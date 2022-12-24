const EventEmitter = require("./EventEmiiter");

function observable(obj, handler) {
  if (typeof obj == "object" && !Boolean(obj instanceof Store)) {
    for (var key in obj) obj[key] = observable(obj[key], handler);

    return new Proxy(obj, handler);
  } else return obj;
}

class Store extends EventEmitter {
  constructor() {
    super();
    const onChange = this.listener("onChange");

    const self = this;
    const handler = {
      get() {
        return Reflect.get(...arguments);
      },
      set(target, p, value, receiver) {
        var result;

        if (value instanceof EventEmitter) {
          const onChildChange = value.listener("onChange");

          onChildChange(onChange);

          result = self.onSet(...arguments);
        } else if (value == self.listener) {
          result = self.onSet(target, p, value(p), receiver);
        } else if (typeof value == "object") {
          result = self.onSet(target, p, observable(value, handler), receiver);
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
      const listener = this.listener("onChange");
      listener(fn);
    }
  }
  onSet() {
    return Reflect.set(...arguments);
  }
}

module.exports = Store;
