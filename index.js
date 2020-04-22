const fp = require('fastify-plugin');

const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

const getContext = (key) => {
  const store = asyncLocalStorage.getStore();
  
  return store != null ? store.get(key) : undefined;  
};

const setContext = (key, value) => {
  const store = asyncLocalStorage.getStore();

  if (store != null) {
    store.set(key, value);
  }
};

function plugin (fastify, opts, next) {
  const defaults = new Map(Object.entries(opts.defaults || {}));
  fastify.addHook('onRequest', (req, res, done) => {
    
    asyncLocalStorage.run(defaults, () => {
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
