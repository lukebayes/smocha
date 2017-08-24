
class Emitter {
  constructor() {
    this._listeners = [];
  }

  on(eventName, handler) {
    const index = this._listeners.push({eventName: eventName, handler: handler}) - 1;

    return () => {
      this._listeners.splice(index, 1);
    };
  }

  emit(eventName, payload) {
    this._listeners.forEach((listener) => {
      if (listener.eventName === eventName) {
        listener.handler(payload);
      }
    });
  }

  remove(eventName, handler) {
    const index = this._listeners.findIndex((listener) => {
      return listener.eventName === eventName && listener.handler === handler;
    });

    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }
}

module.exports = Emitter;
