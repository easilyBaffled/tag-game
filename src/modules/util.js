import R from "ramda";
import _ from "lodash";
export const off = Symbol("off");

const applyCountDown = gameState => ({ countDown, ...attr }) => {
  const newCountDown = Math.max(countDown - gameState.tickUnit) || off;

  return {
    countDown: newCountDown,
    ..._.reduce(attr, (acc, v, k) => ({
      ...acc,
      [k]: newCountDown === off ? off : v
    }))
  };
};

export const tickCountDown = gameState => unitAttribute =>
  !unitAttribute.temporaryState || ua.temporaryState.countDown === off
    ? unitAttribute
    : over(
        R.lens(R.prop("temporaryState")),
        applyCountDown(gameState),
        unitAttribute
      );
