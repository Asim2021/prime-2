process.loadEnvFile('.env');

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ENDPOINT } from './constant/endpoints.js';
import { HTTP_STATUS } from './constant/httpStatus.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.handler.js';
import { requestLogger } from './utils/logger.js';
import rootRouter from '#features/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DEFINING CONSTANTS
const app = express();

// INITIATING MIDDLEWARES
app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://192.168.0.101:3001',
      'http://192.168.0.101:4173',
      'http://localhost:4173',
      'http://localhost:5173',
    ],
    credentials: true,
    optionsSuccessStatus: HTTP_STATUS.NO_CONTENT,
    preflightContinue: false,
    methods: [ 'GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH' ],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(compression());

// // INITIATING STATIC FILE USAGE
app.use('/profiles', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});
app.use(express.static(path.join(__dirname, '..', 'public')));

// USING ROUTER
app.use(ENDPOINT.BASE, rootRouter);

app.use(errorHandler);

// For Test
app.get('/test', (_req, res) => {
  res.send(`<h1 style="background:red">WELCOME TO ERP V1 SERVER</h1>`);
});

// IF NO ROUTE FOUND
app.use(notFoundHandler);

export default app;
