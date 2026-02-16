import Joi from 'joi';
export const createMedicineSchema = Joi.object({
    brand_name: Joi.string().required().trim().max(100),
    generic_name: Joi.string().required().trim().max(100),
    composition: Joi.string().allow(null, '').max(500),
    hsn_code: Joi.string().required().min(4).max(8),
    gst_percent: Joi.number().valid(0, 5, 12, 18, 28).required(),
    manufacturer: Joi.string().required().trim().max(100),
    schedule_type: Joi.string().valid('H', 'H1', 'X', 'OTC').required(),
    reorder_level: Joi.number().integer().min(0).default(10),
    barcode: Joi.string().allow(null, '').max(50),
});
export const updateMedicineSchema = createMedicineSchema.fork(['brand_name', 'generic_name', 'hsn_code', 'gst_percent', 'manufacturer', 'schedule_type'], (schema) => schema.optional());
//# sourceMappingURL=medicine.schema.js.map