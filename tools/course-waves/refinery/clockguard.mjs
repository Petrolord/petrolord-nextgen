// THE CLOCK GATE, shared by refinery_dump.mjs, refinery_capstone.mjs and
// discriminate.mjs.
//
// Two exports this course calls read the machine clock when a caller leaves an
// argument out: cascadeToSchedule dates the schedule from `periodStart ||
// Date.now()`, and feasibilityEconomics (through the screening engine's
// calculateEconomics) labels the cash flow from `startYear = new
// Date().getFullYear()`. Which exports read a clock is READ OUT OF THE ENGINE
// SOURCE here rather than typed: every exported arrow function whose body
// contains `new Date()` or `Date.now()` is found, and loadGuarded() returns the
// modules with each such export wrapped.
//
//   - An export this file knows the override for is allowed only when the call
//     passes one of the wave's fixed values for it (PERIOD_START; START_YEAR
//     or the one declared check year), by value.
//   - An export that reads a clock and whose override this file does NOT know
//     throws on every call. A new clock read upstream therefore stops the build
//     instead of printing a date.
//
// So no digest line and no graded value can have come from the machine clock.
import fs from 'fs';

export const MODULES = {
  refineryPlanning: 'engines/downstream/refineryPlanning.js',
  streamModel: 'engines/downstream/streamModel.js',
  modularRefinery: 'engines/downstream/modularRefinery.js',
  screening: 'engines/economics/screening.js',
  simplex: 'lib/lp/simplex.js',
};

// The overrides this gate knows, and the test a call must pass.
const OVERRIDES = {
  'refineryPlanning.cascadeToSchedule': (args, fixed) => args[0] && args[0].periodStart === fixed.periodStart,
  'modularRefinery.feasibilityEconomics': (args, fixed) => args[0] && fixed.startYears.includes(args[0].startYear),
  'screening.calculateEconomics': (args, fixed) => args[0] && fixed.startYears.includes(args[0].startYear),
};

/** Every exported arrow function whose own body reads the machine clock. */
export const clockReadersOf = (src) => {
  const found = [];
  const re = /^export const (\w+) = (async )?\(/gm;
  const starts = [];
  let m;
  while ((m = re.exec(src))) starts.push({ name: m[1], at: m.index });
  const allExports = [...src.matchAll(/^export /gm)].map((x) => x.index);
  for (const s of starts) {
    const next = allExports.find((i) => i > s.at) ?? src.length;
    const body = src.slice(s.at, next)
      .split('\n').filter((l) => !/^\s*(\/\/|\*)/.test(l)).join('\n');
    if (/new Date\(\)|Date\.now\(\)/.test(body)) found.push(s.name);
  }
  return found;
};

export const loadGuarded = async (root, fixed) => {
  const RAW = {};
  const CLOCK = new Map();
  const CALLS = new Map();
  for (const [mod, rel] of Object.entries(MODULES)) {
    const src = fs.readFileSync(`${root}/${rel}`, 'utf8');
    RAW[mod] = await import(`${root}/${rel}`);
    for (const name of clockReadersOf(src)) {
      if (typeof RAW[mod][name] !== 'function') throw new Error(`CLOCK GATE: ${mod}.${name} is not an exported function`);
      CLOCK.set(RAW[mod][name], `${mod}.${name}`);
    }
  }
  // The scan must find at least the three readers this course is known to
  // meet, or it has failed rather than found a clean engine.
  const names = [...CLOCK.values()];
  for (const must of Object.keys(OVERRIDES)) {
    if (!names.includes(must)) throw new Error(`CLOCK GATE REFUSES: the source scan did not find ${must}; it has failed`);
  }
  const guard = (mod) => {
    const out = {};
    for (const [k, v] of Object.entries(mod)) {
      const name = CLOCK.get(v);
      if (typeof v !== 'function' || !name) { out[k] = v; continue; }
      const ok = OVERRIDES[name];
      out[k] = (...args) => {
        if (!ok) throw new Error(`CLOCK GATE: ${name} reads the machine clock and this gate knows no override for it`);
        if (!ok(args, fixed)) {
          throw new Error(`CLOCK GATE: ${name} was called without the wave's fixed ${name.endsWith('Schedule') ? 'periodStart' : 'startYear'}; it would have read the machine clock`);
        }
        CALLS.set(name, (CALLS.get(name) || 0) + 1);
        return v(...args);
      };
    }
    return Object.freeze(out);
  };
  const G = Object.fromEntries(Object.keys(MODULES).map((m) => [m, guard(RAW[m])]));
  return { RAW, G, CLOCK, CALLS };
};
