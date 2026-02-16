import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class Medicine extends Model {
}
Medicine.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    brand_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    generic_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    composition: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    hsn_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
            len: [ 4, 8 ],
        },
    },
    gst_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            isIn: [ [ 0, 5, 12, 18, 28 ] ],
        },
    },
    manufacturer: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    schedule_type: {
        type: DataTypes.ENUM('H', 'H1', 'X', 'OTC'),
        allowNull: false,
    },
    reorder_level: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    },
    barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
    tableName: 'medicines',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: [ 'brand_name' ] },
        { fields: [ 'generic_name' ] }, // Good for search too
    ],
});
//# sourceMappingURL=medicine.model.js.map