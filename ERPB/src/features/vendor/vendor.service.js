import { Op } from 'sequelize';
import { Vendor } from '../../models/vendor/vendor.model.js';
import { randomUUID } from 'node:crypto';
export const createVendor = async (data) => {
    return await Vendor.create({ ...data, id: randomUUID() });
};
export const getAllVendors = async (params = {}) => {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const search = params.search;
    const whereClause = {};
    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { contact_person: { [Op.like]: `%${search}%` } },
        ];
    }
    const { rows, count } = await Vendor.findAndCountAll({
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
};
export const getVendorById = async (id) => {
    return await Vendor.findByPk(id);
};
export const updateVendor = async (id, data) => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor)
        return null;
    return await vendor.update(data);
};
export const deleteVendor = async (id) => {
    const vendor = await Vendor.findByPk(id);
    if (!vendor)
        return null;
    return await vendor.destroy();
};
//# sourceMappingURL=vendor.service.js.map
