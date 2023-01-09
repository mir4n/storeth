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
    const onChange = this.listener("onChange").bind(this);

    const self = this;
    const handler = {
      set(target, p, value, receiver) {
        var result;

        const oldValue = { ...self };

        if (!Boolean(/^\$/.test(p))) {
          if (value == self.listener) {
            result = self.onSet(target, p, value(p), receiver);
          } else if (
            typeof value == "object" &&
            !Boolean(value instanceof Store)
          ) {
            result = self.onSet(
              target,
              p,
              observable(value, handler),
              receiver
            );
          } else result = self.onSet(...arguments);

          const newValue = { ...self };

          delete oldValue._events;
          delete newValue._events;

          onChange(newValue, oldValue);
          self.onChange(newValue, oldValue);
        } else return self.onSet(...arguments);

        return result;
      },
    };

    return new Proxy(this, handler);
  }

  onChange(fn) {
    if (typeof fn == "function") {
      const listener = this.listener("onChange").bind(this);

      return listener(fn);
    }
  }
  onSet() {
    return Reflect.set(...arguments);
  }
}

module.exports = Store;
