import Joi from 'joi';
export const loginSchema = Joi.object({
    username: Joi.string().trim().required().messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
});
export const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required().messages({
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must not exceed 100 characters',
        'any.required': 'Username is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).max(128).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password must not exceed 128 characters',
        'any.required': 'Password is required',
    }),
    role_id: Joi.string().uuid().optional(),
});
//# sourceMappingURL=auth.schema.js.map