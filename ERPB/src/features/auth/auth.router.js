import { Router } from 'express';
import { login, register, refresh, logout, getMe } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { authLimiter } from '#lib/rateLimit.js';
import { joiValidate } from '#utils/joiValidator.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { verifyAccessToken } from '#middleware/verifyTokens.js';

const router = Router();

// Public routes
router.post(ENDPOINT.AUTH.LOGIN.toLowerCase(), authLimiter, joiValidate(loginSchema), login);
router.post(ENDPOINT.AUTH.REGISTER, authLimiter, joiValidate(registerSchema), register);
router.post(ENDPOINT.AUTH.REFRESH_TOKEN, refresh);

// Protected routes
router.post(ENDPOINT.AUTH.LOGOUT, verifyAccessToken, logout);
router.get(ENDPOINT.AUTH.GET_ME, verifyAccessToken, getMe);

export default router;
