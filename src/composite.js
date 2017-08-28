const Emitter = require('./emitter');
/**
 * Provide some basic infrastructure for entity composition.
 */
class Composite extends Emitter {
  constructor() {
    super();
    this.children = [];
    this.parent = null;
  }

  /**
   * Emit an event that bubbles up the tree to root, unless it is cancelled.
   */
  bubble(eventName, payload) {
    const isCancelled = this.emit(eventName, payload);
    if (!isCancelled && this.parent) {
      this.parent.bubble(eventName, payload);
    }
  }

  /**
   * Add a child to this entity and set that child's parent property.
   */
  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Get the root node in the tree.
   */
  getRoot() {
    let current = this;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  /**
   * Enumerate each child.
   */
  forEach(handler, index, array) {
    return this.children.forEach(handler, index, array);
  }
}

module.exports = Composite;
