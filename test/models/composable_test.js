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

  describe('addChild', () => {

    it('accepts children', () => {
      var child = new Composable();
      instance.addChild(child);

      assert.equal(instance.children.length, 1);
    });

    it('returns the child', () => {
      var child = new Composable();
      assert.equal(instance.addChild(child), child);
    });
  });

  describe('getParent', () => {

    it('returns undefined if root', () => {
      assert(instance.getParent() === undefined);
    });

    it('returns parents at each level', () => {
      var one = new Composable(),
          two = new Composable(),
          three = new Composable();

      instance.addChild(one);
      one.addChild(two);
      two.addChild(three);

      assert.equal(three.getParent(), two);
      assert.equal(two.getParent(), one);
      assert.equal(one.getParent(), instance);
    });
  });
});

