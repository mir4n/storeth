import { EventEmitter } from "./EventEmiiter";
import { clean } from "./utils";

export default class Store extends EventEmitter {
  constructor() {
    super();
    const onChange = this.listener("onChange").bind(this);

    const self = this;
    const handler = {
      set(target, p, value, receiver) {
        var result;

        const oldValue = clean(self);

        function observable(value) {
          if (typeof value == "object" && !Boolean(value instanceof Store)) {
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

          onChange(newValue, oldValue);
          self.onChange(newValue, oldValue);
        } else return self.onSet(...arguments);

        return result;
      },
      deleteProperty(target, p) {
        if (p in target && !Boolean(/^\$/.test(p))) {
          const oldValue = clean(self);
          const res = delete target[p];
          const newValue = clean(self);

          onChange(newValue, oldValue);
          self.onChange(newValue, oldValue);
          return res;
        } else return delete target[p];
      }
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
