
var Composable = function(name) {
  this.name = name;
  this.children = [];
};

Composable.prototype.addChild = function(child) {
  child.parent = this;
  this.children.push(child);
  return child;
};

Composable.prototype.getParent = function() {
  return this.parent;
};

module.exports = Composable;

