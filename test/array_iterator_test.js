'use strict';
const ArrayIterator = require('../').ArrayIterator;
const assert = require('assert');

describe('ArrayIterator', () => {
  it('loop over one child', () => {
    const itr = new ArrayIterator(['a']);

    assert(itr.hasNext());
    assert.equal('a', itr.next());

    assert(!itr.hasNext());
    assert.throws(() => {
      itr.next();
    }, /no more items/);
  });

  it('loop over three children', () => {
    const itr = new ArrayIterator(['a', 'b', 'c']);
    assert(itr.hasNext());
    assert.equal('a', itr.next());
    assert(itr.hasNext());
    assert.equal('b', itr.next());
    assert(itr.hasNext());
    assert.equal('c', itr.next());

    assert(!itr.hasNext());
    assert.throws(() => {
      itr.next();
    }, /no more items/);
  });

  it('return next item from peek', () => {
    const itr = new ArrayIterator(['a', 'b']);
    assert.equal('a', itr.peek());
    itr.next();
    assert.equal('b', itr.peek());
    itr.next();

    assert(!itr.hasNext());

    assert.throws(() => {
      itr.peek();
    }, /no more items/);
  });
});

