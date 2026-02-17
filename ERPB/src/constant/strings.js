const SEVERITY = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const TOKEN = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
};

const ROLE_CODES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  PHARMACIST: 'pharmacist',
};

const ROLE_NAMES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CASHIER: 'Cashier',
  PHARMACIST: 'Pharmacist',
};

const GLOBAL_STRING = {
  WENT_WRONG: 'Something went wrong',
};

const AUTH_STRING = {
  REGISTERED: '  Account registered successfully.',
  LOG_IN_SUCCESS: 'Login successful!',
  LOGOUT: 'User logged out!',
  INVALID_CRED: 'Invalid credentials.',
  INVALID_OTP: 'Invalid/Missing OTP!',
  EXPIRED_OTP: 'Invalid/Expired OTP!',
  FORGET_PASSWORD_SENT: 'If the account exists, a password reset email has been sent.',
  TWO_FA_REQUIRED: '2FA verification required',
  TWO_FA_SCAN_QR: 'Scan QR code with your authenticator app',
  TWO_FA_ALREADY_ENABLED: '2FA is already enabled',
  TWO_FA_SECRET_REQUIRED: 'Please generate 2FA secret first',
  TWO_FA_INVALID_CODE: 'Invalid 2FA code',
  TWO_FA_INVALID_VERIFY_CODE: 'Invalid verification code',
  TWO_FA_ENABLED: '2FA enabled successfully',
  TWO_FA_DISABLED: '2FA disabled successfully',
  TWO_FA_NOT_ENABLED: '2FA is not enabled',
  TWO_FA_NOT_ENABLED_FOR_USER: '2FA is not enabled for this user',
  TWO_FA_STATUS_FETCHED: '2FA status retrieved',
  TWO_FA_VERIFIED: '2FA verification successful',
};

const TOKEN_STRING = {
  NO_TOKEN: 'No token provided.',
  VERIFICATION_FAILED: 'Token verification failed.',
  USER_NOT_EXIST: 'User does not Exist',
  USER_DEACTIVATED: 'User is deactivated.',
  ROLE_UNAUTHORIZED: 'Current role is not allowed to access this resource.',
  SESSION_EXPIRED: 'Session expired or revoked.',
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  MISSING_AUTH_CONTEXT: 'Authorization context missing.',
};

const USERS_STRING = {
  USER_CREATED: 'User(s) created successfully',
  USER_DELETED: 'User(s) deleted successfully',
  PROFILE_UPLOADED: 'Profile uploaded successfully',
  EMAIL_EXISTS: 'User with email already exists!',
  PHONE_EXISTS: 'User with phone already exists!',
  PASSWORD_NOT_MATCHED: 'Password not matched',
  PROFILE_DELETED: 'Profile deleted successfully',
  NOT_FOUND: 'User(s) not found!',
  USER_FETCHED: 'User(s) successfully fetched.',
  USER_NOT_EXIST: 'User with email does not exist!',
  NOT_ACTIVATED: 'User Deactivated/Not Yet Activated.',
  USER_NOT_UPDATED: 'User not found or no changes made to the user.',
  USER_UPDATED: 'User updated successfully.',
  CANT_DELETE_OWN_ACCOUNT: 'You cannot delete your account!',
  CANT_INACTIVE_YOURSELF: 'You cannot make yourself Inactive!',
  UNABLE_TO_DELETE: 'Unable to delete the user(s)!',
};

const TABLES = {
  ROLES: 'roles',
  USERS: 'users',
};

const SESSION_STRING = {
  ACTIVE_SESSIONS_FETCHED: 'Active sessions retrieved',
  NOT_FOUND: 'Session not found',
  REVOKED: 'Session revoked successfully',
  REVOKED_ALL: 'All other sessions revoked',
};

export {
  AUTH_STRING,
  GLOBAL_STRING,
  SEVERITY,
  TOKEN,
  TOKEN_STRING,
  TABLES,
  USERS_STRING,
  SESSION_STRING,
  ROLE_CODES,
  ROLE_NAMES,
};
