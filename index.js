const fp = require('fastify-plugin');

const fastAls = require('fast-als');

const httpContext = {
    get: fastAls.get,
    set: fastAls.set
};

/**
 * @deprecated
 * @param {*} key 
 */
const getContext = (key) => {
  return httpContext.get(key);
};

/**
 * @deprecated - Please use httpContext instead
 * @param {*} key 
 * @param {*} value 
 */
const setContext = (key, value) => {
  httpContext.set(key, value);
};

function plugin (fastify, opts, next) {
  const defaults = opts.defaults || {};
  fastify.addHook('onRequest', (req, res, done) => {
    fastAls.runWith(defaults, () => {
      done();
    });
  });
  next();
}

module.exports = {
  httpContext: httpContext,
  setContext: setContext,
  getContext: getContext,
  fastifyHttpContextPlugin: fp(plugin, {
    fastify: '2.x',
    name: 'fastify-http-context'
  })
};
