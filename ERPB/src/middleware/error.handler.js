import { UniqueConstraintError, ValidationError } from 'sequelize';

import config from '#lib/config.js';
import { sendErrorResponse } from './sendResponse.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';

function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return sendErrorResponse({res, status: HTTP_STATUS.BAD_REQUEST, message: 'Validation Error', args : {
      errors: err?.errors?.map((e) => e?.message),
    }});
  }

  // Fallback for other errors, with general 500 status
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  const message =
    config.NODE_ENV === 'production' && status === HTTP_STATUS.SERVER_ERROR
      ? 'Server Error'
      : err?.message || 'Server Error';

  return sendErrorResponse({ res, status, message });
}

export { errorHandler };

