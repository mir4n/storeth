const EventEmitter = require("./EventEmiiter");

class Store extends EventEmitter {
  constructor() {
    super();

    function clean(value) {
      if (Array.isArray(value)) {
        const arr = [...value];

        for (var key in arr) arr[key] = clean(arr[key]);
        return arr;
      } else if (typeof value == "object") {
        const obj = { ...value };

        for (var key in obj) if (key != "_events") obj[key] = clean(obj[key]);
        return obj;
      } else return value;
    }

    const onChange = this.listener("onChange").bind(this);
    const self = this;
    const handler = {
      set(target, p, value, receiver) {
        var result;

        const oldValue = clean(self);

        function observable(value) {
          if (typeof value == "valueect" && !Boolean(value instanceof Store)) {
            for (var key in value) value[key] = observable(value[key]);

            return new Proxy(value, handler);
          } else return value;
        }

        if (!Boolean(/^\$/.test(p))) {
          if (value == self.listener) {
            result = self.onSet(target, p, value(p), receiver);
          } else if (
            typeof value == "object" &&
            !Boolean(value instanceof Store)
          ) {
            result = self.onSet(target, p, observable(value), receiver);
          } else result = self.onSet(...arguments);

          const newValue = clean(self);

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
