import { customerService } from './customer.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
export const createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
};
export const getCustomers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const result = await customerService.findAll({ page, limit, search });
        res.status(HTTP_STATUS.OK).json({ success: true, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
export const getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.findById(id);
        if (!customer) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Customer not found' });
            return;
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
};
export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.update(id, req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
};
export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        await customerService.delete(id);
        res.status(HTTP_STATUS.OK).json({ success: true, message: 'Customer deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=customer.controller.js.map

