const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it('is callable', () => {
    return findFiles('.*\.js', './test/fixtures')
      .then((files) => {
        assert(files.length >= 2, 'Expected at least two files');

        const firstStat = files[0].stat;
        const secondStat = files[1].stat;
        assert(firstStat.mtimeMs > secondStat.mtimeMs, 'Expected sort by modified time');
      });
  });
});
