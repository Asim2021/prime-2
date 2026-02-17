import Joi from 'joi';

export const loginSchema = Joi.object({
  password: Joi.string().required(),
  username: Joi.string().required(),
  remember: Joi.boolean().optional(),
});

export const registerUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must be less than 30 characters long.',
      'string.pattern.base': 'Password must contain at least one letter and one number.',
      'any.required': 'Password is required.',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords not matched.',
    'any.required': 'Confirm password is required.',
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
