import { reportService } from './report.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import { getPaginationParams } from '#utils/helpers.js';
import _ from 'lodash';
const { isEmpty } = _

export const getDashboardMetrics = async (req, res) => {
    try {
        const metrics = await reportService.getDashboardMetrics();
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: metrics,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Start date and End date are required',
            });
        }
        const sales = await reportService.getSalesReport(startDate, endDate);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: sales,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getInventoryReport = async (req, res) => {
    const { page, limit, offset, sortBy, order } = getPaginationParams({
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        order: req.query.order,
        defaultLimit: 10,
        maxLimit: 100,
        defaultSortBy: 'created_at',
        defaultOrder: 'DESC',
    });
    try {
        const { total_count, inventory, total_inventory_value } = await reportService.getInventoryReport({ page, limit, offset, sortBy, order });
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: { inventory, total_inventory_value },
            data: _.isEmpty(inventory)
                ? {
                    data: [],
                    totalCount: 0,
                    count: 0,
                    currentPage: 1,
                    totalPages: 1,
                    meta: { total_inventory_value: 0 }
                }
                : {
                    data: inventory,
                    totalCount: total_count,
                    count: inventory.length,
                    currentPage: page,
                    totalPages: Math.ceil(total_count / limit),
                    meta: { total_inventory_value }
                },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

