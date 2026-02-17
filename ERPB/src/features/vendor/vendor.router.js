import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '../../utils/joiValidator.js';
import * as vendorController from './vendor.controller.js';
import { createVendorSchema, updateVendorSchema } from './vendor.schema.js';
import { ENDPOINT } from '../../constant/endpoints.js';

const router = Router();

// Protect all vendor routes
router.use(verifyAccessToken);

router.post(
  ENDPOINT.BASE,
  verifyUserRole([ 'admin', 'pharmacist' ]), // Only admin/pharmacist can create vendors
  joiValidate(createVendorSchema, JOI_TYPES.BODY),
  vendorController.createVendor,
);
router.get(ENDPOINT.BASE, vendorController.getAllVendors);
router.get(ENDPOINT.ID, vendorController.getVendorById);
router.put(
  ENDPOINT.ID,
  verifyUserRole([ 'admin', 'pharmacist' ]),
  joiValidate(updateVendorSchema, JOI_TYPES.BODY),
  vendorController.updateVendor,
);
router.delete(ENDPOINT.ID, verifyUserRole([ 'admin' ]), vendorController.deleteVendor);

export default router;
