var Test = require('../../').Test,
    assert = require('assert');

describe('Test', () => {
  var instance;

  beforeEach(() => {
    instance = new Test('abcd');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'abcd');
    assert(typeof instance.handler === 'function');
  });

  it('accepts handler', () => {
    var handler = function() {};
    instance = new Test('efgh', handler);
    assert.equal(instance.handler, handler);
  });

  it('accepts name with no handler', () => {
    instance = new Test('ijkl');
    assert.equal(instance.name, 'ijkl');
    assert.equal(instance.handler, Test.DEFAULT_HANDLER);
  });

  describe('context', () => {

    it('executes handler on test context', () => {
      instance = new Test('abcd', function() {
        this.foo = 'efgh';
      });

      instance.context.foo = 'abcd';
      assert.equal(instance.context.foo, 'abcd');

      instance.run();
      assert.equal(instance.context.foo, 'efgh');
    });

    it('provides timeout method', () => {
      instance = new Test(function() {
        this.timeout(2300);
      });

      assert.equal(instance.timeout, 2000);
      instance.run();
      assert.equal(instance.timeout, 2300);
    });
  });
});

