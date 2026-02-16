import { getAllUsers, getUserById, createUser, updateUser, deactivateUser } from './user.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const list = async (_req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(HTTP_STATUS.OK).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
export const getById = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
export const create = async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
export const update = async (req, res, next) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
export const deactivate = async (req, res, next) => {
    try {
        const result = await deactivateUser(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map

