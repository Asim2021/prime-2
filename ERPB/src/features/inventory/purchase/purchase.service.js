import { randomUUID } from 'node:crypto';
import sequelize from '../../../config/db.js';
import { Purchase } from '../../../models/purchase/purchase.model.js';
import { PurchaseItem } from '../../../models/purchaseItem/purchaseItem.model.js';
import { Batch } from '../../../models/batch/batch.model.js';
import { StockLedger } from '../../../models/stockLedger/stockLedger.model.js';
export const purchaseService = {
    getAll: async (params = {}) => {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const offset = (page - 1) * limit;
        const { rows, count } = await Purchase.findAndCountAll({
            include: [
                {
                    model: PurchaseItem,
                    as: 'items',
                    include: [
                        {
                            model: Batch,
                            as: 'batch',
                        },
                    ],
                },
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset,
            distinct: true, // Important when using include with limit
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
        return await Purchase.findByPk(id, {
            include: [
                {
                    model: PurchaseItem,
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
            // 1. Create Purchase Header
            const purchaseId = randomUUID();
            const purchase = await Purchase.create({
                id: purchaseId,
                vendor_id: data.vendor_id,
                invoice_no: data.invoice_no,
                invoice_date: data.invoice_date,
                total_amount: data.total_amount,
                gst_amount: data.gst_amount,
                free_quantity: data.free_quantity || 0,
                created_by: data.created_by,
            }, { transaction });
            // 2. Process Items
            for (const item of data.items) {
                // A. Find or Create Batch
                let batch = await Batch.findOne({
                    where: {
                        medicine_id: item.medicine_id,
                        batch_no: item.batch_no,
                    },
                    transaction,
                });
                const batchId = batch?.id || randomUUID();
                const quantityToAdd = item.quantity;
                if (batch) {
                    await batch.update({
                        quantity_available: batch.quantity_available + quantityToAdd,
                        purchase_rate: item.purchase_rate,
                        mrp: item.mrp,
                        vendor_id: data.vendor_id,
                        rack_location: item.rack_location || batch.rack_location,
                    }, { transaction });
                }
                else {
                    await Batch.create({
                        id: batchId,
                        medicine_id: item.medicine_id,
                        batch_no: item.batch_no,
                        mfg_date: new Date(item.mfg_date),
                        exp_date: new Date(item.exp_date),
                        purchase_rate: item.purchase_rate,
                        mrp: item.mrp,
                        quantity_available: quantityToAdd,
                        rack_location: item.rack_location || 'UNASSIGNED',
                        vendor_id: data.vendor_id,
                        is_active: true,
                    }, { transaction });
                }
                // B. Create Purchase Item
                await PurchaseItem.create({
                    id: randomUUID(),
                    purchase_id: purchaseId,
                    batch_id: batchId,
                    purchase_quantity: quantityToAdd,
                }, { transaction });
                // C. Create Stock Ledger Entry
                await StockLedger.create({
                    id: randomUUID(),
                    batch_id: batchId,
                    transaction_type: 'purchase',
                    reference_id: purchaseId,
                    quantity_change: quantityToAdd,
                    balance_after: batch ? batch.quantity_available + quantityToAdd : quantityToAdd,
                }, { transaction });
            }
            await transaction.commit();
            return purchase;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
//# sourceMappingURL=purchase.service.js.map
