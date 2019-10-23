require('dotenv').config();

const Koa = require('koa');
const Cors = require('@koa/cors');
const BodyParser = require('koa-bodyparser');
const Helmet = require('koa-helmet');
const respond = require('koa-respond');
const config = require('config');
const awilix = require('awilix');
const NodeCache = require("node-cache");

const status = require('./modules/status');
const insurance = require('./modules/insurance');

const {
  createContainer,
  asValue,
  asClass,
  asFunction,
  InjectionMode,
} = awilix;

// init koa app and load middlewares
const app = new Koa();

app.use(Helmet());
app.use(Cors());
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  onerror(err, ctx) {
    ctx.throw('body parse error', 422);
  },
}));

// create dependency injection container
const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// registering core dependencies
container.register({
  config: asValue(config),
  cache: asFunction(() => new NodeCache()).singleton(),  
});

// registering application endpoints and services
container.register({
  statusRoutes: asFunction(status.routes),
  insuranceService: asFunction(insurance.service),
});

app.use(respond());
app.use(container.resolve('statusRoutes'));

module.exports = { app, container };
