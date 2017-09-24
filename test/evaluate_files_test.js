const BddInterface = require('../').BddInterface;
const assert = require('chai').assert;
const evaluateFiles = require('../').evaluateFiles;
const suiteToHooks = require('../').suiteToHooks;

describe('evaluateFiles', () => {
  let bddInterface;
  let fileAndStats;
  let sandbox;

  beforeEach(() => {
    bddInterface = new BddInterface();
    sandbox = bddInterface.toSandbox();
    fileAndStats = [
      './test/fixtures/simple.js',
      './test/fixtures/dependency.js',
    ];
  });

  it('loads and evaluates fixture files', () => {
    return evaluateFiles(sandbox, fileAndStats)
      .then(() => {
        const root = bddInterface.getRoot();
        const hooks = suiteToHooks(root);
        assert(hooks.length >= 20);
      });
  });
});

