import { Request, Response } from 'express';
import { UserRepository } from '../../repositories/user.repository';
import { ResponseFormatter } from '../../shared/responseFormatter';
import { AppError } from '../../domain/exceptions/AppError';

export class UserController {
  static async getProfile(req: Request, res: Response) {
    const userId = (req as any).user?.userId; // Assuming auth middleware sets req.user
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const profile = await UserRepository.getUserProfile(userId);
    if (!profile) {
      throw new AppError('User not found', 404);
    }

    res.json(ResponseFormatter.success(profile));
  }

  static async updateAvatar(req: Request, res: Response) {
    const userId = (req as any).user?.userId;
    const { avatar_config } = req.body;

    if (!userId) throw new AppError('Unauthorized', 401);
    if (!avatar_config) throw new AppError('avatar_config is required', 400);

    const updatedProfile = await UserRepository.updateAvatar(userId, avatar_config);
    res.json(ResponseFormatter.success(updatedProfile));
  }
}
