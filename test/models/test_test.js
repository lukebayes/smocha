'use strict';
const Promise = require('promise');
const Test = require('../../').Test;
const assert = require('assert');
const sinon = require('sinon');

const Status = Test.Status;

describe('Test', () => {
  let instance;

  beforeEach(() => {
    instance = new Test('abcd');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'abcd');
    assert(typeof instance.handler === 'function');
  });

  it('accepts handler', () => {
    const handler = function() {};
    instance = new Test('efgh', handler);
    assert.equal(instance.handler, handler);
  });

  it('accepts name with no handler', () => {
    instance = new Test('ijkl');
    assert.equal(instance.name, 'ijkl');
    assert.equal(instance.handler, Test.DEFAULT_HANDLER);
  });

  describe('run', () => {
    it('handles exceptions', () => {
      instance = new Test(function() {
        throw new Error('fake-error');
      });

      const data = instance.run();
      assert.equal(data.failure.message, 'fake-error');
    });

    describe('with beforeEach', () => {
      let parent, beforeEachHooks, afterEachHooks, beforeOne, beforeTwo,
        afterOne, afterTwo, testHook;

      beforeEach(() => {
        beforeOne = sinon.spy();
        beforeTwo = sinon.spy();
        afterOne = sinon.spy();
        afterTwo = sinon.spy();
        testHook = sinon.spy();

        beforeEachHooks = [beforeOne, beforeTwo];
        afterEachHooks = [afterOne, afterTwo];

        // Create a stub Suite so that we can verify the Test
        // interactions with the Suite interface.
        parent = {
          getBeforeEachHooks: function() {
            return beforeEachHooks;
          },
          getAfterEachHooks: function() {
            return afterEachHooks;
          },
          fullName: function() {
            return 'parent';
          }
        };

        instance = new Test('abcd', testHook);
        instance.parent = parent;
      });

      it('executes parent hook methods', () => {
        instance.run();
        assert.equal(beforeOne.callCount, 1);
        assert.equal(beforeTwo.callCount, 1);
        assert.equal(afterOne.callCount, 1);
        assert.equal(afterTwo.callCount, 1);
      });

      it('executes parent hook methods even when failing', () => {
        instance.handler = function() {
          throw new Error('fake-error');
        };
        instance.run();
        assert.equal(instance.data.failure.message, 'fake-error');
        assert.equal(beforeOne.callCount, 1);
        assert.equal(beforeTwo.callCount, 1);
        assert.equal(afterOne.callCount, 1);
        assert.equal(afterTwo.callCount, 1);
      });

      // Before we go much further, we need to create external iterators
      // for test execution and ensure we're supporting async tests,
      // promisified tests and regular test failures.
      it.skip('stops execution if beforeEach fails', () => {
        beforeEachHooks.unshift(function() {
          throw new Error('before-err');
        });

        assert.equal(beforeOne.callCount, 0);
        assert.equal(beforeTwo.callCount, 0);

        assert.equal(afterOne.callCount, 1);
        assert.equal(afterTwo.callCount, 1);
      });
    });
  });

  describe('async', () => {
    describe('promise', () => {
      it.skip('returns a promise', function() {
        // Create an initial, async succeeding promise.
        const promise = new Promise(function(fulfill, reject) {
          setTimeout(function() {
            fulfill();
          });
        });

        // Create a test method that returns this promise.
        instance = new Test(function() {
          return promise;
        });

        // Wrap the test promise with an assert to return to this test.
        const outer = promise.then(function() {
          assert.equal(instance.data.status, Status.SUCCEEDED);
        });

        // Run the async test.
        instance.run();

        // Ensure we're operating asynchronously.
        assert.equal(instance.data.status, Status.INITIALIZED);

        // Defer this test until all asynchronous work settles.
        return outer;
      });
    });
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

      assert.equal(instance.timeoutMs, 2000);
      instance.run();
      assert.equal(instance.timeoutMs, 2300);
    });
  });
});

