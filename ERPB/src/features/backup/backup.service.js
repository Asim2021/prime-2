import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import util from 'util';
import { logger } from '../../utils/logger.js';
import dayjs from 'dayjs';
import sequelize from '#lib/sqlConfig.js';
import config from '#lib/config.js';
const execPromise = util.promisify(exec);
export const backupService = {
    performBackup: async () => {
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
        const baseName = `backup_${timestamp}`;
        const sqlFilePath = path.join(backupDir, `${baseName}.sql`);
        const jsonFilePath = path.join(backupDir, `${baseName}.json`);
        const zipName = `${baseName}.enc`;
        const zipPath = path.join(backupDir, zipName);
        let sourceFilePath = sqlFilePath;
        let backupType = 'sql';
        try {
            // Database Config
            const dbUser = config.DB_USER || 'root';
            const dbPass = config.DB_PASS || '';
            const dbName = config.DB_NAME || 'pims_erp';
            const dbHost = config.DB_HOST || 'localhost';
            // 1. Try SQL Dump
            const dumpCommand = `mysqldump -h ${dbHost} -u ${dbUser} ${dbPass ? `-p${dbPass}` : ''} ${dbName} > "${sqlFilePath}"`;
            logger.info(`Starting database backup (SQL): ${dbName}`);
            try {
                await execPromise(dumpCommand);
                logger.info('✅ SQL Dump successful');
            }
            catch (sqlError) {
                logger.warn('⚠️ mysqldump failed, falling back to JSON dump via Sequelize...', sqlError.message);
                // Fallback: JSON Dump
                backupType = 'json';
                sourceFilePath = jsonFilePath;
                const dumpData = {};
                // Ensure models are loaded. In a running app, they are.
                // We iterate over loaded models.
                const models = sequelize.models;
                if (Object.keys(models).length === 0) {
                    throw new Error('No models loaded in Sequelize instance. Cannot perform JSON backup.');
                }
                for (const [ modelName, model ] of Object.entries(models)) {
                    const rows = await model.findAll();
                    dumpData[ modelName ] = rows.map((r) => r.toJSON());
                }
                fs.writeFileSync(jsonFilePath, JSON.stringify(dumpData, null, 2));
                logger.info(`✅ JSON Dump successful: ${Object.keys(dumpData).length} tables exported`);
            }
            // 2. Encrypt the file (AES-256-CBC)
            const secretKey = config.BACKUP_ENCRYPTION_KEY || 'default-backup-key-must-change-32b';
            const key = crypto.createHash('sha256').update(secretKey).digest();
            const iv = crypto.randomBytes(16);
            const output = fs.createWriteStream(zipPath);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            const input = fs.createReadStream(sourceFilePath);
            output.write(iv);
            input.pipe(cipher).pipe(output);
            await new Promise((resolve, reject) => {
                output.on('finish', () => resolve());
                output.on('error', reject);
            });
            // 3. Delete the raw file
            if (fs.existsSync(sourceFilePath)) {
                fs.unlinkSync(sourceFilePath);
            }
            logger.info(`✅ Backup completed and encrypted: ${zipName} (${backupType})`);
            return { success: true, path: zipPath, type: backupType };
        }
        catch (error) {
            logger.error('❌ Backup failed:', error);
            throw error;
        }
    },
};
//# sourceMappingURL=backup.service.js.map

