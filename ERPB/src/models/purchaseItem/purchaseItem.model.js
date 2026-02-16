import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
export class PurchaseItem extends Model {
}
PurchaseItem.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    purchase_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    batch_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    purchase_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'purchase_items',
    timestamps: false,
});
//# sourceMappingURL=purchaseItem.model.js.map