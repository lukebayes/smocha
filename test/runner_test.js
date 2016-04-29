'use strict';
const Events = require('../').Events;
const Runner = require('../').Runner;
const assert = require('assert');
const sinon = require('sinon');

describe('Runner', () => {
  var instance, fakeTest, fakeHooks;

  beforeEach(() => {
    fakeHooks = [];

    fakeTest = {
      getHooks: function()  { return fakeHooks; }
    };

    instance = Runner.create(fakeTest);
  });

  it('only runs once', () => {
    instance.run();

    assert.throws(err => {
      instance.run();
    }, /Runner can only be run once/);
  });

  it('calls each hook with self', () => {
    const runnerStarted = sinon.spy();
    const hookStarted = sinon.spy();
    const hookCompleted = sinon.spy();
    const runnerCompleted = sinon.spy();

    fakeHooks = [
      function(runner) {
        runner.onHookStarted('abcd');
        runner.onHookCompleted('efgh');
      },
      function(runner) {
        runner.onHookStarted('ijkl');
        runner.onHookCompleted('mnop');
      }
    ];

    instance.on(Events.RUNNER_STARTED, runnerStarted);
    instance.on(Events.HOOK_STARTED, hookStarted);
    instance.on(Events.HOOK_COMPLETED, hookCompleted);
    instance.on(Events.RUNNER_COMPLETED, runnerCompleted);
    instance.run();

    assert.equal(runnerStarted.callCount, 1);
    assert.equal(runnerCompleted.callCount, 1);

    assert.equal(hookStarted.callCount, 2);
    assert.equal(hookCompleted.callCount, 2);

    assert.equal(hookStarted.getCall(0).args[0], 'abcd');
    assert.equal(hookStarted.getCall(1).args[0], 'ijkl');

    assert.equal(hookCompleted.getCall(0).args[0], 'efgh');
    assert.equal(hookCompleted.getCall(1).args[0], 'mnop');
  });
});

