# Fastify HTTP Context

> This plugin was inspired by express-http-context, but works more seamlessly within the fastify ecosystem.
 
The purpose of this fastify plugin is to easily add a true http context, where any variables set within the scope of a single http call won't be overwritten by simultaneous calls to the api
nor will variables remain to be assumed by subsequent calls once a request is completed.

This is ideal when you need, to for instance, set a user in a hook, and then retrieve that user later on to add them as the createdBy or modifiedBy user later in subsequent calls. This plugin
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

This plugin takes in a single option named `defaults`. These are what the values should be if not set. This is optional and not necessar. There are cases where defaults are not wanted nor
necessary.

From there you can set a context in another hook, route, or method that is within scope. For instance:

```js
const { setContext, getContext } = require('fastify-http-context');

const getUserFromToken = require('get-user-from-token');

fastify.addHook('preHandler', (req, reply, done) => {
  setContext('user', getUserFromToken(req.headers['authorization']);
  done(); 
});

fastify.get('/', (req, reply) => {
  // sends the user info that was set earlier in the call
  reply.send(getContext('user'));
});
```
