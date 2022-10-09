// Used only when there is no micro/nano second precision
const ms: { [k: number]: number } = {};

//TODO: this should always be unique
//  performance.now() might differ from implementation to implementation
//  and we need a way to ensure that a timestamp is never given twice
//  in the same browser session
export const now = (): number => {
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    return performance.now();
  }

  if (
    typeof process !== "undefined" &&
    typeof process.hrtime?.bigint === "function"
  ) {
    return Number(process.hrtime.bigint());
  }

  if (typeof process !== "undefined" && typeof process.hrtime === "function") {
    const time = process.hrtime();
    return time[0] * 1e3 + time[1] / 1e6;
  }

  if (typeof Date && typeof Date.now === "function") {
    // In order to avoid collision between events we simulate a
    // microsecond behaviour
    const time = Date.now();
    if (!ms[time]) {
      ms[time] = 0;
      return time;
    } else {
      ms[time] += 1;
      return time + ms[time] / 1e3;
    }
  } else {
    throw new Error("No time API found");
  }
};
