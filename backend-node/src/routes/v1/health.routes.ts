import { Router } from 'express';
import { ResponseFormatter } from '../../shared/responseFormatter';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the status of the API
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', (req, res) => {
  res.json(ResponseFormatter.success({ status: 'OK', timestamp: new Date() }));
});

export default router;
