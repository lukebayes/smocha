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
      after = sinon.spy();
      afterEachOne = sinon.spy();
      afterEachTwo = sinon.spy();
      before = sinon.spy();
      beforeEachOne = sinon.spy();
      beforeEachTwo = sinon.spy();
      testOne = sinon.spy();
      testTwo = sinon.spy();

      instance = new Suite('abcd');
      instance.befores.push(before);
      instance.beforeEaches.push(beforeEachOne);
      instance.beforeEaches.push(beforeEachTwo);
      instance.afterEaches.push(afterEachOne);
      instance.afterEaches.push(afterEachTwo);
      instance.afters.push(after);
      instance.tests.push(testOne);
      instance.tests.push(testTwo);
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
