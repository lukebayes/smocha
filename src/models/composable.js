
var Composable = function(name) {
  this.name = name;
  this.children = [];
};

Composable.prototype.addChild = function(child) {
  child.parent = this;
  this.children.push(child);
  return child;
};

module.exports = Composable;

