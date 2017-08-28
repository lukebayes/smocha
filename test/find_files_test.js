const assert = require('chai').assert;
const findFiles = require('../').findFiles;

describe('findFiles', () => {

  it('is callable', () => {
    return findFiles('fixtures/*.js')
      .then((files) => {
        console.log('files:', files);
      });
  });
});
