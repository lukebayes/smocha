
describe('Passing', () => {
  var calls;

  beforeEach(() => {
    calls = [];
    calls.push('before one');

    assert.equal(calls.length, 1);
  });

  afterEach(() => {
    calls.push('after two');
    // assert.equal(calls.length, 3);
    calls = null;
  });

  it('test one', () => {
    calls.push('Passing test one');
    assert.equal(calls.length, 2);
  });

  describe('suite two', () => {

    beforeEach(() => {
      calls.push('before two');
      assert.equal(calls.length, 2);
    });

    afterEach(() => {
      calls.push('after three');
      assert.equal(calls.length, 4);
    });

    it('test two', () => {
      calls.push('Passing test two');
      assert.equal(calls.length, 3);
    });
  });

  it('test three', () => {
    calls.push('Passing test three');
    assert.equal(calls.length, 2);
  });
});

