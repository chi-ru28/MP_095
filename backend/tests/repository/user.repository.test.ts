import { UserRepository } from '../../src/repositories/user.repository';
import { prisma } from '../../src/infrastructure/database/prisma';

// Mocking prisma
jest.mock('../../src/infrastructure/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by id', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserRepository.findById('123');
    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
      include: { profile: true },
    });
  });
});
