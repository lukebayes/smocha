const BaseReporter = require('../').BaseReporter;
const Hook = require('../').Hook;
const assert = require('chai').assert;

class FakeStream {
  constructor() {
    this.content = '';
  }

  write(str) {
    this.content += str;
  }
}

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
