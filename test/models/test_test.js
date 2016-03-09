var Test = require('../../').Test,
    assert = require('assert');

describe('Test', () => {
  var instance;

  it('is instantiable', () => {
    instance = new Test('abcd');
    assert(instance);
    assert.equal(instance.name, 'abcd');
  });

  it('is composable', () => {
    var child = new Test();
    instance.addChild(child);
    assert.equal(instance.children.length, 1);
  });
});

