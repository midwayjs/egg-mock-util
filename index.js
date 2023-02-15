const urllib = require('urllib');

exports.createMockApp = (app, properties = []) => {
  const readyFunction = [];
  const coreLogger = app.getLogger();
  const mockApp = {
    name: '',
    coreLogger,
    config: app.getConfig(),
    loader: {
      appInfo: {},
      getLoadUnits: () => [],
    },
    logger: coreLogger,
    loggers: {
      coreLogger,
    },
    getLogger() {
      return coreLogger;
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
    },
    runInBackground(asyncFn) {
      asyncFn().catch(err => coreLogger.error(err));
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
