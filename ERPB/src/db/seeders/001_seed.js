import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs';
import { logger } from '#utils/logger.js';
import db from '#models/index.js';

const seed = async () => {
	try {
		// Ensure DB connection
		await db.sequelize.authenticate();
		logger.info('Database connected for seeding');

		// Sync all tables (use force:false to avoid dropping existing data)
		await db.sequelize.sync({ alter: true });
		logger.info('Database tables synced');

		// ── Seed Roles ──
		const roles = [
			{ id: randomUUID(), name: 'Administrator', code: 'admin' },
			{ id: randomUUID(), name: 'Pharmacist', code: 'pharmacist' },
			{ id: randomUUID(), name: 'Cashier', code: 'cashier' },
		];

		for (const role of roles) {
			const existing = await db.Role.findOne({ where: { code: role.code } });
			if (!existing) {
				await db.Role.create(role);
				logger.info(`Created role: ${role.name}`);
			} else {
				logger.info(`Role already exists: ${role.name}`);
			}
		}

		// ── Seed Admin User ──
		const adminRole = await db.Role.findOne({ where: { code: 'admin' } });
		if (!adminRole) {
			throw new Error('Admin role not found after seeding');
		}

		const existingAdmin = await db.User.findOne({
			where: { username: 'admin' },
		});
		if (!existingAdmin) {
			const hashedPassword = await bcrypt.hash('admin123', 12);
			await db.User.create({
				id: randomUUID(),
				username: 'admin',
				email: 'admin@pims-erp.local',
				password_hash: hashedPassword,
				role_id: adminRole.id,
				is_active: true,
			});
			logger.info('Created default admin user (admin / admin123)');
		} else {
			logger.info('Admin user already exists');
		}

		// ── Seed Default Shop Settings ──
		const existingSettings = await db.ShopSettings.findOne();
		if (!existingSettings) {
			await db.ShopSettings.create({
				id: randomUUID(),
				shop_name: 'My Pharmacy',
				gst_number: '22AAAAA0000A1Z5',
				drug_license_no: 'DL-0000-000000',
				address_line_1: '123 Main Street',
				city: 'Mumbai',
				state: 'Maharashtra',
				pincode: '400001',
				phone: '9876543210',
				email: 'pharmacy@example.com',
				invoice_prefix: 'INV',
				paper_width_mm: 80,
				near_expiry_days: 90,
			});
			logger.info('Created default shop settings (update from Settings page)');
		} else {
			logger.info('Shop settings already exist');
		}

		logger.info('✅ Seeding completed successfully');
		process.exit(0);
	} catch (error) {
		logger.error('Seeding failed:', error);
		process.exit(1);
	}
};

seed();

