import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { ResponseFormatter } from '../../shared/responseFormatter';
import { z } from 'zod';
import { AppError } from '../../domain/exceptions/AppError';

// Zod schema for validating the incoming payload
const googleAuthSchema = z.object({
  google_token: z.string().min(1, 'google_token is required'),
});

export class AuthController {
  static async loginWithGoogle(req: Request, res: Response) {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400, 'VALIDATION_ERROR');
    }

    const { google_token } = parsed.data;
    const result = await AuthService.loginWithGoogle(google_token);
    
    res.json(ResponseFormatter.success(result));
  }
}
