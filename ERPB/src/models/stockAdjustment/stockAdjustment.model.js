import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
export class StockAdjustment extends Model {
}
StockAdjustment.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    batch_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    reason: {
        type: DataTypes.ENUM('damage', 'expired', 'theft', 'manual_correction', 'other'),
        allowNull: false,
    },
    quantity_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notZero(value) {
                if (value === 0)
                    throw new Error('Quantity change cannot be zero');
            },
        },
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'stock_adjustments',
    timestamps: false,
});
//# sourceMappingURL=stockAdjustment.model.js.map