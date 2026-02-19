import { Router } from 'express';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { JOI_TYPES, joiValidate } from '#utils/joiValidator.js';
import * as batchController from './batch.controller.js';
import { createBatchSchema, getAllBatchSchema } from './batch.schema.js';

const router = Router();

// Protect all batch routes
router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, joiValidate(getAllBatchSchema, JOI_TYPES.QUERY), batchController.getAllBatches);
router.get(ENDPOINT.ID, batchController.getBatchById);
router.put(
  ENDPOINT.ID,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  batchController.updateBatch,
);

router.post(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(createBatchSchema, JOI_TYPES.BODY),
  batchController.createBatch,
);

router.delete(
  ENDPOINT.ID,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  batchController.deleteBatch,
);

export default router;
