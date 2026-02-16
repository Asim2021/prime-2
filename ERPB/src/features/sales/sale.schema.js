import Joi from 'joi';
export const createSaleSchema = Joi.object({
    customer_name: Joi.string().trim().default('CASH CUSTOMER'),
    customer_phone: Joi.string().trim().allow(null, ''),
    customer_id: Joi.string().uuid().allow(null, ''),
    payment_mode: Joi.string().valid('cash', 'credit', 'upi').required(),
    total_amount: Joi.number().min(0).required(),
    taxable_amount: Joi.number().min(0).required(),
    cgst_amount: Joi.number().min(0).default(0),
    sgst_amount: Joi.number().min(0).default(0),
    igst_amount: Joi.number().min(0).default(0),
    is_credit: Joi.boolean().default(false),
    items: Joi.array()
        .items(Joi.object({
        batch_id: Joi.string().uuid().required().messages({
            'string.guid': 'Invalid Batch ID',
            'any.required': 'Batch is required',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
            'number.min': 'Quantity must be at least 1',
        }),
        selling_price: Joi.number().min(0.01).required(),
        mrp_at_sale: Joi.number().min(0.01).required(),
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'At least one item is required',
        'any.required': 'Items are required',
    }),
});
//# sourceMappingURL=sale.schema.js.map