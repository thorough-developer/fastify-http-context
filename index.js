const fp = require('fastify-plugin');

const namespace = require('./async-local-storage');

const getContext = (key) => {
  return namespace.get(key);
};

const setContext = (key, value) => {
  namespace.set(key, value);
};

function plugin (fastify, opts, next) {
  const defaults = opts.defaults || {};
  fastify.addHook('onRequest', (req, res, done) => {
    namespace.doRun(defaults, () => {
      done();
    });
  });
  next();
}

module.exports = {
  setContext: setContext,
  getContext: getContext,
  fastifyHttpContextPlugin: fp(plugin, {
    fastify: '2.x',
    name: 'fastify-http-context'
  })
};
