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

  bubble(eventName, payload) {
    this.emit(eventName, payload);
    if (this.parent) {
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
