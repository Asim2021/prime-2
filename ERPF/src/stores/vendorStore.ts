import { create } from "zustand";

interface VendorStoreI {
  detail: VendorI | null;
  modalAction: "ADD" | "EDIT" | "VIEW" | null;
  setDetail: (data: VendorI | null) => void;
  setModalAction: (action: "ADD" | "EDIT" | "VIEW" | null) => void;
}

const useVendorStore = create<VendorStoreI>((set) => ({
  detail: null,
  modalAction: null,
  setDetail: (data) => set({ detail: data }),
  setModalAction: (action) => set({ modalAction: action }),
}));

export default useVendorStore;
