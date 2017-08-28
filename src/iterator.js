
/**
 * External iterator so that we can execute asynchronous test hooks and pick up
 * execution where we left off.
 */
class Iterator {

  constructor(iterable) {
    this._index = -1;
    this._iterable = iterable;
  }

  hasNext() {
    return this._iterable.length - 1 >= this._index + 1;
  }

  next() {
    return this._iterable[++this._index];
  }

  peek() {
    return this._iterable[this._index + 1];
  }

  reset() {
    this._index = -1;
  }
}

module.exports = Iterator;
