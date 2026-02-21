import { randomUUID } from 'node:crypto';
import crypto from 'crypto';
import dayjs from 'dayjs';

import { shopSettingsService } from '../shopSettings/shopSettings.service.js';
import {
    Sale,
    SaleItem,
    Batch,
    StockLedger,
    AuditLog,
    InvoiceSequence,
    Customer,
    Medicine,
    SalesReturn,
    SalesReturnItem
} from '#models/index.js';
import sequelize from '#lib/sqlConfig.js';


/**
 * Get all sales with pagination.
 */
export const getAllSales = async ({ limit, offset, sortBy, order }) => {
    return Sale.findAndCountAll({
        include: [
            {
                model: SaleItem,
                as: 'items',
                include: [
                    {
                        model: Batch,
                        as: 'batch',
                    },
                ],
            },
            {
                model: SalesReturn,
                as: 'returns',
                required: false,
            },
        ],
        order: [ [ sortBy, order ] ],
        limit,
        offset,
        distinct: true,
    });
};

/**
 * Get all sales returns with pagination.
 */
export const getAllSalesReturns = async ({ limit, offset, sortBy, order }) => {
    return SalesReturn.findAndCountAll({
        include: [
            {
                model: SalesReturnItem,
                as: 'items',
                include: [
                    {
                        model: Batch,
                        as: 'batch',
                        include: [
                            {
                                model: Medicine,
                                as: 'medicine',
                            },
                        ],
                    },
                ],
            },
        ],
        order: [ [ sortBy, order ] ],
        limit,
        offset,
        distinct: true,
    });
};

/**
 * Get a sale by ID.
 */
export const getSaleById = async (id) => {
    return Sale.findByPk(id, {
        include: [
            {
                model: SaleItem,
                as: 'items',
                include: [
                    {
                        model: Batch,
                        as: 'batch',
                        include: [
                            {
                                model: Medicine,
                                as: 'medicine',
                            },
                        ],
                    },
                ],
            },
            {
                model: SalesReturn,
                as: 'returns',
                required: false,
                include: [
                    {
                        model: SalesReturnItem,
                        as: 'items'
                    }
                ]
            },
        ],
    });
};
/**
 * Create a new sale.
 */
export const createSale = async (data) => {
    return await sequelize.transaction(async (t) => {
        // 1. Generate Bill Number
        const now = dayjs();
        const fy =
            now.month() >= 3
                ? `${now.format('YY')}-${now.add(1, 'year').format('YY')}`
                : `${now.subtract(1, 'year').format('YY')}-${now.format('YY')}`;

        let sequence = await InvoiceSequence.findByPk(fy, { transaction: t, lock: true });
        if (!sequence) {
            sequence = await InvoiceSequence.create({ financial_year: fy, last_number: 0 }, { transaction: t });
        }
        const nextNumber = sequence.last_number + 1;
        const billNo = `INV-${fy}-${nextNumber.toString().padStart(4, '0')}`;
        await sequence.update({ last_number: nextNumber }, { transaction: t });

        // 2. Create Sale Header
        const saleId = randomUUID();
        const saleDataForHash = JSON.stringify({
            bill_no: billNo,
            total_amount: data.total_amount,
            items: data.items.map((i) => ({ batch: i.batch_id, qty: i.quantity, price: i.selling_price })),
        });
        const invoiceHash = crypto.createHash('sha256').update(saleDataForHash).digest('hex');

        // 2a. Calculate Tax Split (IGST vs CGST+SGST)
        const shopSettings = await shopSettingsService.getSettings();
        let isInterState = false;
        if (data.customer_id && shopSettings.gst_number) {
            const customer = await Customer.findByPk(data.customer_id, { transaction: t });
            if (customer && customer.gstin && customer.gstin.length >= 2) {
                const shopStateCode = shopSettings.gst_number.substring(0, 2);
                const customerStateCode = customer.gstin.substring(0, 2);
                if (shopStateCode !== customerStateCode) {
                    isInterState = true;
                }
            }
        }

        const totalTax = (data.cgst_amount || 0) + (data.sgst_amount || 0) + (data.igst_amount || 0);
        let finalIGST = 0;
        let finalCGST = 0;
        let finalSGST = 0;
        if (isInterState) {
            finalIGST = totalTax;
        } else {
            finalCGST = totalTax / 2;
            finalSGST = totalTax / 2;
        }

        const sale = await Sale.create(
            {
                id: saleId,
                bill_no: billNo,
                bill_date: new Date(),
                customer_name: data.customer_name || 'CASH CUSTOMER',
                customer_phone: data.customer_phone,
                customer_id: data.customer_id,
                total_amount: data.total_amount,
                taxable_amount: data.taxable_amount,
                cgst_amount: finalCGST,
                sgst_amount: finalSGST,
                igst_amount: finalIGST,
                payment_mode: data.payment_mode,
                is_credit: data.is_credit || false,
                invoice_hash: invoiceHash,
                created_by: data.created_by,
            },
            { transaction: t },
        );

        // 2b. Update Customer Outstanding Balance if Credit Sale
        if (data.is_credit && data.customer_id) {
            const creditCustomer = await Customer.findByPk(data.customer_id, { transaction: t, lock: true });
            if (creditCustomer) {
                const newBalance = creditCustomer.outstanding_balance + data.total_amount;
                if (creditCustomer.credit_limit > 0 && newBalance > creditCustomer.credit_limit) {
                    throw new Error(`Credit limit exceeded. Customer credit limit is ₹${creditCustomer.credit_limit}, but their outstanding balance will become ₹${newBalance}.`);
                }
                await creditCustomer.increment('outstanding_balance', { by: data.total_amount, transaction: t });
            }
        }

        // 3. Process Items
        for (const item of data.items) {
            const batch = await Batch.findByPk(item.batch_id, { transaction: t, lock: true });
            if (!batch) {
                throw new Error(`Batch ${item.batch_id} not found`);
            }
            if (batch.quantity_available < item.quantity) {
                throw new Error(
                    `Insufficient stock for batch ${batch.batch_no}. Available: ${batch.quantity_available}, Requested: ${item.quantity}`,
                );
            }
            if (item.selling_price > item.mrp_at_sale) {
                throw new Error(
                    `MRP violation: selling price (${item.selling_price}) exceeds MRP (${item.mrp_at_sale}) for batch ${batch.batch_no}`,
                );
            }

            // A. Deduct Stock
            const oldBalance = batch.quantity_available;
            const newBalance = oldBalance - item.quantity;
            await batch.update({ quantity_available: newBalance }, { transaction: t });

            // B. Create Sale Item
            await SaleItem.create(
                {
                    id: randomUUID(),
                    sale_id: saleId,
                    batch_id: item.batch_id,
                    quantity: item.quantity,
                    selling_price: item.selling_price,
                    mrp_at_sale: item.mrp_at_sale,
                },
                { transaction: t },
            );

            // C. Create Stock Ledger Entry
            await StockLedger.create(
                {
                    id: randomUUID(),
                    batch_id: item.batch_id,
                    transaction_type: 'sale',
                    reference_id: saleId,
                    quantity_change: -item.quantity,
                    balance_after: newBalance,
                },
                { transaction: t },
            );
        }

        // 4. Audit Log
        await AuditLog.create(
            {
                id: randomUUID(),
                user_id: data.created_by,
                action: 'sale_create',
                table_name: 'sales',
                record_id: saleId,
                old_value: null,
                new_value: JSON.stringify({
                    bill_no: billNo,
                    total_amount: data.total_amount,
                    payment_mode: data.payment_mode,
                    items_count: data.items.length,
                }),
            },
            { transaction: t },
        );

        return sale;
    });
};

