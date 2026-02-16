import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
export class InvoiceSequence extends Model {
}
InvoiceSequence.init({
    financial_year: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    last_number: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'invoice_sequence',
    timestamps: false,
});
//# sourceMappingURL=invoiceSequence.model.js.map