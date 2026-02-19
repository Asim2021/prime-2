import { querySchema } from '#common/joiSchema.js';
import Joi from 'joi';

export const createStockAdjustmentSchema = Joi.object({
  batch_id: Joi.string().uuid().required(),
  quantity_change: Joi.number().integer().required(), // Can be negative or positive
  reason: Joi.string().valid('damage', 'expired', 'theft', 'manual_correction', 'other').required(),
  note: Joi.string().allow('', null),
});

export const getAllStockAdjustmentSchema = querySchema;
