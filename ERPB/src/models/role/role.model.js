import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class Role extends Model {
}
Role.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
});
//# sourceMappingURL=role.model.js.map