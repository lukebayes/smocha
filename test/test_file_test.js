const TestFile = require('../').TestFile;
const assert = require('chai').assert;

describe('TestFile', () => {
  let instance;

  beforeEach(() => {
    instance = new TestFile('abcd', 'efgh');
  });

  it('accepts filename and content', () => {
    assert(instance);
    assert.equal(instance.filename, 'abcd');
    assert.equal(instance.content, 'efgh');
  });
});
