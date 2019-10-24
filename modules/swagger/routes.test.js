const request = require('supertest');
const { app, container } = require('../../app');

describe('swagger endpoint', () => {
  let SERVER;
  let AGENT;

  beforeAll(async () => {
    SERVER = app.listen();
    AGENT = request(SERVER);
  });

  afterAll(async () => {
    SERVER.close();
    await container.dispose();
  });

  test('should respond with 200', async () => {
    const response = await AGENT.get('/swagger');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('text/html');
  });
});
