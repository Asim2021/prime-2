import { randomUUID } from 'node:crypto';
import { StockAdjustment, Batch, StockLedger, Medicine } from '#models/index.js';

export const stockAdjustmentService = {
  create: async (data, userId) => {
    return await StockAdjustment.sequelize.transaction(async (t) => {
      const batch = await Batch.findByPk(data.batch_id, { transaction: t, lock: true });
      if (!batch) {
        throw new Error('Batch not found');
      }

      const newBalance = batch.quantity_available + data.quantity_change;
      if (newBalance < 0) {
        throw new Error(`Insufficient stock. Available: ${batch.quantity_available}, Adjustment: ${data.quantity_change}`);
      }

      // 1. Create Adjustment Record
      const adjustment = await StockAdjustment.create({
        id: randomUUID(),
        batch_id: data.batch_id,
        quantity_change: data.quantity_change,
        reason: data.reason,
        note: data.note,
        created_by: userId,
      }, { transaction: t });

      // 2. Update Batch Quantity
      await batch.update({ quantity_available: newBalance }, { transaction: t });

      // 3. Add to Stock Ledger
      await StockLedger.create({
        id: randomUUID(),
        batch_id: data.batch_id,
        transaction_type: 'adjustment',
        reference_id: adjustment.id,
        quantity_change: data.quantity_change,
        balance_after: newBalance,
      }, { transaction: t });

      return adjustment;
    });
  },

  getAll: async ({ page, limit, offset, sortBy, order }) => {
    const { rows, count } = await StockAdjustment.findAndCountAll({
      include: [
        {
          model: Batch,
          as: 'batch',
          include: [ { model: Medicine, as: 'medicine', attributes: [ 'brand_name' ] } ]
        },
      ],
      order: [ [ sortBy || 'created_at', order || 'DESC' ] ],
      limit,
      offset,
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
};
