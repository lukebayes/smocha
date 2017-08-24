
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

module.exports = BaseReporter;
