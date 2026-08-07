import { prisma } from '../infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

export class ProfileRepository {
  static async findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  static async create(data: Prisma.ProfileCreateInput) {
    return prisma.profile.create({
      data,
    });
  }

  static async update(userId: string, data: Prisma.ProfileUpdateInput) {
    return prisma.profile.update({
      where: { userId },
      data,
    });
  }
}
