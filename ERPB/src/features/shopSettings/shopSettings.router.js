import { Router } from 'express';
import * as settingsController from './shopSettings.controller.js';
import { updateSettingsSchema } from './shopSettings.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
router.use(verifyAccessToken);
router.get('/', settingsController.getSettings);
router.put('/', verifyUserRole('admin'), joiValidate(updateSettingsSchema), settingsController.updateSettings);
export default router;
//# sourceMappingURL=shopSettings.router.js.map
