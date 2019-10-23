const { container } = require('../../app');
const { JWT } = require('@panva/jose');
const assert = require('assert');

describe('auth module unit tests', () => {
    const authService = container.resolve('authService');

    afterAll(async () => {
        await container.dispose();
    });

    test('Test getJWT method', async () => {
        const uuid = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
        const role = 'admin';
        const token =  authService.getJWT(uuid, role);
        assert(JWT.decode(token), 'Invalid or malformed JWT');
    });

    test('Test verifyJWT method', async () => {
        const uuid = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
        const role = 'admin';
        const token = authService.getJWT(uuid, role);
        assert(authService.verifyJWT(token, ['admin']), 'Error veriying JWT');
    });

    test('Test verifyJWT with insufficient scope', async () => {
        const uuid = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
        const role = 'user';
        const token = authService.getJWT(uuid, role);
        let isValid;
        try {
           isValid = authService.verifyJWT(token, ['admin']);
        } catch(e) {
            isValid = e;
        }
        assert(isValid instanceof Error, 'Error veriying JWT');
    });

    test('Test verifyJWT with expired token', async () => {
        const uuid = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
        const role = 'admin';
        const key = container.resolve('key');
        const issued = Math.round(new Date().getTime() / 1000);
        const exp = issued - 100;
        const signedToken = JWT.sign({ exp, scope: role}, key);

        let isValid;
        try {
           isValid = authService.verifyJWT(signedToken, ['admin']);
        } catch(e) {
            isValid = e;
        }
        assert(isValid instanceof Error, 'Error veriying JWT expiration time');
    });
});
