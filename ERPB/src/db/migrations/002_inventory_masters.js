import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		// 1. Shop Settings
		await queryInterface.createTable(
			'shop_settings',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				shop_name: { type: DataTypes.STRING(255), allowNull: false },
				logo_url: { type: DataTypes.STRING(255) },
				gst_number: { type: DataTypes.STRING(15), allowNull: false },
				drug_license_no: { type: DataTypes.STRING(100), allowNull: false },
				address_line_1: { type: DataTypes.STRING(255), allowNull: false },
				address_line_2: { type: DataTypes.STRING(255) },
				city: { type: DataTypes.STRING(100), allowNull: false },
				state: { type: DataTypes.STRING(100), allowNull: false },
				pincode: { type: DataTypes.STRING(10), allowNull: false },
				phone: { type: DataTypes.STRING(15), allowNull: false },
				email: { type: DataTypes.STRING(150) },
				invoice_prefix: { type: DataTypes.STRING(20), defaultValue: 'INV' },
				invoice_footer_text: { type: DataTypes.TEXT },
				paper_width_mm: { type: DataTypes.TINYINT, defaultValue: 80 },
				near_expiry_days: { type: DataTypes.SMALLINT, defaultValue: 90 },
				backup_encryption_key: { type: DataTypes.TEXT },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 2. Medicines
		await queryInterface.createTable(
			'medicines',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				brand_name: { type: DataTypes.STRING(200), allowNull: false },
				generic_name: { type: DataTypes.STRING(200), allowNull: false },
				composition: { type: DataTypes.TEXT },
				hsn_code: { type: DataTypes.STRING(8), allowNull: false },
				gst_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
				manufacturer: { type: DataTypes.STRING(200), allowNull: false },
				schedule_type: { type: DataTypes.ENUM('H', 'H1', 'X', 'OTC'), allowNull: false },
				reorder_level: { type: DataTypes.INTEGER, defaultValue: 10 },
				barcode: { type: DataTypes.STRING(100) },
				created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
				updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			},
			{ transaction },
		);

		// 3. Vendors
		await queryInterface.createTable(
			'vendors',
			{
				id: { type: DataTypes.CHAR(36), primaryKey: true },
				name: { type: DataTypes.STRING(200), allowNull: false },
				gst_number: { type: DataTypes.STRING(15) },
				contact_person: { type: DataTypes.STRING(200) },
				phone: { type: DataTypes.STRING(15), allowNull: false },
				address: { type: DataTypes.TEXT },
				credit_days: { type: DataTypes.INTEGER, defaultValue: 0 },
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
		await queryInterface.dropTable('vendors', { transaction });
		await queryInterface.dropTable('medicines', { transaction });
		await queryInterface.dropTable('shop_settings', { transaction });
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

