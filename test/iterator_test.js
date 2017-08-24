const Iterator = require('../').Iterator;
const assert = require('chai').assert;

describe('Iterator', () => {
  it('is instantiable', () => {
    const instance = new Iterator([]);
    assert(instance);
  });

  it('hasNext returns false when empty', () => {
    const instance = new Iterator([]);
    assert.isFalse(instance.hasNext());
  });

  it('hasNext returns true when there is another', () => {
    const instance = new Iterator(['abcd']);
    assert(instance.hasNext());
  });

  it('iterates over falsyish values', () => {
    const instance = new Iterator([0, false, -1, '']);
    const results = [];
    while(instance.hasNext()) {
      results.push(instance.next());
    }
    assert.equal(results.length, 4);
    assert.equal(results[0], 0);
    assert.equal(results[1], false);
    assert.equal(results[2], -1);
    assert.equal(results[3], '');
  });

  it('peeks', () => {
    const instance = new Iterator(['abcd', 'efgh', 'ijkl']);
    assert.equal(instance.peek(), 'abcd');
    instance.next();
    assert.equal(instance.peek(), 'efgh');
    instance.next();
    assert.equal(instance.peek(), 'ijkl');
    instance.next();
    assert.isFalse(instance.hasNext());
  });
});
