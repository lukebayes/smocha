const BaseReporter = require('../').BaseReporter;
const FakeStream = require('./fakes/fake_stream');
const Hook = require('../').Hook;
const assert = require('chai').assert;
const nullFunction = require('../').nullFunction;

const IS_PENDING = true;
const IS_NOT_ONLY = false;

describe('BaseReporter', () => {
  let instance;
  let test;
  let stdout;
  let stderr;

  beforeEach(() => {
    test = new Hook('abcd', nullFunction, Hook.Types.Test);
    skipped = new Hook('efgh', nullFunction, Hook.Types.Test, IS_NOT_ONLY, IS_PENDING);

    stdout = new FakeStream();
    stderr = new FakeStream();
    instance = new BaseReporter(stdout, stderr);
  });

  it('emits dots on stable pass', () => {
    instance.onHookComplete(test);
    instance.onHookComplete(test);
    instance.onHookComplete(skipped);
    instance.onHookComplete(test);
    assert.equal(stdout.content, '..,.');
  });

  it('emits counts on end', () => {
    instance.onStart();
    instance.onHookComplete(test);
    instance.onHookComplete(test);
    instance.onHookComplete(test);
    instance.onHookComplete(test);
    instance.onEnd();

    const lines = stdout.content.split('\n');
    assert.equal(lines[1], '....');
    assert.match(lines[3], /4 passing \(\dms\)/);
  });
});
