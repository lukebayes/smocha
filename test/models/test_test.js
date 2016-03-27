'use strict';
const Promise = require('promise');
const Test = require('../../').Test;
const TestRunner = require('../../').TestRunner;
const assert = require('assert');
const sinon = require('sinon');

const Status = Test.Status;

describe('Test', () => {
  let test;

  describe('configuration', () => {
    beforeEach(() => {
      test = new Test('abcd');
    });

    it('is instantiable', () => {
      assert(test);
      assert.equal(test.name, 'abcd');
      assert(typeof test.handler === 'function');
    });

    it('accepts handler', () => {
      const handler = function() {};
      test = new Test('efgh', handler);
      assert.equal(test.handler, handler);
    });

    it('accepts name with no handler', () => {
      test = new Test('ijkl');
      assert.equal(test.name, 'ijkl');
      assert.equal(test.handler, Test.DEFAULT_HANDLER);
    });
  });

  describe('run', () => {
    beforeEach(() => {
      test = new Test('abcd');
    });

    it('handles exceptions', () => {
      test = new Test(function() {
        throw new Error('fake-error');
      });

      TestRunner.create(test).run();
      assert(test.data.failure, 'Expected error object');
      assert.equal(test.data.failure.message, 'fake-error');
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

        test = new Test('abcd', testHook);
        test.parent = parent;
      });

      it('executes parent hook methods', () => {
        TestRunner.create(test).run();
        assert.equal(beforeOne.callCount, 1);
        assert.equal(beforeTwo.callCount, 1);
        assert.equal(afterOne.callCount, 1);
        assert.equal(afterTwo.callCount, 1);
      });

      it('executes parent hook methods even when failing', () => {
        test.handler = function() {
          throw new Error('fake-error');
        };
        TestRunner.create(test).run();
        assert.equal(test.data.failure.message, 'fake-error');
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
    beforeEach(() => {
      test = new Test('abcd');
    });

    describe('promise', () => {
      it.skip('returns a promise', function() {
        // Create an initial, async succeeding promise.
        const promise = new Promise(function(fulfill, reject) {
          setTimeout(function() {
            fulfill();
          });
        });

        // Create a test method that returns this promise.
        test = new Test(function() {
          return promise;
        });

        // Wrap the test promise with an assert to return to this test.
        const outer = promise.then(function() {
          assert.equal(test.data.status, Status.SUCCEEDED);
        });

        // Run the async test.
        TestRunner.create(test).run();

        // Ensure we're operating asynchronously.
        assert.equal(test.data.status, Status.INITIALIZED);

        // Defer this test until all asynchronous work settles.
        return outer;
      });
    });
  });

  describe('context', () => {
    it('executes handler against test context', () => {
      test = new Test('abcd', function() {
        this.foo = 'efgh';
      });
      test.context.foo = 'abcd';
      assert.equal(test.context.foo, 'abcd');

      TestRunner.create(test).run();
      assert.equal(test.context.foo, 'efgh');
    });

    it('provides timeout method', () => {
      test = new Test(function() {
        this.timeout(2300);
      });

      assert.equal(test.timeoutMs, 2000);
      TestRunner.create(test).run();
      assert.equal(test.timeoutMs, 2300);
    });
  });
});

