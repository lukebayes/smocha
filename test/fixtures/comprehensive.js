var source = require('../fixtures/source');

describe('suite-one', function() {
  before(function() {
    this.befores = [];
  });

  beforeEach(function() {
    this.values = [];
  });

  beforeEach(function() {
    this.values.push('beforeEach:one');
  });

  beforeEach(function() {
    this.values.push('beforeEach:two');
  });

  afterEach(function() {
    this.values.push('afterEach:one');
  });

  afterEach(function() {
    this.values.push('afterEach:two');
  });

  after(function() {
    this.befores = null;
  });

  it('test-one', function() {
    this.values.push('test-one');
  });

  it('test-two', function() {
    this.values.push('test-two');
  });

  describe('suite-two', function() {
    beforeEach(function() {
      this.values.push('beforeEach:three');
    });

    afterEach(function() {
      this.values.push('afterEach:four');
    });

    it('test-three', function() {
      this.values.push('test-three');
    });
  });

  it('test-four', function() {
    this.values.push('test-four');
  });
});

