import * as vendorService from './vendor.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const createVendor = async (req, res, next) => {
    try {
        const vendor = await vendorService.createVendor(req.body);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: { vendor } });
    }
    catch (error) {
        next(error);
    }
};
export const getAllVendors = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const result = await vendorService.getAllVendors({ page, limit, search });
        res.status(HTTP_STATUS.OK).json({ success: true, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
export const getVendorById = async (req, res, next) => {
    try {
        const vendor = await vendorService.getVendorById(req.params.id);
        if (!vendor) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: { vendor } });
    }
    catch (error) {
        next(error);
    }
};
export const updateVendor = async (req, res, next) => {
    try {
        const vendor = await vendorService.updateVendor(req.params.id, req.body);
        if (!vendor) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: { vendor } });
    }
    catch (error) {
        next(error);
    }
};
export const deleteVendor = async (req, res, next) => {
    try {
        const vendor = await vendorService.deleteVendor(req.params.id);
        if (!vendor) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, message: 'Vendor deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=vendor.controller.js.map

