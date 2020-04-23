const fp = require('fastify-plugin');

const { namespace } = require('./async-local-storage');

const getContext = (key) => {
  return namespace.getContext(key);
};

const setContext = (key, value) => {
  namespace.setContext(key, value);
};

function plugin (fastify, opts, next) {
  const defaults = new Map(Object.entries(opts.defaults || {}));
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
