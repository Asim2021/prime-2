import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { Role } from '#models/index.js';

export const list = async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: [ 'id', 'name', 'code' ] });
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: 'Roles fetched successfully',
      data: {
        data: roles,
        totalCount: roles.length,
        count: roles.length,
        currentPage: 1,
        totalPages: 1
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
