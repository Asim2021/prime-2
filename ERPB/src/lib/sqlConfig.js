import { Sequelize } from 'sequelize';
import { logger } from '#utils/logger.js';
import config from './config.js';

const sequelize = new Sequelize(config.SQL_DATABASE_NAME, config.SQL_USER, config.SQL_PASSWORD, {
  host: config.SQL_HOST,
  dialect: 'mysql',
  port: config.SQL_PORT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: config.NODE_ENV === config.ENVIRONMENT.DEV ? console.log : false,
});

// TO CHECK THE DATABASE CONNECTION
(async () => {
  try {
    await sequelize.authenticate();
    logger.info(`🚀 MYSQL Connection established successfully! 🎉`);
  } catch (error) {
    logger.error('❌ Unable to connect to the database ❌');
    logger.error(error?.message);
    process.exit(1); // Exit the process if the connection fails
  }
})();

export default sequelize;
