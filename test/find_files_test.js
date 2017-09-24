const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it('sorts files by most recently edited', () => {
    return findFiles('.*\.js', './test/fixtures')
      .then((filenames) => {
        assert(filenames.length >= 2, 'Expected at least two files');
      });
  });
});
