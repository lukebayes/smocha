const Composite = require('../').Composite;
const CompositeIterator = require('../').CompositeIterator;
const assert = require('chai').assert;

class Node extends Composite {
  constructor(label) {
    super();
    this.label = label;
  }
}

describe('CompositeIterator', () => {
  let instance;
  let one;
  let two;
  let three;
  let four;
  let five;
  let six;

  beforeEach(() => {
    one = new Node('one');
    two = new Node('two');
    three = new Node('three');
    four = new Node('four');
    five = new Node('five');
    six = new Node('six');

    one.addChild(two);
    one.addChild(three);
    two.addChild(four);
    two.addChild(five);
    five.addChild(six);
  });

  it('throws on empty set', () => {
    instance = new CompositeIterator();
    assert.throws(() => {
      instance.next();
    }, /is empty/);
  });

  it('preorder tree traversal', () => {
    instance = new CompositeIterator(one);
    assert(instance);
    assert(instance.hasNext());
    assert.equal(instance.next(), one);
    assert(instance.hasNext());
    assert.equal(instance.next(), two);
    assert(instance.hasNext());
    assert.equal(instance.next(), four);
    assert(instance.hasNext());
    assert.equal(instance.next().id, five.id);
    assert(instance.hasNext());
    assert.equal(instance.next(), six);
    assert(instance.hasNext());
    assert.equal(instance.next(), three);

    assert.isFalse(instance.hasNext());
  });
});
