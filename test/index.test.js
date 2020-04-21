const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
chai.use(sinonChai);

const { expect } = chai;

const { getContext, setContext } = require('../');

const { buildFastify } = require('./mock-server.js');

describe('Testing fastify-http-context', () => {
  let fastify;
  
  describe('when setContext is called', () => {
    let setContext;
    let getContext;
    let namespace;
   
    describe('and the namespace is defined but not active', () => {
      let unactiveNamespaceFastify;

      afterEach(() => {
        fastify.close(); 
      });

      beforeEach(() => {
        fastify = buildFastify();
      });

      it('then the call returns undefined because it is out of scope even with defaults set', async() => {
        await fastify.inject({ method: 'GET', url: '/' });
        getContext = require('../').getContext;
        expect(getContext('user')).to.be.undefined;
      })
    });
    describe('and the namespace is undeifned', () => {
      beforeEach(() => {
        const imports = require('../index.js');
        setContext = imports.setContext;
        getContext = imports.getContext;
      });

      it('then the getContext returns undefined', () => {
        setContext('value', 'value');
        expect(getContext('value')).to.be.undefined;
      });
    });
  });
  describe('When intialized', () => {
    afterEach(() => {
      fastify.close(); 
    });

    describe('And there are no defaults', () => {
      beforeEach(() => {
       fastify = buildFastify();
      });

      describe('And no context was set', () => {
        it('then undefined is returned', async() => {
          const result = await fastify.inject({ method: 'GET', url: '/' });
          expect(JSON.parse(result.body).user).to.be.undefined;
        });
      });
    });
    
    describe('And there are defaults', () => {
      beforeEach(() => {
       fastify = buildFastify(true);
      });
     
      describe('And the context is not set', () => {
        const defaultUser = { id: 'system' };
        
        it('then the returned value is the default context value', async() => {
          const result = await fastify.inject({ method: 'GET', url: '/' });
          expect(JSON.parse(result.body).user).to.deep.equal(defaultUser);
        });
                        
      });
      describe('And the context is set', () => {
        const user = { id: 'helloUser' };

        beforeEach(() => {
          fastify.addHook('preHandler', async (req, reply) => {
            setContext('user', user);
            return;
          });
        });

        it('then the returned value is what is in the context', async() => {
           const result = await fastify.inject({ method: 'GET', url: '/' });
           expect(JSON.parse(result.body).user).to.deep.equal(user);
        });
   
      });
    });
  });
});
