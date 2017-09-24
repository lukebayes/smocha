/**
 * Provide some basic infrastructure for entity composition.
 */
class Composite {
  constructor() {
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

  hasChildren() {
    return this.children.length > 0;
  }

  /**
   * Add a child to this entity and set that child's parent property.
   */
  addChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  /**
   * Remove the child by reference.
   */
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1 && child.parent === this) {
      child.parent = null;
      this.children.splice(index, 1);
      return child;
    }
    return null;
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
