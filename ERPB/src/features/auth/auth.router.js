import { Router } from 'express';
import { authLogin, authLogout, authRegister, forgetPassword, getAccessToken, getMe } from './auth.controller.js';
import { forgetPasswordSchema, loginSchema, registerUserSchema } from './auth.schema.js';
import { authLimiter } from '#lib/rateLimit.js';
import { JOI_TYPES, joiValidate } from '#utils/joiValidator.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { verifyRefreshToken } from '#middleware/verifyTokens.js';
import { decryptLoginRequest } from '#utils/cyptoFunctions.js';

const authRouter = Router();

//////  --- AUTHENTICATION-ROUTING  --- //////

authRouter.get(ENDPOINT.AUTH.LOGOUT, verifyRefreshToken, authLogout);
authRouter.get(ENDPOINT.AUTH.REFRESH_TOKEN, authLimiter, verifyRefreshToken, getAccessToken);
authRouter.get(ENDPOINT.AUTH.GET_ME, verifyRefreshToken, getMe);

authRouter.post(
  ENDPOINT.AUTH.REGISTER,
  joiValidate(registerUserSchema, JOI_TYPES.BODY),
  authRegister
);
authRouter.post(
  ENDPOINT.AUTH.LOGIN,
  decryptLoginRequest,
  joiValidate(loginSchema, JOI_TYPES.BODY),
  authLimiter,
  authLogin
);
authRouter.post(
  ENDPOINT.AUTH.FORGET_PASS,
  joiValidate(forgetPasswordSchema, JOI_TYPES.BODY),
  authLimiter,
  forgetPassword
);

export default authRouter;
