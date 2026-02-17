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
