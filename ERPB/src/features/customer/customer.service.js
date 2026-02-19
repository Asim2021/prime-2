import { Op } from 'sequelize';
import { Customer } from '../../models/customer/customer.model.js';

/**
 * Get all customers with pagination and search.
 */
export const getAllCustomers = async ({ limit, offset, sortBy, order, search }) => {
    const whereClause = {};
    if (search) {
        whereClause[ Op.or ] = [
            { name: { [ Op.like ]: `%${search.trim()}%` } },
            { phone: { [ Op.like ]: `%${search.trim()}%` } },
            { gstin: { [ Op.like ]: `%${search.trim()}%` } },
        ];
    }

    return Customer.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [ [ sortBy, order ] ],
    });
};

export const getCustomerById = async (id) => {
    return Customer.findByPk(id);
};

export const createCustomer = async (data) => {
    return Customer.create(data);
};

export const updateCustomer = async (id, data) => {
    const customer = await Customer.findByPk(id);
    if (!customer) {
        const error = new Error('Customer not found');
        error.statusCode = 404;
        throw error;
    }
    return customer.update(data);
};

export const deleteCustomer = async (id) => {
    const customer = await Customer.findByPk(id);
    if (!customer) {
        const error = new Error('Customer not found');
        error.statusCode = 404;
        throw error;
    }
    return customer.destroy();
};