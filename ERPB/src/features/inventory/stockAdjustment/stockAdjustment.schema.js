import Joi from 'joi';

export const createStockAdjustmentSchema = Joi.object({
  batch_id: Joi.string().uuid().required(),
  quantity_change: Joi.number().integer().required(), // Can be negative or positive
  reason: Joi.string().valid('damaged', 'expired', 'lost', 'correction', 'returned').required(),
  note: Joi.string().allow('', null),
});

export const getStockAdjustmentSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  batch_id: Joi.string().uuid(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
