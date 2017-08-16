

const fs = require('fs');

/**
 * Loads the file and returns an executor that is bound to the provided
 * definitions.
 */
class NodeLoader {
  constructor(file, runner) {
    this.file = file;
    this.runner = runner;
  }

  load() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(new TestFile(this.file, data.toString()));
        }
      });
    });
  }
}

class TestFile {
  constructor(filename, content) {
    this.filename = filename;
    this.content = content;
  }
}

class BaseReporter {
  constructor(writer) {
    this.writer = writer;
  }

  onStart(test) {
  }

  onBeforeEach(test) {
  }

  onSuite(suite) {
  }

  onTest(suite) {
  }

  onPass(test) {
  }

  onFail(test) {
  }

  onPending(test) {
  }

  onAfterEach(test) {
  }

  onAfterSuite(suite) {
  }

  onEnd(test) {
  }
}

class Composite {
  constructor() {
    this.children = [];
  }

  forEach(handler) {
    return this.children.forEach(handler);
  }
}

class Hook extends Composite {
  constructor(label, handler, onAsync) {
    super();
    this.label = label;
    this.handler = handler;
    this.onAsync = onAsync;
  }
}

class Suite extends Hook {
  constructor(label, handler) {
    super(label, handler);
    this.befores = [];
    this.afters = [];
    this.beforeEaches = [];
    this.afterEaches = [];
    this.tests = [];
  }
}

const nullFunction = function() {};

class BddInterface {
  constructor() {
    this.suites = [new Suite()];
  }

  get _currentSuite() {
    return this.suites[this.suites.length - 1];
  }

  describe(label, body) {
    this._currentSuite.children.push(new Suite(label, body));
    body();
    if (this.suites.length > 1) {
      this.suites.pop();
    }
  }

  it(label, body, onAsync) {
    this._currentSuite.tests.push(new Hook(label, body, onAsync));
  }

  beforeEach(label, body, onAsync) {
    this._currentSuite.beforeEaches.push(new Hook(label, body, onAsync));
  }

  afterEach(label, body, onAsync) {
    this._currentSuite.afterEaches.push(new Hook(label, body, onAsync));
  }

  before(label, body, onAsync) {
    this._currentSuite.befores.push(new Hook(label, body, onAsync));
  }

  after(label, body, onAsync) {
    this._currentSuite.afters.push(new Hook(label, body, onAsync));
  }

  toHooks() {
    return [];
  }

  toSandbox() {
    return {
      after: this.after.bind(this),
      afterEach: this.afterEach.bind(this),
      before: this.before.bind(this),
      beforeEach: this.beforeEach.bind(this),
      describe: this.describe.bind(this),
      it: this.it.bind(this),
    }
  }
}

const {NodeVM} = require('vm2');
const mod = require('module');
const path = require('path');


class TestRunner {
  constructor(files, opt_options) {
    this.files = Array.isArray(files) ? files : [files];
    this.options = opt_options || {};
    this.reporter = new BaseReporter();
  }

  load() {
    const loaders = this._createLoaders();
    return this._loadLoaders(loaders)
      .then((testFiles) => {
        return this._processTestFiles(testFiles);
      });
  }

  _loadLoaders(loaders) {
    return Promise.all(loaders.map((loader) => {
      return loader.load();
    }));
  }

  _processTestFiles(testFiles) {
    return testFiles.map((file) => {
      return this._processTestFile(file);
    });
  }

  _getInterface() {
    return new BddInterface();
  }

  _runFile(testFile, testInterface) {
    // TODO(lbayes): Select the appropriate runtime environment
    // depending on whether we're in a browser, on a device or
    // running in Nodejs.
    const vm = new NodeVM({
      timeout: 1000,
      require: {
        external: true
      },
      sandbox: testInterface.toSandbox()
    });

    vm.run(testFile.content, testFile.filename);
  }

  _processTestFile(testFile) {
    const testInterface = this._getInterface();
    this._runFile(testFile, testInterface);
    return testInterface.toHooks();
    console.log('FINISHED');
  }

  _createLoaders() {
    return this.files.map((file) => {
      return new NodeLoader(file, this);
    });
  }
}

module.exports = TestRunner;

