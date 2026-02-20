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

        // 5. Total Stock Value
        const stockValueResult = await Batch.findAll({
            attributes: [
                [ Sequelize.fn('SUM', Sequelize.literal('quantity_available * purchase_rate')), 'total_value' ]
            ],
            where: {
                is_active: true,
            },
            raw: true
        });
        const stockValue = stockValueResult[ 0 ]?.total_value || 0;

        // 6. Sales Trend (Last 30 Days)
        const date30DaysAgo = dayjs().subtract(30, 'day').startOf('day').toDate();
        const salesTrendRaw = await Sale.findAll({
            attributes: [
                [ Sequelize.fn('DATE', Sequelize.col('bill_date')), 'date' ],
                [ Sequelize.fn('SUM', Sequelize.col('total_amount')), 'amount' ]
            ],
            where: {
                bill_date: {
                    [ Op.gte ]: date30DaysAgo
                }
            },
            group: [ Sequelize.fn('DATE', Sequelize.col('bill_date')) ],
            order: [ [ Sequelize.fn('DATE', Sequelize.col('bill_date')), 'ASC' ] ],
            raw: true
        });

        // Format salesTrend to match exactly what Recharts expects
        const salesTrend = salesTrendRaw.map(s => ({
            date: dayjs(s.date).format('YYYY-MM-DD'),
            amount: Number(s.amount)
        }));

        return {
            todaysSales,
            lowStockCount: lowStockMedicines.length,
            nearExpiryCount: nearExpiryBatches,
            activeBatchCount,
            stockValue: Number(stockValue),
            salesTrend
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
    getInventoryReport: async ({ page, limit, offset, sortBy, order }) => {

        // Get total medicines count (without join)
        const total_count = await Medicine.count();

        // Aggregate stock per medicine
        const inventory = await Medicine.findAll({
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
            limit,
            offset,
            order: [ [ sortBy, order ] ],
            subQuery: false,
        });

        const { total_inventory_value } = await Batch.findOne({
            attributes: [
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn(
                            'SUM',
                            Sequelize.literal('quantity_available * purchase_rate')
                        ),
                        0
                    ),
                    'total_inventory_value',
                ],
            ],
            where: {
                is_active: true,
            },
            raw: true,
        });

        return { total_count, inventory, total_inventory_value }
    },
};