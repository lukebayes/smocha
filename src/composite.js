
class Composite {
  constructor() {
    this.children = [];
    this.parent = null;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  forEach(handler) {
    return this.children.forEach(handler);
  }
}

module.exports = Composite;
