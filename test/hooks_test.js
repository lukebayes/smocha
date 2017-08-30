const hooks = require('../').hooks;
const assert = require('chai').assert;

describe('hooks', () => {
  let instance;

  describe('Test', () => {
    it('is instiable', () => {
      instance = new hooks.Test('abcd');
      instance.execute()
    });
  });
});
