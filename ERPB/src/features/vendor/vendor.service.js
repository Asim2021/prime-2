import { Op } from 'sequelize';
import { randomUUID } from 'node:crypto';

import { Vendor } from '../../models/vendor/vendor.model.js';

export const createVendor = async (data) => {
    return await Vendor.create({ ...data, id: randomUUID() });
};

export const getAllVendors = async (params = {}) => {
    const { page, limit, offset, sortBy, order, search } = params;

    const whereClause = {};
    if (search) {
        whereClause[ Op.or ] = [
            { name: { [ Op.like ]: `%${search}%` } },
            { phone: { [ Op.like ]: `%${search}%` } },
            { contact_person: { [ Op.like ]: `%${search}%` } },
        ];
    }

    const { rows, count } = await Vendor.findAndCountAll({
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
};

export const getVendorById = async (id) => {
    return await Vendor.findByPk(id);
};

export const updateVendor = async (id, data) => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) return null;
    return await vendor.update(data);
};

export const deleteVendor = async (id) => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) return null;
    return await vendor.destroy();
};
