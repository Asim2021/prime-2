import { shopSettingsService } from './shopSettings.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';

export const getSettings = async (req, res) => {
    try {
        const settings = await shopSettingsService.getSettings();
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: settings,
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = await shopSettingsService.updateSettings(req.body);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: settings,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

