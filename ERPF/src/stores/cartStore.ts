import { create } from "zustand";
import { CartItemI } from "@src/types/sales"; // We need to fix imports in sales.d.ts or use global types
// Actually, types are usually global if in src/types/index.d.ts or we import them.
// Let's assume we import from the file we just created.
import { notifications } from "@mantine/notifications";

interface CartState {
  items: CartItemI[];
  customer: {
    id?: string;
    name: string;
    phone: string;
  };
  paymentMode: "cash" | "upi" | "credit";

  // Actions
  addItem: (batch: any, medicine: any) => void; // Using any for now to avoid circular dependency hell, ideally strict typed
  removeItem: (batchId: string) => void;
  updateQty: (batchId: string, qty: number) => void;
  updatePrice: (batchId: string, price: number) => void;
  setCustomer: (customer: { id?: string; name: string; phone: string }) => void;
  setPaymentMode: (mode: "cash" | "upi" | "credit") => void;
  reset: () => void;

  // Getters (computed via function or selector)
  getTotals: () => {
    total: number;
    taxable: number;
    gst: number;
    count: number;
  };
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: { name: "CASH CUSTOMER", phone: "" },
  paymentMode: "cash",

  addItem: (batch, medicine) => {
    const { items } = get();
    const existing = items.find((i) => i.id === batch.id);

    // Validation: Check Stock
    // if batch.available_quantity <= 0 ... (handled in UI mostly, but good here too)

    if (existing) {
      // Increment
      if (existing.cartQty + 1 > batch.available_quantity) {
        notifications.show({
          title: "Stock Limit",
          message: "Cannot add more than available stock",
          color: "red",
        });
        return;
      }
      set({
        items: items.map((i) =>
          i.id === batch.id ? { ...i, cartQty: i.cartQty + 1 } : i,
        ),
      });
    } else {
      // Add new
      const newItem: CartItemI = {
        ...batch,
        cartId: batch.id,
        cartQty: 1,
        cartPrice: batch.ptr || batch.mrp, // Default to PTR or MRP? existing logic says Selling Price. Let's use MRP for now or predefined selling price if exists.
        // Actually, better to default to MRP but allow edit.
        // Let's assume batch has 'purchase_rate' and 'mrp'. We should probably default to MRP or calculate based on margin.
        // For now, default to MRP.
        // Also need tax info from medicine.
        taxPercent: medicine.gst_percent || 0,
        medicine_name: medicine.brand_name, // Helper for UI
        generic_name: medicine.generic_name,
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (batchId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== batchId),
    }));
  },

  updateQty: (batchId, qty) => {
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id === batchId) {
          // Validate stock
          if (qty > i.available_quantity) {
            notifications.show({
              title: "Stock Limit",
              message: `Max stock is ${i.available_quantity}`,
              color: "red",
            });
            return { ...i, cartQty: i.available_quantity };
          }
          if (qty < 1) return i;
          return { ...i, cartQty: qty };
        }
        return i;
      }),
    }));
  },

  updatePrice: (batchId, price) => {
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id === batchId) {
          if (price > i.mrp) {
            notifications.show({
              title: "Price Error",
              message: "Selling Price cannot exceed MRP",
              color: "red",
            });
            return i;
          }
          return { ...i, cartPrice: price };
        }
        return i;
      }),
    }));
  },

  setCustomer: (customer) => set({ customer }),

  setPaymentMode: (mode) => set({ paymentMode: mode }),

  reset: () =>
    set({
      items: [],
      customer: { name: "CASH CUSTOMER", phone: "" },
      paymentMode: "cash",
    }),

  getTotals: () => {
    const { items } = get();
    // Logic:
    // Total = Sum(Price * Qty)
    // Taxable = Total / (1 + Tax/100) (Inclusive tax logic usually for Retail)
    // Or Exclusive?
    // Retail Pharma usually MRP is inclusive of all taxes.
    // So Taxable = MRP / (1 + GST%)

    let total = 0;
    let taxable = 0;
    let gst = 0;

    items.forEach((item) => {
      const itemTotal = item.cartPrice * item.cartQty;
      total += itemTotal;

      // Back calculate tax
      // Rate = 12% -> Total = 112, Taxable = 100, Tax = 12
      // Taxable = total / (1 + rate/100)
      const itemTaxable = itemTotal / (1 + (item.taxPercent || 0) / 100);
      taxable += itemTaxable;
      gst += itemTotal - itemTaxable;
    });

    return {
      total: parseFloat(total.toFixed(2)),
      taxable: parseFloat(taxable.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      count: items.length,
    };
  },
}));

export default useCartStore;
