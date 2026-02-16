import { randomUUID } from 'node:crypto';
import crypto from 'crypto';
import sequelize from '../../config/db.js';
import { Sale } from '../../models/sale/sale.model.js';
import { SaleItem } from '../../models/saleItem/saleItem.model.js';
import { Batch } from '../../models/batch/batch.model.js';
import { StockLedger } from '../../models/stockLedger/stockLedger.model.js';
import { AuditLog } from '../../models/auditLog/auditLog.model.js';
import { InvoiceSequence } from '../../models/invoiceSequence/invoiceSequence.model.js';
import { Customer } from '../../models/customer/customer.model.js';
import { shopSettingsService } from '../shopSettings/shopSettings.service.js';
import dayjs from 'dayjs';
export const saleService = {
    getAll: async () => {
        return await Sale.findAll({
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
            order: [['bill_date', 'DESC']],
        });
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
        const transaction = await sequelize.transaction();
        try {
            // 1. Generate Bill Number
            const now = dayjs();
            const fy = now.month() >= 3
                ? `${now.format('YY')}-${now.add(1, 'year').format('YY')}`
                : `${now.subtract(1, 'year').format('YY')}-${now.format('YY')}`;
            let sequence = await InvoiceSequence.findByPk(fy, { transaction, lock: true });
            if (!sequence) {
                sequence = await InvoiceSequence.create({ financial_year: fy, last_number: 0 }, { transaction });
            }
            const nextNumber = sequence.last_number + 1;
            const billNo = `INV-${fy}-${nextNumber.toString().padStart(4, '0')}`;
            await sequence.update({ last_number: nextNumber }, { transaction });
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
                const customer = await Customer.findByPk(data.customer_id, { transaction });
                if (customer && customer.gstin && customer.gstin.length >= 2) {
                    const shopStateCode = shopSettings.gst_number.substring(0, 2);
                    const customerStateCode = customer.gstin.substring(0, 2);
                    if (shopStateCode !== customerStateCode) {
                        isInterState = true;
                    }
                }
            }
            // Distribute tax amounts based on type
            // Currently implementation assumes input 'data' has absolute amounts for cgst/sgst/igst
            // passed from frontend.
            // BUT, backend should probably validate or recalculate this?
            // PROPOSAL: The frontend currently calculates and sends these.
            // If we want to ENFORCE backend calculation, we'd need to ignore frontend tax inputs
            // and calculate here from items.
            // For now, let's just APPLY the correct buckets if the frontend sent them generic,
            // OR just trust frontend validation?
            // The safest bet for Phase 3 "GST Compliance" is to RECALCULATE or at least RE-BUCKET.
            // Let's rely on total_amount and taxable_amount for checksum, and bucket the rest.
            // Actually existing code takes data.cgst_amount etc.
            // Let's override buckets based on logic if valid amounts exist.
            // If isInterState -> IGST = (Total Tax), CGST/SGST = 0
            // Else -> IGST = 0, CGST = Tax/2, SGST = Tax/2
            const totalTax = (data.cgst_amount || 0) + (data.sgst_amount || 0) + (data.igst_amount || 0);
            let finalIGST = 0;
            let finalCGST = 0;
            let finalSGST = 0;
            if (isInterState) {
                finalIGST = totalTax;
            }
            else {
                finalCGST = totalTax / 2;
                finalSGST = totalTax / 2;
            }
            const sale = await Sale.create({
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
            }, { transaction });
            // 3. Process Items
            for (const item of data.items) {
                const batch = await Batch.findByPk(item.batch_id, { transaction, lock: true });
                if (!batch) {
                    throw new Error(`Batch ${item.batch_id} not found`);
                }
                if (batch.quantity_available < item.quantity) {
                    throw new Error(`Insufficient stock for batch ${batch.batch_no}. Available: ${batch.quantity_available}, Requested: ${item.quantity}`);
                }
                // MRP Enforcement — selling price must not exceed MRP (BLUEPRINT §Security)
                if (item.selling_price > item.mrp_at_sale) {
                    throw new Error(`MRP violation: selling price (${item.selling_price}) exceeds MRP (${item.mrp_at_sale}) for batch ${batch.batch_no}`);
                }
                // A. Deduct Stock
                const oldBalance = batch.quantity_available;
                const newBalance = oldBalance - item.quantity;
                await batch.update({ quantity_available: newBalance }, { transaction });
                // B. Create Sale Item
                await SaleItem.create({
                    id: randomUUID(),
                    sale_id: saleId,
                    batch_id: item.batch_id,
                    quantity: item.quantity,
                    selling_price: item.selling_price,
                    mrp_at_sale: item.mrp_at_sale,
                }, { transaction });
                // C. Create Stock Ledger Entry
                await StockLedger.create({
                    id: randomUUID(),
                    batch_id: item.batch_id,
                    transaction_type: 'sale',
                    reference_id: saleId,
                    quantity_change: -item.quantity,
                    balance_after: newBalance,
                }, { transaction });
            }
            // 4. Audit Log — record the sale for compliance
            await AuditLog.create({
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
            }, { transaction });
            await transaction.commit();
            return sale;
        }
        catch (error) {
            await transaction.rollback();
            console.error('CREATE SALE ERROR:', error);
            throw error;
        }
    },
};
//# sourceMappingURL=sale.service.js.map
