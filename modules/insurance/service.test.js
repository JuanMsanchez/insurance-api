const { container } = require('../../app');
const assert = require('assert');

describe('insurance module unit tests', () => {
    const insuranceService = container.resolve('insuranceService');
    const config = container.resolve('config');
  
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
});
