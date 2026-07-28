import { prisma } from '../infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

export class RefreshTokenRepository {
  static async create(data: Prisma.RefreshTokenCreateInput) {
    return prisma.refreshToken.create({
      data,
    });
  }

  static async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async revokeToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  static async revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}
