import EventEmitter from "../EventEmiiter";
import { isObserver } from "./isObserver";

export function clean(value) {
  if (Array.isArray(value) && value[isObserver]) {
    const arr = [...value];

    for (var key in arr) arr[key] = clean(arr[key]);
    return arr;
  } else if (typeof value == "object" && value[isObserver]) {
    const obj = { ...value };

    if (value instanceof EventEmitter) delete obj._events;

    for (var key in obj)
      if (!Boolean(/^\$/.test(key))) obj[key] = clean(obj[key]);
    return obj;
  } else return value;
}
