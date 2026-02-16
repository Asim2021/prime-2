import { Router } from 'express';
import * as vendorController from './vendor.controller.js';
import { createVendorSchema, updateVendorSchema } from './vendor.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
// Protect all vendor routes
router.use(verifyAccessToken);
router.post('/', verifyUserRole('admin', 'pharmacist'), // Only admin/pharmacist can create vendors
joiValidate(createVendorSchema), vendorController.createVendor);
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', verifyUserRole('admin', 'pharmacist'), joiValidate(updateVendorSchema), vendorController.updateVendor);
router.delete('/:id', verifyUserRole('admin'), // Only admin can delete vendors
vendorController.deleteVendor);
export default router;
//# sourceMappingURL=vendor.router.js.map
