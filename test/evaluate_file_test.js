const assert = require('chai').assert;
const evaluateFile = require('../').evaluateFile;

describe('evaluateFile', () => {
  it('is defined', () => {
    assert(evaluateFile);
  });
});
