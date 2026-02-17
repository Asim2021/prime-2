import { create } from "zustand";

interface CustomerStoreI {
  detail: CustomerI | null;
  modalAction: "ADD" | "EDIT" | "VIEW" | null;
  setDetail: (data: CustomerI | null) => void;
  setModalAction: (action: "ADD" | "EDIT" | "VIEW" | null) => void;
}

const useCustomerStore = create<CustomerStoreI>((set) => ({
  detail: null,
  modalAction: null,
  setDetail: (data) => set({ detail: data }),
  setModalAction: (action) => set({ modalAction: action }),
}));

export default useCustomerStore;
