import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import * as settingsController from './shopSettings.controller.js';
import { updateSettingsSchema } from './shopSettings.schema.js';

const router = Router();

router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, settingsController.getSettings);
router.put(
  ENDPOINT.BASE,
  verifyUserRole(['admin']),
  joiValidate(updateSettingsSchema),
  settingsController.updateSettings,
);

export default router;
