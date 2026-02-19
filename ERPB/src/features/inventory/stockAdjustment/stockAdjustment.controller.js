import { stockAdjustmentService } from './stockAdjustment.service.js';

export const createStockAdjustment = async (req, res, next) => {
  try {
    const result = await stockAdjustmentService.create(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStockAdjustments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await stockAdjustmentService.getAll({
      page,
      limit,
      offset,
      sortBy: req.query.sortBy,
      order: req.query.order
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
