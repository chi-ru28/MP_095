import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../infrastructure/database/prisma';
import { AppError } from '../domain/exceptions/AppError';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export class AuthService {
  /**
   * Verifies Google token, finds or creates a User and Profile, and returns a JWT.
   */
  static async loginWithGoogle(googleToken: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new AppError('Invalid Google Token', 400, 'AUTH_INVALID_TOKEN');
      }

      const { sub: googleId, email, name } = payload;
      let username = name || email.split('@')[0];

      // Use a Prisma transaction to ensure User and Profile are created together
      const user = await prisma.$transaction(async (tx) => {
        let existingUser = await tx.user.findUnique({
          where: { google_id: googleId },
        });

        if (existingUser) {
          // Update last_login
          return tx.user.update({
            where: { id: existingUser.id },
            data: { last_login: new Date() },
          });
        }

        // Handle unique username collision simple fallback
        const usernameExists = await tx.user.findUnique({ where: { username } });
        if (usernameExists) {
          username = `${username}_${Math.floor(Math.random() * 10000)}`;
        }

        // Create new user and profile
        return tx.user.create({
          data: {
            google_id: googleId,
            email,
            username,
            profile: {
              create: {}, // Use defaults
            },
          },
        });
      });

      // Generate Ascendra JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          xp: user.xp,
          coins: user.coins,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Google Authentication Failed', 401, 'AUTH_FAILED');
    }
  }
}
