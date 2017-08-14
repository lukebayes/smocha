

const fs = require('fs');

/**
 * Loads the file and returns an executor that is bound to the provided
 * definitions.
 */
class NodeLoader {
  constructor(file, runner) {
    this.file = file;
    this.runner = runner;
    this.hooks = [];
  }

  load() {
    console.log('Nodeloader loading file', this.file);
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          console.error("FAIL:", err);
          reject(err);
        } else {
          console.error("SUCCESS:", data.toString());
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

class Composite {
  constructor() {
    this.children = [];
  }

  forEach(handler) {
    return this.children.forEach(handler);
  }
}

class Suite extends Composite {
  constructor(label, handler, onAsync) {
    this.label = label;
    this.handler = handler;
    this.onAsync = onAsync;
  }
}

class Hook extends Composite {
  constructor(label, handler, onAsync) {
    this.label = label;
    this.handler = handler;
    this.onAsync = onAsync;
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

class BddInterface {
  constructor(hooks) {
    this._hooks = hooks;
  }

  describe(name, body) {
    console.log('DESCRIBE:', name);
    console.log('body:', body);
  }

  it(name, body, handler) {
  }

  beforeEach(name, body, handler) {
  }

  afterEach(name, body, handler) {
  }

  before(name, body, handler) {
  }

  after(name, body, handler) {
  }

  getHooks() {
    console.log('returning hooks:', this._hooks);
    return this._hooks;
  }

  toSandbox() {
    return {
      after: this.after,
      afterEach: this.afterEach,
      before: this.before,
      beforeEach: this.beforeEach,
      describe: this.describe,
      it: this.it,
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
    console.log('loading: ', this.files);
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
    return Promise.all(testFiles.map((file) => {
      return this._processTestFile(file);
    }));
  }

  _processTestFile(testFile) {
    console.log('processing:', testFile);
    console.log('aye');

    const testInterface = new BddInterface();

    const vm = new NodeVM({
      timeout: 1000,
      require: {
        external: true
      },
      sandbox: testInterface.toSandbox(),
    });

    vm.run(testFile.content, testFile.filename);

    return testInterface.getHooks();
    console.log('FINISHED');
  }

  _createLoaders() {
    return this.files.map((file) => {
      return new NodeLoader(file, this);
    });
  }
}

module.exports = TestRunner;

