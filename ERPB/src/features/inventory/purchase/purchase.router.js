import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '#utils/joiValidator.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { createPurchase, getPurchaseById, getPurchases } from './purchase.controller.js';
import { createPurchaseSchema, getAllPurchaseSchema } from './purchase.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, verifyUserRole([ 'admin' ]), joiValidate(getAllPurchaseSchema, JOI_TYPES.QUERY), getPurchases);
router.get(ENDPOINT.ID, verifyUserRole([ 'admin' ]), getPurchaseById);
router.post(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin' ]),
  joiValidate(createPurchaseSchema, JOI_TYPES.BODY),
  createPurchase,
);

export default router;
