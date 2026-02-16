import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		// 1. Batches
		await queryInterface.createTable(
			'batches',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				medicine_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'medicines', key: 'id' },
				},
				vendor_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'vendors', key: 'id' },
				},
				batch_no: { type: DataTypes.STRING(100), allowNull: false },
				mfg_date: { type: DataTypes.DATEONLY, allowNull: false },
				exp_date: { type: DataTypes.DATEONLY, allowNull: false },
				purchase_rate: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
				mrp: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
				quantity_available: { type: DataTypes.INTEGER, defaultValue: 0 },
				rack_location: { type: DataTypes.STRING(50), defaultValue: 'UNASSIGNED' },
				is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		await queryInterface.addIndex('batches', ['medicine_id', 'batch_no'], {
			unique: true,
			name: 'unique_batch_medicine',
			transaction,
		});

		// 2. Purchases
		await queryInterface.createTable(
			'purchases',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				vendor_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'vendors', key: 'id' },
				},
				invoice_no: { type: DataTypes.STRING(100), allowNull: false },
				invoice_date: { type: DataTypes.DATEONLY, allowNull: false },
				total_amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
				gst_amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
				free_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
				created_by: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'users', key: 'id' },
				},
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 3. Purchase Items
		await queryInterface.createTable(
			'purchase_items',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				purchase_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'purchases', key: 'id' },
					onDelete: 'CASCADE',
				},
				batch_id: {
					type: DataTypes.CHAR(36),
					allowNull: false,
					references: { model: 'batches', key: 'id' },
				},
				purchase_quantity: { type: DataTypes.INTEGER, allowNull: false },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
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
		await queryInterface.dropTable('purchase_items', { transaction });
		await queryInterface.dropTable('purchases', { transaction });
		await queryInterface.dropTable('batches', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
