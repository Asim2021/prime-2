import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import * as customerController from './customer.controller.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.post(
  ENDPOINT.BASE,
  verifyUserRole(['admin', 'pharmacist']),
  joiValidate(createCustomerSchema),
  customerController.createCustomer,
);
router.get(ENDPOINT.BASE, customerController.getCustomers);
router.get(ENDPOINT.ID, customerController.getCustomerById);
router.put(
  ENDPOINT.ID,
  verifyUserRole(['admin', 'pharmacist']),
  joiValidate(updateCustomerSchema),
  customerController.updateCustomer,
);
router.delete(ENDPOINT.ID, verifyUserRole(['admin']), customerController.deleteCustomer);

export default router;
