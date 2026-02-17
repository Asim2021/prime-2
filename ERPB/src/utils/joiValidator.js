import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendErrorResponse } from '#middleware/sendResponse.js';


const joiValidate = (schema, type) => {
  return (req, res, next) => {
    if (!type) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.SERVER_ERROR,
        message: "joiValidate require 'type' as param",
      });
    }
    const { error } = schema.validate(req[ type ]);
    if (error) {
      const errMessages = error?.details?.map((detail) => detail.message);
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.BAD_REQUEST,
        message: errMessages.length === 1 ? errMessages[ 0 ] : errMessages,
        args: { type: `Joi ${type} Validation Error` },
      });
    }
    next();
  };
};

const JOI_TYPES = {
  BODY: 'body',
  PARAMS: 'params',
  QUERY: 'query',
};

export { JOI_TYPES, joiValidate };

