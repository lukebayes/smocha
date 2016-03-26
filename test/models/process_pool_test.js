'use strict';
const ProcessPool = require('../../').ProcessPool;
const assert = require('assert');

describe('ProcessPool', () => {
  var instance;

  it('is instantiable', () => {
    instance = new ProcessPool();
    assert(instance);
  });
});

