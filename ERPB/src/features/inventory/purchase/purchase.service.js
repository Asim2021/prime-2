import { randomUUID } from 'node:crypto';
import db, {
    Purchase,
    PurchaseItem,
    Batch,
    StockLedger,
    Vendor
} from '#models/index.js';

/**
 * Get all purchases with pagination.
 */
export const getAllPurchases = async ({ limit, offset, sortBy, order }) => {
    return Purchase.findAndCountAll({
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
            {
                model: Vendor,
                as: 'vendor',
                attributes: [ 'name' ],
            },
        ],
        order: [ [ sortBy, order ] ],
        limit,
        offset,
        distinct: true, // Important when using include with limit
    });
};

/**
 * Get a purchase by ID.
 */
export const getPurchaseById = async (id) => {
    return Purchase.findByPk(id, {
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
};

/**
 * Create a new purchase.
 */
export const createPurchase = async (data) => {
    return db.sequelize.transaction(async (t) => {
        // 1. Create Purchase Header
        const purchaseId = randomUUID();
        const purchase = await Purchase.create(
            {
                id: purchaseId,
                vendor_id: data.vendor_id,
                invoice_no: data.invoice_no,
                invoice_date: data.invoice_date,
                total_amount: data.total_amount,
                gst_amount: data.gst_amount,
                free_quantity: data.free_quantity || 0,
                created_by: data.created_by,
            },
            { transaction: t },
        );

        // 2. Process Items
        for (const item of data.items) {
            // A. Find or Create Batch
            const batch = await Batch.findOne({
                where: {
                    medicine_id: item.medicine_id,
                    batch_no: item.batch_no,
                },
                transaction: t,
            });

            const batchId = batch?.id || randomUUID();
            const quantityToAdd = item.quantity;

            if (batch) {
                await batch.update(
                    {
                        quantity_available: batch.quantity_available + quantityToAdd,
                        purchase_rate: item.purchase_rate,
                        mrp: item.mrp,
                        vendor_id: data.vendor_id,
                        rack_location: item.rack_location || batch.rack_location,
                    },
                    { transaction: t },
                );
            } else {
                await Batch.create(
                    {
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
                    },
                    { transaction: t },
                );
            }

            // B. Create Purchase Item
            await PurchaseItem.create(
                {
                    id: randomUUID(),
                    purchase_id: purchaseId,
                    batch_id: batchId,
                    purchase_quantity: quantityToAdd,
                },
                { transaction: t },
            );

            // C. Create Stock Ledger Entry
            await StockLedger.create(
                {
                    id: randomUUID(),
                    batch_id: batchId,
                    transaction_type: 'purchase',
                    reference_id: purchaseId,
                    quantity_change: quantityToAdd,
                    balance_after: batch ? batch.quantity_available + quantityToAdd : quantityToAdd,
                },
                { transaction: t },
            );
        }

        return purchase;
    });
};
