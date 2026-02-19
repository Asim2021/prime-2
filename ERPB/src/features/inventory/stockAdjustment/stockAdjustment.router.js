import { Router } from 'express';
import { verifyAccessToken, verifyUserRole } from '../../../middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '../../../utils/joiValidator.js';
import { createStockAdjustment, getStockAdjustments } from './stockAdjustment.controller.js';
import { createStockAdjustmentSchema, getStockAdjustmentSchema } from './stockAdjustment.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.post(
  '/',
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(createStockAdjustmentSchema, JOI_TYPES.BODY),
  createStockAdjustment
);

router.get(
  '/',
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(getStockAdjustmentSchema, JOI_TYPES.QUERY),
  getStockAdjustments
);

export default router;
