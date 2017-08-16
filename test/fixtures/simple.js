const Dependency = require('./dependency');
const assert = require('chai').assert;

describe('Simple', () => {
  let value;
  let other;

  before(() => {
    other = 'ijkl';
  });

  after(() => {
    other = null;
  });

  beforeEach(() => {
    value = 'abcd';
  });

  afterEach(() => {
  });

  it('receives __filename', () => {
    assert.equal(__filename, 'sdf');
  });

  it('passes', () => {
    const dep = new Dependency('one');
    assert.equal(dep.name, 'one');
  });

  describe('nested', () => {
    beforeEach(() => {
      value = 'efgh';
    });

    it('finds before value', () => {
      assert.equal(other, 'ijkl');
    });

    it('sets value in beforeEach', () => {
      assert.equal(value, 'efgh');
    });

    it('fails', () => {
      assert(false);
    });
  });

  it('is below', () => {
    assert(value, 'abcd');
  });
});

describe('outside', () => {
  it('is really outside', () => {
    assert(true);
  });
});
