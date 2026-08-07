import { GoogleOAuthService } from './googleOAuth.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { JWTService } from './jwt.service';
import { AppError } from '../domain/exceptions/AppError';
import { logger } from '../infrastructure/logging/logger';
import { prisma } from '../infrastructure/database/prisma';
import { sendOTP } from '../shared/utils/email';
import { getAuth } from '../shared/utils/firebase';

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

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak whether the email exists, just return success
      return { message: 'If the email exists, an OTP has been sent.' };
    }

    // Generate 5-digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.resetOTP.create({
      data: {
        email,
        otp,
        expiresAt
      }
    });

    await sendOTP(email, otp);
    return { 
      message: 'If the email exists, an OTP has been sent.',
      devOtp: otp // Always return for UI display as requested
    };
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    const validOTP = await prisma.resetOTP.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validOTP) {
      throw new AppError('Invalid or expired OTP', 400, 'AUTH_INVALID_OTP');
    }

    // Mark OTP as used
    await prisma.resetOTP.update({
      where: { id: validOTP.id },
      data: { used: true }
    });

    // Update Firebase password
    const auth = getAuth();
    if (auth) {
      try {
        const firebaseUser = await auth.getUserByEmail(email);
        await auth.updateUser(firebaseUser.uid, { password: newPassword });
        logger.info(`Password reset successfully in Firebase for ${email}`);
      } catch (error: any) {
        logger.error(`Failed to update password in Firebase: ${error.message}`);
        throw new AppError('Failed to update password in Firebase', 500, 'FIREBASE_ERROR');
      }
    } else {
      logger.warn(`Firebase Admin SDK not initialized. Password for ${email} was NOT updated in Firebase.`);
      throw new AppError('Server misconfiguration: Firebase Admin SDK not initialized', 500, 'SERVER_ERROR');
    }
    
    return { message: 'Password reset successfully' };
  }
}
