'use strict';
const Events = require('../').Events;
const FileRunner = require('../').FileRunner;
const assert = require('assert');
const path = require('path');
const sinon = require('sinon');

const COMPREHENSIVE_TEST_FIXTURE = path.join(__dirname, 'fixtures/comprehensive.js');

describe('FileRunner', () => {
  var instance;

  it('loads provided ui', (done) => {
    instance = new FileRunner();
    instance.runFile(COMPREHENSIVE_TEST_FIXTURE, (err, suite) => {
      assert(!err, err && err.stack);
      assert.equal(suite.tests.length, 4);
      done(err);
    });
  });
});

