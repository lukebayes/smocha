const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const sinon = require('sinon');
const executeHooks = require('../').executeHooks;

describe('executeHooks', () => {
  let onProgress;
  let one;
  let suite;
  let three;
  let two;

  beforeEach(() => {
    suite = new Suite('root suite');
    onProgress = sinon.spy();
  });

  function createTest(label, handler) {
    const test = new Hook(label, handler);
    suite.addTest(test);
    return test;
  };

  function getProgressArg(index) {
    return onProgress.getCall(index).args[0];
  }

  it.only('receives the hook as this', () => {
    let receivedLabel;
    function handler() {
      receivedLabel = this.getFullLabel();
    };
    const test = new Hook('abcd', handler);
    suite.addTest(test);
    return executeHooks(suite)
      .then(() => {
        assert.equal(receivedLabel, 'root suite abcd');
      });
  });

  it('uses a nullFunction if no handler is present', () => {
    const test = new Hook('abcd');
    suite.addTest(test);
    return executeHooks(suite)
      .then(() => {
        // NOTE(lbayes): The test should be 'pending'
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

      return executeHooks(suite, onProgress)
          .then(() => {
            assert.equal(onProgress.callCount, 4);
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

      return executeHooks(suite, onProgress)
        .then((results) => {
          // Check progress results.
          assert.match(getProgressArg(1).failure.message, /one failed/);
          assert.match(getProgressArg(2).failure.message, /1 to equal 2/);
          assert.match(getProgressArg(3).error.message, /fake error/);

          // Check aggregate results.
          assert.match(results[1].failure.message, /one failed/);
          assert.match(results[2].failure.message, /1 to equal 2/);
          assert.match(results[3].error.message, /fake error/);
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

      return executeHooks(suite, onProgress)
        .then((results) => {
          assert.equal(onProgress.callCount, 2);
          assert.isNull(getProgressArg(1).failure);
          assert.isNull(getProgressArg(1).error);
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

      return executeHooks(suite, onProgress)
        .then((results) => {
          assert.equal(onProgress.callCount, 4);
          assert.match(getProgressArg(1).error.message, /fake error/);
          assert.match(getProgressArg(2).error.message, /fake error two/);
          assert.isNull(getProgressArg(3).error);
          assert.isNull(getProgressArg(3).failure);
        });
    });

    it('handles failures', () => {
      createTest('one', () => {
        return new Promise((resolve, reject) => {
          assert(false, 'fake failure');
        });
      });

      return executeHooks(suite, onProgress)
        .then((results) => {
          assert.equal(onProgress.callCount, 2);
          assert.match(getProgressArg(1).failure.message, /fake failure/);
        });
    });

    it('handles async errors', () => {
      createTest('one', (next) => {
        setTimeout(() => {
          next(new Error('fake error'));
        });
      });

      return executeHooks(suite, onProgress)
        .then((results) => {
          assert.equal(onProgress.callCount, 2);
          assert.match(getProgressArg(1).error.message, /fake error/);
        });
    });
  });
});
