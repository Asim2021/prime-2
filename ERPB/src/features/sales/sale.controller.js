import _ from 'lodash';
import * as saleService from './sale.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { getPaginationParams } from '#utils/helpers.js';

export const getSales = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
            defaultLimit: 20,
            maxLimit: 100,
            defaultSortBy: 'bill_date',
            defaultOrder: 'DESC',
        });

        const { rows, count } = await saleService.getAllSales({
            limit,
            offset,
            sortBy,
            order,
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Sales fetched successfully',
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

export const getSalesReturns = async (req, res) => {
    try {
        const { page, limit, offset, sortBy, order } = getPaginationParams({
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            order: req.query.order,
            defaultLimit: 20,
            maxLimit: 100,
            defaultSortBy: 'return_date',
            defaultOrder: 'DESC',
        });

        const { rows, count } = await saleService.getAllSalesReturns({
            limit,
            offset,
            sortBy,
            order,
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Sales Returns fetched successfully',
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

export const getSaleById = async (req, res) => {
    try {
        const sale = await saleService.getSaleById(req.params.id);
        if (!sale) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.NOT_FOUND,
                message: 'Sale not found',
            });
        }
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: sale,
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const createSale = async (req, res) => {
    try {
        const sale = await saleService.createSale({
            ...req.body,
            created_by: req.user.id,
        });
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: sale,
            message: 'Sale created successfully',
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};

export const returnSale = async (req, res) => {
    try {
        const data = { ...req.body, created_by: req.user.id };
        const result = await saleService.processReturn(data);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            data: result,
            message: 'Sale return processed successfully',
        });
    } catch (error) {
        sendErrorResponse({
            res,
            status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
            message: error.message || error,
        });
    }
};
//# sourceMappingURL=sale.controller.js.map