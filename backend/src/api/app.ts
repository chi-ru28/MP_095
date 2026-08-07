import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Import async errors handler
import 'express-async-errors';

import { errorHandler } from '../middleware/errorHandler';
import { rateLimiter } from '../middleware/rateLimiter';
import healthRoutes from '../routes/v1/health.routes';
import authRoutes from '../routes/v1/auth.routes';
import userRoutes from '../routes/v1/user.routes';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Setup
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger documentation not found or failed to load.', error);
}

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', rateLimiter(10, 60), authRoutes); // Stricter rate limit for auth
app.use('/api/v1/user', rateLimiter(100, 60), userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
