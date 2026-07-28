import { JWTService, TokenPayload } from './jwt.service';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { storeRefreshTokenInRedis, revokeRefreshTokenInRedis, verifyRefreshTokenInRedis } from '../infrastructure/redis/redis.client';

export class TokenService {
  static async generateAuthTokens(userId: string, role: string) {
    const payload: TokenPayload = { userId, role };
    
    const accessToken = JWTService.generateAccessToken(payload);
    const refreshToken = JWTService.generateRefreshToken(payload);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshTokenRepository.create({
      userId,
      token: refreshToken,
      expiresAt,
    });

    // Store in Redis for 7 days
    await storeRefreshTokenInRedis(userId, refreshToken, 604800);

    return { accessToken, refreshToken };
  }

  static async revokeRefreshToken(userId: string, token: string) {
    await RefreshTokenRepository.revokeToken(token);
    await revokeRefreshTokenInRedis(userId, token);
  }

  static async isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
    const isRedisValid = await verifyRefreshTokenInRedis(userId, token);
    if (!isRedisValid) {
       const dbToken = await RefreshTokenRepository.findByToken(token);
       if (dbToken && !dbToken.revoked && dbToken.expiresAt > new Date()) {
           return true;
       }
       return false;
    }
    return true;
  }
}
