
class BaseReporter {
  constructor(writer) {
    this.writer = writer;
    this._results = [];
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

  getResults() {
    return this._results;
  }
}

module.exports = BaseReporter;
