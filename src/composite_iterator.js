const Iterator = require('./iterator');
/**
 * This is an iterator that enables preorder tree traversal with asynchronous
 * pauses.
 */
class CompositeIterator {
  constructor(root) {
    this._stack = root ? [new Iterator([root])] : [];
  }

  _current() {
    return this._stack[this._stack.length - 1];
  }

  hasNext() {
    return this._stack.length > 0;
  }

  next() {
    if (!this.hasNext()) {
      throw new Error('Cannot get next item, collection is empty.');
    }

    const current = this._current();
    if (current.hasNext()) {
      const result = current.next();
      if (result.hasChildren()) {
        this._stack.push(new Iterator(result.children));
      }
      return result;
    } else {
      console.log('popping!', this._stack.length);
      this._stack.pop();
      return this.next();
    }
  }

  peek() {
    throw new Error('Not implemented');
  }
}

module.exports = CompositeIterator;
