import { expect, it } from "vitest";
import wrappy from "../index.js";

it("prop copied", () => {
  function onceifier(cb) {
    let called = false;
    return function (...args) {
      if (called) return;
      called = true;
      return cb.apply(this, args);
    };
  }
  onceifier.iAmOnce = {};
  const once = wrappy(onceifier);
  expect(once.iAmOnce).toBe(onceifier.iAmOnce);

  let called = 0;
  function boo() {
    expect(called).toBe(0);
    called++;
  }
  boo.iAmBoo = true;

  const onlyPrintOnce = once(boo);

  onlyPrintOnce();
  onlyPrintOnce();
  expect(called).toBe(1);

  expect(onlyPrintOnce.iAmBoo).toBeTruthy();
});

it("log", () => {
  const logs = [];
  const logwrap = wrappy(function (msg, cb) {
    logs.push(msg + " wrapping cb");
    return function (...args) {
      logs.push(msg + " before cb");
      cb.apply(this, args);
      logs.push(msg + " after cb");
    };
  });

  const c = logwrap("foo", function () {
    expect(logs).toEqual(["foo wrapping cb", "foo before cb"]);
  });
  c();
  expect(logs).toEqual(["foo wrapping cb", "foo before cb", "foo after cb"]);
});
