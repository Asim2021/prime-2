import { HTTP_STATUS } from '#constant/httpStatus.js';
import { loginUser, registerUser, refreshAccessToken, logoutUser, getUserProfile } from './auth.service.js';
import config from '#lib/config.js';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: (config.NODE_ENV === 'production' ? 'strict' : 'lax'),
    path: '/',
};
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);
        // Set refresh token in HttpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);
        res.cookie('accessToken', result.accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Registration successful',
            data: { user: result.user },
        });
    }
    catch (error) {
        next(error);
    }
};
export const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Refresh token required',
            });
            return;
        }
        const tokens = await refreshAccessToken(refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Token refreshed',
            data: { accessToken: tokens.accessToken },
        });
    }
    catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        if (req.user) {
            await logoutUser(req.user.id);
        }
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
export const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }
        const user = await getUserProfile(req.user.id);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map

