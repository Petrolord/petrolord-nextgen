// A FAKE MACHINE CLOCK, used ONLY as a detector by gate_clock.sh. It moves
// Date.now() and the no-argument `new Date()` by FAKE_CLOCK_DAYS days and
// leaves every Date built from explicit arguments alone. If any line of the
// digest came from a clock read, the digest built under it differs.
const shift = Number(process.env.FAKE_CLOCK_DAYS || 0) * 86400000;
const Real = Date;
class Fake extends Real {
  constructor(...args) { if (args.length === 0) super(Real.now() + shift); else super(...args); }
  static now() { return Real.now() + shift; }
}
globalThis.Date = Fake;
