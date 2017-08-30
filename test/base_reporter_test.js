const BaseReporter = require('../').BaseReporter;
const FakeStream = require('./fakes/fake_stream');
const Hook = require('../').Hook;
const assert = require('chai').assert;

describe('BaseReporter', () => {
  let instance;
  let test;
  let stdout;
  let stderr;

  beforeEach(() => {
    test = new Hook('abcd');

    stdout = new FakeStream();
    stderr = new FakeStream();
    instance = new BaseReporter(stdout, stderr);
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('emits dots on stable pass', () => {
    instance.onPass(test);
    instance.onPass(test);
    instance.onPass(test);
    assert.equal(stdout.content, '...');
  });

  it('emits counts on end', () => {
    instance.onStart();
    instance.onPass(test);
    instance.onPass(test);
    instance.onPass(test);
    instance.onPass(test);
    instance.onEnd();

    const lines = stdout.content.split('\n');
    assert.equal(lines[0], '....');
    assert.match(lines[1], /4 passing \(\dms\)/);
  });
});
