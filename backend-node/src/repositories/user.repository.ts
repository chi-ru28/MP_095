import { prisma } from '../infrastructure/database/prisma';

export class UserRepository {
  static async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  static async updateAvatar(userId: string, avatarConfig: any) {
    return prisma.profile.update({
      where: { user_id: userId },
      data: { avatar_config: avatarConfig },
    });
  }
}
