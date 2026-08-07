import { Router } from 'express';
import { UserController } from '../../api/controllers/user.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get player profile
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', UserController.getProfile);

/**
 * @swagger
 * /user/avatar:
 *   put:
 *     summary: Update avatar config
 *     security:
 *       - bearerAuth: []
 */
router.put('/avatar', UserController.updateAvatar);

export default router;
