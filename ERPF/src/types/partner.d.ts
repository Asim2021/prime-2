interface VendorI {
  id: string;
  name: string;
  gst_number?: string;
  contact_person?: string;
  phone: string;
  address?: string;
  credit_days: number;
  created_at?: string;
  updated_at?: string;
}

interface CustomerI {
  id: string;
  name: string;
  phone: string;
  gstin?: string;
  credit_limit: number;
  outstanding_balance: number;
  created_at?: string;
  updated_at?: string;
}
