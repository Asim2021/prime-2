import { reportService } from './report.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';

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
    try {
        const inventory = await reportService.getInventoryReport();
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: inventory,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

