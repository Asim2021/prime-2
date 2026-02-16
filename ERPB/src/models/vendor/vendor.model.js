import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
export class Vendor extends Model {
}
Vendor.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    gst_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
            isValidGST(value) {
                if (value !== null && value.length !== 15) {
                    throw new Error('GST number must be exactly 15 characters');
                }
            },
        },
    },
    contact_person: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    credit_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'vendors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=vendor.model.js.map