import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Op, Sequelize } from 'sequelize';
import { User, Role } from '#models/index.js';
import { createError } from '#middleware/error.middleware.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';

/**
 * Get all users with their roles.
 */
export const getAllUsers = async ({ page, limit, offset, sortBy, order, search, active }) => {
  return User.findAndCountAll({
    raw: true,
    include: [ { model: Role, as: 'role', attributes: [] } ],
    attributes: {
      exclude: [ 'password_hash', 'session_token' ],
      include: [
        [ Sequelize.col('role.name'), 'role_name' ],
        [ Sequelize.col('role.code'), 'role_code' ],
      ],
    },
    where: {
      ...(search && {
        username: { [ Op.like ]: `%${search.trim()}%` },
      }),
      ...(active && { is_active: active }),
    },
    limit,
    offset,
    order: [ [ sortBy, order ] ],
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
  const existing = await User.findOne({
    where: {
      [ Op.or ]: [ { email: data.email }, { username: data.username } ],
    },
  });
  if (existing) {
    throw createError('Username already exists', HTTP_STATUS.CONFLICT);
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
  if (data.password) {
    data.password_hash = await bcrypt.hash(data.password, 12);
    delete data.password;
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
