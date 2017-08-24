
/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(loaders) {
    this._loaders = loaders;
  }

  run() {
    // TODO(lbayes): This method needs to be asynchronous
    return this._loaders.map((loader) => {
      return loader.execute();
    });
  }
}

module.exports = TestRunner;

