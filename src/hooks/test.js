const Hook = require('../hook');

class Test extends Hook {
  constructor(label, body, isOnly, isPending) {
    super(label, body, isOnly, isPending);
  }


  toHooks() {
    let result = this.getAllBeforeEaches();
    result.push(this);
    result = result.concat(this.getAllAfterEaches());
    return result;
  }
}

module.exports = Test;
