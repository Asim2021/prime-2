import { Router } from 'express';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { list } from './role.controller.js';

const router = Router();

// Only authenticated admins can fetch roles
router.use(verifyAccessToken);
router.get('/', verifyUserRole([ 'admin' ]), list);

export default router;
