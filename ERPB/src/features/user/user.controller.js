import * as userService from './user.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';

export const list = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: users,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: user,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const create = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: user,
            message: 'User created successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const update = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: user,
            message: 'User updated successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const deactivate = async (req, res) => {
    try {
        const result = await userService.deactivateUser(req.params.id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: result.message,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

