'use strict';
const File = require('../../').File;
const assert = require('assert');

describe('File', () => {
  let instance;

  it('is instantiable', () => {
    instance = new File();
    assert(instance);
  });
});

