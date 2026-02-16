import * as medicineService from './medicine.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const createMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.createMedicine(req.body, req.user?.id);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: { medicine } });
    }
    catch (error) {
        next(error);
    }
};
export const getAllMedicines = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const result = await medicineService.getAllMedicines({ page, limit, search });
        res.status(HTTP_STATUS.OK).json({ success: true, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
export const getMedicineById = async (req, res, next) => {
    try {
        const medicine = await medicineService.getMedicineById(req.params.id);
        if (!medicine) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Medicine not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: { medicine } });
    }
    catch (error) {
        next(error);
    }
};
export const updateMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.updateMedicine(req.params.id, req.body, req.user?.id);
        if (!medicine) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Medicine not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: { medicine } });
    }
    catch (error) {
        next(error);
    }
};
export const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await medicineService.deleteMedicine(req.params.id, req.user?.id);
        if (!medicine) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Medicine not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, message: 'Medicine deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
export const getMedicineBatches = async (req, res, next) => {
    try {
        const batches = await medicineService.getBatches(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: { batches } });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=medicine.controller.js.map

