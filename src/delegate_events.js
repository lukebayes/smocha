const events = require('./events');


function delegateEvents(emitter, reporter) {

  function delegateEvent(eventName, callback) {
    emitter.on(eventName, callback.bind(reporter));
  };

  delegateEvent(events.START, reporter.onStart);
  delegateEvent(events.END, reporter.onEnd);
  delegateEvent(events.TEST_PASS, reporter.onPass);
  delegateEvent(events.TEST_FAIL, reporter.onFail);
};

module.exports = delegateEvents;

