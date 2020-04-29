const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chaiAsPromise = require('chai-as-promised');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

chai.use(sinonChai);
chai.use(chaiAsPromise);

const { expect, assert } = chai;

const { httpContext, validHooks } = require('../');

const { buildFastify } = require('./mock-server.js');

describe('Testing fastify-http-context', () => {
    let fastify;

    beforeEach(() => {
        sandbox.restore();
    });

    describe('when httpContext.set is called', () => {
        let set;
        let get;
        let namespace;

        describe('and the namespace is defined but not active', () => {
            let unactiveNamespaceFastify;

            afterEach(() => {
                fastify.close();
            });

            beforeEach(async () => {
                fastify = await buildFastify();
            });

            it('then the call returns undefined because it is out of scope even with defaults set', async () => {
                await fastify.inject({ method: 'GET', url: '/' });
                get = require('../').httpContext.get;
                expect(get('user')).to.be.undefined;
            })
        });
        describe('and the namespace is undeifned', () => {
            beforeEach(() => {
                const imports = require('../index.js');
                set = imports.httpContext.set;
                get = imports.httpContext.get;
            });

            it('then the httpContext.get returns undefined', () => {
                set('value', 'value');
                expect(httpContext.get('value')).to.be.undefined;
            });
        });
    });
    describe('When intialized', () => {
        afterEach(() => {
            fastify.close();
        });

        describe('And an invalid hook is supplied', () => {
            beforeEach(async () => {
                fastify = await buildFastify(true, true);
            });

            it('then an error is thrown', async () => {
                const logErrorStub = sandbox.stub(fastify.log, 'error');
                await fastify.inject({ method: 'GET', url: '/' });
                expect(logErrorStub).to.have.been.calledWith(`invalidHook is not a valid fastify hook. Please use one of the following ${validHooks}`);
            });
        });

        describe('And there are no defaults', () => {
            beforeEach(async () => {
                fastify = await buildFastify();
            });

            describe('And no context was set', () => {
                it('then undefined is returned', async () => {
                    const result = await fastify.inject({ method: 'GET', url: '/' });
                    expect(JSON.parse(result.body).user).to.be.undefined;
                });
            });
        });

        describe('And there are defaults', () => {
            beforeEach(async () => {
                fastify = await buildFastify(true);
            });

            describe('And the context is not set', () => {
                const defaultUser = { id: 'system' };

                it('then the returned value is the default context value', async () => {
                    const result = await fastify.inject({ method: 'GET', url: '/' });
                    expect(JSON.parse(result.body).user).to.deep.equal(defaultUser);
                });

            });
            describe('And the context is set', () => {
                const user = { id: 'helloUser' };

                beforeEach(() => {
                    fastify.addHook('preHandler', async (req, reply) => {
                        const id = req.headers['x-header-user'];
                        if (id) {
                            httpContext.set('user', { id });
                        }
                        return;
                    });
                });

                it('then the returned value is what is in the context', async () => {
                    const defaultUser = { id: 'system' };
                    const result = await fastify.inject({ method: 'GET', url: '/', headers: { 'x-header-user': 'helloUser' } });
                    expect(JSON.parse(result.body).user).to.deep.equal(user);

                    const resultNoHeader = await fastify.inject({ method: 'GET', url: '/' });
                    expect(JSON.parse(resultNoHeader.body).user).to.deep.equal(defaultUser);

                    const resultRedo = await fastify.inject({ method: 'GET', url: '/', headers: { 'x-header-user': 'iAmUser' } });
                    expect(JSON.parse(resultRedo.body).user).to.deep.equal({ id: 'iAmUser' });
                });

            });
        });
    });
});
