import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../../middleware/verifyTokens.js';
import { joiValidate } from '../../../utils/joiValidator.js';
import { ENDPOINT } from '../../../constant/endpoints.js';
import { createPurchase, getPurchaseById, getPurchases } from './purchase.controller.js';
import { createPurchaseSchema } from './purchase.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, verifyUserRole('admin', 'salesman'), getPurchases);
router.get(ENDPOINT.ID, verifyUserRole('admin', 'salesman'), getPurchaseById);
router.post(
  ENDPOINT.BASE,
  verifyUserRole('admin', 'salesman'),
  joiValidate(createPurchaseSchema),
  createPurchase,
);

export default router;
