import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class SaleItem extends Model {
}
SaleItem.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    sale_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    batch_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
    },
    selling_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0.01 },
    },
    mrp_at_sale: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'sale_items',
    timestamps: false,
    validate: {
        mrpEnforcement() {
            const sellingPrice = this.selling_price;
            const mrpAtSale = this.mrp_at_sale;
            if (sellingPrice > mrpAtSale) {
                throw new Error('Selling price cannot exceed MRP');
            }
        },
    },
});
//# sourceMappingURL=saleItem.model.js.map