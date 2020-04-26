![fastify-http-context Package](https://github.com/thorough-developer/fastify-http-context/workflows/fastify-http-context%20Package/badge.svg)

# Fastify HTTP Context

> This plugin was inspired by express-http-context, but works more seamlessly within the fastify ecosystem.
 
The purpose of this fastify plugin is to easily add a true thread local http context, where any variables set within the scope of a single http call won't be overwritten by simultaneous calls to the api
nor will variables remain to be assumed by subsequent calls once a request is completed.

This is ideal when you need to, for instance, set a user in a hook, and then retrieve that user later on to add them as the createdBy or modifiedBy user later in subsequent calls. This plugin
will ensure that the user who made the call is the user that is retrieved later on.

## Getting started

First install the package:

```bash
npm i fastify-http-context
```

Next, set up the plugin:

```js
const { fastifyHttpContextPlugin } = fastify-http-context
const fastify = require('fastify');

fastify.register(fastifyHttpContextPlugin, { defaults: user: { id: 'system' } };
``` 

This plugin takes in a single option named `defaults`. These are what the values should be if not set. This is optional and not necessary. There are cases where defaults are not wanted nor
necessary.

From there you can set a context in another hook, route, or method that is within scope. For instance:

```js
const { fastifyHttpContextPlugin, httpContext } = require('fastify-http-context');

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
  httpContext.set('user', { id: 'helloUser' });
  done();
});

// this should now get the user id of helloUser instead of the default
fastify.get('/', (req, reply) => {
  const user = httpContext.get('user');
  reply.code(200).send( { user });
});

fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
});
```
