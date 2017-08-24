
class Composite {
  constructor() {
    this.children = [];
    this.parent = null;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  forEach(handler, index, array) {
    return this.children.forEach(handler, index, array);
  }
}

module.exports = Composite;
