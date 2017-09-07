const {NodeVM} = require('vm2');

function evaluateFile(sandbox, content, filename) {
  // TODO(lbayes): Select the appropriate runtime environment
  // depending on whether we're in a browser, on a device or
  // running in Nodejs.
  const vm = new NodeVM({
    timeout: 1000,
    require: {
      external: true
    },
    sandbox: sandbox,
  });

  try {
    vm.run(content, filename);
  } catch (err) {
    console.error('EvaluationError:', err);
  }
};

module.exports = evaluateFile;
