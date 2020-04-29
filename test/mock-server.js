const { fastifyHttpContextPlugin, httpContext} = require('../');

const sharedRoute = (request, reply) => {
  reply.send({ user: httpContext.get('user')})
}

const buildFastify = async ( withDefaults = false, withInvalidHook = false) => {
  const fastify = require('fastify')({
    disableRequestLogging: true
  });
  
  let options = {};

  if (withDefaults) {
    options.defaults = {
        user: { id: 'system' }
    };
  }

  if (withInvalidHook) {
      options.hook = 'invalidHook';
  }
  
  await fastify.register(fastifyHttpContextPlugin, options);

  fastify.get('/', sharedRoute);

  return fastify;
};

module.exports = {
  buildFastify
};
