import { Op } from 'sequelize';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { Batch, Medicine, Vendor } from '#models/index.js';

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
};
