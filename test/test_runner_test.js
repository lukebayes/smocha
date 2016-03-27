'use strict';
const TestRunner = require('../').TestRunner;
const assert = require('assert');

describe('TestRunner', () => {
  var instance;

  it('is instantiable', () => {
    instance = TestRunner.create();
    assert(instance);
  });
});

