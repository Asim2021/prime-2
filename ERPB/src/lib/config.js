process.loadEnvFile('.env')

class Config {
  constructor() {
    this.ENVIRONMENT = {
      DEV: 'development',
      STAGE: 'stage',
      PROD: 'production'
    }
    this.NODE_ENV = process.env.NODE_ENV
    this.API_URL = process.env.API_URL;
    this.PORT = process.env.PORT;

    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    this.REFRESH_TOKEN_TIME = process.env.REFRESH_TOKEN_TIME;
    this.REFRESH_TOKEN_TIME_EXTEND = process.env.REFRESH_TOKEN_TIME_EXTEND;
    this.ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_TIME;
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    this.SALT = process.env.SALT || 12;
    this.ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

    this.SQL_HOST = process.env.SQL_HOST;
    this.SQL_DATABASE_NAME = process.env.SQL_DATABASE_NAME;
    this.SQL_USER = process.env.SQL_USER;
    this.SQL_PASSWORD = process.env.SQL_PASSWORD;
    this.SQL_PORT = process.env.SQL_PORT;

    // this.REDIS_HOST = process.env.REDIS_HOST;
    // this.REDIS_PORT = process.env.REDIS_PORT;

    this.SMTP_HOST = process.env.SMTP_HOST;
    this.SMTP_PORT = process.env.SMTP_PORT;
    this.SMTP_USER = process.env.SMTP_USER;
    this.SMTP_PASS = process.env.SMTP_PASS;
    this.FROM_EMAIL = process.env.FROM_EMAIL;
  }

  validateConfig() {
    for (const [ key, value ] of Object.entries(this)) {
      if (value === undefined) {
        if (this.STORAGE_PROVIDER === 'local' && (key === 'AWS_S3_BUCKET' || key === 'AWS_REGION')) {
          continue;
        }
        throw new Error(`Environment Variable ${key} missing`);
      }
    }
  }
}

const config = new Config();
config.validateConfig();

export default config;
