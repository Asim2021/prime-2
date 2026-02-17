## 🗃️ MYSQL DATABASE SCHEMA

```sql
-- Enable strict mode for data integrity

-- ROLES
CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- USERS
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id CHAR(36) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at DATETIME,
  session_token VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- SHOP SETTINGS (SINGLE ROW TABLE)
CREATE TABLE shop_settings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  shop_name VARCHAR(200) NOT NULL,
  logo_url VARCHAR(500),
  gst_number VARCHAR(15) NOT NULL CHECK (gst_number REGEXP '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$'),
  drug_license_no VARCHAR(100) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL CHECK (pincode REGEXP '^[1-9][0-9]{5}$'),
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(150),
  invoice_prefix VARCHAR(20) DEFAULT 'INV',
  invoice_footer_text TEXT,
  paper_width_mm TINYINT DEFAULT 80 CHECK (paper_width_mm IN (58, 80)),
  near_expiry_days SMALLINT DEFAULT 90,
  backup_encryption_key TEXT, -- PBKDF2-encrypted
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CUSTOMERS (New table for credit management)
CREATE TABLE customers (
  id TEXT PRIMARY KEY,          -- UUID
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gstin TEXT,                   -- For B2B invoices
  credit_limit REAL DEFAULT 0,
  outstanding_balance REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MEDICINES
CREATE TABLE medicines (
  id TEXT PRIMARY KEY,          -- UUID
  brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  composition TEXT,
  hsn_code TEXT NOT NULL CHECK(length(hsn_code) >= 4 AND length(hsn_code) <= 8),
  gst_percent REAL NOT NULL CHECK(gst_percent IN (0, 5, 12, 18, 28)),
  manufacturer TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK(schedule_type IN ('H', 'H1', 'X', 'OTC')),
  reorder_level INTEGER DEFAULT 10,
  barcode TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- VENDORS
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,          -- UUID
  name TEXT NOT NULL,
  gst_number TEXT CHECK(length(gst_number) = 15 OR gst_number IS NULL),
  contact_person TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  credit_days INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BATCHES (Core inventory unit)
CREATE TABLE batches (
  id TEXT PRIMARY KEY,          -- UUID
  medicine_id TEXT NOT NULL REFERENCES medicines(id),
  batch_no TEXT NOT NULL,
  mfg_date DATE NOT NULL,
  exp_date DATE NOT NULL,
  purchase_rate REAL NOT NULL CHECK(purchase_rate > 0),
  mrp REAL NOT NULL CHECK(mrp > 0),          -- Legal selling ceiling
  quantity_available INTEGER NOT NULL DEFAULT 0 CHECK(quantity_available >= 0),
  rack_location TEXT DEFAULT 'UNASSIGNED',   -- Shelf management
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  is_active BOOLEAN DEFAULT TRUE,            -- Hide expired batches from sales UI
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(medicine_id, batch_no)              -- Prevent duplicate batches
);

-- PURCHASES
CREATE TABLE purchases (
  id TEXT PRIMARY KEY,          -- UUID
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  invoice_no TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  total_amount REAL NOT NULL,
  gst_amount REAL NOT NULL,
  free_quantity INTEGER DEFAULT 0,           -- "10+1 free" handling
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL REFERENCES users(id)
);

-- PURCHASE ITEMS
CREATE TABLE purchase_items (
  id TEXT PRIMARY KEY,          -- UUID
  purchase_id TEXT NOT NULL REFERENCES purchases(id),
  batch_id TEXT NOT NULL REFERENCES batches(id),
  purchase_quantity INTEGER NOT NULL CHECK(purchase_quantity > 0), -- Renamed for clarity
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SALES (GST-compliant invoices)
CREATE TABLE sales (
  id TEXT PRIMARY KEY,          -- UUID
  bill_no TEXT NOT NULL UNIQUE, -- Sequential number (e.g., INV-2024-001)
  bill_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  customer_name TEXT NOT NULL DEFAULT 'CASH CUSTOMER',
  customer_phone TEXT,
  customer_id TEXT REFERENCES customers(id), -- For credit customers
  total_amount REAL NOT NULL,
  taxable_amount REAL NOT NULL,
  cgst_amount REAL DEFAULT 0,
  sgst_amount REAL DEFAULT 0,
  igst_amount REAL DEFAULT 0,
  payment_mode TEXT NOT NULL CHECK(payment_mode IN ('cash', 'credit', 'upi')),
  is_credit BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL REFERENCES users(id)
);

-- SALE ITEMS
CREATE TABLE sale_items (
  id TEXT PRIMARY KEY,          -- UUID
  sale_id TEXT NOT NULL REFERENCES sales(id),
  batch_id TEXT NOT NULL REFERENCES batches(id),
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  selling_price REAL NOT NULL CHECK(selling_price > 0),
  mrp_at_sale REAL NOT NULL,    -- Snapshot for audit (MRP may change later)
  CHECK(selling_price <= mrp_at_sale) -- MRP enforcement at point of sale
);

-- STOCK ADJUSTMENTS
CREATE TABLE stock_adjustments (
  id TEXT PRIMARY KEY,          -- UUID
  batch_id TEXT NOT NULL REFERENCES batches(id),
  reason TEXT NOT NULL CHECK(reason IN ('damage', 'expired', 'theft', 'manual_correction', 'other')),
  quantity_change INTEGER NOT NULL CHECK(quantity_change != 0), -- + for addition, - for reduction
  note TEXT NOT NULL,           -- Mandatory explanation
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- STOCK LEDGER (Immutable audit trail)
CREATE TABLE stock_ledger (
  id TEXT PRIMARY KEY,          -- UUID
  batch_id TEXT NOT NULL REFERENCES batches(id),
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('purchase', 'sale', 'return', 'adjustment')),
  reference_id TEXT NOT NULL,   -- ID of purchase/sale/adjustment
  quantity_change INTEGER NOT NULL, -- + for inflow, - for outflow
  balance_after INTEGER NOT NULL CHECK(balance_after >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOG (Critical for compliance)
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,          -- UUID
  user_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,         -- 'price_change', 'stock_adjustment', 'medicine_create', etc.
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  old_value TEXT,               -- JSON snapshot
  new_value TEXT,               -- JSON snapshot
  ip_address TEXT,              -- localhost for single machine
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INVOICE SEQUENCE (For gap-free numbering)
CREATE TABLE invoice_sequence (
  financial_year TEXT PRIMARY KEY, -- e.g., '2024-25'
  last_number INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
