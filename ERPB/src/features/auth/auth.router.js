import { Router } from 'express';
import { login, register, refresh, logout, getMe } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { joiValidate } from '#utils/joiValidator.js';
import { authLimiter } from '#lib/rateLimit.js';
import { verifyAccessToken } from '#middleware/verifyTokens.js';
const router = Router();
// Public routes
router.post('/login', authLimiter, joiValidate(loginSchema), login);
router.post('/register', authLimiter, joiValidate(registerSchema), register);
router.post('/refresh', refresh);
// Protected routes
router.post('/logout', verifyAccessToken, logout);
router.get('/me', verifyAccessToken, getMe);
export default router;
//# sourceMappingURL=auth.router.js.map
