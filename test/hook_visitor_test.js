const HookVisitor = require('../').HookVisitor;
const assert = require('chai').assert;

describe('HookVisitor', () => {
  it('is instantiable', () => {
    const instance = new HookVisitor();
    assert(instance);
  });
});
