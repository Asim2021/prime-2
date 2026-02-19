import _ from 'lodash';
import * as stockAdjustmentService from './stockAdjustment.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { getPaginationParams } from '#utils/helpers.js';

export const createStockAdjustment = async (req, res) => {
  try {
    const result = await stockAdjustmentService.createStockAdjustment(req.body, req.user.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.CREATED,
      data: result,
      message: 'Stock adjustment created successfully',
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const getStockAdjustments = async (req, res) => {
  try {
    const { page, limit, offset, sortBy, order } = getPaginationParams({
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
      defaultLimit: 10,
      maxLimit: 100,
      defaultSortBy: 'created_at',
      defaultOrder: 'DESC',
    });

    const { rows, count } = await stockAdjustmentService.getAllStockAdjustments({
      limit,
      offset,
      sortBy,
      order,
    });

    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: 'Stock adjustments fetched successfully',
      data: _.isEmpty(rows)
        ? {
          data: [],
          totalCount: 0,
          count: 0,
          currentPage: 1,
          totalPages: 1,
        }
        : {
          data: rows,
          totalCount: count,
          count: rows.length,
          currentPage: page,
          totalPages: Math.ceil(count / limit),
        },
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};
