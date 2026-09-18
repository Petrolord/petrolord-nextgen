// THE CLOCK GATE, shared by compliance_dump.mjs and compliance_capstone.mjs.
//
// Every export of the six assurance modules this course teaches that reads a
// date against "today" takes that date as a parameter defaulting to
// `new Date()`. Which parameter, at which position, is READ OUT OF THE ENGINE
// SOURCE here rather than typed. loadGuarded() returns every module with each
// such export wrapped: a call that does not pass the given as-of Date itself,
// by identity, at that position throws, so no output can come from the
// machine clock.
import fs from 'fs';

export const MODS = ['calendar', 'complianceStatus', 'documentControl', 'qualityAssurance', 'isoCompliance', 'auditManagement'];

const splitTop = (s) => {
  const out = []; let depth = 0; let cur = '';
  for (const ch of s) {
    if ('([{'.includes(ch)) depth += 1;
    if (')]}'.includes(ch)) depth -= 1;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((x) => x.trim());
};

export const clockParamsOf = (src) => {
  const found = new Map();
  const re = /export const (\w+) = \(/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length; let depth = 1; const start = i;
    while (depth > 0) { if (src[i] === '(') depth += 1; if (src[i] === ')') depth -= 1; i += 1; }
    const params = splitTop(src.slice(start, i - 1));
    params.forEach((p, idx) => {
      if (/^(today|asOf)\s*=\s*new Date\(\)$/.test(p)) found.set(m[1], idx);
    });
  }
  return found;
};

export const loadGuarded = async (root, asOf) => {
  const DIR = `${root}/engines/assurance`;
  const CLOCK = new Map();
  const CALLS = new Map();
  const RAW = {};
  for (const mod of MODS) {
    const src = fs.readFileSync(`${DIR}/${mod}.js`, 'utf8');
    RAW[mod] = await import(`${DIR}/${mod}.js`);
    for (const [name, idx] of clockParamsOf(src)) {
      const fn = RAW[mod][name];
      if (typeof fn !== 'function') throw new Error(`CLOCK GATE: ${mod}.${name} is not an exported function`);
      CLOCK.set(fn, { idx, name: `${mod}.${name}` });
    }
  }
  if (CLOCK.size < 20) throw new Error(`CLOCK GATE REFUSES: only ${CLOCK.size} clock-reading exports found; the source scan has failed`);
  const guard = (mod) => {
    const out = {};
    for (const [k, v] of Object.entries(mod)) {
      if (typeof v !== 'function') { out[k] = v; continue; }
      const c = CLOCK.get(v);
      out[k] = c
        ? (...args) => {
          if (args.length <= c.idx || args[c.idx] !== asOf) {
            throw new Error(`CLOCK GATE: ${c.name} was called without the as-of date at parameter ${c.idx}; it would have read the machine clock`);
          }
          CALLS.set(c.name, (CALLS.get(c.name) || 0) + 1);
          return v(...args);
        }
        : v;
    }
    return Object.freeze(out);
  };
  const G = Object.fromEntries(MODS.map((m) => [m, guard(RAW[m])]));
  return { RAW, G, CLOCK, CALLS };
};
