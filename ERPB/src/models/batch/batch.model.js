import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class Batch extends Model {
}
Batch.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    medicine_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    batch_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mfg_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    exp_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    purchase_rate: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0.01 },
    },
    mrp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0.01 },
    },
    quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    rack_location: {
        type: DataTypes.STRING(50),
        defaultValue: 'UNASSIGNED',
    },
    vendor_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'batches',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: [ 'medicine_id', 'batch_no' ],
        },
        {
            fields: [ 'exp_date' ],
        },
        {
            fields: [ 'batch_no' ],
        },
    ],
});
//# sourceMappingURL=batch.model.js.map