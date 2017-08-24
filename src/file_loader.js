const {NodeVM} = require('vm2');
const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const NodeLoader = require('./node_loader');

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

module.exports = FileLoader;
