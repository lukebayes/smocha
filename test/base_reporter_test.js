const BaseReporter = require('../').BaseReporter;
const FakeStream = require('./fakes/fake_stream');
const Hook = require('../').Hook;
const assert = require('chai').assert;
const nullFunction = require('../').nullFunction;

describe('BaseReporter', () => {
  let instance;
  let test;
  let stdout;
  let stderr;

  beforeEach(() => {
    test = new Hook('abcd', nullFunction, Hook.Types.Test);

    stdout = new FakeStream();
    stderr = new FakeStream();
    instance = new BaseReporter(stdout, stderr);
  });

  it('emits dots on stable pass', () => {
    instance.onHookComplete({hook: test});
    instance.onHookComplete({hook: test});
    instance.onHookComplete({hook: test});
    assert.equal(stdout.content, '...');
  });

  it('emits counts on end', () => {
    instance.onStart();
    instance.onHookComplete({hook: test});
    instance.onHookComplete({hook: test});
    instance.onHookComplete({hook: test});
    instance.onHookComplete({hook: test});
    instance.onEnd();

    const lines = stdout.content.split('\n');
    assert.equal(lines[1], '....');
    assert.match(lines[3], /4 passing \(\dms\)/);
  });
});
