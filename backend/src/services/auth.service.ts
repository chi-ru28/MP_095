import { GoogleOAuthService } from './googleOAuth.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { JWTService } from './jwt.service';
import { AppError } from '../domain/exceptions/AppError';
import { logger } from '../infrastructure/logging/logger';

export class AuthService {
  static async loginWithGoogle(googleToken: string) {
    logger.info('Starting Google Login flow');
    const { googleId, email, name, avatar } = await GoogleOAuthService.verifyToken(googleToken);
    
    const user = await UserService.findOrCreateGoogleUser(googleId, email, name, avatar);
    
    const tokens = await TokenService.generateAuthTokens(user.id, user.role);
    
    logger.info(`User ${user.id} logged in successfully`);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  static async refreshTokens(refreshToken: string) {
    try {
      const payload = JWTService.verifyRefreshToken(refreshToken);
      const { userId, role } = payload;

      const isValid = await TokenService.isRefreshTokenValid(userId, refreshToken);
      if (!isValid) {
        throw new AppError('Invalid or revoked refresh token', 401, 'AUTH_INVALID_REFRESH_TOKEN');
      }

      // Refresh token rotation: revoke old, create new
      await TokenService.revokeRefreshToken(userId, refreshToken);
      const newTokens = await TokenService.generateAuthTokens(userId, role);

      logger.info(`Tokens refreshed for user ${userId}`);
      
      return newTokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid refresh token', 401, 'AUTH_INVALID_REFRESH_TOKEN');
    }
  }

  static async logout(userId: string, refreshToken: string) {
    await TokenService.revokeRefreshToken(userId, refreshToken);
    logger.info(`User ${userId} logged out`);
  }
}
