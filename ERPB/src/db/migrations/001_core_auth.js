import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		// 1. Roles
		await queryInterface.createTable(
			'roles',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
				code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 2. Users
		await queryInterface.createTable(
			'users',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
				email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
				password_hash: { type: DataTypes.STRING(255), allowNull: false },
				role_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'roles', key: 'id' },
					onDelete: 'RESTRICT',
				},
				is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
				last_login_at: { type: DataTypes.DATE },
				session_token: { type: DataTypes.STRING(255) },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const down = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.dropTable('users', { transaction });
		await queryInterface.dropTable('roles', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
