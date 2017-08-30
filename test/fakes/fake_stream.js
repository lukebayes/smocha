
class FakeStream {
  constructor() {
    this.content = '';
  }

  write(str) {
    this.content += str;
  }
}

module.exports = FakeStream;

