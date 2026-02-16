import { purchaseService } from './purchase.service.js';
export const getPurchases = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await purchaseService.getAll({ page, limit });
        res.json({ success: true, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
export const getPurchaseById = async (req, res, next) => {
    try {
        const purchase = await purchaseService.getById(req.params.id);
        if (!purchase) {
            res.status(404).json({ message: 'Purchase not found' });
            return;
        }
        res.json(purchase);
    }
    catch (error) {
        next(error);
    }
};
export const createPurchase = async (req, res, next) => {
    try {
        const purchase = await purchaseService.create({
            ...req.body,
            created_by: req.user.id,
        });
        res.status(201).json(purchase);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=purchase.controller.js.map