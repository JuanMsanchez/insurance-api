const request = require('supertest');
const assert = require('assert');
const nock = require('nock');
const { app, container } = require('../../app');

describe('insurance routes test', () => {
    const server = app.listen();
    const agent = request(server);
    const config = container.resolve('config');
    const authService = container.resolve('authService');
    const { host, policiesPath, clientsPath } = config.get('insurance');
    
    const USR_TOKEN =  authService.getJWT('uuid', 'user');
    const ADM_TOKEN =  authService.getJWT('uuid', 'admin');
    const CLIENT_ID = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
    const POLICY_ID = 'be4bf877-5a72-4ae2-b8f5-3c79e21fc829';
    const USER_EMAIL = 'manningblankenship@quotezart.com';
    const USER_NAME = 'Manning';

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
            "name": USER_NAME,
            "email": USER_EMAIL,
            "role": "admin"
        }],
    });

    afterAll(async () => {
        server.close();
        await container.dispose();
    });

    test('Test /insurance/token route with valid email', async () => {
        const response = await agent.get(`/insurance/token?email=${USER_EMAIL}`)
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(response.body.token).toBeTruthy();
    });

    test('Test /insurance/token route with non existent user', async () => {
        const response = await agent.get(`/insurance/token?email=fake@email.com`)
        expect(response.status).toEqual(400);
    });

    test('Test /insurance/clients route with no params', async () => {
        const query = `accessToken=${USR_TOKEN}`;        
        const response = await agent.get(`/insurance/clients?${query}`)
        expect(response.status).toEqual(200);
    });

    test('Test /insurance/clients route with valid params', async () => {
        const queryName = `name=${USER_NAME}&accessToken=${USR_TOKEN}`;
        const nameFiltered = await agent.get(`/insurance/clients?${queryName}`)
        expect(nameFiltered.status).toEqual(200);
        assert(nameFiltered.body.clients[0].id === CLIENT_ID, 'Error filtering by name');
        
        const queryId = `id=${CLIENT_ID}&accessToken=${USR_TOKEN}`;
        const idFiltered = await agent.get(`/insurance/clients?${queryId}`)
        expect(idFiltered.status).toEqual(200);
        assert(idFiltered.body.clients[0].id === CLIENT_ID, 'Error filtering by id');
    });

    test('Test /insurance/clients route with multiple valid params', async () => {
        const query = `id=${CLIENT_ID}&name=${USER_NAME}&accessToken=${USR_TOKEN}`;
        const response = await agent.get(`/insurance/clients?${query}`)
        expect(response.status).toEqual(200);
        assert(response.body.clients[0].id === CLIENT_ID,
            'Error filtering by multiple params');
    });
  
    test('Test /insurance/clients route with ilegal values params', async () => {
        const query = `name=$()&accessToken=${USR_TOKEN}`;
        const response = await agent.get(`/insurance/clients?${query}`)
        expect(response.status).toEqual(400);
    });

    test('Test /insurance/policies route with no params', async () => {
        const query = `accessToken=${ADM_TOKEN}`;
        const response = await agent.get(`/insurance/policies?${query}`)
        expect(response.status).toEqual(200);
    });

    test('Test /insurance/policies route with valid params', async () => {
        const query = `username=${USER_NAME}&accessToken=${ADM_TOKEN}`;
        const response = await agent.get(`/insurance/policies?${query}`)
        expect(response.status).toEqual(200);
        assert(response.body.policies[0].id === POLICY_ID, 'Error filtering by username');
    });

    test('Test /insurance/policies route with ilegal values params', async () => {
        const query = `username=$()&accessToken=${ADM_TOKEN}`;
        const response = await agent.get(`/insurance/policies?${query}`)
        expect(response.status).toEqual(400);
    });

    test('Test /insurance/policy/:policyId/clients route with valid params', async () => {
        const query = `accessToken=${ADM_TOKEN}`;
        const response = await agent.get(`/insurance/policy/${POLICY_ID}/clients?${query}`)
        expect(response.status).toEqual(200);
        assert(response.body.clients[0].id === CLIENT_ID, 'Error fetching clients by policy');
    });

    test('Test /insurance/policy/:policyId/clients route with user token', async () => {
        const query = `accessToken=${USR_TOKEN}`;
        const response = await agent.get(`/insurance/policy/${POLICY_ID}/clients?${query}`)
        expect(response.status).toEqual(403);
    });
   
    test('Test /insurance/policy/:policyId/clients route with ilegal params', async () => {
        const query = `accessToken=${ADM_TOKEN}`;
        const response = await agent.get(`/insurance/policy/$()/clients?${query}`)
        expect(response.status).toEqual(400);
    });
});
