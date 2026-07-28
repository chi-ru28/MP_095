import request from 'supertest';
import app from '../../src/api/app';

describe('Auth API Endpoints', () => {
  it('should return 400 for missing google_token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/google')
      .send({});
    expect(response.status).toBe(400);
  });
});
