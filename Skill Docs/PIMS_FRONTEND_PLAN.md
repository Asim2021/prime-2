# PIMS Frontend Implementation Master Plan

**Status:** Draft
**Version:** 1.0
**Context:** Pharmaceutical Inventory Management System (PIMS) - Frontend

This document serves as the **single source of truth** for the frontend implementation of PIMS. It aligns strictly with the `@TECH_STACK.md` and `@FRONTEND_GUIDELINES.md` to ensure a production-grade, maintainable, and aesthetic application.

---

## 1. Architecture Overview

The PIMS frontend is built on a **Modular Architecture**, where features are encapsulated within their distinct domains. This ensures scalability and separation of concerns.

### 1.1 Technology Core

- **Framework:** React 19 + Vite (Speed & Modern Features)
- **Runtime:** TypeScript (Strict Type Safety)
- **Routing:** React Router v7 (Data Loading & Actions Strategy)
- **State Management:**
    - _Server:_ TanStack Query v5 (Caching, Auto-refetching, Optimistic Updates)
    - _Client:_ Zustand v5 (Modal states, Session, Global UI preferences)
- **UI System:** Mantine v8 + Tailwind CSS (Component primitives + Utility styling)
- **Forms:** Mantine Form + `react-imask` (Complex inputs, validation)
- **Data Grid:** TanStack Table v8 (Headless) + Mantine UI Wrapper

### 1.2 Directory Structure Strategy

We adhere to the `src/pages/[Module]` pattern for high cohesion.

```
src/
├── components/         # Global Atoms (Buttons, Inputs, specialized Table wrappers)
├── services/           # API Layer (Axios calls matched to Backend Routes)
├── stores/             # Zustand Stores (UI State)
├── hooks/              # Reusable Logic (usePagination, useDebounce)
├── types/              # types *.d.ts
├── pages/              # Domain Modules
│   ├── Dashboard/      # KPIs & Analytics
│   ├── Inventory/      # Medicines, Batches, Stock Adjustment
│   ├── Sales/          # POS Interface, Bill History
│   ├── Purchase/       # Inward Stock (GRN)
│   ├── Reports/        # Display business reports (Sales Report,Inventory Report,Expiry Report, etc., ... )
│   ├── Partners/       # Customers, Vendors
│   ├── Admin/          # Users, Roles, Shop Settings
│   └── Auth/           # Login, Forgot Password
└── routes/             # Router Configuration
```

---

## 2. Component Hierarchy

The application consists of the following core modules. A `MainLayout` wraps all authenticated pages (providing Sidebar, Header, GlobalNotifications).

### 2.1 Core Modules Tree

```text
App
├── AuthLayout
│   └── Login Page
├── MainLayout (Sidebar + Header)
│   ├── Dashboard Module
│   │   └── AnalyticsDashboard (KPIs, Charts, Alerts)
│   │
│   ├── Inventory Module
│   │   ├── MedicineList (MainTable: Items + Current Stock)
│   │   │   └── MedicineModal (Add/Edit Medicine)
│   │   ├── BatchRegistry (MainTable: All Batches, Expiry focus)
│   │   │   └── BatchModal (Manual Adjustments)
│   │   └── StockAdjustmentList (Audit Trail)
│   │
│   ├── Sales Module
│   │   ├── POS (Point of Sale Interface)
│   │   │   ├── ProductSearch (Autocomplete)
│   │   │   ├── CartGrid (Editable Quantity/Price)
│   │   │   └── CheckoutModal (Payment Mode, Invoice Print)
│   │   └── SalesHistory (MainTable: Invoices)
│   │       └── InvoiceViewer (Print/PDF View)
│   │
│   ├── Purchase Module
│   │   ├── PurchaseEntry (Form: Vendor + Batch Entry Grid)
│   │   └── PurchaseHistory (MainTable)
│   │
│   ├── Partners Module
│   │   ├── VendorList
│   │   │   └── VendorModal
│   │   └── CustomerList
│   │       └── CustomerModal
│   │
│   └── Admin Module
│       ├── UserManagement
│       └── ShopConfiguration (Settings Form)
```

---

## 3. Dashboard Design Strategy

**Goal:** Provide an "At-a-Glance" health check of the pharmacy with a minimalist, aesthetic design.

### 3.1 Layout "The Pilot's View"

