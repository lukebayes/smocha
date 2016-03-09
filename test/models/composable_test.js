var Composable = require('../../').Composable,
    assert = require('assert');

describe('Composable', () => {
  var instance;

  beforeEach(() => {
    instance = new Composable('abcd');
  });

  it('is instantiable', () => {
    assert.equal(instance.name, 'abcd');
  });

  it('accepts children', () => {
    var child = new Composable();
    instance.addChild(child);

    assert.equal(instance.children.length, 1);
  });
});

