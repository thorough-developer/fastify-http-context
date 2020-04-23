const { fastifyHttpContextPlugin, setContext, getContext } = require('../');

const sharedRoute = (request, reply) => {
  reply.send({ user: getContext('user')})
}

const buildFastify = ( withDefaults = false) => {
  const fastify = require('fastify')({
    disableRequestLogging: true
  });
  
  let options;

  if (withDefaults) {
    options = {
      defaults: {
        user: { id: 'system' }
      }
    };
  }

  fastify.register(fastifyHttpContextPlugin, options);

  fastify.get('/', sharedRoute);

  return fastify;
};

module.exports = {
  buildFastify
};
