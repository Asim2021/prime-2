import Joi from 'joi';
export const createVendorSchema = Joi.object({
    name: Joi.string().required().trim().max(100),
    gst_number: Joi.string()
        .length(15)
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/)
        .allow(null, '')
        .messages({
        'string.pattern.base': 'Invalid GST Number format',
    }),
    contact_person: Joi.string().allow(null, '').max(100),
    phone: Joi.string()
        .required()
        .min(10)
        .max(15)
        .pattern(/^[0-9]+$/),
    address: Joi.string().allow(null, '').max(500),
    credit_days: Joi.number().integer().min(0).default(0),
});
export const updateVendorSchema = createVendorSchema.fork(['name', 'phone'], (schema) => schema.optional());
//# sourceMappingURL=vendor.schema.js.map