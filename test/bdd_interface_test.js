const BddInterface = require('../').BddInterface;
const assert = require('chai').assert;
const nullFunction = require('../').nullFunction;
const sinon = require('sinon');

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
    root.start();
    assert.equal(root.suites.length, 2);
  });

  it('parents child tests properly', () => {
    sandbox.describe('abcd', () => {
      sandbox.it('one', nullFunction);
      sandbox.it('two', nullFunction);
      sandbox.it('three', nullFunction);
    });

    const root = instance.getRoot();
    root.start();
    console.log(root.tests);
    assert.equal(root.children.length, 3);
  });

  describe.skip('it.only', () => {
    it('provides it.only', () => {
      const handler = sinon.spy();
      sandbox.describe('abcd');

      sandbox.it('mnop', handler);
      sandbox.it.only('efgh', handler);
      sandbox.it('ijkl', handler);

      const root = instance.getRoot();
      assert.equal(root.tests.length, 1);
    });
  });
});

