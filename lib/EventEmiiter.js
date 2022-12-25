module.exports = function () {
  const events = {};

  this.listener = function (eventType) {
    return function (listener) {
      if (typeof listener !== "function") {
        (events[eventType] || []).forEach((listener) => listener(...arguments));
      } else {
        events[eventType] = events[eventType] || [];
        events[eventType].push(listener);

        return { remove: () => this.removeListener(eventType, listener) };
      }
    };
  };
  this.removeListener = function (eventType, target) {
    const start = (events[eventType] || []).indexOf(target);
    (events[eventType] || []).splice(start, 1);

    !Boolean(events[eventType].length) && delete events[eventType];
  };
};
