const FakeStream = require('./fakes/fake_stream');
const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const executeHooks = require('../').executeHooks;
const nullFunction = require('../').nullFunction;
const sinon = require('sinon');
const suiteToHooks = require('../').suiteToHooks;

describe('executeHooks', () => {
  let one;
  let suite;
  let three;
  let two;

  beforeEach(() => {
    suite = new Suite('root suite');
  });

  function createTest(label, handler) {
    const test = new Hook(label, handler, Hook.Types.Test);
    suite.addTest(test);
    return test;
  };

  it('uses a nullFunction if no handler is present', () => {
    const test = new Hook('abcd');
    suite.addTest(test);
    return executeHooks(suiteToHooks(suite), nullFunction)
      .then((results) => {
        // No handler is the same as skipped
        assert(results[0].hook.isPending);
      });
  });

  describe('synchronous', () => {
    it('executes passing tests', () => {
      createTest('one', () => {
        assert(true);
      });

      createTest('two', () => {
        assert.equal(1, 1);
      });

      createTest('three', () => {
        assert.isTrue(true);
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
          .then((results) => {
            assert.equal(results.length, 3);
          });
    });

    it('handles synchronous failures', () => {
      createTest('one', () => {
        assert(false, 'one failed');
      });

      createTest('two', () => {
        assert.equal(1, 2);
      });

      createTest('three', () => {
        throw new Error('fake error');
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
        .then((results) => {
          assert.match(results[0].failure.message, /one failed/);
          assert.match(results[1].failure.message, /1 to equal 2/);
          assert.match(results[2].error.message, /fake error/);
        });
    });
  });

  describe('promisified', () => {
    it('executes passing tests', () => {
      createTest('one', () => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
        .then((results) => {
          assert.equal(results.length, 1);
          assert.isNull(results[0].failure);
          assert.isNull(results[0].error);
        });
    });

    it('handles errors', () => {
      createTest('one', () => {
        return new Promise((resolve, reject) => {
          reject(new Error('fake error'));
        });
      });
      createTest('two', () => {
        return new Promise((resolve, reject) => {
          reject(new Error('fake error two'));
        });
      });
      createTest('three', () => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
        .then((results) => {
          assert.match(results[0].error.message, /fake error/);
          assert.match(results[1].error.message, /fake error two/);
          assert.isNull(results[2].error);
          assert.isNull(results[2].failure);
        });
    });

    it('handles failures', () => {
      createTest('one', () => {
        return new Promise((resolve, reject) => {
          assert(false, 'fake failure');
        });
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
        .then((results) => {
          assert.match(results[0].failure.message, /fake failure/);
        });
    });

    it('handles async errors', () => {
      createTest('one', (next) => {
        setTimeout(() => {
          next(new Error('fake error'));
        });
      });

      return executeHooks(suiteToHooks(suite), nullFunction)
        .then((results) => {
          assert.match(results[0].error.message, /fake error/);
        });
    });
  });
});
