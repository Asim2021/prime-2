import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendErrorResponse } from './sendResponse.js';

function notFoundHandler(_req, res) {
  return sendErrorResponse({
    res,
    status: HTTP_STATUS.NOT_FOUND,
    message: "API url doesn't exist",
  });
}

export { notFoundHandler };

