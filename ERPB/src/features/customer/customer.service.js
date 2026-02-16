import { Op } from 'sequelize';
import { Customer } from '../../models/customer/customer.model.js';

export const customerService = {
    create: async (data) => {
        return await Customer.create(data);
    },
    findAll: async (params = {}) => {
        const { page, limit, offset, sortBy, order, search } = params;

        const whereClause = {};
        if (search) {
            whereClause[ Op.or ] = [
                { name: { [ Op.like ]: `%${search}%` } },
                { phone: { [ Op.like ]: `%${search}%` } },
                { gstin: { [ Op.like ]: `%${search}%` } },
            ];
        }

        const { rows, count } = await Customer.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [ [ sortBy || 'created_at', order || 'DESC' ] ],
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
    findById: async (id) => {
        return await Customer.findByPk(id);
    },
    update: async (id, data) => {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        return await customer.update(data);
    },
    delete: async (id) => {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        return await customer.destroy();
    },
};