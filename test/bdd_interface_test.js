const BddInterface = require('../').BddInterface;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('BddInterface', () => {
  let instance;

  beforeEach(() => {
    instance = new BddInterface();
  });

  describe('it.only', () => {
    it.skip('provides it.only', () => {
      const handler = sinon.spy();
      instance.describe('abcd');

      const sandbox = instance.toSandbox();

      sandbox.it('mnop', handler);
      sandbox.it.only('efgh', handler);
      sandbox.it('ijkl', handler);

      const rootSuite = instance.getRoot();

      assert.equal(rootSuite.tests.length, 1);
    });
  });
});

