import { Router } from 'express';
import { AuthController } from '../../api/controllers/auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const googleAuthSchema = z.object({
  body: z.object({
    google_token: z.string().min(1, 'google_token is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(5),
    newPassword: z.string().min(6),
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

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', validateRequest(forgotPasswordSchema), AuthController.forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', validateRequest(resetPasswordSchema), AuthController.resetPassword);

export default router;
