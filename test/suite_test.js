const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const nullFunction = require('../').nullFunction;
const sinon = require('sinon');

describe('Suite', () => {
  let instance;

  it('returns added tests', () => {
    const test = new Hook();
    instance = new Suite();
    const result = instance.addTest(test);
    assert.equal(test, result);
  });

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
      afterEachOne = new Hook('afterEach1');
      afterEachTwo = new Hook('afterEach2');
      before = new Hook('before');
      beforeEachOne = new Hook('beforeEach1');
      beforeEachTwo = new Hook('beforeEach2');
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
  });

  describe('start', () => {
    let root;
    let child1;
    let test1;
    let test2;

    beforeEach(() => {
      root = new Suite('root');
      child1 = new Suite('child1');
      test1 = new Hook('test1', nullFunction, Hook.Types.Test);
      test2 = new Hook('test2', nullFunction, Hook.Types.Test);

      root.addSuite(child1);
      child1.addTest(test1);
      child1.addTest(test2);
    });

    it('accepts suite and test declarations', () => {
      assert.equal(root.tests.length, 0);
      assert.equal(root.suites.length, 1);
      assert.equal(child1.tests.length, 2);

      assert.equal(child1.parent, root);
      assert.equal(test1.parent, child1);
      assert.equal(test2.parent, child1);
    });
  });
});
