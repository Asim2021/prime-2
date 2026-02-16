import Joi from 'joi';
export const createPurchaseSchema = Joi.object({
    vendor_id: Joi.string().uuid().required().messages({
        'string.empty': 'Vendor is required',
        'string.guid': 'Invalid Vendor ID',
        'any.required': 'Vendor is required',
    }),
    invoice_no: Joi.string().trim().required().messages({
        'string.empty': 'Invoice Number is required',
        'any.required': 'Invoice Number is required',
    }),
    invoice_date: Joi.date().iso().required().messages({
        'date.base': 'Invalid Invoice Date',
        'any.required': 'Invoice Date is required',
    }),
    total_amount: Joi.number().min(0).required(),
    gst_amount: Joi.number().min(0).required(),
    free_quantity: Joi.number().integer().min(0).default(0),
    items: Joi.array()
        .items(Joi.object({
        medicine_id: Joi.string().uuid().required().messages({
            'string.empty': 'Medicine is required',
            'string.guid': 'Invalid Medicine ID',
        }),
        batch_no: Joi.string().trim().required().messages({
            'string.empty': 'Batch Number is required',
        }),
        mfg_date: Joi.date().iso().required().messages({
            'date.base': 'Invalid Mfg Date',
        }),
        exp_date: Joi.date().iso().required().greater(Joi.ref('mfg_date')).messages({
            'date.base': 'Invalid Expiry Date',
            'date.greater': 'Expiry Date must be after Mfg Date',
        }),
        mrp: Joi.number().min(0.01).required(),
        purchase_rate: Joi.number().min(0.01).max(Joi.ref('mrp')).required().messages({
            'number.max': 'Purchase Rate cannot exceed MRP',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
            'number.min': 'Quantity must be at least 1',
        }),
        rack_location: Joi.string().optional().allow(''),
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'At least one item is required',
        'any.required': 'Items are required',
    }),
});
//# sourceMappingURL=purchase.schema.js.map