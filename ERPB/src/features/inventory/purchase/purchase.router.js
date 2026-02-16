import { Router } from 'express';
import { createPurchase, getPurchaseById, getPurchases } from './purchase.controller.js';
import { createPurchaseSchema } from './purchase.schema.js';
import { verifyAccessToken } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
router.use(verifyAccessToken);
router.get('/', verifyUserRole('admin', 'salesman'), getPurchases);
router.get('/:id', verifyUserRole('admin', 'salesman'), getPurchaseById);
router.post('/', verifyUserRole('admin', 'salesman'), joiValidate(createPurchaseSchema), createPurchase);
export default router;
//# sourceMappingURL=purchase.router.js.map
