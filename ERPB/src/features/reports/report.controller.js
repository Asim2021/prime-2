import { reportService } from './report.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const getDashboardMetrics = async (req, res, next) => {
    try {
        const metrics = await reportService.getDashboardMetrics();
        res.status(HTTP_STATUS.OK).json({ success: true, data: metrics });
    }
    catch (error) {
        next(error);
    }
};
export const getSalesReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Start date and End date are required',
            });
            return;
        }
        const sales = await reportService.getSalesReport(startDate, endDate);
        res.status(HTTP_STATUS.OK).json({ success: true, data: sales });
    }
    catch (error) {
        next(error);
    }
};
export const getInventoryReport = async (req, res, next) => {
    try {
        const inventory = await reportService.getInventoryReport();
        res.status(HTTP_STATUS.OK).json({ success: true, data: inventory });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=report.controller.js.map

