
/**
 * Thin, simple and fast implementation of the Observer pattern.
 *
 * This implementation differs from the native node and others in that the
 * subscribe method returns an unsubscribe function that can be used to
 * remove the enrolled subscription.
 */
class Emitter {
  constructor() {
    this._listeners = [];
  }

  /**
   * Add a listener to the provided event name with a handler.
   */
  on(eventName, handler) {
    if (typeof eventName === 'undefined') {
      throw new Error('Emitter.on called with empty event name');
    }

    const index = this._listeners.push({eventName: eventName, handler: handler}) - 1;

    return () => {
      this._listeners.splice(index, 1);
    };
  }

  /**
   * Emit the event and call each handler with the provided payload.
   */
  emit(eventName, payload) {
    return this._listeners.some((listener) => {
      if (listener.eventName === eventName) {
        return listener.handler(payload);
      }
    });
  }

  /**
   * Remove the listener that was registered with the provided eventName and
   * handler reference.
   *
   * NOTE: If you bind or otherwise delegate your handlers, you'll need to
   * use the actual function that was originally sent to the emitter (e.g.,
   * the result of calling .bind()).
   */
  remove(eventName, handler) {
    const index = this._listeners.findIndex((listener) => {
      return listener.eventName === eventName && listener.handler === handler;
    });

    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Return true if the emitter includes one or more listeners for the provided
   * eventName.
   */
  hasListenerFor(eventName) {
    return this._listeners.some((listener) => {
      return listener.eventName === eventName;
    });
  }
}

module.exports = Emitter;
