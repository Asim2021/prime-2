import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class Customer extends Model {
    id;
    name;
    phone;
    gstin;
    credit_limit;
    outstanding_balance;
    created_at;
    updated_at;
}
Customer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gstin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    credit_limit: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    outstanding_balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=customer.model.js.map