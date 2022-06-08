const urllib = require('urllib');

exports.createMockApp = (app, properties = []) => {
  const readyFunction = [];
  const mockApp = {
    name: '',
    coreLogger: app.getLogger(),
    config: app.getConfig(),
    loader: {
      appInfo: {},
      getLoadUnits: () => [],
    },
    logger: app.getLogger(),
    loggers: {
      coreLogger: app.getLogger(),
    },
    getLogger() {
      return app.getLogger();
    },
    readyCallback() {
      return true;
    },
    createAnonymousContext() {
      return {};
    },
    deprecate(msg) {
      console.warn(msg);
    },
    httpclient: urllib,
    beforeStart(fn) {
      readyFunction.push(fn());
    },
    getBeforeStartList() {
      return readyFunction;
    },
    toAsyncFunction(method) {
      return method;
    }
  };

  for (const property of properties) {
    mockApp[property] = app[property];
  }

  return mockApp;
};

exports.completeAssign = (...sources) => {
  const target = sources.shift();

  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
    // by default, Object.assign copies enumerable Symbols too
    /* istanbul ignore next */
    Object.getOwnPropertySymbols(source).forEach(sym => {
      const descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        Object.defineProperty(target, sym, descriptor);
      }
    });
  });
  return target;
};
