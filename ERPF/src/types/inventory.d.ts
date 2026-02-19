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
  medicine_id: string;
  batch_no: string;
  mfg_date: string;
  exp_date: string;
  purchase_rate: number;
  mrp: number;
  quantity_available: number;
  rack_location: string;
  is_active: boolean;
  vendor_id?: string;
  vendor_name?: string;
  item_name?: string; // Helper for UI
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility if any
  item_id?: string;
  batch_number?: string;
  expiry_date?: string;
  sale_price?: number;
  purchase_price?: number;
  current_stock?: number;
  vendor?: VendorI;
  medicine?: MedicineI;
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
  quantity_change: number; // New field
  quantity_adjustment?: number; // Legacy
  reason: "damage" | "expired" | "theft" | "manual_correction" | "other";
  note: string; // New field
  notes?: string; // Legacy
  created_by?: string;
  created_at?: string;
  medicine?: MedicineI;
  batch?: BatchI;
}
