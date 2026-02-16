import dayJs from "@utils/daysJs";
import { UseFormReturnType } from "@mantine/form";

export const USER_COLUMNS = {
  USERNAME: "username",
  EMAIL: "email",
  DOB: "dob",
  PHONE: "phone",
  COUNTRY: "countryCode",
  ACTIVE: "active",
  ACTION: "action",
  ROLE_NAME: "roleName",
  ROLE_CODE: "roleCode",
};

export const DEFAULT_USER: UserI = {
  id: "",
  firstName: "",
  lastName: "",
  username: "", // Virtual field
  email: "",
  active: false,
  password: "",
  confirmPassword: "",
  dob: null,
  address: "",
  pincode: "",
  profile: null,
  countryCode: "",
  state: "",
  phone: null,
  updatedAt: null,
  createdAt: null,
};

export const USER_DRAWER = {
  USER_ACTION: "userAction",
  ADD: "add",
  EDIT: "edit",
  ADD_TITLE: "Add New User",
  EDIT_TITLE: "Edit User",
};

export const ADD_USER_INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  dob: "",
  countryCode: "",
  state: "",
  pincode: "",
  phone: null,
};

export const EDIT_USER_INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  dob: "",
  countryCode: "",
  state: "",
  phone: null,
  pincode: "",
  active: "",
};

export const isEditUser = (qp: URLSearchParams) =>
  qp.get(USER_DRAWER.USER_ACTION) === USER_DRAWER.EDIT;
export const isAddUser = (qp: URLSearchParams) =>
  qp.get(USER_DRAWER.USER_ACTION) === USER_DRAWER.ADD;
export const getIdFromQuery = (qp: URLSearchParams) => qp.get("id");

export const disableAddUserForm = (form: UseFormReturnType<UserI>) =>
  !form.values.firstName ||
  !form.values.lastName ||
  !form.values.email ||
  !form.values.password ||
  !form.values.confirmPassword;

export const disableEditUserForm = (form: UseFormReturnType<UserI>) =>
  !form.values.firstName ||
  !form.values.lastName ||
  !form.values.email ||
  !form.isDirty();

export const formatDate = (
  value: string | number | Date | null | undefined,
): Date | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const date = dayJs(value);
  if (date.isValid()) {
    return date.toDate();
  }

  throw new TypeError("Invalid date value");
};
