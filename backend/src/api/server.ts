import dotenv from 'dotenv';
import { logger } from '../infrastructure/logging/logger';
import { initializeFirebase } from '../shared/utils/firebase';
import app from './app';

dotenv.config();
initializeFirebase();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    process.exit(0);
  });
});
