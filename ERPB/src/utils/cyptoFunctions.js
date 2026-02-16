import { AES, enc } from 'crypto-js';
import lodash from 'lodash';

import config from '../lib/config.js';

const { mapValues } = lodash;

const secretKey = config.ENCRYPTION_SECRET;

// Encrypt text function
const encryptText = (text) => {
  return AES.encrypt(text, secretKey).toString();
};

// Decrypt text function
const decryptText = (encryptedText) => {
  const bytes = AES.decrypt(encryptedText, secretKey);
  return bytes.toString(enc.Utf8);
};

// Encrypt object function
const encryptObject = ({ payload }) => mapValues(payload, (value) => encrypt(value));

// Decrypt object function
const decryptObject = ({ payload }) => mapValues(payload, (value) => decrypt(value));

const decryptLoginRequest = (req,_res, next) => {
  const newBody = {
    email : decryptText(req.body.email),
    password : decryptText(req.body.password),
    remember : req.body.remember
  }
  req.body = newBody;
  next();
}

export { encryptText, decryptText, encryptObject, decryptObject, decryptLoginRequest };
