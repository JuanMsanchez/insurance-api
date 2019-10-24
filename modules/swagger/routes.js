const koaSwagger = require('koa2-swagger-ui');
const Router = require('koa-router');

const router = new Router();
const path = require('path');
const fs = require('fs');

module.exports = ({ config }) => {
  const opts = config.get('swagger');
  let file = path.resolve(`${__dirname}/../../${opts.file}`);
  let swaggerJSON;

  try {
    file = fs.readFileSync(file, 'utf8');
    swaggerJSON = JSON.parse(file);
  } catch (error) {
    throw new Error(`Invalid json file at: ${file}`);
  }

  const options = Object.assign({
    swaggerPath: '/swagger.json',
    host: 'localhost:3000',
    path: '/swagger',
    scheme: 'http',
  }, opts);

  const { swaggerPath, host, scheme } = options;

  router.get(swaggerPath, async (ctx) => {
    const doc = swaggerJSON;
    doc.host = host;
    ctx.ok(doc);
  });

  router.get('/swagger', koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: `${scheme}://${host}${swaggerPath}`,
    },
    favicon16: 'https://cdn.gsa.rgadev.com/images/favicon.ico',
    favicon32: 'https://cdn.gsa.rgadev.com/images/favicon.ico',
    title: 'Girls Scouts API doc',
  }));

  return router.routes();
};
