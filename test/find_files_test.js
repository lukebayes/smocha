const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it('sorts files by most recently edited', () => {
    return findFiles('.*\.js', './test/fixtures')
      .then((fileAndStats) => {
        assert(fileAndStats.length >= 2, 'Expected at least two files');

        const firstStat = fileAndStats[0].stat;
        const secondStat = fileAndStats[1].stat;
        assert(firstStat.mtimeMs >= secondStat.mtimeMs, 'Expected sort by modified time');
        if (firstStat.mtimeMs === secondStat.mtimeMs) {
          console.log('yoooooooo', firstState.atimeMs);
          assert(firstStat.atimeMs >= secondStat.atimeMs, 'Expected fallback to creation time');
        }
      });
  });
});
