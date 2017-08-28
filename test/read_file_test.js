const BddInterface = require('../').BddInterface;
const readFile = require('../').readFile;
const assert = require('chai').assert;

describe('readFile', () => {
  it('is callable', () => {
    return readFile('./test/fixtures/simple.js')
      .then((file) => {
        assert(file.length > 500);
      });
  });
});
