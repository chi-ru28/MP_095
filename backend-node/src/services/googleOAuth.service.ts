import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../domain/exceptions/AppError';
import { logger } from '../infrastructure/logging/logger';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleOAuthService {
  static async verifyToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new AppError('Invalid Google Token payload', 400, 'AUTH_INVALID_TOKEN');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture,
      };
    } catch (error) {
      logger.error('Google OAuth Verification Failed', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Google Authentication Failed', 401, 'AUTH_FAILED');
    }
  }
}
