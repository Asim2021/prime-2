import * as batchService from './batch.service.js';
import { HTTP_STATUS } from '../../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../../middleware/sendResponse.js';
import { getPaginationParams } from '../../../utils/helpers.js';

export const getAllBatches = async (req, res) => {
  try {
    const { page, limit, offset, sortBy, order } = getPaginationParams({
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
    });

    const search = req.query.search;
    const medicine_id = req.query.medicine_id;

    const result = await batchService.getAllBatches({ page, limit, offset, sortBy, order, search, medicine_id });

    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      data: {
        data: result.data,
        totalCount: result.meta.total,
        count: result.data.length,
        currentPage: result.meta.page,
        totalPages: result.meta.totalPages,
      },
    });
  } catch (error) {
    sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const batch = await batchService.getBatchById(req.params.id);
    if (!batch) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Batch not found',
      });
    }
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      data: batch,
    });
  } catch (error) {
    sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const batch = await batchService.updateBatch(req.params.id, req.body, req.user?.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      data: batch,
      message: 'Batch updated successfully',
    });
  } catch (error) {
    sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
  }
};
