const events = require('../events');
const Hook = require('../hook');

class Test extends Hook {

  execute() {
    this.emit(events.TEST_BEGIN, this);
    const result = super.execute();
    if (result && typeof result.then === 'function') {
      return result
        .then(() => {
          this.emit(events.TEST_PASS, this);
        })
        .catch((err) => {
          this.emit(evnts.TEST_FAIL, this);
        });
    }
  }
}

module.exports = Test;
