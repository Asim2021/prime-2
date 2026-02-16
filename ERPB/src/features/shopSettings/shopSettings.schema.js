import Joi from 'joi';
export const updateSettingsSchema = Joi.object({
    shop_name: Joi.string().required(),
    logo_url: Joi.string().allow('', null).optional(),
    gst_number: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid GST Number format',
    }),
    drug_license_no: Joi.string().required(),
    address_line_1: Joi.string().required(),
    address_line_2: Joi.string().allow('', null).optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .required(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow('', null).optional(),
    invoice_prefix: Joi.string().optional(),
    invoice_footer_text: Joi.string().allow('', null).optional(),
    paper_width_mm: Joi.number().valid(58, 80).optional(),
    near_expiry_days: Joi.number().min(1).optional(),
});
//# sourceMappingURL=shopSettings.schema.js.map