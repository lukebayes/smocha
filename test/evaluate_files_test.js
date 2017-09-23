const BddInterface = require('../').BddInterface;
const CompositeIterator = require('../').CompositeIterator;
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
      {filename: './test/fixtures/simple.js'},
      {filename: './test/fixtures/dependency.js'},
    ];
  });

  it('loads and evaluates fixture files', () => {
    return evaluateFiles(sandbox, fileAndStats)
      .then(() => {
        const root = bddInterface.getRoot();
        const hooks = new CompositeIterator(suiteToHooks(root)).toArray();
        assert(hooks.length >= 23);
      });
  });
});

