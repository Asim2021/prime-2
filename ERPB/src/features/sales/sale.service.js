import { randomUUID } from 'node:crypto';
import crypto from 'crypto';
import dayjs from 'dayjs';

import db from '../../models/index.js';
import { shopSettingsService } from '../shopSettings/shopSettings.service.js';

const {
    Sale,
    SaleItem,
    Batch,
    StockLedger,
    AuditLog,
    InvoiceSequence,
    Customer,
} = db;

export const saleService = {
    getAll: async (params = {}) => {
        const { page, limit, offset, sortBy, order } = params;

        const { rows, count } = await Sale.findAndCountAll({
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
            ],
            order: [ [ sortBy || 'bill_date', order || 'DESC' ] ],
            limit,
            offset,
            distinct: true,
        });

        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    },
    getById: async (id) => {
        return await Sale.findByPk(id, {
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
            ],
        });
    },
    create: async (data) => {
        return await db.sequelize.transaction(async (t) => {
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
    },
};
