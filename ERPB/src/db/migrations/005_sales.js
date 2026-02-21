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

		await queryInterface.addIndex('sales', [ 'bill_date' ], { transaction });
		await queryInterface.addIndex('sales', [ 'customer_id' ], { transaction });

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

		// 3. Sales Returns
		await queryInterface.createTable(
			'sales_returns',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				sale_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'sales', key: 'id' },
				},
				bill_no: { type: DataTypes.STRING(50), allowNull: false },
				return_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				reason: { type: DataTypes.STRING(255), allowNull: true },
				total_refund: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
				created_by: {
					type: DataTypes.CHAR(36),
					allowNull: true,
					references: { model: 'users', key: 'id' },
				},
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		await queryInterface.addIndex('sales_returns', [ 'sale_id' ], { transaction });
		await queryInterface.addIndex('sales_returns', [ 'bill_no' ], { transaction });

		// 4. Sales Return Items
		await queryInterface.createTable(
			'sales_return_items',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				sales_return_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'sales_returns', key: 'id' },
					onDelete: 'CASCADE',
				},
				sale_item_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'sale_items', key: 'id' },
				},
				batch_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'batches', key: 'id' },
				},
				quantity: { type: DataTypes.INTEGER, allowNull: false },
				refund_amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
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
		await queryInterface.dropTable('sales_return_items', { transaction });
		await queryInterface.dropTable('sales_returns', { transaction });
		await queryInterface.dropTable('sale_items', { transaction });
		await queryInterface.dropTable('sales', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
