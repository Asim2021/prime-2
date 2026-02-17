import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import { createSale, getSaleById, getSales } from './sale.controller.js';
import { createSaleSchema } from './sale.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, verifyUserRole([ 'admin', 'pharmacist', 'cashier' ]), getSales);
router.get(ENDPOINT.ID, verifyUserRole([ 'admin', 'pharmacist', 'cashier' ]), getSaleById);
router.post(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin', 'pharmacist', 'cashier' ]),
  joiValidate(createSaleSchema, JOI_TYPES.BODY),
  createSale,
);

export default router;
