import _ from 'lodash'
import * as userService from './user.service.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import { getPaginationParams, parseBoolean } from '#utils/helpers.js';
import { USERS_STRING } from '#constant/strings.js';

export const list = async (req, res) => {
  try {
    const { page, limit, offset, sortBy, order } = getPaginationParams({
      page: req?.query?.page,
      limit: req?.query?.limit,
      sortBy: req?.query?.sort_by,
      order: req?.query?.order,
      defaultLimit: 10,
      maxLimit: 100,
      defaultSortBy: 'created_at',
      defaultOrder: 'DESC',
    });
    const search = req?.query?.search ? decodeURIComponent(req.query.search).trim() : undefined;
    const active = parseBoolean(req?.query?.filter?.active);
    const { rows, count } = await userService.getAllUsers({
      page,
      limit,
      offset,
      sortBy,
      order,
      search,
      active,
    });
    console.log('🚀 ~ list ~ users:', rows);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: USERS_STRING.USER_FETCHED,
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

export const getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: USERS_STRING.USER_FETCHED,
      data: user,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.CREATED,
      data: user,
      message: USERS_STRING.USER_CREATED,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      data: user,
      message: USERS_STRING.USER_UPDATED,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};

export const deactivate = async (req, res) => {
  try {
    const result = await userService.deactivateUser(req.params.id);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: result.message,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
      message: error.message || error,
    });
  }
};
