import { querySchema } from '#common/joiSchema.js';
import Joi from 'joi';

export const getAllBatchSchema = querySchema;

export const createBatchSchema = Joi.object({
  medicine_id: Joi.string().uuid().required(),
  vendor_id: Joi.string().uuid().required(),
  batch_no: Joi.string().required(),
  mfg_date: Joi.date().required(),
  exp_date: Joi.date().greater(Joi.ref('mfg_date')).required().messages({
    'date.greater': 'Expiry date must be greater than manufacturing date',
  }),
  purchase_rate: Joi.number().min(0).required(),
  mrp: Joi.number().greater(Joi.ref('purchase_rate')).required().messages({
    'number.greater': 'MRP must be greater than purchase rate',
  }),
  quantity_available: Joi.number().integer().min(0).default(0),
  rack_location: Joi.string().allow('', null).default('UNASSIGNED'),
  is_active: Joi.boolean().default(true),
});

export const updateBatchSchema = Joi.object({
  mrp: Joi.number().min(0),
  rack_location: Joi.string().allow('', null),
  is_active: Joi.boolean(),
});
