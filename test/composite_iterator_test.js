const Composite = require('../').Composite;
const CompositeIterator = require('../').CompositeIterator;
const assert = require('chai').assert;

describe('CompositeIterator', () => {
  let instance;
  let one;
  let two;
  let three;
  let four;
  let five;
  let six;

  beforeEach(() => {
    one = new Composite('one');
    two = new Composite('two');
    three = new Composite('three');
    four = new Composite('four');
    five = new Composite('five');
    six = new Composite('six');

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
    assert.equal(instance.peek(), one);
    assert.equal(instance.next(), one);
    assert(instance.hasNext());
    assert.equal(instance.peek(), two);
    assert.equal(instance.next(), two);
    assert(instance.hasNext());
    assert.equal(instance.peek(), four);
    assert.equal(instance.next(), four);
    assert(instance.hasNext());
    assert.equal(instance.peek(), five);
    assert.equal(instance.next(), five);
    assert(instance.hasNext());
    assert.equal(instance.peek(), six);
    assert.equal(instance.next(), six);
    assert(instance.hasNext());
    assert.equal(instance.peek(), three);
    assert.equal(instance.next(), three);

    assert.isFalse(instance.hasNext());
  });
});
