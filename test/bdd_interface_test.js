const BddInterface = require('../').BddInterface;
const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const executeHooks = require('../').executeHooks;
const nullFunction = require('../').nullFunction;
const sinon = require('sinon');
const suiteToHooks = require('../').suiteToHooks;

describe('BddInterface', () => {
  let instance;
  let sandbox;

  beforeEach(() => {
    instance = new BddInterface();
    sandbox = instance.toSandbox();
  });

  it('has empty root suite by default', () => {
    assert(instance.getRoot());
  });

  it('parents sibling suites appropriately', () => {
    sandbox.describe('abcd');
    sandbox.describe('efgh');

    const root = instance.getRoot();
    assert.equal(root.suites.length, 2);
  });

  it('parents child tests properly', () => {
    sandbox.describe('abcd', () => {
      sandbox.it('one', nullFunction);
      sandbox.it('two', nullFunction);
      sandbox.it('three', nullFunction);
    });

    const abcd = instance.getRoot().suites[0];
    assert.equal(abcd.tests.length, 3);
  });

  it('applies suite changes to timeout', () => {
    sandbox.describe('root', function() {
      this.timeout(20);

      sandbox.it('test1', function() {
        assert.equal(this.timeout(), 20);
      });
    });

    return executeHooks(suiteToHooks(instance.getRoot()), nullFunction)
      .then((results) => {
        assert.equal(results[0].timeout, 20);
      });
  });

  // TODO(lbayes): Finish support for .only blocks
  /*
  describe('it.only', () => {
    it('provides it.only', () => {
      sandbox.describe('abcd');

      sandbox.it('mnop', nullFunction);
      sandbox.it.only('efgh', nullFunction);
      sandbox.it('ijkl', nullFunction);

      const abcd = instance.getRoot().suites[0];
      assert.equal(abcd.tests.length, 1);
    });
  });
  */
});

