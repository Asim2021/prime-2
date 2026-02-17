import fs from 'node:fs';
import _ from 'lodash';

import { TOKEN } from '../constant/strings.js';
import { logger } from './logger.js';

const trimAndCapitalize = (inputString) => {
  if (!_.isString(inputString) || _.isEmpty(inputString)) return null;
  return _.upperFirst(_.trim(inputString))
};

/**
 * The function extracts the file name from a file path string in JavaScript.
 * @param string - The `string` parameter is a string that represents a file location.
 */
const fileNameFromLocationString = (string) => {
  if (!_.isString(string) || _.isEmpty(string)) return null;
  return _.last(string.split('\\'));
};

const sanitizeUser = (
  user,
  paramsExcludeArray = ['password', 'password_hash', 'session_token']
) => {
  if (!_.isObject(user)) {
    throw new Error('Provided user is not an object');
  }
  // Return a new object
  return _.omit(user, paramsExcludeArray);
};

const makeEmptyStringToNull = (object) => {
  if (!_.isObject(object)) {
    throw new Error('Provided input is not an object');
  }
  // Return a new object
  return _.mapValues({ ...object }, (value) => {
    return _.isEmpty(value) || value === 'null' ? null : value;
  });
};

/**
 * The function generates a random numeric one-time password (OTP) with a specified number of digits.
 * @param num - The `num` parameter in the `generateOTP` to num length
 * @returns randomly generated numeric string of length `num` (default to 5)
 */
const generateOTP = (num = 5) => {
  if (!_.isInteger(num) || num <= 0) {
    throw new Error('Invalid number length for OTP');
  }
  const min = 10 ** (num - 1);
  const max = 10 ** num - 1;
  return _.random(min, max).toString();
};

const saveFile = (filePath, fileBuffer, ErrorMessage = 'Failed to save file') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        logger.error(ErrorMessage, err);
        return reject(err);
      }
      resolve();
    });
  });
};

const deleteFile = (filePath, ErrorMessage = 'Failed to delete file') => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(ErrorMessage, err);
        return reject(err);
      }
      resolve();
    });
  });
};

/**
 * The `logoutUser` function logs out a user by setting a cookie with the value 'logout'.
 * @param res - The `res` parameter of express api.
 */
const logoutUser = ({ res }) => {
  res.cookie(TOKEN.REFRESH, 'logout', {
    expires: new Date(Date.now() + 10),
    httpOnly: true,
  });
};

const parseBoolean = (value) => {
  return _.includes([ 'true', '1', true ], value)
    ? true
    : _.includes([ 'false', '0', false ], value)
      ? false
      : undefined;
};

const getPaginationParams = ({
  page,
  limit,
  sortBy,
  order,
  defaultLimit = 10,
  maxLimit = 100,
  defaultSortBy = 'created_at',
  defaultOrder = 'DESC',
} = {}) => {
  const parsedPage = page ? Math.max(Number(page), 1) : 1;
  const parsedLimit = limit ? Math.min(Number(limit), maxLimit) : defaultLimit;
  const parsedSortBy = sortBy || defaultSortBy;
  const parsedOrder = order || defaultOrder;
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
    sortBy: parsedSortBy,
    order: parsedOrder,
  };
};

export {
  trimAndCapitalize,
  fileNameFromLocationString,
  sanitizeUser,
  makeEmptyStringToNull,
  generateOTP,
  saveFile,
  deleteFile,
  logoutUser,
  parseBoolean,
  getPaginationParams,
};
