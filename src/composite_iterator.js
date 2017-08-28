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

    const node = this._current().next();

    if (node.hasChildren()) {
      // Push onto the iterator stack.
      this._stack.push(new Iterator(node.children));
    } else {
      // Pop off of the iterator stack until we reach root or find a node
      // that has children.
      while (this._current() && !this._current().hasNext()) {
        this._stack.pop();
      }
    }

    return node;
  }

  peek() {
    if (this.hasNext()) {
      return this._current().peek();
    }
  }
}

module.exports = CompositeIterator;
