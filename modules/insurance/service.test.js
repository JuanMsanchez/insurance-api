const { container } = require('../../app');
const assert = require('assert');

describe('insurance data source integration test', () => {
    const insuranceService = container.resolve('insuranceService');

    afterAll(async () => {
        await container.dispose();
    });

    test('Clients data source is available and returns expected schema', async () => {
        const clients = await insuranceService.getClients();
        expect(Array.isArray(clients)).toBeTruthy();
        expect(clients.length).toBeTruthy();
        
        const client = clients[0];
        assert((client.id && typeof client.id === 'string'), 
            'invalid or missing `id` prop on client object');
        assert((client.name && typeof client.name === 'string'),
            'invalid or missing `name` prop on client object');
        assert((client.email && typeof client.email === 'string'),
            'invalid or missing `email` prop on client object');
        assert((client.role && typeof client.role === 'string'),
            'invalid or missing `role` prop on client object');
    });

    test('Policies data source is available and returns expected schema', async () => {
        const policies = await insuranceService.getPolicies();
        expect(Array.isArray(policies)).toBeTruthy();
        expect(policies.length).toBeTruthy();

        const policy = policies[0];
        assert((policy.id && typeof policy.id === 'string'), 
            'invalid or missing `id` prop on policy object');           
        assert((policy.amountInsured && typeof policy.amountInsured === 'number'),
            'invalid or missing `amountInsured` prop on policy object');            
        assert((policy.email && typeof policy.email === 'string'),
            'invalid or missing `email` prop on policy object');
        assert((policy.inceptionDate && typeof policy.inceptionDate === 'string'),
            'invalid or missing `inceptionDate` prop on policy object');        
        assert((policy.installmentPayment && typeof policy.installmentPayment === 'boolean'),
            'invalid or missing `installmentPayment` prop on policy object');                    
        assert((policy.clientId && typeof policy.clientId === 'string'), 
            'invalid or missing `clientId` prop on policy object');           
    });
});
