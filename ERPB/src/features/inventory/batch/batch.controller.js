import _ from 'lodash';
import * as batchService from './batch.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { getPaginationParams } from '#utils/helpers.js';

export const getAllBatches = async (req, res) => {
  try {
    const { page, limit, offset, sortBy, order } = getPaginationParams({
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
      defaultLimit: 20,
      maxLimit: 100,
      defaultSortBy: 'created_at',
      defaultOrder: 'DESC',
    });

    const search = req.query.search ? decodeURIComponent(req.query.search).trim() : undefined;
    const medicine_id = req.query.medicine_id;

    const { rows, count } = await batchService.getAllBatches({
      limit,
      offset,
      sortBy,
      order,
      search,
      medicine_id,
    });

    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: 'Batches fetched successfully',
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
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
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
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const createBatch = async (req, res) => {
  try {
    const batch = await batchService.createBatch(req.body, req.user?.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.CREATED,
      data: batch,
      message: 'Batch created successfully',
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    await batchService.deleteBatch(req.params.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: 'Batch deleted successfully',
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};
