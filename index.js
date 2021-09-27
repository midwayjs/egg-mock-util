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
    const descriptors = Object.keys(source).reduce((descriptors, key) => {
      if (Object.getOwnPropertyDescriptor(target, key)) {
        // delete target[key];
      }
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    // by default, Object.assign copies enumerable Symbols too
    /* istanbul ignore next */
    Object.getOwnPropertySymbols(source).forEach(sym => {
      const descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });

    // 在 copy 属性时不执行 get/set 方法
    for (const name in descriptors) {
      if (Object.getOwnPropertyDescriptor(target, name)) {
        console.debug('Property: "%s" already exists, will be override', name);
      }
      Object.defineProperty(target, name, descriptors[name]);
    }
  });
  return target;
};
