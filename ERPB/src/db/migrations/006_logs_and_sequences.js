import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		// 1. Audit Log
		await queryInterface.createTable(
			'audit_log',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				user_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'users', key: 'id' },
				},
				action: { type: DataTypes.STRING(100), allowNull: false },
				table_name: { type: DataTypes.STRING(100), allowNull: false },
				record_id: { type: DataTypes.CHAR(36), allowNull: false },
				old_value: { type: DataTypes.TEXT('long') },
				new_value: { type: DataTypes.TEXT('long') },
				ip_address: { type: DataTypes.STRING(45) },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 2. Stock Ledger
		await queryInterface.createTable(
			'stock_ledger',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				batch_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'batches', key: 'id' },
				},
				transaction_type: {
					type: DataTypes.ENUM('purchase', 'sale', 'return', 'adjustment'),
					allowNull: false,
				},
				reference_id: { type: DataTypes.CHAR(36), allowNull: false },
				quantity_change: { type: DataTypes.INTEGER, allowNull: false },
				balance_after: { type: DataTypes.INTEGER, allowNull: false },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 3. Stock Adjustments
		await queryInterface.createTable(
			'stock_adjustments',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				batch_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'batches', key: 'id' },
				},
				reason: {
					type: DataTypes.ENUM('damage', 'expired', 'theft', 'manual_correction', 'other'),
					allowNull: false,
				},
				quantity_change: { type: DataTypes.INTEGER, allowNull: false },
				note: { type: DataTypes.TEXT, allowNull: false },
				created_by: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'users', key: 'id' },
				},
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 4. Invoice Sequence
		await queryInterface.createTable(
			'invoice_sequence',
			{
				financial_year: { type: DataTypes.STRING(10), primaryKey: true },
				last_number: { type: DataTypes.INTEGER, defaultValue: 0 },
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
		await queryInterface.dropTable('invoice_sequence', { transaction });
		await queryInterface.dropTable('stock_adjustments', { transaction });
		await queryInterface.dropTable('stock_ledger', { transaction });
		await queryInterface.dropTable('audit_log', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
