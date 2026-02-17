import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import * as reportController from './report.controller.js';

const router = Router();

router.use(verifyAccessToken);

router.get('/dashboard', verifyUserRole(['admin', 'pharmacist']), reportController.getDashboardMetrics);
router.get('/sales', verifyUserRole(['admin']), reportController.getSalesReport);
router.get('/inventory', verifyUserRole(['admin', 'pharmacist']), reportController.getInventoryReport);

export default router;
