import { Op, Sequelize } from 'sequelize';
import dayjs from 'dayjs';

import { Sale } from '../../models/sale/sale.model.js';
import { Batch } from '../../models/batch/batch.model.js';
import { Medicine } from '../../models/medicine/medicine.model.js';

export const reportService = {
    getDashboardMetrics: async () => {
        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();
        const threeMonthsLater = dayjs().add(90, 'day').toDate(); // Default near-expiry threshold

        // 1. Today's Sales Revenue
        const todaysSales =
            (await Sale.sum('total_amount', {
                where: {
                    bill_date: {
                        [ Op.between ]: [ todayStart, todayEnd ],
                    },
                },
            })) || 0;

        // 2. Count of Low Stock Medicines
        const lowStockMedicines = await Medicine.findAll({
            attributes: [
                'id',
                'brand_name',
                'reorder_level',
                [
                    Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('batches.quantity_available')), 0),
                    'total_stock',
                ],
            ],
            include: [
                {
                    model: Batch,
                    as: 'batches',
                    attributes: [],
                    required: false,
                    where: {
                        is_active: true,
                        exp_date: { [ Op.gt ]: new Date() }, // Only count active, non-expired stock
                    },
                },
            ],
            group: [ 'Medicine.id' ],
            having: Sequelize.literal('total_stock <= Medicine.reorder_level'),
        });

        // 3. Count of Near Expiry Batches
        const nearExpiryBatches = await Batch.count({
            where: {
                is_active: true,
                quantity_available: { [ Op.gt ]: 0 },
                exp_date: {
                    [ Op.between ]: [ new Date(), threeMonthsLater ],
                },
            },
        });

        // 4. Count of Active Batches (with stock, not expired)
        const activeBatchCount = await Batch.count({
            where: {
                is_active: true,
                quantity_available: { [ Op.gt ]: 0 },
                exp_date: { [ Op.gt ]: new Date() },
            },
        });

        return {
            todaysSales,
            lowStockCount: lowStockMedicines.length,
            nearExpiryCount: nearExpiryBatches,
            activeBatchCount,
        };
    },
    getSalesReport: async (startDate, endDate) => {
        return await Sale.findAll({
            where: {
                bill_date: {
                    [ Op.between ]: [ dayjs(startDate).startOf('day').toDate(), dayjs(endDate).endOf('day').toDate() ],
                },
            },
            order: [ [ 'bill_date', 'DESC' ] ],
        });
    },
    getInventoryReport: async () => {
        // Aggregate stock per medicine
        return await Medicine.findAll({
            attributes: [
                'id',
                'brand_name',
                'generic_name',
                'manufacturer',
                'reorder_level',
                [
                    Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('batches.quantity_available')), 0),
                    'current_stock',
                ],
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn('SUM', Sequelize.literal('batches.quantity_available * batches.purchase_rate')),
                        0,
                    ),
                    'stock_value',
                ],
            ],
            include: [
                {
                    model: Batch,
                    as: 'batches',
                    attributes: [],
                    required: false,
                    where: { is_active: true },
                },
            ],
            group: [ 'Medicine.id' ],
            order: [ [ 'brand_name', 'ASC' ] ],
        });
    },
};