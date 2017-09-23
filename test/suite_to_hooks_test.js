const CompositeIterator = require('../').CompositeIterator;
const Hook = require('../').Hook;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const nullFunction = require('../').nullFunction;
const suiteToHooks = require('../').suiteToHooks;

describe('suiteToHooks', () => {
  let root;
  let child1;
  let child2;
  let child3;
  let test1;
  let test2;
  let test3;
  let test4;

  beforeEach(() => {
    root = new Suite('root');
    child1 = new Suite('child1');
    child2 = new Suite('child2');
    child3 = new Suite('child3');
    test1 = new Hook('test1', nullFunction, Hook.Types.Test);
    test2 = new Hook('test2', nullFunction, Hook.Types.Test);
    test3 = new Hook('test3', nullFunction, Hook.Types.Test);
    test4 = new Hook('test4', nullFunction, Hook.Types.Test);

    root.addSuite(child1);
    child1.addSuite(child2);
    child1.addTest(test1);
    child1.addTest(test2);

    child2.addTest(test3);
    child2.addTest(test4);
  });

  describe('tests and suites', () => {
    it('assembles tests and suites', () => {
      const result = suiteToHooks(root);
      const iterator = new CompositeIterator(result);

      assert.equal(iterator.next().getFullLabel(), 'root');
      assert.equal(iterator.next().getFullLabel(), 'root child1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 test1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 test2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 test3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 test4');
      assert.isFalse(iterator.hasNext());
    });
  });

  describe('befores and afters', () => {
    beforeEach(() => {
      child1.addBefore(new Hook('before1', nullFunction, Hook.Types.Before));
      child1.addBefore(new Hook('before2', nullFunction, Hook.Types.Before));
      child1.addBeforeEach(new Hook('beforeEach1', nullFunction, Hook.Types.BeforeEach));
      child1.addBeforeEach(new Hook('beforeEach2', nullFunction, Hook.Types.BeforeEach));
      child1.addBeforeEach(new Hook('beforeEach3', nullFunction, Hook.Types.BeforeEach));
      child1.addAfterEach(new Hook('afterEach1', nullFunction, Hook.Types.AfterEach));
      child1.addAfterEach(new Hook('afterEach2', nullFunction, Hook.Types.AfterEach));
      child1.addAfterEach(new Hook('afterEach3', nullFunction, Hook.Types.AfterEach));
      child1.addAfter(new Hook('after', nullFunction, Hook.Types.After));

      child2.addBeforeEach(new Hook('beforeEach4', nullFunction, Hook.Types.BeforeEach));
      child2.addBeforeEach(new Hook('beforeEach5', nullFunction, Hook.Types.BeforeEach));
      child2.addAfterEach(new Hook('afterEach4', nullFunction, Hook.Types.AfterEach));
    });

    it('assembles all hooks', () => {
      const result = suiteToHooks(root);

      const iterator = new CompositeIterator(result);
      assert.equal(iterator.next().getFullLabel(), 'root');
      assert.equal(iterator.next().getFullLabel(), 'root child1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 before1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 before2');


      // Ensure beforeEaches and afterEaches wrap each of child1's tests
      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 test1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach3');

      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 beforeEach3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 test2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 afterEach3');

      // Ensure child1 AND child2 beforeEaches and afterEaches wrap child2's tests
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach4');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach5');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 test3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach4');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach3');

      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach3');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach4');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 beforeEach5');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 test4');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach4');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach1');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach2');
      assert.equal(iterator.next().getFullLabel(), 'root child1 child2 afterEach3');

      assert.equal(iterator.next().getFullLabel(), 'root child1 after');
      assert.isFalse(iterator.hasNext());
    });
  });
});
