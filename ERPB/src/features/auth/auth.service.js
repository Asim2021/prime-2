import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { createError } from '../../middleware/errorHandler.middleware.js';
import config from '#lib/config.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { Role, User } from '#models/index.js';

// ── Fail-fast: require secrets at startup ──
const JWT_SECRET = config.JWT_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables.');
}
const JWT_EXPIRES_IN = config.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN || '7d';
/**
 * Generate access and refresh JWT tokens for a user.
 */
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
};
/**
 * Authenticate user with username and password.
 */
export const loginUser = async (username, password) => {
    const user = await User.findOne({
        where: { username },
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'code'] }],
    });
    if (!user) {
        throw createError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }
    if (!user.is_active) {
        throw createError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw createError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }
    const tokens = generateTokens(user.id);
    // Update session token and last login
    await user.update({
        session_token: tokens.refreshToken,
        last_login_at: new Date(),
    });
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.getDataValue('role'),
        },
        ...tokens,
    };
};
/**
 * Register a new user.
 */
export const registerUser = async (data) => {
    // Check existing user
    const existingUser = await User.findOne({
        where: { username: data.username },
    });
    if (existingUser) {
        throw createError('Username already exists', HTTP_STATUS.CONFLICT);
    }
    const existingEmail = await User.findOne({
        where: { email: data.email },
    });
    if (existingEmail) {
        throw createError('Email already exists', HTTP_STATUS.CONFLICT);
    }
    // Default to 'pharmacist' role if none specified
    let roleId = data.role_id;
    if (!roleId) {
        const pharmacistRole = await Role.findOne({
            where: { code: 'pharmacist' },
        });
        if (!pharmacistRole) {
            throw createError('Default role not found. Please seed the database first.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        roleId = pharmacistRole.id;
    }
    const hashedPassword = await bcrypt.hash(data.password, config.SALT);
    const user = await User.create({
        id: randomUUID(),
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        role_id: roleId,
    });
    const tokens = generateTokens(user.id);
    await user.update({ session_token: tokens.refreshToken });
    const createdUser = await User.findByPk(user.id, {
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'code'] }],
        attributes: { exclude: ['password_hash', 'session_token'] },
    });
    return {
        user: createdUser,
        ...tokens,
    };
};
/**
 * Refresh access token using a valid refresh token.
 */
export const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user || user.session_token !== refreshToken) {
            throw createError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
        }
        if (!user.is_active) {
            throw createError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
        }
        const tokens = generateTokens(user.id);
        await user.update({ session_token: tokens.refreshToken });
        return tokens;
    }
    catch (err) {
        if (err instanceof Error && 'statusCode' in err)
            throw err;
        throw createError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }
};
/**
 * Logout user by clearing their session token.
 */
export const logoutUser = async (userId) => {
    await User.update({ session_token: null }, { where: { id: userId } });
};
/**
 * Get user profile by ID.
 */
export const getUserProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'code'] }],
        attributes: { exclude: ['password_hash', 'session_token'] },
    });
    if (!user) {
        throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
};
//# sourceMappingURL=auth.service.js.map

