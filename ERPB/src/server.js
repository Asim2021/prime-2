// CREATING SERVER
import { createServer } from 'node:http';

import app from './app.js';
import config from './lib/config.js';

const PORT = config.PORT || '5001';

const server = createServer(app);

const handleShutdown = (signal) => {
  console.warn(`got ${signal}, starting shutdow`);
  if (!server.listening) process.exit(0);
  console.warn('Closing server...');
  server.close((err) => {
    if (err) {
      console.error(err);
      return process.exit(1);
    }
    console.warn('Exiting...');
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

server.listen(PORT, () => {
  console.log(`ERP V1 Server is Running at http://localhost:${PORT}`);
});
