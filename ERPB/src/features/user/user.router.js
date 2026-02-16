import { Router } from 'express';
import { list, getById, create, update, deactivate } from './user.controller.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema.js';
import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { joiValidate } from '#utils/joiValidator.js';

const router = Router();
// All user routes require authentication
router.use(verifyAccessToken);
router.get('/', verifyUserRole('admin'), list);
router.get('/:id', joiValidate(userIdParamSchema, 'params'), getById);
router.post('/', verifyUserRole('admin'), joiValidate(createUserSchema), create);
router.patch('/:id', verifyUserRole('admin'), joiValidate(userIdParamSchema, 'params'), joiValidate(updateUserSchema), update);
router.delete('/:id', verifyUserRole('admin'), joiValidate(userIdParamSchema, 'params'), deactivate);
export default router;
//# sourceMappingURL=user.router.js.map
