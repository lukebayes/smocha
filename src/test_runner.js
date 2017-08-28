
/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(loaders) {
    this._loaders = loaders;
  }

  /**
   * Load all loaders in parallel and wait for all files to be loaded and
   * evaluated.
   */
  load() {
    return Promise.all(this._loaders.map((loader) => {
      return loader.load();
    }));
  }
}

module.exports = TestRunner;

