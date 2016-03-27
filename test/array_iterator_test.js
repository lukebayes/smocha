var ArrayIterator = require('../').ArrayIterator;
var assert = require('assert');

describe('ArrayIterator', function() {

  it('loop over one child', function() {
    var itr = new ArrayIterator(['a']);

    assert(itr.hasNext());
    assert.equal('a', itr.next());

    assert(!itr.hasNext());
    assert.throws(function() {
      itr.next();
    }, /no more items/);
  });

  it('loop over three children', function() {
    var itr = new ArrayIterator(['a', 'b', 'c']);
    assert(itr.hasNext());
    assert.equal('a', itr.next());
    assert(itr.hasNext());
    assert.equal('b', itr.next());
    assert(itr.hasNext());
    assert.equal('c', itr.next());

    assert(!itr.hasNext());
    assert.throws(function() {
      itr.next();
    }, /no more items/);
  });

  it('return next item from peek', function() {
    var itr = new ArrayIterator(['a', 'b']);
    assert.equal('a', itr.peek());
    itr.next();
    assert.equal('b', itr.peek());
    itr.next();

    assert(!itr.hasNext());

    assert.throws(function() {
      itr.peek();
    }, /no more items/);
  });
});

