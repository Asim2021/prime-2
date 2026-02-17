import { create } from "zustand";

interface MedicineStoreI {
  detail: MedicineI | null;
  modalAction: "ADD" | "EDIT" | "VIEW" | null;
  setDetail: (data: MedicineI | null) => void;
  setModalAction: (action: "ADD" | "EDIT" | "VIEW" | null) => void;
}

const useMedicineStore = create<MedicineStoreI>((set) => ({
  detail: null,
  modalAction: null,
  setDetail: (data) => set({ detail: data }),
  setModalAction: (action) => set({ modalAction: action }),
}));

export default useMedicineStore;
