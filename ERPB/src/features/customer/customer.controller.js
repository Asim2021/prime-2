import { customerService } from './customer.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import { getPaginationParams } from '../../utils/helpers.js';

export const createCustomer = async (req, res) => {
    try {
        const customer = await customerService.create(req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: customer,
            message: 'Customer created successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
        });

        const search = req.query.search;
        const result = await customerService.findAll({ page, limit, offset, sortBy, order, search });

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

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerService.findById(id);
        if (!customer) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Customer not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: customer,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerService.update(id, req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: customer,
            message: 'Customer updated successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await customerService.delete(id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

