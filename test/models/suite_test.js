var Suite = require('../../').Suite,
    assert = require('assert'),
    sinon = require('sinon');

describe('Suite', () => {
  var instance, one, two, three, four, five, six, seven;

  beforeEach(() => {
    one = sinon.spy();
    two = sinon.spy();
    three = sinon.spy();
    four = sinon.spy();
    five = sinon.spy();
    six = sinon.spy();
    seven = sinon.spy();
    instance = new Suite('abcd');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'abcd');
    assert.equal(typeof instance.run, 'function');
  });

  describe('composition', () => {
    it('composes two tests', () => {
      instance.onSuite(function() {
        instance.onBefore(one);
        instance.onBeforeEach(two);
        instance.onBeforeEach(three);
        instance.onTest('efgh', four);
        instance.onTest('ijkl', four);
        instance.onAfterEach(five);
        instance.onAfterEach(six);
        instance.onAfter(seven);
      });

      instance.run();
      assert.equal(four.callCount, 2);
    });
  });

  describe('hooks', () => {
    it('onSuite', () => {
      var result = instance.onSuite('abcd', one);
      assert.equal(instance, result);
      assert.equal(instance.children.length, 1);
      assert.equal(instance.children[0].name, 'abcd');
      assert.equal(instance.children[0].handler, one);
    });

    it('onTest', () => {
      var result = instance.onTest('abcd', one);
      assert.equal(instance, result);
      assert.equal(instance.tests.length, 1);
      assert.equal(instance.tests[0].name, 'abcd');
      assert.equal(instance.tests[0].handler, one);
    });

    it('onBefore', () => {
      var result = instance.onBefore(one);
      assert.equal(instance, result);
      assert.equal(instance.beforeHooks.length, 1);
      assert.equal(instance.beforeHooks[0], one);
    });

    it('onBeforeEach', () => {
      var result = instance.onBeforeEach(one);
      assert.equal(instance, result);
      assert.equal(instance.beforeEachHooks.length, 1);
      assert.equal(instance.beforeEachHooks[0], one);
    });

    it('onAfter', () => {
      var result = instance.onAfter(one);
      assert.equal(instance, result);
      assert.equal(instance.afterHooks.length, 1);
      assert.equal(instance.afterHooks[0], one);
    });

    it('onAfterEach', () => {
      var result = instance.onAfterEach(one);
      assert.equal(instance, result);
      assert.equal(instance.afterEachHooks.length, 1);
      assert.equal(instance.afterEachHooks[0], one);
    });
  });
});

