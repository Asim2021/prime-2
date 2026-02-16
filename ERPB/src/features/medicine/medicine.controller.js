import * as medicineService from './medicine.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import { getPaginationParams } from '../../utils/helpers.js';

export const createMedicine = async (req, res) => {
    try {
        const medicine = await medicineService.createMedicine(req.body, req.user?.id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: medicine,
            message: 'Medicine created successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getAllMedicines = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
        });

        const search = req.query.search;
        const result = await medicineService.getAllMedicines({ page, limit, offset, sortBy, order, search });

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

export const getMedicineById = async (req, res) => {
    try {
        const medicine = await medicineService.getMedicineById(req.params.id);
        if (!medicine) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Medicine not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: medicine,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const medicine = await medicineService.updateMedicine(req.params.id, req.body, req.user?.id);
        if (!medicine) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Medicine not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: medicine,
            message: 'Medicine updated successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await medicineService.deleteMedicine(req.params.id, req.user?.id);
        if (!medicine) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Medicine not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Medicine deleted successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getMedicineBatches = async (req, res) => {
    try {
        const batches = await medicineService.getBatches(req.params.id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: batches,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

