import { Op } from 'sequelize';
import { Customer } from '../../models/customer/customer.model.js';
export const customerService = {
    create: async (data) => {
        return await Customer.create(data);
    },
    findAll: async (params = {}) => {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const offset = (page - 1) * limit;
        const search = params.search;
        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { gstin: { [Op.like]: `%${search}%` } },
            ];
        }
        const { rows, count } = await Customer.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['created_at', 'DESC']],
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
            throw new Error('Customer not found');
        }
        return await customer.update(data);
    },
    delete: async (id) => {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return await customer.destroy();
    },
};
//# sourceMappingURL=customer.service.js.map