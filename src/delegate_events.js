const events = require('./events');


function delegateEvents(emitter, receiver) {
  function delegateEvent(eventName) {
    emitter.on(eventName, function(payload) {
      receiver.emit(eventName, payload);
    });
  };

  Object.keys(events).forEach((key) => {
    delegateEvent(events[key]);
  });
};

module.exports = delegateEvents;

