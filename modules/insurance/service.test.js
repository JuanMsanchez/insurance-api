const { container } = require('../../app');
const assert = require('assert');
const nock = require('nock');
const { JWT } = require('@panva/jose');

describe('insurance module unit tests', () => {
    const insuranceService = container.resolve('insuranceService');
    const config = container.resolve('config');
    const { host, policiesPath, clientsPath } = config.get('insurance');

    const CLIENT_ID = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
    const POLICY_ID = 'be4bf877-5a72-4ae2-b8f5-3c79e21fc829';
    const USER_EMAIL = 'manningblankenship@quotezart.com';

    const mockedPolicies = nock(host)
    .get(policiesPath)
    .reply(200, {
        policies: [{
            "id": POLICY_ID,
            "amountInsured": 3235.96,
            "email": "inesblankenship@quotezart.com",
            "inceptionDate": "2016-09-22T03:08:08Z",
            "installmentPayment": false,
            "clientId": CLIENT_ID
        }, {
            "id": "19d4fa60-6361-424c-bb15-e81d439b3244",
            "amountInsured": 3313.59,
            "email": "inesblankenship@quotezart.com",
            "inceptionDate": "2014-01-12T04:35:00Z",
            "installmentPayment": true,
            "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
        }],
    });

    const mockedClients = nock(host)
    .get(clientsPath)
    .reply(200, {
        clients: [{
            "id": CLIENT_ID,
            "name": "Manning",
            "email": USER_EMAIL,
            "role": "admin"
        }],
    });

    afterAll(async () => {
        await container.dispose();
    });

    test('Test get clients data method and cache', async () => {
        const { cache, constants } = insuranceService;
        const clients = await insuranceService.getClients();
        expect(Array.isArray(clients)).toBeTruthy();
        expect(clients.length).toBeTruthy();
        const inCache = cache.get(constants['CACHE_CLIENTS_KEY']);
        assert(inCache, 'Error on clients cache');
    });

    test('Test get policies data method and cache', async () => {
        const { cache, constants } = insuranceService;
        const policies = await insuranceService.getPolicies();
        expect(Array.isArray(policies)).toBeTruthy();
        expect(policies.length).toBeTruthy();
        const inCache = cache.get(constants['CACHE_POLICIES_KEY']);
        assert(inCache, 'Error on policies cache');
    });

    test('Test get policies filters', async () => {
        const policies = await insuranceService.getPolicies({ username: 'Manning' });
        expect(Array.isArray(policies)).toBeTruthy();
        expect(policies.length).toBeTruthy();
        assert((policies[0].id === POLICY_ID),
            'Badly filtered policies');
    });

    test('Test get client filters', async () => {
        const clientsByPolicy = await insuranceService.getClients({ 
            policyId: POLICY_ID,
        });
        expect(Array.isArray(clientsByPolicy)).toBeTruthy();
        expect(clientsByPolicy.length).toBeTruthy();
        assert((clientsByPolicy[0].id === CLIENT_ID),
            'Badly filtered clients by policy id');

        const clientsById = await insuranceService.getClients({ 
            id: CLIENT_ID,
        });
        expect(Array.isArray(clientsById)).toBeTruthy();
        expect(clientsById.length).toBeTruthy();
        assert((clientsById[0].id === CLIENT_ID),
            'Badly filtered clients by id');

        const clientsByName = await insuranceService.getClients({ 
            name: 'manni',
        });
        expect(Array.isArray(clientsById)).toBeTruthy();
        expect(clientsByName.length).toBeTruthy();
        assert((clientsByName[0].id === CLIENT_ID),
            'Badly filtered clients by name');
    });

    test('Test get client token method', async () => {
        const token = await insuranceService.getAccessToken(USER_EMAIL);
        expect(token).toBeTruthy();
        assert(JWT.decode(token), 'Invalid or malformed JWT');
    });

    test('Test get client token method with invalid user', async () => {
        let token;
        try {
            token = await insuranceService.getAccessToken('fake@email.com');
        } catch(e) {
            token = e;
        }
        assert(token instanceof Error, 'Error veriying user');
    });
});
