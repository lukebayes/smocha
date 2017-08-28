const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
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
});
