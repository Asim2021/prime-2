const ENDPOINT = {
  BASE: '/',
  ROOT_V1: '/api/v1',
  ID: '/:id',
  AUTH: {
    BASE: '/auth',
    REGISTER: '/register',
    LOGIN: '/LOGIN',
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
  ITEMS: '/items',
  ITEM_FIELDS: '/item-fields',
  ITEM_GROUPS: '/item-groups',
  ITEM_MAKE: '/item-make',
  ITEM_EXCISE: '/item-excise',
  ITEM_DISCOUNT: '/item-discount',
  ITEM_STORE_LOCATION: '/item-store',
  SETTINGS: '/settings',
  ROLES: '/roles',
};

export { ENDPOINT };
