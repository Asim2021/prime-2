import Joi from 'joi';
export const createUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role_id: Joi.string().uuid().required(),
});
export const updateUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(100).optional(),
    email: Joi.string().email().optional(),
    role_id: Joi.string().uuid().optional(),
    is_active: Joi.boolean().optional(),
}).min(1);
export const userIdParamSchema = Joi.object({
    id: Joi.string().uuid().required(),
});
//# sourceMappingURL=user.schema.js.map