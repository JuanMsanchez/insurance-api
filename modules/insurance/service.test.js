const { container } = require('../../app');
const assert = require('assert');
const nock = require('nock');

describe('insurance module unit tests', () => {
    const insuranceService = container.resolve('insuranceService');
    const config = container.resolve('config');
    const { host, policiesPath, clientsPath } = config.get('insurance');

    const mockedPolicies = nock(host)
    .get(policiesPath)
    .reply(200, {
        policies: [{
            "id": "be4bf877-5a72-4ae2-b8f5-3c79e21fc829",
            "amountInsured": 3235.96,
            "email": "inesblankenship@quotezart.com",
            "inceptionDate": "2016-09-22T03:08:08Z",
            "installmentPayment": false,
            "clientId": "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
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
            "id": "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
            "name": "Manning",
            "email": "manningblankenship@quotezart.com",
            "role": "admin"
        }],
    });

    afterAll(async () => {
        await container.dispose();
    });

    test('Get clients data method and cache', async () => {
        const { cache, constants } = insuranceService;
        const clients = await insuranceService.getClients();
        expect(Array.isArray(clients)).toBeTruthy();
        expect(clients.length).toBeTruthy();
        const inCache = cache.get(constants['CACHE_CLIENTS_KEY']);
        assert(inCache, 'Error on clients cache');
    });

    test('Get policies data method and cache', async () => {
        const { cache, constants } = insuranceService;
        const policies = await insuranceService.getPolicies();
        expect(Array.isArray(policies)).toBeTruthy();
        expect(policies.length).toBeTruthy();
        const inCache = cache.get(constants['CACHE_POLICIES_KEY']);
        assert(inCache, 'Error on policies cache');
    });

    test('Get filtered policies', async () => {
        const policies = await insuranceService.getPolicies({ username: 'Manning' });
        expect(Array.isArray(policies)).toBeTruthy();
        expect(policies.length).toBeTruthy();
        assert((policies[0].id === 'be4bf877-5a72-4ae2-b8f5-3c79e21fc829'),
            'Badly filtered policies');
    });
});
