import { shopSettingsService } from './shopSettings.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const getSettings = async (req, res, next) => {
    try {
        const settings = await shopSettingsService.getSettings();
        res.status(HTTP_STATUS.OK).json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
export const updateSettings = async (req, res, next) => {
    try {
        const settings = await shopSettingsService.updateSettings(req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=shopSettings.controller.js.map