- **Top Row (Key Metrics Cards):** 4 Cards with trend indicators (Green/Red arrows).
    - _Today's Sales:_ ₹ Value (vs Yesterday).
    - _Stock Value:_ Total Procurement Cost of Active Batches.
    - _Critical Low Stock:_ Count of items below `reorder_level`.
    - _Expiring Soon:_ Count of batches expiring in < 90 days.
- **Middle Row (Visual Analytics):**
    - _Sales Trend (Area Chart):_ Last 7/30 days revenue. Gradient fill for "modern" feel.
    - _Revenue by Category (Donut Chart):_ Ethical vs. Generic vs. OTC.
- **Bottom Row (Actionable Lists):**
    - _Expiration Alert Table:_ Top 5 batches expiring soon (Action: "mark as return").
    - _Recent Activity Stream:_ Simple timeline of Sales/Purchases.

### 3.2 Aesthetic Guidelines

- **Card Design:** White background, subtle shadow (`shadow-sm`), rounded borders (`rounded-lg`).
- **Typography:** Inter/Outfit font. Heavy use of muted text (`text-gray-500`) for labels, bold text for values.
- **Colors:** Use semantic colors from Mantine theme (e.g., Teal for profit, Red for expiry, Blue for active).

---

## 4. State Management & Data Flow

### 4.1 Server State (TanStack Query)

We rely on React Query for all data fetching.

- **Query Keys:** Centralized in `@constants/queryKeys.ts`.
    - `['inventory', 'medicines', { page: 1, filter: '...' }]`
    - `['sales', 'stats']`
- **Stale Time:**
    - _Reference Data (Roles, Settings):_ `Infinity` (Load once).
    - _Inventory Lists:_ 30 seconds (Balance freshness vs requests).
    - _Dashboard:_ 1 minute.

### 4.2 Client State (Zustand)

Used for UI interaction states that don't persist to DB immediately.

- **`useAuthStore`:** Session token, User info, Role.
- **`useCartStore`:** (Crucial for POS)
    - Holds array of `SaleItem` (BatchID, Qty, Price).
    - Computes Subtotal, Tax, and Grand Total in real-time.
    - Actions: `addToCart`, `removeFromCart`, `updateQty`, `clearCart`.
- **`useModalStore` (Generic):**
    - Pattern: `{ isOpen, mode: 'EDIT' | 'CREATE', activeItem: T, open: (item?) => void, close: () => void }`.
    - Specific stores: `useMedicineModalStore`, `useVendorModalStore`.

### 4.3 Form State

- **Mantine Form:** Used for `PurchaseEntry` and `MedicineModal`.
    - Why? Built-in validation validation (Joi/Zod integration pending, simple functions for now).
    - Handles dirty states, touching, and error messages elegantly.

---

## 5. Development Phases

### Phase 1: Foundation & Inventory Core

- **Goal:** Enable the shop owner to define what they sell and who they buy from.
- **Deliverables:**
    - [x] Layout & Auth (Done).
    - [ ] Admin: Shop Settings, User Management.
    - [ ] Partners: Vendor & Customer CRUD.
    - [ ] Inventory: Medicine Registry & Batch Management.
    - [ ] Backend Connectivity: Integrate `medicineService` and `vendorService`.

### Phase 2: Inward Stock (Purchases)

- **Goal:** Allow stock entry (increasing inventory).
- **Deliverables:**
    - [ ] Purchase Entry Form (Complex Master-Detail Form).
    - [ ] Purchase History Table.
    - [ ] Logic: Updating stock levels upon Purchase creation.

### Phase 3: Outward Stock (Point of Sale)

- **Goal:** Enable billing (decreasing inventory).
- **Deliverables:**
    - [ ] POS Interface (Fast, keyboard-friendly).
    - [ ] Cart State Management.
    - [ ] Invoice Generation (Printable view).
    - [ ] Sales History.

### Phase 4: Intelligence & Polish

- **Goal:** Insights and UX refinement.
- **Deliverables:**
    - [ ] Dashboard Analytics.
    - [ ] Stock Adjustment/Audit Log UI.
    - [ ] Global Search (Cmd+K style).
    - [ ] Final Responsive & Accessibility Audit.

---

## 6. Quality Assurance Checklist

Before every "Phase" completion, the following must be verified:

### 6.1 Functionality

- [ ] **Forms:** All required fields validated? Do invalid states show clear errors?
- [ ] **Feedback:** Does a Toast appear on Success/Error?
- [ ] **Empty States:** Do tables show "No records found" with a call-to-action?
- [ ] **Loading:** Are Skeletons/Loaders visible during data fetch?

### 6.2 UX & Design

