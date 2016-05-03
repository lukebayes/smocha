'use strict';
const Runner = require('../').Runner;
const assert = require('assert');

describe('Runner', () => {
  let instance;

  beforeEach(() => {
    instance = new Runner();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
