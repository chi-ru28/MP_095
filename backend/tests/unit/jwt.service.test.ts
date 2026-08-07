import { JWTService } from '../../src/services/jwt.service';

describe('JWTService', () => {
  const payload = { userId: '123', role: 'USER' };

  it('should generate an access token', () => {
    const token = JWTService.generateAccessToken(payload);
    expect(typeof token).toBe('string');
  });

  it('should verify an access token', () => {
    const token = JWTService.generateAccessToken(payload);
    const decoded = JWTService.verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });
});
