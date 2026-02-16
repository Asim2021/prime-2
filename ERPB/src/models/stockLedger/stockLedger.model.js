import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class StockLedger extends Model {
}
StockLedger.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    batch_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.ENUM('purchase', 'sale', 'return', 'adjustment'),
        allowNull: false,
    },
    reference_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    quantity_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    balance_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'stock_ledger',
    timestamps: false,
});
//# sourceMappingURL=stockLedger.model.js.map