
export const USER_COLUMNS = {
  USERNAME: "username",
  EMAIL: "email",
  DOB: "dob",
  ACTIVE: "is_active",
  ROLE_NAME: "role_name",
  ROLE_CODE: "role_code",
  ACTION: 'action'
};

export const DEFAULT_USER: UserI = {
  id: "",
  username: "",
  email: "",
  is_active: false,
  password: "",
  updated_at: null,
  created_at: null,
};

export const ADD_USER_INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  address: "",
  dob: "",
  state: "",
  pincode: "",
  phone: null,
};

export const EDIT_USER_INITIAL_VALUES = {
  username: "",
  email: "",
  address: "",
  dob: "",
  state: "",
  phone: null,
  pincode: "",
  is_active: "",
};

