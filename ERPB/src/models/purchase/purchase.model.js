import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class Purchase extends Model {
}
Purchase.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    vendor_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    invoice_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
    },
    gst_amount: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
    },
    free_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    tableName: 'purchases',
    timestamps: false,
});
//# sourceMappingURL=purchase.model.js.map