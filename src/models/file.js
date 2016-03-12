'use strict';

class File {

  constructor(path) {
    this._path = path;
  }

  get path() {
    return this._path;
  }
};

module.exports = File;

