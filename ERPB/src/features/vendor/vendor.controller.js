import * as vendorService from './vendor.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import { getPaginationParams } from '../../utils/helpers.js';

export const createVendor = async (req, res) => {
    try {
        const vendor = await vendorService.createVendor(req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: vendor,
            message: 'Vendor created successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
        });

        const search = req.query.search;
        const result = await vendorService.getAllVendors({ page, limit, offset, sortBy, order, search });

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

export const getVendorById = async (req, res) => {
    try {
        const vendor = await vendorService.getVendorById(req.params.id);
        if (!vendor) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Vendor not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: vendor,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const vendor = await vendorService.updateVendor(req.params.id, req.body);
        if (!vendor) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Vendor not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: vendor,
            message: 'Vendor updated successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        const vendor = await vendorService.deleteVendor(req.params.id);
        if (!vendor) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Vendor not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Vendor deleted successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

