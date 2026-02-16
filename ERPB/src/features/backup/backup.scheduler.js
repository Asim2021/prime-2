import { backupService } from './backup.service.js';
import { logger } from '../../utils/logger.js';
// Simple scheduler to run backup every day at midnight (or close to it)
export const startBackupScheduler = () => {
    logger.info('⏳ Backup scheduler started');
    const checkTimeAndBackup = async () => {
        const now = new Date();
        // Run at 00:00 (Midnight)
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            logger.info('🕛 Triggering scheduled daily backup...');
            try {
                await backupService.performBackup();
                // Wait a minute to avoid double triggering
                await new Promise((resolve) => setTimeout(resolve, 61000));
            }
            catch (error) {
                logger.error('❌ Scheduled backup failed:', error);
            }
        }
    };
    // Check every minute
    setInterval(checkTimeAndBackup, 60000);
};
//# sourceMappingURL=backup.scheduler.js.map