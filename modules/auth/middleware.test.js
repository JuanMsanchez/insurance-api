const { container } = require('../../app');
const assert = require('assert');

describe('auth middleware test', () => {
  const authMiddleware = container.resolve('authMiddleware');
  const authService = container.resolve('authService');

  test('Test middleware with no access token', async () => {
    const ctx = { request: {}, headers: {}, query: {} };
    try {
      await authMiddleware.jwtAuthz().call(null, ctx);
    } catch (e)  {
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('Missing authorization token');
    }
  });

  test('Test middleware with invalid token', async () => {
    const ctx = { request: {}, headers: {}, query: { accessToken: 'fake'} };
    try {
      await authMiddleware.jwtAuthz().call(null, ctx);
    } catch (e)  {
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('Invalid or expired token');
    }
  });

  test('Test middleware with invalid authorization header', async () => {
    const ctx = { request: {}, headers: { authorization: 'fake' }, query: {} };
    try {
      await authMiddleware.jwtAuthz().call(null, ctx);
    } catch (e)  {
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('Invalid or expired token');
    }
  });

  test('Test middleware with valid authorization header', async () => {
    const token =  authService.getJWT('uuid', 'role');
    const ctx = { request: {}, headers: { authorization: token }, query: {} };
    const isAuthorized = await authMiddleware.jwtAuthz().call(null, ctx, () => {
        return 'ok';
    });
    assert(isAuthorized === 'ok', 'Error validating token');
  });

  test('Test middleware with insufficient scopes', async () => {
    const token =  authService.getJWT('uuid', 'role');
    const ctx = { request: {}, headers: { authorization: token }, query: {} };
    try {
        await authMiddleware.jwtAuthz(['admin']).call(null, ctx);
    } catch (e)  {
        expect(e.status).toEqual(403);
        expect(e.message).toEqual('Insufficient scope');
    }
  });
  
  test('Test middleware with valid token and scopes', async () => {
    const token =  authService.getJWT('uuid', 'admin');
    const ctx = { request: {}, headers: { authorization: token }, query: {} };
    try {
        await authMiddleware.jwtAuthz(['admin']).call(null, ctx);
    } catch (e)  {
        expect(e.status).toEqual(403);
        expect(e.message).toEqual('Insufficient scope');
    }
  });  
});
