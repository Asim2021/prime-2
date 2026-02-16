import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class User extends Model {
}
User.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    session_token: {
        type: DataTypes.STRING(255),
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=user.model.js.map