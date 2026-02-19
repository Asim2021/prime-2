import crypto from 'node:crypto';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { Batch, Medicine, StockLedger, Vendor } from '#models/index.js';

export const getAllBatches = async ({ page, limit, offset, sortBy, order, search, medicine_id }) => {
  const where = {};

  if (medicine_id) {
    where.medicine_id = medicine_id;
  }

  if (search) {
    where.batch_no = { [ Op.like ]: `%${search}%` };
  }

  const { count, rows } = await Batch.findAndCountAll({
    where,
    include: [
      {
        model: Medicine,
        as: 'medicine',
        attributes: [ 'id', 'brand_name', 'generic_name' ]
      },
      {
        model: Vendor,
        as: 'vendor',
        attributes: [ 'id', 'name' ]
      }
    ],
    limit,
    offset,
    order: [ [ sortBy || 'created_at', order || 'DESC' ] ],
  });

  return {
    data: rows,
    meta: {
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      limit: Number(limit),
    },
  };
};

export const getBatchById = async (id) => {
  return Batch.findByPk(id, {
    include: [
      {
        model: Medicine,
        as: 'medicine',
        attributes: [ 'id', 'brand_name', 'generic_name' ]
      },
      {
        model: Vendor,
        as: 'vendor',
        attributes: [ 'id', 'name' ]
      }
    ],
  });
};

export const updateBatch = async (id, data, userId) => {
  const batch = await Batch.findByPk(id);
  if (!batch) {
    const error = new Error('Batch not found');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Define allowed fields for update based on "Edit Only" requirement for some fields
  // Assuming frontend restricts what it sends, but we can also restrict here.
  // For now, allow updating what's sent, validation handled by Joi/Frontend
  await batch.update(data);
  return batch;
  await batch.update(data);
  return batch;
};

export const createBatch = async (data, userId) => {
  return await Batch.sequelize.transaction(async (t) => {
    const existing = await Batch.findOne({
      where: {
        medicine_id: data.medicine_id,
        batch_no: data.batch_no,
      },
      transaction: t,
    });

    if (existing) {
      const error = new Error('Batch number already exists for this medicine');
      error.statusCode = HTTP_STATUS.CONFLICT;
      throw error;
    }

    const batch = await Batch.create({
      id: crypto.randomUUID(),
      ...data,
    }, { transaction: t });

    if (data.quantity_available > 0) {
      // Create Ledger Entry for Opening Stock / Manual Entry
      await StockLedger.create({
        id: crypto.randomUUID(),
        batch_id: batch.id,
        transaction_type: 'adjustment', // Using adjustment for manual creation
        reference_id: batch.id,
        quantity_change: data.quantity_available,
        balance_after: data.quantity_available,
      }, { transaction: t });
    }

    return batch;
  });
};
