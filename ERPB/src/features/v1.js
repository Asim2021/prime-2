import { Router } from 'express';
import authRouter from './auth/auth.router.js';
import userRouter from './user/user.router.js';
import vendorRouter from './vendor/vendor.router.js';
import medicineRouter from './medicine/medicine.router.js';
import purchaseRouter from './inventory/purchase/purchase.router.js';
import saleRouter from './sales/sale.router.js';
import reportRouter from './reports/report.router.js';
import customerRouter from './customer/customer.router.js';
import settingsRouter from './shopSettings/shopSettings.router.js';
import batchRouter from './inventory/batch/batch.router.js';
import stockAdjustmentRouter from './inventory/stockAdjustment/stockAdjustment.router.js';
import roleRouter from './role/role.router.js';
import { ENDPOINT } from '#constant/endpoints.js';

const v1Router = Router();
v1Router.use(ENDPOINT.AUTH.BASE, authRouter);
v1Router.use('/users', userRouter);
v1Router.use('/vendors', vendorRouter);
v1Router.use('/customers', customerRouter);
v1Router.use('/settings', settingsRouter);
v1Router.use('/medicines', medicineRouter);
v1Router.use('/purchases', purchaseRouter);
v1Router.use('/batches', batchRouter); // Mounted
v1Router.use('/sales', saleRouter);
v1Router.use('/roles', roleRouter);
v1Router.use('/reports', reportRouter);
v1Router.use('/stock-adjustments', stockAdjustmentRouter);

export default v1Router;
//# sourceMappingURL=v1.js.map