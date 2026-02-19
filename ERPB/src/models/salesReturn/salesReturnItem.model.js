import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';

export class SalesReturnItem extends Model { }

SalesReturnItem.init({
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  sales_return_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  sale_item_id: {
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
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: 'sales_return_items',
  timestamps: false,
});
