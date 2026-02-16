import { Router } from 'express';
import * as customerController from './customer.controller.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
router.use(verifyAccessToken);
router.post('/', verifyUserRole('admin', 'pharmacist'), joiValidate(createCustomerSchema), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', verifyUserRole('admin', 'pharmacist'), joiValidate(updateCustomerSchema), customerController.updateCustomer);
router.delete('/:id', verifyUserRole('admin'), customerController.deleteCustomer);
export default router;
//# sourceMappingURL=customer.router.js.map
