import R, { lensPath, set, over } from "ramda";
import _ from "lodash";
import { off } from "./util";

export default () => "";

export const typeSymbol = Symbol("decay");

const defaultDecayValues = {
  decayRate: 1,
  decayCounter: 10,
  temporaryState: {
    countDown: off,
    decayRate: off
  }
};

export const unitAttribute = {
  _type: typeSymbol,
  ...defaultDecayValues
};

const decayCounter = R.lensPath(["decayRate"]);

const rate = ua =>
  ua.temporaryState.countDown === off
    ? ua.decayRate
    : ua.temporaryState.decayRate;

export const tickReducer = unitAttribute =>
  over(decayCounter, v => Math.max(v - rate(unitAttribute), 0), unitAttribute);

const hasAll = (keys, target) => keys.every(k => R.has(k, target));
const repeatReduce = (func, times, initialValue) =>
  Array(times - 1)
    .fill(func)
    .reduce((res, f) => f(res), func(initialValue));

describe("decay tickReducer", () => {
  test("returns a valid decay attribute", () => {
    expect(
      hasAll(
        ["_type", "decayRate", "decayCounter", "temporaryState"],
        tickReducer(defaultDecayValues)
      )
    ).toBeTruthy();
  });

  test("ticks down", () => {
    expect(tickReducer(defaultDecayValues).decayCounter === 9).toBeTruthy();

    expect(
      tickReducer({ decayRate: 2, decayCounter: 8 }).decayCounter === 6
    ).toBeTruthy();

    expect(
      tickReducer({ decayRate: -2, decayCounter: 8 }).decayCounter === 10
    ).toBeTruthy();
  });

  test("stops at 0", () => {
    expect(
      repeatReduce(tickReducer, 5, { decayRate: 1, decayCounter: 1 }) === 0
    ).toBeTruthy();
  });
});

var getkeys = function(obj, prefix) {
  var keys = Object.keys(obj);
  prefix = prefix ? prefix + "." : "";

  return keys.reduce((result, key) => {
    return _.isPlainObject(obj[key])
      ? [...result, getkeys(obj[key], prefix + key)]
      : [...result, prefix + key];
  }, []);
};

const updaterPaths = console
  .ident(getkeys(defaultDecayValues), { lineNumber: true })
  .reduce(
    (acc, path) => ({ ...acc, [_.last(console.ident(path).split("."))]: path }),
    {}
  );

console.log(defaultDecayValues, updaterPaths);
