import { Router } from 'express';
import * as medicineController from './medicine.controller.js';
import { createMedicineSchema, updateMedicineSchema } from './medicine.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';


const router = Router();
// Protect all medicine routes
router.use(verifyAccessToken);
router.post('/', verifyUserRole('admin', 'pharmacist'), joiValidate(createMedicineSchema), medicineController.createMedicine);
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);
router.get('/:id/batches', medicineController.getMedicineBatches);
router.put('/:id', verifyUserRole('admin', 'pharmacist'), joiValidate(updateMedicineSchema), medicineController.updateMedicine);
router.delete('/:id', verifyUserRole('admin'), medicineController.deleteMedicine);
export default router;
//# sourceMappingURL=medicine.router.js.map
