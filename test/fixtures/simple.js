const Dependency = require('./dependency');
const assert = require('chai').assert;

describe('Simple', () => {

  it('receives __filename', () => {
    assert.equal(__filename, 'sdf');
  });

  it('passes', () => {
    const dep = new Dependency('one');
    assert.equal(dep.name, 'one');
  });
});
