import Joi from 'joi';
export const createCustomerSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Customer name is required',
        'any.required': 'Customer name is required',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    gstin: Joi.string().allow('', null).optional(),
    credit_limit: Joi.number().min(0).optional().default(0),
});
export const updateCustomerSchema = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    gstin: Joi.string().allow('', null).optional(),
    credit_limit: Joi.number().min(0).optional(),
});
//# sourceMappingURL=customer.schema.js.map