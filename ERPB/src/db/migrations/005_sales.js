import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		// 1. Sales
		await queryInterface.createTable(
			'sales',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				bill_no: { type: DataTypes.STRING(50), allowNull: false, unique: true },
				bill_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
				customer_name: { type: DataTypes.STRING(200), allowNull: false, defaultValue: 'CASH CUSTOMER' },
				customer_phone: { type: DataTypes.STRING(15) },
				customer_id: {
					type: DataTypes.CHAR(36),
					references: { model: 'customers', key: 'id' },
				},
				total_amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
				taxable_amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
				cgst_amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
				sgst_amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
				igst_amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
				payment_mode: { type: DataTypes.ENUM('cash', 'credit', 'upi'), allowNull: false },
				is_credit: { type: DataTypes.BOOLEAN, defaultValue: false },
				invoice_hash: { type: DataTypes.STRING(64) },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				created_by: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'users', key: 'id' },
				},
			},
			{ transaction },
		);

		await queryInterface.addIndex('sales', ['bill_date'], { transaction });
		await queryInterface.addIndex('sales', ['customer_id'], { transaction });

		// 2. Sale Items
		await queryInterface.createTable(
			'sale_items',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				sale_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'sales', key: 'id' },
					onDelete: 'CASCADE',
				},
				batch_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'batches', key: 'id' },
				},
				quantity: { type: DataTypes.INTEGER, allowNull: false },
				selling_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
				mrp_at_sale: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
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
		await queryInterface.dropTable('sale_items', { transaction });
		await queryInterface.dropTable('sales', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
