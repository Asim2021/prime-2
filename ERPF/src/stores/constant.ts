import { PurchaseOrderI } from "@src/types";

export const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
  dob: "",
  address: "",
  phone: "",
  createdAt: "",
  updatedAt: "",
  profile: "",
};

export const INITIAL_AUTH_STORE = {
  accessToken: undefined,
  isLoggedIn: false,
  loading: true,
};

export const INITIAL_ITEM_GROUP = {
  id: "",
  groupName: "",
  storeName: "",
} as ItemGroupI;

export const INITIAL_ITEM_FIELDS = {
  id: "",
  itemGroupId: "",
  f1: "",
  f2: "",
  f3: "",
  f4: "",
  f5: "",
  f6: "",
  f7: "",
  f8: "",
  f9: "",
  f10: "",
  f11: "",
  f12: "",
  username: "",
  createdBy: "",
  creator: "",
  groupName: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemFieldI;

export const INITIAL_ITEM_MASTER = {
  id: "",
  itemFieldId: "",
  itemGroupId: "",
  itemCode: "",
  itemGroup: "",
  make: "",
  itemName: "",
  model: "",
  itemUnitType: "",
  f1: "",
  f2: "",
  f3: "",
  f4: "",
  f5: "",
  f6: "",
  f7: "",
  f8: "",
  f9: "",
  f10: "",
  f11: "",
  f12: "",
  listPrice: "",
  currencyType: "",
  exciseDuty: "",
  discountGroup: "",
  rackSeqNo: "",
  shelfNo: "",
  discountedPrice: "",
  catalogue: "",
  priceQuotation: "",
  itemNote: "",
  storeLocation: "",
  stockQty: "",
  itemDescription: "",
  createdBy: "",
  creator: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemI;

export const INITIAL_ITEM_MAKE = {
  id: "",
  make: "",
  createdBy: "",
  creator: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemMakeI;

export const INITIAL_ITEM_EXCISE = {
  id: "",
  excise: "",
  createdBy: "",
  creator: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemExciseI;

export const INITIAL_ITEM_DISCOUNT = {
  id: "",
  discount: "",
  createdBy: "",
  creator: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemDiscountI;

export const INITIAL_ITEM_STORE = {
  id: "",
  store: "",
  createdBy: "",
  creator: "",
  createdAt: undefined,
  updatedAt: undefined,
} as ItemStoreI;

export const INITIAL_PO = {
  id: "",
  poNumber: "",
  vendorId: "",
  orderDate: "",
  expectedDeliveryDate: null,
  status: "DRAFT",
  totalAmount: 0,
  remarks: null,
  createdBy: null,
  creator: null,
  createdAt: null,
  updatedAt: null,
  vendor: undefined,
  items: [],
} as PurchaseOrderI;

export const INITIAL_TASK = {
  id: "",
  projectId: "",
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assignedTo: "",
  dueDate: "",
  createdBy: "",
  createdAt: "",
  updatedAt: "",
} as ProjectTaskI;
