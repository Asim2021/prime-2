import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class ShopSettings extends Model {
    id;
    shop_name;
    logo_url;
    gst_number;
    drug_license_no;
    address_line_1;
    address_line_2;
    city;
    state;
    pincode;
    phone;
    email;
    invoice_prefix;
    invoice_footer_text;
    paper_width_mm;
    near_expiry_days;
    backup_encryption_key;
    created_at;
    updated_at;
}
ShopSettings.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shop_name: { type: DataTypes.STRING, allowNull: false },
    logo_url: { type: DataTypes.STRING, allowNull: true },
    gst_number: { type: DataTypes.STRING, allowNull: false },
    drug_license_no: { type: DataTypes.STRING, allowNull: false },
    address_line_1: { type: DataTypes.STRING, allowNull: false },
    address_line_2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    pincode: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    invoice_prefix: { type: DataTypes.STRING, defaultValue: 'INV' },
    invoice_footer_text: { type: DataTypes.TEXT, allowNull: true },
    paper_width_mm: { type: DataTypes.TINYINT, defaultValue: 80 },
    near_expiry_days: { type: DataTypes.SMALLINT, defaultValue: 90 },
    backup_encryption_key: { type: DataTypes.TEXT, allowNull: true },
}, {
    sequelize,
    tableName: 'shop_settings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=shopSettings.model.js.map