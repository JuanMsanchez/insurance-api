const Router = require('koa-router');
const packageJson = require('../../package.json');

module.exports = () => {
  const router = new Router();
  const started = new Date();

  router.get('/status', async (ctx) => {
    const uptime = new Date().getTime() - started.getTime();
    const environment = process.env.NODE_ENV;
    const { version } = packageJson;
    ctx.ok({ started: started.toISOString(), uptime, environment, version });
  });
  return router.routes();
};
