import { prisma } from '../infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
