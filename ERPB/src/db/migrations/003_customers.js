import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.createTable(
			'customers',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				name: { type: DataTypes.STRING(200), allowNull: false },
				phone: { type: DataTypes.STRING(15), allowNull: false },
				gstin: { type: DataTypes.STRING(15) },
				credit_limit: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
				outstanding_balance: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
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
		await queryInterface.dropTable('customers', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
