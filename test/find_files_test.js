const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it('is callable', () => {
    return findFiles('.*\.js', './test/fixtures')
      .then((fileAndStats) => {
        assert(fileAndStats.length >= 2, 'Expected at least two files');

        const firstStat = fileAndStats[0].stat;
        const secondStat = fileAndStats[1].stat;
        assert(firstStat.mtimeMs > secondStat.mtimeMs, 'Expected sort by modified time');
      });
  });
});
