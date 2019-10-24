const { container } = require('../../app');
const { JWT } = require('@panva/jose');
const assert = require('assert');

describe('auth module unit tests', () => {
    const authService = container.resolve('authService');

    const UUID = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
    const ADMIN_ROLE = 'admin';
    const USER_ROLE = 'user';

    afterAll(async () => {
        await container.dispose();
    });

    test('Test getJWT method', async () => {
        const token =  authService.getJWT(UUID, ADMIN_ROLE);
        assert(JWT.decode(token), 'Invalid or malformed JWT');
    });

    test('Test verifyJWT method', async () => {
        const token = authService.getJWT(UUID, ADMIN_ROLE);
        assert(authService.verifyJWT(token, [ADMIN_ROLE]), 'Error veriying JWT');
    });

    test('Test verifyJWT method with no scopes', async () => {
        const token = authService.getJWT(UUID, ADMIN_ROLE);
        assert(authService.verifyJWT(token), 'Error veriying JWT');
    });


    test('Test verifyJWT with insufficient scope', async () => {
        const token = authService.getJWT(UUID, USER_ROLE);
        let isValid;
        try {
           isValid = authService.verifyJWT(token, [ADMIN_ROLE]);
        } catch(e) {
            isValid = e;
        }
        assert(isValid instanceof Error, 'Error veriying JWT');
    });

    test('Test verifyJWT with expired token', async () => {
        const key = container.resolve('key');
        const issued = Math.round(new Date().getTime() / 1000);
        const exp = issued - 100;
        const signedToken = JWT.sign({ exp, scope: ADMIN_ROLE }, key);

        let isValid;
        try {
           isValid = authService.verifyJWT(signedToken, ['admin']);
        } catch(e) {
            isValid = e;
        }
        assert(isValid instanceof Error, 'Error veriying JWT expiration time');
    });
});
