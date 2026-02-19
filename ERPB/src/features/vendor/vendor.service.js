import { Op } from 'sequelize';
import { randomUUID } from 'node:crypto';

import { Vendor } from '#models/index.js';

export const createVendor = async (data) => {
    return Vendor.create({ ...data, id: randomUUID() });
};

export const getAllVendors = async ({ limit, offset, sortBy, order, search }) => {
    const whereClause = {};
    if (search) {
        whereClause[ Op.or ] = [
            { name: { [ Op.like ]: `%${search.trim()}%` } },
            { phone: { [ Op.like ]: `%${search.trim()}%` } },
            { contact_person: { [ Op.like ]: `%${search.trim()}%` } },
        ];
    }

    return Vendor.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [ [ sortBy, order ] ],
    });
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
