'use strict';
const EventEmitter = require('events').EventEmitter;

/**
 * Provide a collection of independent processes that can be used to execute
 * test files. For now, these processes are colocated on the same machine,
 * but there is no reason these could not be hosted externally and controlled
 * with a REST or RPC interface.
 */
class ProcessPool extends EventEmitter {

  constructor(limit) {
    super();
    this._limit = limit;
  }

  run(filePath) {
  }
};

module.exports = ProcessPool;

