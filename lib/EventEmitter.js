export class EventEmitter {
  #events = {};

  listener(eventType) {
    return function (listener) {
      if (typeof listener !== "function") {
        (this.#events[eventType] || []).forEach((listener) =>
          listener(...arguments)
        );
      } else {
        this.#events[eventType] = this.#events[eventType] || [];
        this.#events[eventType].push(listener);

        return { remove: () => this.removeListener(eventType, listener) };
      }
    };
  }
  removeListener(eventType, target) {
    const start = (this.#events[eventType] || []).indexOf(target);
    (this.#events[eventType] || []).splice(start, 1);

    !Boolean(this.#events[eventType].length) && delete this.#events[eventType];
  }
}
