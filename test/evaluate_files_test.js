const BddInterface = require('../').BddInterface;
const assert = require('chai').assert;
const evaluateFiles = require('../').evaluateFiles;

describe('evaluateFiles', () => {
  let bddInterface;
  let fileAndStats;
  let sandbox;

  beforeEach(() => {
    bddInterface = new BddInterface();
    sandbox = bddInterface.toSandbox();
    fileAndStats = [
      {filename: './test/fixtures/simple.js'},
      {filename: './test/fixtures/dependency.js'},
    ];
  });

  it('loads and evaluates fixture files', () => {
    return evaluateFiles(sandbox, fileAndStats)
      .then((results) => {
        assert(bddInterface.getRoot().children.length >= 5);
      });
  });
});

