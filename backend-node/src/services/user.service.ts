import { UserRepository } from '../repositories/user.repository';
import { prisma } from '../infrastructure/database/prisma';

export class UserService {
  static async findOrCreateGoogleUser(googleId: string, email: string, name: string, avatar: string | undefined) {
    let user = await UserRepository.findByGoogleId(googleId);

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      });
      return user;
    }

    let username = name.replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
    let usernameExists = await UserRepository.findByUsername(username);
    if (usernameExists) {
      username = `${username}_${Math.floor(Math.random() * 10000)}`;
    }

    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          googleId,
          email,
          username,
          fullName: name,
          avatar,
          provider: 'google',
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });
  }
}
