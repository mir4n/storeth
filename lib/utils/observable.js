const Store = require("../Store");

module.exports = function observable(obj, handler) {
  if (typeof obj == "object" && !Boolean(obj instanceof Store)) {
    for (var key in obj) obj[key] = observable(obj[key], handler);

    return new Proxy(obj, handler);
  } else return obj;
};