- [ ] **Responsiveness:** Does the Sidebar collapse on mobile? Are tables scrollable?
- [ ] **Theme:** Is the Color Palette consistent (Primary Blue/Teal)?
- [ ] **Typography:** Is heirarchy clear (H1 vs H2 vs Body)?

### 6.3 Code Quality

- [ ] **Type Safety:** No `any` types in new code. Interfaces defined in `@types/`.
- [ ] **Cleanup:** No `console.log` in production flow.
- [ ] **Rules:** Service functions used? No direct Axios calls in components?

---

---

## 7. Backend Integration Map

This section maps Frontend Modules to their corresponding Backend Features, Endpoints, and Data Schemas. Refer to this when implementing Services.

### 7.1 Key Entities

| FE Module     | BE Feature     | Base Endpoint | Key Schema Models                   |
| :------------ | :------------- | :------------ | :---------------------------------- |
| **Auth**      | `auth`         | `/auth`       | N/A (JWT based)                     |
| **Users**     | `user`         | `/users`      | `User`                              |
| **Partners**  | `vendor`       | `/vendors`    | `Vendor`                            |
| **Partners**  | `customer`     | `/customers`  | `Customer`                          |
| **Inventory** | `medicine`     | `/medicines`  | `Medicine`                          |
| **Inventory** | `purchase`     | `/purchases`  | `Purchase`, `PurchaseItem`, `Batch` |
| **Sales**     | `sales`        | `/sales`      | `Sale`, `SaleItem`                  |
| **Settings**  | `shopSettings` | `/settings`   | `ShopSettings`                      |
| **Reports**   | `reports`      | `/reports`    | N/A (Aggregated Data)               |

### 7.2 Detailed API Mapping

#### 7.2.1 Auth & Users

- **Login:** `POST /auth/login` (Body: `{ email, password }` -> Returns `{ accessToken, user }`)
- **Me:** `GET /auth/getme` (Validates session)
- **User CRUD:**
    - List: `GET /users` (Query: `page`, `limit`, `search`)
    - Create: `POST /users` (Body: `{ username, email, role_id, ... }`)
    - Update: `PATCH /users/:id`

#### 7.2.2 Partners (Vendors & Customers)

- **Vendors:**
    - Schema: `name`, `gst_number`, `phone`, `address`, `contact_person`, `credit_days`
    - Endpoints: `GET /vendors`, `POST /vendors`, `PUT /vendors/:id`
- **Customers:**
    - Schema: `name`, `phone`, `gstin`, `credit_limit`, `outstanding_balance`
    - Endpoints: `GET /customers`, `POST /customers`, `PUT /customers/:id`

#### 7.2.3 Inventory (Medicines & Batches)

- **Medicines:**
    - Base: `/medicines` (NOT `/items`)
    - Schema: `brand_name`, `generic_name`, `manufacturer`, `hsn_code`, `gst_percent`, `schedule_type`, `reorder_level`
    - **Note:** Backend model uses `brand_name` (not `item_name`). `unit_type` is currently handled on Frontend or missing in BE model (Verify).
    - **Batches:** Fetched via `GET /medicines/:id/batches`.
    - **Batch Creation:** Batches are typically created via **Purchases** (New Stock), not manually.
        - _Manual Batch Entry:_ If required, check if `POST /batches` exists or use `StockAdjustment`.

#### 7.2.4 Purchases (Inward Stock)

- **Create Purchase:** `POST /purchases`
    - Body:
        ```json
        {
        	"vendor_id": "uuid",
        	"invoice_no": "INV-123",
        	"invoice_date": "2023-10-27",
        	"items": [
        		{ "medicine_id": "uuid", "batch_number": "B123", "expiry_date": "...", "quantity": 100, "price": 50 }
        	]
        }
        ```
    - **Logic:** This transaction creates `Purchase`, `PurchaseItems`, and new `Batch` records (or updates existing).

#### 7.2.5 Sales (POS)

- **Create Sale:** `POST /sales`
    - Body:
        ```json
        {
          "customer_id": "uuid", // Optional for cash sales
          "payment_mode": "cash" | "upi",
          "items": [
             { "batch_id": "uuid", "quantity": 2 }
          ]
        }
        ```
    - **Logic:** Deducts stock from `Batch`.

#### 7.2.6 Reports & Dashboard

- `GET /reports/dashboard`: KPIs (Sales, Stock Value, Expiry).
- `GET /reports/sales`: Date-wise sales.
- `GET /reports/inventory`: Stock levels.

**End of Plan**
