import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemI } from "../types/sales";

interface CartState {
  items: CartItemI[];
  customer: { id: string | null; name: string; phone: string };
  paymentMode: "cash" | "upi" | "credit" | "online" | "card";
  discount: number;

  // Actions
  addItem: (item: CartItemI) => void;
  removeItem: (batchId: string) => void;
  updateQty: (batchId: string, quantity: number) => void;
  setCustomer: (customer: {
    id: string | null;
    name: string;
    phone: string;
  }) => void;
  setPaymentMode: (mode: "cash" | "upi" | "credit" | "online" | "card") => void;
  reset: () => void;

  // Helpers
  getTotals: () => { taxable: number; gst: number; total: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customer: { id: null, name: "", phone: "" },
      paymentMode: "cash",
      discount: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.id === newItem.id);

        if (existing) {
          const newQty = existing.cartQty + newItem.cartQty;
          // Optional: Add stock check here or rely on UI
          set({
            items: items.map((i) =>
              i.id === newItem.id ? { ...i, cartQty: newQty } : i,
            ),
          });
        } else {
          set({
            items: [...items, newItem],
          });
        }
      },

      removeItem: (batchId) => {
        set({ items: get().items.filter((i) => i.id !== batchId) });
      },

      updateQty: (batchId, quantity) => {
        const { items } = get();
        set({
          items: items.map((i) =>
            i.id === batchId ? { ...i, cartQty: quantity } : i,
          ),
        });
      },

      setCustomer: (customer) => set({ customer }),

      setPaymentMode: (mode) => set({ paymentMode: mode }),

      reset: () =>
        set({
          items: [],
          customer: { id: null, name: "", phone: "" },
          paymentMode: "cash",
          discount: 0,
        }),

      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce(
          (acc, item) => acc + item.cartPrice * item.cartQty,
          0,
        );
        // Placeholder tax logic: 0 for now as per previous decision
        const gst = 0;
        return {
          taxable: subtotal,
          gst,
          total: subtotal + gst,
        };
      },
    }),
    {
      name: "pos-cart-storage",
    },
  ),
);
