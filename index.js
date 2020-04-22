const fp = require('fastify-plugin');
const createNamespace = require('cls-hooked').createNamespace;
const hyperid = require('hyperid');
const generator = hyperid();
const id = generator();

const namespaceIdentifier = hyperid.decode(id).uuid;

let namespace;

const getDefaults = (key) => {
  return namespace.get(namespaceIdentifier) || {};
}

const getContext = (key) => {
  let value;
  if (namespace && namespace.active) {
   value = namespace.get(key) || getDefaults()[key];
  }
  return value;
};

const setContext = (key, value) => {
  if (namespace && namespace.active) {
   namespace.set(key, value);
  }
};

function plugin (fastify, opts, next) {
  namespace = createNamespace(namespaceIdentifier);

  fastify.addHook('onRequest', (req, res, done) => {
    namespace.run(() => {
      if (opts && opts.defaults) {
       setContext(namespaceIdentifier, opts.defaults);   
      }
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
