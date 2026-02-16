import rateLimit from 'express-rate-limit';

import { sendErrorResponse } from '../middleware/sendResponse.js';

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 150, // Limit each IP to 150 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (_, res, next, options) => {
    if (options.statusCode === 429) {
      return sendErrorResponse({
        res,
        status: options.statusCode,
        message: 'Too many requests, please try again after 60 Min.',
      });
    }
    next();
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_, res, next, options) => {
    if (options.statusCode === 429) {
      return sendErrorResponse({
        res,
        status: options.statusCode,
        message: 'Too many requests, please try again after 15 Min.',
      });
    }
    next();
  },
});

export { authLimiter, appLimiter };
