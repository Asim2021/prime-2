import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';

export class SalesReturn extends Model { }

SalesReturn.init({
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  sale_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  bill_no: { // Store bill no for easier search
    type: DataTypes.STRING,
    allowNull: false,
  },
  return_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total_refund: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.CHAR(36),
    allowNull: true, // System or User
  },
}, {
  sequelize,
  tableName: 'sales_returns',
  timestamps: true,
  updatedAt: false,
});
