import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
import { createError } from '#middleware/error.middleware.js';

export class AuditLog extends Model {
}
AuditLog.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    table_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    record_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    old_value: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    new_value: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'audit_log',
    timestamps: false,
    hooks: {
        beforeUpdate: () => {
            throw createError('Audit logs are immutable and cannot be modified.', 403, 'AUDIT_LOG_IMMUTABLE');
        },
        beforeBulkUpdate: () => {
            throw createError('Audit logs are immutable and cannot be modified.', 403, 'AUDIT_LOG_IMMUTABLE');
        },
        beforeDestroy: () => {
            throw createError('Audit logs are immutable and cannot be deleted.', 403, 'AUDIT_LOG_IMMUTABLE');
        },
        beforeBulkDestroy: () => {
            throw createError('Audit logs are immutable and cannot be deleted.', 403, 'AUDIT_LOG_IMMUTABLE');
        },
    },
});
//# sourceMappingURL=auditLog.model.js.map