import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

import { HTTP_STATUS } from '#constant/httpStatus.js';
import { AUTH_STRING, GLOBAL_STRING, USERS_STRING } from '#constant/strings.js';
import { Role, User } from '#models/index.js';
import config from '#lib/config.js';
import { sendErrorResponse, sendSuccessResponse } from '#middleware/sendResponse.js';
import { sanitizeUser } from '#utils/helpers.js';

const getPayload = (user)=> {
      return  {
        id: user.id,
        username: user.username,
        role_code: user.role.code,
        role_name: user.role.name,
      };
}

//////// ------- USER REGISTRATION/SIGNUP -----------//////////
export const authRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({ raw: true, where: { email: email } });

    if (user) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.CONFLICT,
        message: USERS_STRING.EMAIL_EXISTS,
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, config.SALT);
    } catch (error) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.SERVER_ERROR,
        message: GLOBAL_STRING.WENT_WRONG,
        internalError: error,
        args: { service: 'Password Hashing' },
      });
    }

    const userData = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const id = userData.id;
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.CREATED,
      data: id,
      message: AUTH_STRING.REGISTERED,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'authRegister' },
    });
  }
};

//////// ------- USER LOGIN -----------//////////
export const authLogin = async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    const user = await User.findOne({
      raw: true,
      nest: true, // to create role as an object
      where: {
        [Op.or]: [{ email: username }, { username: username }],
      },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'code'] }],
    });

    if (!user) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: AUTH_STRING.INVALID_CRED,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user?.password_hash);

    if (!isPasswordMatched) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: AUTH_STRING.INVALID_CRED,
      });
    }

    if (!user.is_active) {
      return sendErrorResponse({
        res,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: USERS_STRING.NOT_ACTIVATED,
      });
    }

    const payload = getPayload(user);

    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: remember ? config.REFRESH_TOKEN_TIME_EXTEND : config.REFRESH_TOKEN_TIME,
    });

    const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_TIME,
    });

    const isProd = config.NODE_ENV === config.ENVIRONMENT.PROD;
    const expiresInMs = remember
      ? 7 * 24 * 60 * 60 * 1000 // 7 days
      : 24 * 60 * 60 * 1000; // 1 day
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: expiresInMs,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      data: { user: payload, accessToken },
      message: AUTH_STRING.LOG_IN_SUCCESS,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'authLogin' },
    });
  }
};

//////// ------- USER LOGOUT -----------//////////

export const authLogout = async (req, res) => {
  try {
    const isProd = config.NODE_ENV === config.ENVIRONMENT.PROD;
    res.cookie('refreshToken', 'logout', {
      maxAge: 0,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
    });
    sendSuccessResponse({
      res,
      status: HTTP_STATUS.OK,
      message: AUTH_STRING.LOGOUT,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'authLogout' },
    });
  }
};

//////// ------- GET ACCESS TOKEN -----------//////////

export const getAccessToken = async (req, res) => {
  try {
    const user = req?.user;
    const payload = getPayload(user);
    const newAccessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
    sendSuccessResponse({ res, status: HTTP_STATUS.OK, data: newAccessToken });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'getAccessToken' },
    });
  }
};

//////// ------- GET ME -----------//////////
export const getMe = async (req, res) => {
  try {
    const user = sanitizeUser(req?.user);
    sendSuccessResponse({ res, status: HTTP_STATUS.OK, data: user });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'getMe' },
    });
  }
};

//////// ------- Forget Password -----------//////////
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ raw: true, where: { email: email } });

    if (!user || !user.is_active) {
      return sendSuccessResponse({
        res,
        status: HTTP_STATUS.OK,
        message: AUTH_STRING.FORGET_PASSWORD_SENT,
      });
    }

    sendSuccessResponse({ res, status: HTTP_STATUS.OK, message: AUTH_STRING.FORGET_PASSWORD_SENT });
  } catch (error) {
    sendErrorResponse({
      res,
      status: HTTP_STATUS.SERVER_ERROR,
      message: GLOBAL_STRING.WENT_WRONG,
      internalError: error,
      args: { service: 'forgetPassword' },
    });
  }
};
