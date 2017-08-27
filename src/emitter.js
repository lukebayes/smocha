
class Emitter {
  constructor() {
    this._listeners = [];
  }

  on(eventName, handler) {
    if (typeof eventName === 'undefined') {
      throw new Error('Emitter.on called with empty event name');
    }

    const index = this._listeners.push({eventName: eventName, handler: handler}) - 1;

    return () => {
      this._listeners.splice(index, 1);
    };
  }

  emit(eventName, payload) {
    return this._listeners.some((listener) => {
      if (listener.eventName === eventName) {
        return listener.handler(payload);
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
