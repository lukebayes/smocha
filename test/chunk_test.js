const assert = require('chai').assert;
const chunk = require('../').chunk;

describe('chunk', () => {
  it('returns empty array', () => {
    const chunks = chunk([]);
    assert.equal(chunks.length, 0);
  });

  it('returns a single item in a new array', () => {
    const chunks = chunk(['abcd']);
    assert.deepEqual(chunks[0], ['abcd']);
  });

  it('spreads two entries across two cores', () => {
    const chunks = chunk(['abcd', 'efgh'], 2);
    assert.deepEqual(chunks, [['abcd'], ['efgh']]);
  });

  it('spreads two entries across first of many cores', () => {
    const chunks = chunk(['abcd', 'efgh'], 20);
    assert.deepEqual(chunks, [['abcd'], ['efgh']]);
  });

  it('spreads three entries across two cores', () => {
    const chunks = chunk(['abcd', 'efgh', 'ijkl'], 2);
    assert.deepEqual(chunks, [['abcd', 'ijkl'], ['efgh']]);
  });

  it('spreads ten entries across two cores', () => {
    const chunks = chunk(['abcd', 'efgh', 'ijkl', 'mnop', 'qrst', 'uvwx', 'yzab', 'cdef', 'ghij', 'klmn'], 2);
    assert.deepEqual(chunks, [['abcd', 'ijkl', 'qrst', 'yzab', 'ghij'], ['efgh', 'mnop', 'uvwx', 'cdef', 'klmn']]);
  });
});
