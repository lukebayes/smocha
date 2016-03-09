
var Composable = function(name) {
  this.name = name;
  this.children = [];
};

Composable.prototype.addChild = function(child) {
  this.children.push(child);
};

module.exports = Composable;

