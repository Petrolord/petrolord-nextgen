// A FAKE MACHINE CLOCK AND A FAKE RANDOM SOURCE, used ONLY as detectors by
// gate_clock.sh. It moves Date.now() and the no-argument `new Date()` by
// FAKE_CLOCK_DAYS days, leaves every Date built from explicit arguments alone,
// and, with FAKE_RANDOM set, makes Math.random return that constant. If any
// line of the digest or any graded field came from a clock read or a random
// draw, the output built under it differs.
const shift = Number(process.env.FAKE_CLOCK_DAYS || 0) * 86400000;
const Real = Date;
class Fake extends Real {
  constructor(...args) { if (args.length === 0) super(Real.now() + shift); else super(...args); }
  static now() { return Real.now() + shift; }
}
globalThis.Date = Fake;
if (process.env.FAKE_RANDOM !== undefined) {
  const r = Number(process.env.FAKE_RANDOM);
  Math.random = () => r;
}
