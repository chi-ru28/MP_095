import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const googleAuthSchema = z.object({
  body: z.object({
    google_token: z.string({ required_error: 'google_token is required' }).min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(), // Could be in cookie
  }),
});

// POST /api/v1/auth/google
router.post('/google', validateRequest(googleAuthSchema), AuthController.loginWithGoogle);

// POST /api/v1/auth/refresh
router.post('/refresh', validateRequest(refreshSchema), AuthController.refresh);

// POST /api/v1/auth/logout
router.post('/logout', requireAuth, AuthController.logout);

// GET /api/v1/auth/me
router.get('/me', requireAuth, AuthController.getCurrentUser);

export default router;
