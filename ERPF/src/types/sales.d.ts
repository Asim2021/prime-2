export interface SaleItemI {
  id: string;
  sale_id: string;
  batch_id: string;
  quantity: number;
  selling_price: string | number; // Decimal comes as string from API usually
  mrp_at_sale: string | number;
  // Computed/Joined fields if available from backend
  batch?: BatchI;
  medicine_name?: string;
}

export interface SaleI {
  id: string;
  bill_no: string;
  bill_date: string; // ISO Date
  customer_name: string;
  customer_phone?: string;
  customer_id?: string;
  total_amount: string | number;
  taxable_amount: string | number;
  cgst_amount: string | number;
  sgst_amount: string | number;
  igst_amount: string | number;
  payment_mode: "cash" | "credit" | "upi";
  is_credit: boolean;
  created_at: string;
  created_by: string;
  items?: SaleItemI[];
}

export interface CartItemI extends BatchI {
  cartId: string;
  cartQty: number;
  cartPrice: number;
  taxPercent: number;
  medicine_name?: string;
  brand_name?: string;
  generic_name?: string;
  available_quantity: number; // Ensure this is present
}

export interface SalesStatI {
  totalSales: number;
  totalOrders: number;
}
