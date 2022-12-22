module.exports = function Store() {
  const events = {};

  function listener(eventType) {
    return function (listener) {
      if (typeof listener !== "function") {
        (events[eventType] || []).forEach((listener) => listener(...arguments));
      } else {
        events[eventType] = events[eventType] || [];
        events[eventType].push(listener);

        return () => removeListener(eventType, listener);
      }
    };
  }
  function removeListener(eventType, target) {
    const start = (events[eventType] || []).indexOf(target);
    (events[eventType] || []).splice(start, 1);

    !Boolean(events[eventType].length) && delete events[eventType];
  }
  function onSet() {
    return Reflect.set(...arguments);
  }

  Object.setPrototypeOf(Object.getPrototypeOf(this), {
    listener,
    removeListener,
    onSet,
    onChange: function (fn) {
      if (typeof fn == "function") {
        const onChange = listener("onChange");
        onChange(fn);
      }
    },
  });

  const onChange = listener("onChange");

  const set = (target, p, value, receiver) => {
    var result;

    if (value == listener) {
      result = this.onSet(target, p, value(p), receiver);
    } else if (typeof value == "object" && !Boolean(value instanceof Store)) {
      result = this.onSet(target, p, new Proxy(value, handler), receiver);
    } else result = this.onSet(target, p, value, receiver);

    onChange(p);
    this.onChange(p);

    return result;
  };

  const handler = { set };

  return new Proxy(this, handler);
};
