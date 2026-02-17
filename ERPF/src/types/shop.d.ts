interface ShopSettingsI {
  id: string;
  shop_name: string;
  logo_url?: string;
  gst_number: string;
  drug_license_no: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  invoice_prefix: string;
  invoice_footer_text?: string;
  paper_width_mm: 58 | 80;
  near_expiry_days: number;
}
