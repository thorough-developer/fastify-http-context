let AsyncLocalStorage = require('async_hooks').AsyncLocalStorage;
let namespace; // = new AsyncLocalStorage();

if (AsyncLocalStorage == null) {
  const createNamespace = require('cls-hooked').createNamespace;
  const hyperid = require('hyperid');
  const generator = hyperid();
  const id = generator();

  const namespaceIdentifier = hyperid.decode(id).uuid;
  
  namespace = createNamespace(namespaceIdentifier);
  namespace.getContext = function(key) {
    if (this.active) {
      return this.get(key);
    }
    return undefined;
  };  

  namespace.setContext = function(key, value){
    if (this.active) {
      this.set(key, value);
    }
  }
  namespace.doRun = ( defaults = {}, callback) => {
     namespace.run(() => {
       for (let [key, value] of defaults) {
        namespace.set(key, value);
       }
       callback();
     });
   };
} else {
 namespace = new class AsyncLocalStorageFacade extends AsyncLocalStorage {
  constructor() {
   super();
  }

  doRun(defaults, callback) {
    this.run(defaults, callback);
  }

  setContext(key, value) {
    const store = this.getStore();

    if (store != null) {
     store.set(key, value);
    }
  }

  getContext(key) {
    const store = this.getStore();

    return store != null ? store.get(key) : undefined;
  }
 }();
}


module.exports = {
  namespace: namespace
}
