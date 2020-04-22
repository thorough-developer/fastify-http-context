const { fastifyHttpContextPlugin, setContext, getContext } = require('../');

const fastify = require('fastify')();

fastify.register(fastifyHttpContextPlugin, {
 defaults: {
  user: {
   id: 'system'
  }
 }
});

fastify.addHook('onRequest', (req, reply, done) => {
  // overwrite the defaults
  setContext('user', { id: 'helloUser' });
  done();
});

// this should now get the user id of helloUser instead of the default
fastify.get('/', (req, reply) => {
  const user = getContext('user');
  reply.code(200).send( { user });
});

fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
});
