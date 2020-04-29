const fp = require('fastify-plugin');

const fastAls = require('fast-als');

const httpContext = {
    get: fastAls.get,
    set: fastAls.set
};


const validHooks = [
    'onRequest',
    'preParsing',
    'preValidation',
    'preHandler',
    'preSerialization',
    'onError',
    'onSend',
    'onResponse'
];

function plugin(fastify, opts, next) {
    const defaults = opts.defaults || {};
    const hook = opts.hook || 'onRequest';

    if (!validHooks.includes(hook)) {
        fastify.log.error(`${hook} is not a valid fastify hook. Please use one of the following ${validHooks}`);
    }

    
    fastify.addHook('onRequest', (req, res, done) => {
        fastAls.runWith(defaults, () => {
            done();
        });
    });
    next();
}

module.exports = {
    validHooks: validHooks,
    httpContext: httpContext,
    fastifyHttpContextPlugin: fp(plugin, {
        fastify: '2.x',
        name: 'fastify-http-context'
    })
};
