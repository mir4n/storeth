const EventEmitter = require("./EventEmitter");

class Store extends EventEmitter {
  constructor() {
    super();
    const onChange = this.listener("onChange").bind(this);

    const self = this;
    const handler = {
      get() {
        return Reflect.get(...arguments);
      },
      set(target, p, value, receiver) {
        var result;

        if (value == self.listener) {
          result = self.onSet(target, p, value(p), receiver);
        } else if (
          typeof value == "object" &&
          !Boolean(value instanceof Store)
        ) {
          result = self.onSet(target, p, new Proxy(value, handler), receiver);
        } else result = self.onSet(...arguments);

        onChange(p);
        self.onChange(p);

        return result;
      },
    };

    return new Proxy(this, handler);
  }

  onChange(fn) {
    if (typeof fn == "function") {
      const listener = this.listener("onChange").bind(this);
      listener(fn);
    }
  }
  onSet() {
    return Reflect.set(...arguments);
  }
}

module.exports = Store;
