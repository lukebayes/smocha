const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it.only('is callable', () => {
    return findFiles('.*\.js', 'test/fixtures')
      .then((files) => {
        console.log('files.length:', files.files.length);
        console.log('files:', files);
      });
  });
});
