import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
export class Sale extends Model {
}
Sale.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    bill_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    bill_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    customer_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: 'CASH CUSTOMER',
    },
    customer_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    customer_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
    },
    total_amount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
    },
    taxable_amount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
    },
    cgst_amount: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0,
    },
    sgst_amount: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0,
    },
    igst_amount: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0,
    },
    payment_mode: {
        type: DataTypes.ENUM('cash', 'credit', 'upi'),
        allowNull: false,
    },
    is_credit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    invoice_hash: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'sales',
    timestamps: false,
    indexes: [{ fields: ['bill_date'] }, { fields: ['customer_id'] }],
});
//# sourceMappingURL=sale.model.js.map