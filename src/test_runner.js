
/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(loaders) {
    this._loaders = loaders;
  }

  run() {
    return this._loaders.map((loader) => {
      return loader.execute();
    })
  }
}

module.exports = TestRunner;

