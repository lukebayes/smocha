const assert = require('chai').assert;
const filesToBatches = require('../').filesToBatches;

describe('filesToBatches', () => {
  it('returns empty array', () => {
    const chunks = filesToBatches([]);
    assert.equal(chunks.length, 0);
  });

  it('returns a single item in a new array', () => {
    const chunks = filesToBatches(['abcd']);
    assert.deepEqual(chunks[0], ['abcd']);
  });

  it('spreads two entries across two cores', () => {
    const chunks = filesToBatches(['abcd', 'efgh'], 2);
    assert.deepEqual(chunks, [['abcd'], ['efgh']]);
  });

  it('spreads two entries across first of many cores', () => {
    const chunks = filesToBatches(['abcd', 'efgh'], 20);
    assert.deepEqual(chunks, [['abcd'], ['efgh']]);
  });

  it('spreads three entries across two cores', () => {
    const chunks = filesToBatches(['abcd', 'efgh', 'ijkl'], 2);
    assert.deepEqual(chunks, [['abcd', 'ijkl'], ['efgh']]);
  });

  it('spreads ten entries across two cores', () => {
    const chunks = filesToBatches(['abcd', 'efgh', 'ijkl', 'mnop', 'qrst', 'uvwx', 'yzab', 'cdef', 'ghij', 'klmn'], 2);
    assert.deepEqual(chunks, [['abcd', 'ijkl', 'qrst', 'yzab', 'ghij'], ['efgh', 'mnop', 'uvwx', 'cdef', 'klmn']]);
  });
});
