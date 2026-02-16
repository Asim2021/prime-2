import { purchaseService } from './purchase.service.js';
import { HTTP_STATUS } from '../../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../../middleware/sendResponse.js';
import { getPaginationParams } from '../../../utils/helpers.js';

export const getPurchases = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
        });

        const result = await purchaseService.getAll({ page, limit, offset, sortBy, order });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: {
                data: result.data,
                totalCount: result.meta.total,
                count: result.data.length,
                currentPage: result.meta.page,
                totalPages: result.meta.totalPages,
            },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getPurchaseById = async (req, res) => {
    try {
        const purchase = await purchaseService.getById(req.params.id);
        if (!purchase) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Purchase not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: purchase,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const createPurchase = async (req, res) => {
    try {
        const purchase = await purchaseService.create({
            ...req.body,
            created_by: req.user.id,
        });
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: purchase,
            message: 'Purchase created successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};