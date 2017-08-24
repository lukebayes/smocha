const Composite = require('../').Composite;
const assert = require('chai').assert;

describe('Composite', () => {
  let root;
  let one;
  let two;
  let three;
  let four;
  let five;

  beforeEach(() => {
    root = new Composite();
    one = new Composite();
    two = new Composite();
    three = new Composite();
    four = new Composite();
    five = new Composite();

    root.addChild(one);

    one.addChild(two);
    one.addChild(four);
    one.addChild(five);

    two.addChild(three);

  });

  it('populates children collection', () => {
    // Populates children collection.
    assert.equal(root.children.length, 1);
    assert.equal(one.children.length, 3);
    assert.equal(two.children.length, 1);
    assert.equal(three.children.length, 0);
    assert.equal(four.children.length, 0);
  });

  it('assigns parent property to child', () => {
    assert.equal(one.parent, root);
    assert.equal(two.parent, one);
    assert.equal(three.parent, two);
    assert.equal(four.parent, one);
    assert.equal(five.parent, one);
  });

  it('stores a reference to each child', () => {
    assert.equal(root.children[0], one);
    assert.equal(one.children[0], two);
    assert.equal(one.children[1], four);
    assert.equal(one.children[2], five);
  });

  it('iterates over children', () => {
    let looped = false;
    root.forEach((child) => {
      assert.equal(child, one);
      looped = true;
    });
    assert(looped);
  });
});
