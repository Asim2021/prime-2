import { Router } from 'express';
import { createSale, getSaleById, getSales } from './sale.controller.js';
import { createSaleSchema } from './sale.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
router.use(verifyAccessToken);
router.get('/', verifyUserRole('admin', 'pharmacist', 'cashier'), getSales);
router.get('/:id', verifyUserRole('admin', 'pharmacist', 'cashier'), getSaleById);
router.post('/', verifyUserRole('admin', 'pharmacist', 'cashier'), joiValidate(createSaleSchema), createSale);
export default router;
//# sourceMappingURL=sale.router.js.map
