import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '#utils/joiValidator.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { createStockAdjustment, getStockAdjustments } from './stockAdjustment.controller.js';
import { createStockAdjustmentSchema, getAllStockAdjustmentSchema } from './stockAdjustment.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.post(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(createStockAdjustmentSchema, JOI_TYPES.BODY),
  createStockAdjustment,
);

router.get(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(getAllStockAdjustmentSchema, JOI_TYPES.QUERY),
  getStockAdjustments,
);

export default router;
