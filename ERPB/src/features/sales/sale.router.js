import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import { createSale, getSaleById, getSales, returnSale } from './sale.controller.js';
import { createSaleSchema, returnSaleSchema } from './sale.schema.js';

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

router.post(
  '/return',
  verifyUserRole([ 'admin', 'pharmacist', 'cashier' ]),
  joiValidate(returnSaleSchema, JOI_TYPES.BODY),
  returnSale
);

export default router;
