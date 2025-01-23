export default function wrappy(fn, cb) {
  if (fn && cb) return wrappy(fn)(cb);

  if (typeof fn !== "function") throw new TypeError("need wrapper function");

  Object.keys(fn).forEach((k) => {
    wrapper[k] = fn[k];
  });

  return wrapper;

  function wrapper(...args) {
    const ret = fn.apply(this, args);
    const cb = args[args.length - 1];
    if (typeof ret === "function" && ret !== cb) {
      Object.keys(cb).forEach((k) => {
        ret[k] = cb[k];
      });
    }
    return ret;
  }
}
