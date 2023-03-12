import EventEmitter from "../EventEmiiter";
import uniqueP from "../uniqueP";

export function clean(value) {
  if (value?.[uniqueP]) {
    if (Array.isArray(value)) {
      const arr = [...value];

      for (var key in arr) arr[key] = clean(arr[key]);
      return arr;
    } else if (typeof value == "object") {
      const obj = { ...value };

      if (value instanceof EventEmitter) delete obj._events;

      for (var key in obj)
        if (!Boolean(/^\$/.test(key))) obj[key] = clean(obj[key]);
      return obj;
    } else return value;
  } else return value;
}
