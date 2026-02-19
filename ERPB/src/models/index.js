import sequelize from '#lib/sqlConfig.js';
// ── Import all models ──
import { Role } from './role/role.model.js';
import { User } from './user/user.model.js';
import { ShopSettings } from './shopSettings/shopSettings.model.js';
import { Customer } from './customer/customer.model.js';
import { Medicine } from './medicine/medicine.model.js';
import { Vendor } from './vendor/vendor.model.js';
import { Batch } from './batch/batch.model.js';
import { Purchase } from './purchase/purchase.model.js';
import { PurchaseItem } from './purchaseItem/purchaseItem.model.js';
import { Sale } from './sale/sale.model.js';
import { SaleItem } from './saleItem/saleItem.model.js';
import { StockAdjustment } from './stockAdjustment/stockAdjustment.model.js';
import { StockLedger } from './stockLedger/stockLedger.model.js';
import { AuditLog } from './auditLog/auditLog.model.js';
import { InvoiceSequence } from './invoiceSequence/invoiceSequence.model.js';
import { SalesReturn } from './salesReturn/salesReturn.model.js';
import { SalesReturnItem } from './salesReturn/salesReturnItem.model.js';
// ══════════════════════════════════════════════
// ASSOCIATIONS
// ══════════════════════════════════════════════
// ── Role ↔ User ──
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
// ── Medicine ↔ Batch ──
Medicine.hasMany(Batch, { foreignKey: 'medicine_id', as: 'batches' });
Batch.belongsTo(Medicine, { foreignKey: 'medicine_id', as: 'medicine' });
// ── Vendor ↔ Batch ──
Vendor.hasMany(Batch, { foreignKey: 'vendor_id', as: 'batches' });
Batch.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
// ── Vendor ↔ Purchase ──
Vendor.hasMany(Purchase, { foreignKey: 'vendor_id', as: 'purchases' });
Purchase.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
// ── User ↔ Purchase (created_by) ──
User.hasMany(Purchase, { foreignKey: 'created_by', as: 'purchases' });
Purchase.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
// ── Purchase ↔ PurchaseItem ──
Purchase.hasMany(PurchaseItem, { foreignKey: 'purchase_id', as: 'items' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchase_id', as: 'purchase' });
// ── Batch ↔ PurchaseItem ──
Batch.hasMany(PurchaseItem, { foreignKey: 'batch_id', as: 'purchaseItems' });
PurchaseItem.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
// ── Customer ↔ Sale ──
Customer.hasMany(Sale, { foreignKey: 'customer_id', as: 'sales' });
Sale.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
// ── User ↔ Sale (created_by) ──
User.hasMany(Sale, { foreignKey: 'created_by', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
// ── Sale ↔ SaleItem ──
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });
// ── Batch ↔ SaleItem ──
Batch.hasMany(SaleItem, { foreignKey: 'batch_id', as: 'saleItems' });
SaleItem.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
// ── Batch ↔ StockAdjustment ──
Batch.hasMany(StockAdjustment, { foreignKey: 'batch_id', as: 'adjustments' });
StockAdjustment.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
// ── User ↔ StockAdjustment (created_by) ──
User.hasMany(StockAdjustment, { foreignKey: 'created_by', as: 'adjustments' });
StockAdjustment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
// ── Batch ↔ StockLedger ──
Batch.hasMany(StockLedger, { foreignKey: 'batch_id', as: 'ledgerEntries' });
StockLedger.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
// ── User ↔ AuditLog ──
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ── Sales Return Associations ──
Sale.hasMany(SalesReturn, { foreignKey: 'sale_id', as: 'returns' });
SalesReturn.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

SalesReturn.hasMany(SalesReturnItem, { foreignKey: 'sales_return_id', as: 'items' });
SalesReturnItem.belongsTo(SalesReturn, { foreignKey: 'sales_return_id', as: 'salesReturn' });

SalesReturnItem.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
Batch.hasMany(SalesReturnItem, { foreignKey: 'batch_id', as: 'returnedItems' });

// ══════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════
const db = {
    sequelize,
    Role,
    User,
    ShopSettings,
    Customer,
    Medicine,
    Vendor,
    Batch,
    Purchase,
    PurchaseItem,
    Sale,
    SaleItem,
    StockAdjustment,
    StockLedger,
    AuditLog,
    InvoiceSequence,
    SalesReturn,
    SalesReturnItem,
};
export default db;
export { Role, User, ShopSettings, Customer, Medicine, Vendor, Batch, Purchase, PurchaseItem, Sale, SaleItem, StockAdjustment, StockLedger, AuditLog, InvoiceSequence, SalesReturn, SalesReturnItem };
//# sourceMappingURL=index.js.map