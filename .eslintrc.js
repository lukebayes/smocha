// Extra rules for code running in the browser
'use strict';

module.exports = {
  extends: 'kr-linter',
  root: true,
  globals: {
    global: false,
    Buffer: false,
    process: false,
    setTimeout: true,
    window: true
  }
};
