export default class EventEmitter {
  constructor() {
    this._events = {};
  }

  listener(eventType) {
    return function (listener) {
      if (typeof listener !== "function") {
        (this._events[eventType] || []).forEach((listener) =>
          listener(...arguments)
        );
      } else {
        this._events[eventType] = this._events[eventType] || [];
        this._events[eventType].push(listener);

        return { remove: () => this.removeListener(eventType, listener) };
      }
    };
  }
  removeListener(eventType, target) {
    const start = (this._events[eventType] || []).indexOf(target);
    (this._events[eventType] || []).splice(start, 1);

    !Boolean(this._events[eventType].length) && delete this._events[eventType];
  }
}
