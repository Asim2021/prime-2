import _ from 'lodash';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { SEVERITY } from '#constant/strings.js';

const { isEmpty } = _
/**
 * The function `sendSuccess` sends a successful response with data, message, and severity information.
 * @param res - The  response object.
 * @param status - The HTTP status code.
 * @param data - The data that you want to send back as a response.
 * @param message - The `message` in the JSON response when an error occurs.
 * @param meta - The `meta` in the meta data object.
 * @returns Returns a JSON response.
 */
function sendSuccessResponse({ res, status = 200, data = null, message, meta }) {
  return res.status(status).json({
    data: status === HTTP_STATUS.NO_CONTENT ? [] : data,
    message: message || SEVERITY.SUCCESS,
    severity: SEVERITY.SUCCESS,
    success: true,
    ...(isEmpty(meta) ? {} : { meta })
  });
}

/**
 * The `sendError` is used to send an error response with a specified status code, message,
 * and severity level.
 * @param res - The  response object.
 * @param status - The HTTP status code.
 * @param message - The `message` in the JSON response when an error occurs.
 * @param args - The `args` is an Object having key-value pairs that are passed to the response as extra params.
 * @returns Returns a JSON response.
 */
function sendErrorResponse({ res, status, message = 'Server error', args = {}, internalError }) {
  if (internalError) {
    console.error('Error ~ Failure: ', internalError);
  } else {
    console.error('Error ~ Failure: ', message);
  }

  return res.status(status).json({
    success: false,
    data: null,
    message: message,
    ...args,
    severity: SEVERITY.ERROR,
  });
}

/**
 * @returns The `sendUnauthorizedResponse` function is returning an unauthorized response with
 * a specific message and additional details by calling the
 * `sendErrorResponse` function with the provided parameters: `res`, `status`, `message`, and an
 * object containing additional information such as `jwtExpired`, `service`, and a formatted `reason`
 * message.
 */
const sendUnauthorizedResponse = ({
  res,
  status = HTTP_STATUS.UNAUTHORIZED,
  message = 'Unauthorized',
  tokenType,
  reason,
}) => {
  return sendErrorResponse({
    res,
    status,
    message,
    args: {
      jwtExpired: true,
      service: 'verifyTokens',
      reason:
        reason && tokenType
          ? `${reason} Authorization denied for ${tokenType}.`
          : 'Authorization denied.',
    },
  });
};

export { sendSuccessResponse, sendErrorResponse, sendUnauthorizedResponse };

