'use strict';
var Runner = require('./runner');
var Suite = require('./models/suite');
var defaultUi = require('./default_ui');


class FileRunner extends Runner {

  runFile(file, opt_completeHandler) {
    var suite = new Suite();

    this.onRunnerStarted();

    defaultUi(file, suite, (err, suite) => {
      if (err) {
        this._completeHandler(err);
        return;
      }

      this.runTest(suite, opt_completeHandler);
    });
  }
};

module.exports = FileRunner;

