import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

import { User } from '../../models/user/user.model.js';
import { Role } from '../../models/role/role.model.js';
import { createError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS } from '../../constant/httpStatus.js';

/**
 * Get all users with their roles.
 */
export const getAllUsers = async () => {
    return User.findAll({
        include: [ { model: Role, as: 'role', attributes: [ 'id', 'name', 'code' ] } ],
        attributes: { exclude: [ 'password_hash', 'session_token' ] },
        order: [ [ 'created_at', 'DESC' ] ],
    });
};

/**
 * Get a single user by ID.
 */
export const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        include: [ { model: Role, as: 'role', attributes: [ 'id', 'name', 'code' ] } ],
        attributes: { exclude: [ 'password_hash', 'session_token' ] },
    });
    if (!user) {
        throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
};

/**
 * Create a new user (admin-only action).
 */
export const createUser = async (data) => {
    const existing = await User.findOne({ where: { username: data.username } });
    if (existing) {
        throw createError('Username already exists', HTTP_STATUS.CONFLICT);
    }
    const existingEmail = await User.findOne({ where: { email: data.email } });
    if (existingEmail) {
        throw createError('Email already exists', HTTP_STATUS.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({
        id: randomUUID(),
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        role_id: data.role_id,
    });
    return getUserById(user.id);
};

/**
 * Update a user's details.
 */
export const updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    if (data.username && data.username !== user.username) {
        const existing = await User.findOne({ where: { username: data.username } });
        if (existing) {
            throw createError('Username already exists', HTTP_STATUS.CONFLICT);
        }
    }
    if (data.email && data.email !== user.email) {
        const existingEmail = await User.findOne({ where: { email: data.email } });
        if (existingEmail) {
            throw createError('Email already exists', HTTP_STATUS.CONFLICT);
        }
    }
    await user.update(data);
    return getUserById(id);
};

/**
 * Soft delete (deactivate) a user.
 */
export const deactivateUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw createError('User not found', HTTP_STATUS.NOT_FOUND);
    }
    await user.update({ is_active: false, session_token: null });
    return { message: 'User deactivated successfully' };
};

