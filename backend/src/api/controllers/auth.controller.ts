import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { ResponseFormatter } from '../../shared/responseFormatter';

export class AuthController {
  static async loginWithGoogle(req: Request, res: Response) {
    const { google_token } = req.body;
    const result = await AuthService.loginWithGoogle(google_token);
    
    // Set refresh token in secure cookie (optional, but good practice)
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json(ResponseFormatter.success({
      user: result.user,
      accessToken: result.tokens.accessToken
    }));
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const tokens = await AuthService.refreshTokens(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json(ResponseFormatter.success({
      accessToken: tokens.accessToken
    }));
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const userId = (req as any).user.userId;

    await AuthService.logout(userId, refreshToken);
    
    res.clearCookie('refreshToken');
    res.json(ResponseFormatter.success({ message: 'Logged out successfully' }));
  }

  static async getCurrentUser(req: Request, res: Response) {
    const user = (req as any).user;
    res.json(ResponseFormatter.success({ user }));
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json(ResponseFormatter.error('Email is required', 400));
      return;
    }
    const result = await AuthService.forgotPassword(email);
    res.json(ResponseFormatter.success(result));
  }

  static async resetPassword(req: Request, res: Response) {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json(ResponseFormatter.error('Email, OTP, and new password are required', 400));
      return;
    }
    const result = await AuthService.resetPassword(email, otp, newPassword);
    res.json(ResponseFormatter.success(result));
  }
}
