import jwt from 'jsonwebtoken';

import { HTTP_STATUS } from '#constant/httpStatus.js';
import { TOKEN, TOKEN_STRING } from '#constant/strings.js';
import config from '#lib/config.js';
import { logoutUser, sanitizeUser } from '#utils/helpers.js';
import { sendErrorResponse, sendUnauthorizedResponse } from './sendResponse.js';
import { Role, User } from '#models/index.js';

const getUser = async (id) => {
  const user = await User.findOne({
    where: { id: id },
    raw: true,
    nest: true,
    attributes: {
      exclude: ['password', ''],
    },
    include: [{ model: Role, as: 'role', attributes: ['name', 'code'] }],
  });

  return user;
};

const verifyAccessToken = async (req, res, next) => {
  try {
    const accessTokenFromReq = req.headers.authorization?.split(' ')[1];

    if (!accessTokenFromReq) {
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.NO_TOKEN,
      });
    }

    const verifiedToken = jwt.verify(accessTokenFromReq, config.ACCESS_TOKEN_SECRET);

    if (!verifiedToken) {
      return sendUnauthorizedResponse({
        res,
        status: HTTP_STATUS.FORBIDDEN,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.VERIFICATION_FAILED,
      });
    }

    const user = await getUser(verifiedToken.id);

    if (!user) {
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.USER_NOT_EXIST,
      });
    }

    if (!user.is_active) {
      logoutUser({ res });
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.USER_DEACTIVATED,
      });
    }

    ((req.user = sanitizeUser(user)), next());
  } catch (error) {
    return sendErrorResponse({
      res,
      status: HTTP_STATUS.FORBIDDEN,
      message: TOKEN_STRING.VERIFICATION_FAILED,
      internalError: error,
      args: {
        service: 'verifyAccessToken',
      },
    });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromReq = req.cookies[TOKEN.REFRESH];

    if (!refreshTokenFromReq) {
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.REFRESH,
        reason: TOKEN_STRING.NO_TOKEN,
      });
    }

    const verifiedToken = jwt.verify(refreshTokenFromReq, config.REFRESH_TOKEN_SECRET);

    if (!verifiedToken) {
      return sendUnauthorizedResponse({
        res,
        status: HTTP_STATUS.FORBIDDEN,
        tokenType: TOKEN.REFRESH,
        reason: TOKEN_STRING.VERIFICATION_FAILED,
      });
    }

    const user = await getUser(verifiedToken.id);

    if (!user) {
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.REFRESH,
        reason: TOKEN_STRING.USER_NOT_EXIST,
      });
    }

    if (!user.is_active) {
      logoutUser({ res });
      return sendUnauthorizedResponse({
        res,
        tokenType: TOKEN.REFRESH,
        reason: TOKEN_STRING.USER_DEACTIVATED,
      });
    }

    ((req.user = sanitizeUser(user)), next());
  } catch (error) {
    return sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: TOKEN_STRING.VERIFICATION_FAILED,
      internalError: error,
      args: {
        service: 'verifyRefreshToken',
      },
    });
  }
};

const verifyUserRole = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) {
    return sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: 'allowedRoles must be an array',
      internalError: true,
      args: {
        service: 'verifyUserRole',
      },
    });
  }
  return (req, res, next) => {
    if (!req.user || !req.user.role.code) {
      return sendUnauthorizedResponse({
        res,
        status: HTTP_STATUS.UNAUTHORIZED,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.MISSING_AUTH_CONTEXT,
      });
    }

    if (!allowedRoles.includes(req.user.role.code)) {
      return sendUnauthorizedResponse({
        res,
        status: HTTP_STATUS.FORBIDDEN,
        tokenType: TOKEN.ACCESS,
        reason: TOKEN_STRING.ROLE_UNAUTHORIZED,
      });
    }
    next();
  };
};

export { verifyAccessToken, verifyRefreshToken, verifyUserRole };
