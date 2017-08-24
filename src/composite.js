
/**
 * Provide some basic infrastructure for entity composition.
 */
class Composite {
  constructor() {
    this.children = [];
    this.parent = null;
  }

  /**
   * Add a child to this entity and set that child's parent property.
   */
  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }
}

module.exports = Composite;
