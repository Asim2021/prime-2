import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '../../middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '../../utils/joiValidator.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import { list, getById, create, update, deactivate } from './user.controller.js';
import { createUserSchema, getAllUserSchema, updateUserSchema, userIdParamSchema } from './user.schema.js';

const router = Router();

// All user routes require authentication
router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, verifyUserRole(['admin']), joiValidate(getAllUserSchema, JOI_TYPES.QUERY), list);
router.get(ENDPOINT.ID, joiValidate(userIdParamSchema, 'params'), getById);
router.post(ENDPOINT.BASE, verifyUserRole(['admin']), joiValidate(createUserSchema), create);
router.patch(
  ENDPOINT.ID,
  verifyUserRole(['admin']),
  joiValidate(userIdParamSchema, 'params'),
  joiValidate(updateUserSchema),
  update,
);
router.delete(
  ENDPOINT.ID,
  verifyUserRole(['admin']),
  joiValidate(userIdParamSchema, 'params'),
  deactivate,
);

export default router;
