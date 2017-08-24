const BaseReporter = require('./base_reporter');
const Composite = require('./composite');
const Hook = require('./hook');
const NodeLoader = require('./node_loader');
const Suite = require('./suite');
const TestFile = require('./test_file');

const nullFunction = function() {};

class BddInterface {
  constructor() {
    this._currentSuite = null;
  }

  describe(label, body) {
    const parent = this._currentSuite;
    const child = new Suite(label, body);

    if (parent) {
      parent.addChild(child);
    }

    this._currentSuite = child;

    body();

    if (parent) {
      this._currentSuite = parent;
    }

  }

  it(label, body, onAsync) {
    this._currentSuite.tests.push(new Hook(label, body, onAsync));
  }

  beforeEach(body, onAsync) {
    this._currentSuite.beforeEaches.push(new Hook('beforeEach', body, onAsync));
  }

  afterEach(body, onAsync) {
    this._currentSuite.afterEaches.push(new Hook('afterEach', body, onAsync));
  }

  before(body, onAsync) {
    this._currentSuite.befores.push(new Hook('before', body, onAsync));
  }

  after(body, onAsync) {
    this._currentSuite.afters.push(new Hook('after', body, onAsync));
  }

  execute() {
    this._currentSuite.execute();
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


/**
 * Test loader for tests declared in external files.
 *
 * Only works when executed from a node process that has access to the
 * provided files.
 */
class FileLoader {
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
    return testInterface;
  }

  _createLoaders() {
    return this.files.map((file) => {
      return new NodeLoader(file, this);
    });
  }
}

class TestRunner {
  constructor(loaders) {
    this._loaders = loaders;
  }

  run() {
    // TODO(lbayes): Introduce support for async hooks!
    this._loaders.forEach((loader) => {
      loader.execute();
    });
  }
}

module.exports = {
  FileLoader,
  TestRunner
}

