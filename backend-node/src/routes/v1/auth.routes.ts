import { Router } from 'express';
import { AuthController } from '../../api/controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login with Google
 *     description: Exchanges a Google OAuth token for an Ascendra JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               google_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post('/google', AuthController.loginWithGoogle);

export default router;
