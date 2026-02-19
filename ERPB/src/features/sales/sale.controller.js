import { saleService } from './sale.service.js';
export const getSales = async (req, res, next) => {
    try {
        const sales = await saleService.getAll();
        res.json(sales);
    }
    catch (error) {
        next(error);
    }
};
export const getSaleById = async (req, res, next) => {
    try {
        const sale = await saleService.getById(req.params.id);
        if (!sale) {
            res.status(404).json({ message: 'Sale not found' });
            return;
        }
        res.json(sale);
    }
    catch (error) {
        next(error);
    }
};
export const createSale = async (req, res, next) => {
    try {
        const sale = await saleService.create({
            ...req.body,
            created_by: req.user.id,
        });
        res.status(201).json(sale);
    }
    catch (error) {
        next(error);
    }
};

export const returnSale = async (req, res, next) => {
    try {
        const data = { ...req.body, created_by: req.user.id };
        const result = await saleService.processReturn(data);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
//# sourceMappingURL=sale.controller.js.map