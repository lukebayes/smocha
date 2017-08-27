const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Suite', () => {
  let instance;

  describe('simple', () => {
    let after;
    let afterEachOne;
    let afterEachTwo;
    let before;
    let beforeEachOne;
    let beforeEachTwo;
    let testOne;
    let testTwo;

    beforeEach(() => {
      after = new Hook('after');
      afterEachOne = new Hook('afterEach');
      afterEachTwo = new Hook('afterEach');
      before = new Hook('before');
      beforeEachOne = new Hook('beforeEach');
      beforeEachTwo = new Hook('beforeEach');
      testOne = new Hook('test one');
      testTwo = new Hook('test two');

      instance = new Suite('abcd');
      instance.addBefore(before);
      instance.addBeforeEach(beforeEachOne);
      instance.addBeforeEach(beforeEachTwo);
      instance.addAfterEach(afterEachOne);
      instance.addAfterEach(afterEachTwo);
      instance.addAfter(after);
      instance.addTest(testOne);
      instance.addTest(testTwo);
    });

    it('creates hooks', () => {
      const hooks = instance.toHooks();
      // Expect one before, one after, and two beforeEaches and two afterEaches
      // for each test, and of course, the tests themselves, total of twelve
      // hooks to execute.
      assert.equal(hooks.length, 12);
    });
  });
});
