interface MedicineI {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  composition?: string;
  hsn_code: string;
  gst_percent: number;
  schedule_type: "H" | "H1" | "X" | "OTC";
  reorder_level?: number;
  barcode?: string;
  unit_type?: string;
  created_at?: string;
  updated_at?: string;
}

interface PurchaseItemI {
  id: string;
  purchase_id: string;
  batch_id: string;
  medicine_id?: string; // Frontend helper
  purchase_quantity: number;
  // Expanded for UI display if needed, though usually nested in Batch
  batch?: BatchI;
}

interface PurchaseI {
  id: string;
  vendor_id: string;
  vendor_name?: string; // Helper
  invoice_no: string;
  invoice_date: string;
  total_amount: number;
  gst_amount: number;
  free_quantity?: number;
  created_by: string;
  created_at: string;
  items?: PurchaseItemI[];
}

interface BatchI {
  id: string;
  item_id: string;
  item_name?: string;
  batch_number: string;
  expiry_date: string;
  sale_price: number;
  purchase_price: number;
  mrp: number;
  current_stock: number;
  created_at?: string;
  updated_at?: string;
}

interface ManufacturerI {
  id: string;
  name: string;
}

interface CategoryI {
  id: string;
  name: string;
}

interface StockAdjustmentI {
  id: string;
  medicine_id: string;
  batch_id: string;
  old_quantity?: number;
  new_quantity?: number;
  quantity_adjustment: number; // + or -
  reason: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  medicine?: MedicineI;
  batch?: BatchI;
}
