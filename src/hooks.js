const Hook = require('./hook');
const events = require('./events');

class Test extends Hook {
  execute() {
    try {
      this.emit(events.TEST_BEGIN, this);
      const maybePromise = super.execute();

      if (maybePromise) {
        return maybePromise
          .then(() => {
            this.emit(events.TEST_PASS, this);
          })
          .catch(() => {
            this.emit(events.TEST_FAIL, this);
          });
      }
    } catch (err) {
      this.emit(events.TEST_FAIL, this);
    }
  }
}

module.exports = {
  Test,
};
