const ENDPOINT = {
  BASE: '/',
  ROOT_V1: '/api/v1',
  ID: '/:id',
  AUTH: {
    BASE: '/auth',
    REGISTER: '/register',
    LOGIN: '/login',
    FORGET_PASS: '/forget-password',
    VALIDATE_OTP: '/validate-otp',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh',
    GET_ME: '/getme',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/profile/:id',
  },
  SETTINGS: '/settings',
  ROLES: '/roles',
};

export { ENDPOINT };
