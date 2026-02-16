import winston from 'winston';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
  // new winston.transports.File({ filename: 'requests.log' }),
];

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: transports,
});

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Event listener to capture the response finish time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;
    if (res.statusCode >= 400) {
      logger.error(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
};

export { logger, requestLogger };