/**
 * Process a sale return.
 */
export const processReturn = async (data) => {
    return sequelize.transaction(async (t) => {
        const { sale_id, items, reason } = data;
        const sale = await Sale.findByPk(sale_id, { transaction: t });
        if (!sale) throw new Error('Sale not found');

        // check if already returned? For now, we allow multiple returns until qty is exhausted.
        // But we need to track how much returned.
        // We can sum up existing SalesReturnItems for this sale_item_id.

        let totalRefund = 0;
        const returnId = randomUUID();

        const salesReturn = await SalesReturn.create({
            id: returnId,
            sale_id,
            bill_no: sale.bill_no,
            // return_date defaults to now
            reason,
            total_refund: 0, // update later
            created_by: data.created_by,
        }, { transaction: t });

        for (const item of items) {
            const saleItem = await SaleItem.findByPk(item.sale_item_id, { transaction: t });
            if (!saleItem) throw new Error(`Sale Item ${item.sale_item_id} not found`);
            if (saleItem.sale_id !== sale_id) throw new Error('Item does not belong to this sale');

            // Check previously returned quantity
            const previousReturns = await SalesReturnItem.sum('quantity', {
                where: { sale_item_id: item.sale_item_id },
                transaction: t,
            }) || 0;

            if (previousReturns + item.quantity > saleItem.quantity) {
                throw new Error(`Cannot return ${item.quantity}. Sold: ${saleItem.quantity}, Already Returned: ${previousReturns}`);
            }

            const refundAmount = Number(saleItem.selling_price) * item.quantity;
            totalRefund += refundAmount;

            // 1. Create Return Item
            await SalesReturnItem.create({
                id: randomUUID(),
                sales_return_id: returnId,
                sale_item_id: item.sale_item_id,
                batch_id: item.batch_id,
                quantity: item.quantity,
                refund_amount: refundAmount,
            }, { transaction: t });

            // 2. Update Batch Stock (Increment)
            const batch = await Batch.findByPk(item.batch_id, { transaction: t, lock: true });
            if (batch) {
                await batch.increment('quantity_available', { by: item.quantity, transaction: t });

                // 3. Stock Ledger
                await StockLedger.create({
                    id: randomUUID(),
                    batch_id: item.batch_id,
                    transaction_type: 'return',
                    reference_id: returnId,
                    quantity_change: item.quantity,
                    balance_after: batch.quantity_available + item.quantity, // approximate if concurrent, but we locked batch? findByPk with lock: true locks the row.
                    // Wait, increment returns the updated instance or I should calculate manually?
                    // `increment` runs an update query. The `batch` instance might not be updated in memory unless `{ returning: true }` (Postgres).
                    // Safer to calc:
                }, { transaction: t });
            }
        }

        await salesReturn.update({ total_refund: totalRefund }, { transaction: t });

        await AuditLog.create({
            id: randomUUID(),
            user_id: data.created_by,
            action: 'sale_return',
            table_name: 'sales_returns',
            record_id: returnId,
            new_value: JSON.stringify({ sale_id, items_count: items.length, total_refund: totalRefund }),
        }, { transaction: t });

        return salesReturn;
    });
};
