'use strict';
const FileRunner = require('../../').FileRunner;
const Suite = require('../../').Suite;
const assert = require('assert');
const sinon = require('sinon');

describe('Suite', () => {
  let instance, one, two, three, four, five, six, seven, eight, nine, ten,
      eleven, twelve;

  beforeEach(() => {
    one = sinon.spy();
    two = sinon.spy();
    three = sinon.spy();
    four = sinon.spy();
    five = sinon.spy();
    six = sinon.spy();
    seven = sinon.spy();
    eight = sinon.spy();
    nine = sinon.spy();
    ten = sinon.spy();
    eleven = sinon.spy();
    twelve = sinon.spy();
    instance = new Suite('root');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'root');
  });

  describe('composition and hook ordering', () => {
    it('composes two suites', () => {
      instance.onSuite('outer', function() {
        instance.onBefore(one);

        // This hook should run before every single subsequent test
        instance.onBeforeEach(two);

        // These tests should run before the inner suite tests
        instance.onTest('abcd', function() {
          assert.equal(one.callCount, 1, 'outer before called once');
          assert.equal(two.callCount, 1, 'outer beforeEach called once');
          assert.equal(five.callCount, 0, 'inner before not yet called');
          assert.equal(six.callCount, 0, 'inner beforeEach not yet called');
        });

        instance.onTest('efgh', function() {
          assert.equal(one.callCount, 1, 'outer before called once');
          assert.equal(two.callCount, 2, 'outer beforeEach called twice');
          assert.equal(five.callCount, 0, 'inner before not yet called');
          assert.equal(six.callCount, 0, 'inner beforeEach not yet called');
        });

        // Each of the inner suite tests should also run the outer beforeEach blocks
        instance.onSuite('inner', function() {
          instance.onBefore(five);
          instance.onBeforeEach(six);

          instance.onTest('ijkl', function() {
            assert.equal(one.callCount, 1, 'outer before called once');
            assert.equal(two.callCount, 3, 'outer beforeEach called three times by now');
            assert.equal(five.callCount, 1, 'inner before called once');
            assert.equal(six.callCount, 1, 'inner beforeEach called once');
            assert.equal(nine.callCount, 0, 'inner afterEach not yet called');
          });

          instance.onTest('mnop', function() {
            assert.equal(one.callCount, 1, 'outer before called once');
            assert.equal(two.callCount, 4, 'outer beforeEach called four times by now');
            assert.equal(five.callCount, 1, 'inner before called once');
            assert.equal(six.callCount, 2, 'inner beforeEach called twice');
            assert.equal(nine.callCount, 1, 'inner afterEach called once for previous test');
          });

          // This should run after each inner test is run
          instance.onAfterEach(nine);

          // This should run exactly once after inner tests are run
          instance.onAfter(ten);
        });

        // These tests should run after the inner suite & tests
        instance.onTest('qrst', function() {
          assert.equal(one.callCount, 1, 'outer before called once');
          assert.equal(two.callCount, 5, 'outer beforeEach called four times by now');

          assert.equal(five.callCount, 1, 'inner before called once');
          assert.equal(six.callCount, 2, 'inner beforeEach called for each test');
          assert.equal(nine.callCount, 2, 'inner afterEach called for each test');
          assert.equal(ten.callCount, 1, 'inner after called once');
        });

        instance.onTest('uvxw', function() {
          assert.equal(one.callCount, 1, 'outer before called once');
          assert.equal(two.callCount, 6, 'outer beforeEach called four times by now');
        });

        // This should run after every single test method.
        instance.onAfterEach(eleven);

        // This should run exactly once after all tests are run
        instance.onAfter(twelve);
      });

      assert.equal(one.callCount, 0, 'No test or before handlers called until run');

      FileRunner.create(instance).run();

      assert.equal(five.callCount, 1, 'outer before called once');
      assert.equal(twelve.callCount, 1, 'outer after called once');
    });
  });
});

