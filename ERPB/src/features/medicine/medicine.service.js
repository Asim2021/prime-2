import { Op } from 'sequelize';
import { randomUUID } from 'node:crypto';

import { Medicine } from '../../models/medicine/medicine.model.js';
import { Batch } from '../../models/batch/batch.model.js';
import { AuditLog } from '../../models/auditLog/auditLog.model.js';

export const createMedicine = async (data, userId) => {
    const medicine = await Medicine.create({ ...data, id: randomUUID() });
    // Audit log — medicine creation
    if (userId) {
        await AuditLog.create({
            id: randomUUID(),
            user_id: userId,
            action: 'medicine_create',
            table_name: 'medicines',
            record_id: medicine.getDataValue('id'),
            old_value: null,
            new_value: JSON.stringify({
                brand_name: data.brand_name,
                generic_name: data.generic_name,
                manufacturer: data.manufacturer,
                schedule_type: data.schedule_type,
            }),
        });
    }
    return medicine;
};

export const getAllMedicines = async (params = {}) => {
    const { page, limit, offset, sortBy, order, search } = params;

    const whereClause = {};
    if (search) {
        whereClause[ Op.or ] = [
            { brand_name: { [ Op.like ]: `%${search}%` } },
            { generic_name: { [ Op.like ]: `%${search}%` } },
            { manufacturer: { [ Op.like ]: `%${search}%` } },
        ];
    }

    const { rows, count } = await Medicine.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [ [ sortBy || 'brand_name', order || 'ASC' ] ],
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

export const getMedicineById = async (id) => {
    return await Medicine.findByPk(id);
};

export const getBatches = async (medicineId) => {
    return await Batch.findAll({
        where: { medicine_id: medicineId },
        order: [ [ 'exp_date', 'ASC' ] ],
    });
};

export const updateMedicine = async (id, data, userId) => {
    const medicine = await Medicine.findByPk(id);
    if (!medicine) return null;
    const oldValues = medicine.toJSON();
    const updated = await medicine.update(data);
    // Audit log — medicine update
    if (userId) {
        await AuditLog.create({
            id: randomUUID(),
            user_id: userId,
            action: 'medicine_update',
            table_name: 'medicines',
            record_id: id,
            old_value: JSON.stringify(oldValues),
            new_value: JSON.stringify(data),
        });
    }
    return updated;
};

export const deleteMedicine = async (id, userId) => {
    const medicine = await Medicine.findByPk(id);
    if (!medicine) return null;
    const oldValues = medicine.toJSON();
    // Audit log — medicine deletion (log BEFORE destroy)
    if (userId) {
        await AuditLog.create({
            id: randomUUID(),
            user_id: userId,
            action: 'medicine_delete',
            table_name: 'medicines',
            record_id: id,
            old_value: JSON.stringify(oldValues),
            new_value: null,
        });
    }
    return await medicine.destroy();
};
