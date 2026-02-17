import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import * as medicineController from './medicine.controller.js';
import { createMedicineSchema, updateMedicineSchema } from './medicine.schema.js';

const router = Router();

// Protect all medicine routes
router.use(verifyAccessToken);

router.post(
  ENDPOINT.BASE,
  verifyUserRole(['admin', 'pharmacist']),
  joiValidate(createMedicineSchema),
  medicineController.createMedicine,
);
router.get(ENDPOINT.BASE, medicineController.getAllMedicines);
router.get(ENDPOINT.ID, medicineController.getMedicineById);
router.get(ENDPOINT.ID + '/batches', medicineController.getMedicineBatches);
router.put(
  ENDPOINT.ID,
  verifyUserRole(['admin', 'pharmacist']),
  joiValidate(updateMedicineSchema),
  medicineController.updateMedicine,
);
router.delete(ENDPOINT.ID, verifyUserRole(['admin']), medicineController.deleteMedicine);

export default router;
