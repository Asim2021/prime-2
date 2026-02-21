import _ from 'lodash';
import * as customerService from './customer.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { getPaginationParams } from '#utils/helpers.js';

export const createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: customer,
            message: 'Customer created successfully',
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
            defaultLimit: 20,
            maxLimit: 100,
            defaultSortBy: 'created_at',
            defaultOrder: 'DESC',
        });

        const search = req.query.search ? decodeURIComponent(req.query.search).trim() : undefined;
        const has_credit = req.query.has_credit === 'true' || req.query.filter?.has_credit === 'true';

        const { rows, count } = await customerService.getAllCustomers({
            limit,
            offset,
            sortBy,
            order,
            search,
            has_credit,
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Customers fetched successfully',
            data: _.isEmpty(rows)
                ? {
                    data: [],
                    totalCount: 0,
                    count: 0,
                    currentPage: 1,
                    totalPages: 1,
                }
                : {
                    data: rows,
                    totalCount: count,
                    count: rows.length,
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                },
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
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
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerService.updateCustomer(id, req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: customer,
            message: 'Customer updated successfully',
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await customerService.deleteCustomer(id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};
