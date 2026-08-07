import { Router } from 'express';
import { HealthController } from '../../api/controllers/health.controller';

const router = Router();

router.get('/', HealthController.check);

export default router;
