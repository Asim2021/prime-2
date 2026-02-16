import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import config from '../../lib/config.js';
import { loginUser, registerUser, refreshAccessToken, logoutUser, getUserProfile } from './auth.service.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);

        // Set refresh token in HttpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Login successful',
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);

        res.cookie('refreshToken', result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.CREATED,
            message: 'Registration successful',
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'Refresh token required',
            });
        }

        const tokens = await refreshAccessToken(refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Token refreshed',
            data: { accessToken: tokens.accessToken },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const logout = async (req, res) => {
    try {
        if (req.user) {
            await logoutUser(req.user.id);
        }
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            message: 'Logged out successfully',
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return sendErrorResponse({
                res,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'Not authenticated',
            });
        }
        const user = await getUserProfile(req.user.id);
        sendSuccessResponse({
            res,
            status: HTTP_STATUS.OK,
            data: { user },
        });
    } catch (error) {
        sendErrorResponse({ res, status: error.statusCode || HTTP_STATUS.SERVER_ERROR, message: error.message || error });
    }
};

