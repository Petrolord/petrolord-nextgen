// THE RISKCHANGE TEACHING DIGEST GENERATOR. Runs the teaching records of
// riskchange_fields.mjs (OBODO, ESANMI, IKANG, ONNE) through the vendored
// engines/assurance modules and prints the digest every lesson, bank and panel
// of Risk, Change & Learning quotes. THE CAPSTONE RUNS DIFFERENT RECORDS:
// nothing here imports, reads or reproduces riskchange_fields_capstone.mjs or
// fields.json.
//
// Usage:  sh /root/as-wip-riskchange/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/as-wip-riskchange/digest.txt
//
// Engines, vendored sha-identical with engines 9d5d3b4 (ASC-0, PR #212):
// riskScoring.js, managementOfChange.js, peerReview.js, lessonsLearned.js and
// the calendar.js they share (lessonsLearned reaches it directly and through
// qualityAssurance.js). The walked closure of the family is 53 paths.
//
// EVERY FIGURE PRINTED HERE IS A RETURN VALUE OF AN ENGINE, except a line that
// says "golden" (read from the published case file, which the ORACLE wrote) or
// "measured" (a count read out of a vendored file with the rule stated). Every
// engine call is also written to calls.json, and oracle_bridge.py replays each
// one through the independent Python oracle for its module, so every printed
// answer is two methods agreeing.
//
// THE CLOCK IS NEVER READ. Two gates, both inside this file, both with a
// negative control (RC_NEGATIVE=omit, RC_NEGATIVE=clock):
//   1. THE AS-OF GATE. Every export whose signature defaults a `today` or an
//      `asOf` to the machine clock is found by READING THE ENGINE SOURCE, and
//      every call to it through this file must pass that argument explicitly,
//      as a Date at local midnight. A call that omits it throws.
//   2. THE CLOCK TRAP. `new Date()` with no argument and `Date.now()` throw for
//      the whole run, so an engine that fell back to the clock anywhere, even
//      inside a call the first gate could not see, stops the build.
//
// NOTHING IN THIS FILE DESCRIBES WHAT THE ENGINES USED TO DO except the last
// section, which says so in its title and in its first line.
import fs from 'fs';
import {
  AS_OF, AS_OF_ISO, AS_OF_PARTS,
  OBODO_RISKS, LEVEL_PROBES, BAND_PROBES, RESIDUAL_PROBES, APPETITE_PROBES, CALENDAR_PROBES,
  ESANMI_MOCS, ESANMI_APPROVALS, ESANMI_ACTIONS, APPROVAL_SETS, EXPIRY_DAY_SWEEP, RATIFY_DAY_SWEEP,
  IKANG_REVIEWS, IKANG_COMMENTS, IKANG_OTHER_COMMENTS, IKANG_PARTICIPANTS,
  ONNE_LESSONS, ONNE_APPLICATIONS, APPLICATION_PROBES, LESSON_REVIEW_SWEEP,
} from '/root/as-wip-riskchange/riskchange_fields.mjs';

const ROOT = process.env.RC_ENGINES || '/root/wt-as-riskchange-nextgen/packages/engines';
const WAVE = '/root/as-wip-riskchange';
const CALLS_OUT = process.env.RC_CALLS_OUT || `${WAVE}/calls.json`;
const NEGATIVE = process.env.RC_NEGATIVE || '';

/* ------------------------------------------------------------------ *
 * GATE 2, THE CLOCK TRAP. Installed before any engine is imported.
 * ------------------------------------------------------------------ */
const RealDate = Date;
class TrappedDate extends RealDate {
  constructor(...a) {
    if (a.length === 0) {
      throw new Error('CLOCK READ: new Date() with no argument. Every date in this digest is AS_OF or '
        + 'a date built from stated parts; an engine that fell back to the machine clock stops the build.');
    }
    super(...a);
  }

  static now() {
    throw new Error('CLOCK READ: Date.now(). Nothing in this digest may read the machine clock.');
  }
}
globalThis.Date = TrappedDate;

const { normalise } = await import(`${ROOT}/__tests__/helpers/assuranceGoldens.js`);
const RAW = {
  calendar: await import(`${ROOT}/engines/assurance/calendar.js`),
  riskScoring: await import(`${ROOT}/engines/assurance/riskScoring.js`),
  managementOfChange: await import(`${ROOT}/engines/assurance/managementOfChange.js`),
  peerReview: await import(`${ROOT}/engines/assurance/peerReview.js`),
  lessonsLearned: await import(`${ROOT}/engines/assurance/lessonsLearned.js`),
};
const SOURCE = Object.fromEntries(Object.keys(RAW).map((m) => [m,
  fs.readFileSync(`${ROOT}/engines/assurance/${m}.js`, 'utf8')]));

/* ------------------------------------------------------------------ *
 * GATE 1, THE AS-OF GATE. The date argument of every export is found by
 * reading its signature in the engine source: a parameter written
 * `today = new Date()` or `asOf = new Date()`. A re-export (daysUntil in
 * managementOfChange, peerReview and lessonsLearned) resolves to the
 * calendar definition.
 * ------------------------------------------------------------------ */
const SIG = /export const (\w+) = (?:\(([\s\S]*?)\)|(\w+)) =>/g;
const dateArgOf = {};
for (const [m, src] of Object.entries(SOURCE)) {
  dateArgOf[m] = {};
  for (const hit of src.matchAll(SIG)) {
    const params = (hit[2] ?? hit[3] ?? '')
      .replace(/\{[^{}]*\}/g, 'OBJ').split(',').map((p) => p.trim()).filter(Boolean);
    const at = params.findIndex((p) => /^(today|asOf)\s*=\s*new Date\(\)$/.test(p));
    if (at !== -1) dateArgOf[m][hit[1]] = at;
  }
}
for (const m of ['managementOfChange', 'peerReview', 'lessonsLearned']) {
  if (typeof RAW[m].daysUntil === 'function') dateArgOf[m].daysUntil = dateArgOf.calendar.daysUntil;
}
const DATE_TAKERS = Object.entries(dateArgOf).flatMap(([m, o]) => Object.keys(o).map((f) => `${m}.${f}`));
if (DATE_TAKERS.length < 10) {
  throw new Error(`AS-OF GATE REFUSES: it found only ${DATE_TAKERS.length} date-taking exports by reading `
    + 'the source. A gate that found nothing to guard must not report success.');
}

const isLocalMidnight = (d) => d instanceof RealDate && !Number.isNaN(d.getTime())
  && d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0;

const ledger = [];
let guardedDateCalls = 0;
let negativeFired = false;
const enc = (v) => (v === undefined ? { $undefined: true } : normalise(v, { keepProse: true }));
const guard = (m) => new Proxy(RAW[m], {
  get(target, fn) {
    const f = target[fn];
    if (typeof f !== 'function') return f;
    return (...args) => {
      let callArgs = args;
      const at = dateArgOf[m][fn];
      if (at !== undefined) {
        if (NEGATIVE === 'omit' && !negativeFired) {
          negativeFired = true;
          callArgs = args.slice(0, at);
        }
        if (callArgs.length <= at || !isLocalMidnight(callArgs[at])) {
          throw new Error(`AS-OF GATE: ${m}.${String(fn)} was called without its date argument (position ${at + 1}) `
            + 'as a Date at local midnight. It would have read the machine clock.');
        }
        guardedDateCalls += 1;
      }
      const result = f(...callArgs);
      if (typeof result === 'function') return result;
      ledger.push({ m, fn, args: callArgs.map(enc), result: enc(result) });
      return result;
    };
  },
});

let NEG_LINE = null;
if (NEGATIVE === 'utc') {
  // The negative control for the time-zone gate: one line that reads a date
  // string as a UTC instant (the RS-1 and RC-1 shape, both now repaired in the
  // engine, so the plant is made here) and prints the local calendar day of
  // that instant. It must make the digest differ west of Greenwich.
  NEG_LINE = `NEGATIVE CONTROL: day ${new RealDate('2026-10-01').getDate()}`;
}
if (NEGATIVE === 'clock') {
  // The negative control for the trap: an engine call that is allowed to fall
  // back to its default today, bypassing the as-of gate. The trap must fire.
  RAW.riskScoring.isReviewOverdue({ next_review_date: '2026-09-30' });
}

/* The constants a line prints are ledgered too, so the bridge checks them
 * against the oracle's own statement of each rule. */
for (const [m, name] of [['riskScoring', 'RISK_BANDS'], ['riskScoring', 'SCALE_MIN'], ['riskScoring', 'SCALE_MAX'],
  ['managementOfChange', 'EXPIRY_LEAD_DAYS'],
  ['managementOfChange', 'EMERGENCY_RATIFY_DAYS'], ['managementOfChange', 'STAGE_TRANSITIONS'],
  ['managementOfChange', 'ACTIVE_STAGES'], ['managementOfChange', 'IN_EFFECT_STAGES'],
  ['peerReview', 'COMMENT_TRANSITIONS'], ['peerReview', 'RESOLVED_STATUSES'], ['peerReview', 'BLOCKING_SEVERITIES'],
  ['peerReview', 'ACTIVE_STAGES'], ['peerReview', 'REVIEWER_ROLES'], ['lessonsLearned', 'REVIEW_LEAD_DAYS'], ['lessonsLearned', 'LESSON_TRANSITIONS'],
  ['lessonsLearned', 'LESSON_VISIBLE_STATUSES'], ['lessonsLearned', 'LESSON_LIVE_STATUSES'],
  ['lessonsLearned', 'EMBEDDING_OUTCOMES']]) {
  ledger.push({ m, constant: name, value: enc(RAW[m][name]) });
}

const CAL = guard('calendar');
const R = guard('riskScoring');
const M = guard('managementOfChange');
const P = guard('peerReview');
const L = guard('lessonsLearned');

/** A sort through an engine comparator factory, recorded for the oracle. */
const sortWith = (m, factory, factoryArgs, rows) => {
  const at = dateArgOf[m][factory];
  if (at === undefined || factoryArgs.length <= at || !isLocalMidnight(factoryArgs[at])) {
    throw new Error(`AS-OF GATE: ${m}.${factory} was given no date at local midnight`);
  }
  guardedDateCalls += 1;
  const cmp = RAW[m][factory](...factoryArgs);
  const order = [...rows].sort(cmp).map((r) => r.id);
  ledger.push({ m, sort: factory, factoryArgs: factoryArgs.map(enc), rows: rows.map(enc), order });
  return order;
};
const sortPlain = (m, fn, rows) => {
  const order = [...rows].sort(RAW[m][fn]).map((r) => r.id);
  ledger.push({ m, sort: fn, factory: false, rows: rows.map(enc), order });
  return order;
};

/* ------------------------------------------------------------------ *
 * Output, labels and refusal guards.
 * ------------------------------------------------------------------ */
const out = [];
const w = (s = '') => out.push(s);
const n0 = (x) => {
  if (!Number.isInteger(x)) throw new Error(`GENERATOR REFUSES: ${x} was printed as a count and is not a whole number`);
  return String(x);
};
const q = (s) => (s === null || s === undefined ? 'null' : `"${s}"`);
const yn = (b) => {
  if (b !== true && b !== false) throw new Error(`GENERATOR REFUSES: ${b} is not a yes or no`);
  return b ? 'yes' : 'no';
};
const lst = (a) => (a.length ? a.join(', ') : 'none');
const T = AS_OF;

let refusals = 0;
let answers = 0;
const REFUSED = 'REFUSED, ';
const refusal = (label, r) => {
  if (!r || r.ok !== false || typeof r.reason !== 'string' || !r.reason.trim()) {
    throw new Error(`GENERATOR REFUSES: "${label}" is labelled a refusal and the engine answered ${JSON.stringify(r)}`);
  }
  refusals += 1;
  return `${REFUSED}${label}: ${r.reason}`;
};
const allowed = (label, r) => {
  if (!r || r.ok !== true) {
    throw new Error(`GENERATOR REFUSES: "${label}" is labelled allowed and the engine refused: ${JSON.stringify(r)}`);
  }
  answers += 1;
  return `ALLOWED, ${label}.`;
};

/* Section headings are written out whole, owner clause included, so the
 * committed generator spells every heading the digest prints. */
const OWNER = /\(owned by ((?:Associate|Professional|Expert)[^)]*)\)$/;
const seen = new Set();
const sec = (heading) => {
  const m = /^SECTION (\d+): (.+)$/.exec(heading);
  if (!m || !OWNER.test(heading)) throw new Error(`GENERATOR REFUSES: malformed heading ${heading}`);
  const no = Number(m[1]);
  if (seen.has(no) || no !== seen.size + 1) throw new Error(`GENERATOR REFUSES: SECTION ${no} out of order`);
  for (const key of OWNER.exec(heading)[1].match(/\bm\d+\b/g) || []) {
    if (!/^m0[1-6]$/.test(key)) throw new Error(`GENERATOR REFUSES: ${heading} names ${key}`);
  }
  seen.add(no);
  w(`# ${heading}`);
  w();
};

/* ================================================================== *
 * PREAMBLE
 * ================================================================== */
w('# Risk, Change & Learning (riskchange). Teaching digest.');
if (NEG_LINE) w(NEG_LINE);
w(`# THE AS-OF DATE FOR EVERY LINE BELOW IS ${AS_OF_ISO}, a Thursday. Every status that depends on a date (review overdue, expired, expiring soon, awaiting or overdue ratification, review due soon, days until) is that status ON ${AS_OF_ISO}, and every engine call that takes a date was handed this one explicitly. None of them read a clock.`);
w('# Scores, levels, counts and days are whole numbers. Dates print as YYYY-MM-DD. Statuses, bands and verdicts print exactly as the engine spells them, in double quotes.');
w('# Built against engines 9d5d3b4 (ASC-0), vendored sha-identical: riskScoring, managementOfChange, peerReview, lessonsLearned and the calendar they share. Every figure is the engine answering at the inputs named beside it, except a line that says golden or measured.');
w('# Every engine answer printed here was also replayed through the independent Python oracle for its module (oracle_bridge.py), so each one is two methods agreeing.');
w('# A GOLDEN LINE IS NOT THE ENGINE ANSWERING. The published case files are written by the oracles.');
w();

/* ================================================================== *
 * SECTION 1
 * ================================================================== */
sec('SECTION 1: What these four engines decide, the one as-of date, and every door (owned by Associate m01)');
w('# App surface: four apps in the Suite Assurance module call these engines. The Risk Register (with its Heatmap tab) calls riskScoring, Management of Change calls managementOfChange, Peer Review Manager calls peerReview and Lessons Learned calls lessonsLearned. All four read calendar dates through calendar.js.');
w('- Each engine decides a STATE from a record: a band and an appetite verdict for a risk, a stage move and an expiry state for a change, a closure verdict for a review, an acceptance and an embedding verdict for a lesson. None of them stores anything. The app stores the record and asks the engine what it means.');
w('- Every verdict that can be refused comes back as an object with `ok`, and a refusal carries a `reason` a user can act on. The four engines refuse in the same shape.');
w();
w('Every export, measured by loading each module:');
w('| module | exports | functions | frozen tables and constants | functions that take a date |');
w('| --- | --- | --- | --- | --- |');
for (const m of ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned']) {
  const keys = Object.keys(RAW[m]);
  const fns = keys.filter((k) => typeof RAW[m][k] === 'function');
  w(`| ${m} | ${n0(keys.length)} | ${n0(fns.length)} | ${n0(keys.length - fns.length)} | ${n0(Object.keys(dateArgOf[m]).length)} |`);
}
w();
w('The functions that take a date, each read from its signature in the engine source (a parameter that defaults to the machine clock). Every one of them was handed the as-of date on every call this digest makes:');
for (const m of ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned']) {
  const names = Object.keys(dateArgOf[m]).sort();
  w(`- ${m}: ${names.map((f) => `${f} (argument ${n0(dateArgOf[m][f] + 1)})`).join(', ')}.`);
}
w('- A function that defaults its date to the clock answers a different question every day it is run. A report that does not state its as-of date cannot be checked by anybody, including its author the next morning.');
w();

/* ================================================================== *
 * SECTION 2
 * ================================================================== */
sec('SECTION 2: The five by five matrix, the product, and the four bands (owned by Associate m02)');
w(`- The scale runs from ${n0(RAW.riskScoring.SCALE_MIN)} to ${n0(RAW.riskScoring.SCALE_MAX)} on each axis, likelihood and impact. A score is the product of the two levels.`);
w('- The bands, as the engine carries them, highest first. Each band is found by its LOWER edge only:');
w('| band | lower edge | upper edge as written |');
w('| --- | --- | --- |');
for (const b of RAW.riskScoring.RISK_BANDS) w(`| ${q(b.band)} | ${n0(b.min)} | ${n0(b.max)} |`);
w();
w('All twenty five cells, likelihood down the side and impact across the top, each cell the score and its band:');
w('| likelihood \\ impact | 1 | 2 | 3 | 4 | 5 |');
w('| --- | --- | --- | --- | --- | --- |');
for (let l = 5; l >= 1; l -= 1) {
  const cells = [1, 2, 3, 4, 5].map((i) => {
    const s = R.calculateRiskScore(l, i);
    return `${n0(s)} ${R.getRiskBand(s)}`;
  });
  w(`| ${n0(l)} | ${cells.join(' | ')} |`);
}
{
  const tally = {};
  for (let l = 1; l <= 5; l += 1) for (let i = 1; i <= 5; i += 1) {
    const b = R.getRiskBand(R.calculateRiskScore(l, i));
    tally[b] = (tally[b] || 0) + 1;
  }
  w();
  w(`- Cells in each band, counted from the grid above: ${RAW.riskScoring.RISK_BAND_NAMES.map((b) => `${q(b)} ${n0(tally[b] || 0)}`).join(', ')}.`);
  const distinct = new Set();
  for (let l = 1; l <= 5; l += 1) for (let i = 1; i <= 5; i += 1) distinct.add(R.calculateRiskScore(l, i));
  const top = RAW.riskScoring.SCALE_MAX * RAW.riskScoring.SCALE_MAX;
  const holes = [];
  for (let s = 1; s <= top; s += 1) if (!distinct.has(s)) holes.push(s);
  w(`- The grid holds ${n0(distinct.size)} distinct scores. Of the whole numbers from ${n0(RAW.riskScoring.SCALE_MIN)} to ${n0(top)}, ${n0(holes.length)} are in no cell, because no two whole levels on this scale multiply to them: ${holes.map(n0).join(', ')}.`);
}
w();
w('Scores read against the bands, including the edge either side of each band and scores no cell of the grid holds:');
w('| score | band |');
w('| --- | --- |');
for (const s of BAND_PROBES) w(`| ${s} | ${q(R.getRiskBand(s))} |`);
w();
w('- A score above the grid still bands: the band is found by the lower edge alone, so the upper edge printed in the band table is a label rather than a limit. A score of zero or below reads "None", the one band that means no score.');
w();
w('What the scale accepts as a level, each probe scored against the other axis:');
w('| the likelihood given | as | impact | score | band |');
w('| --- | --- | --- | --- | --- |');
for (const [l, i, what] of LEVEL_PROBES) {
  const s = R.calculateRiskScore(l, i);
  w(`| ${what} | ${JSON.stringify(l)} | ${JSON.stringify(i)} | ${n0(s)} | ${q(R.getRiskBand(s))} |`);
}
w();
w('- The scale is five WHOLE levels. A fraction is off the scale and unscored, the same as a level of 6 or a blank: the engine returns a score of 0 and the band "None" rather than guessing a level. A whole number written as text or with a decimal point is still that level.');
w();

/* ================================================================== *
 * SECTION 3
 * ================================================================== */
sec('SECTION 3: Inherent and residual, the per-axis fallback, and appetite (owned by Associate m03)');
w('- The inherent score is the risk before any control. The residual score is the risk with its controls in place, scored from the residual likelihood and the residual impact.');
w('- A residual axis that has not been assessed FALLS BACK to the inherent level on that axis alone. Null, an absent key and a blank form field all mean "not assessed". A residual axis that WAS assessed with a value off the scale does not fall back: it leaves the residual unscored.');
w();
w('| residual probe (inherent likelihood 4, impact 5) | residual likelihood given | residual impact given | residual score | residual band |');
w('| --- | --- | --- | --- | --- |');
for (const [label, r] of RESIDUAL_PROBES) {
  const s = R.calculateResidualScore(r);
  w(`| ${label} | ${JSON.stringify(r.residual_likelihood)} | ${JSON.stringify(r.residual_impact)} | ${n0(s)} | ${q(R.getRiskBand(s))} |`);
}
w();
w(`- Appetite compares the RESIDUAL score with the risk's own target. The engine has three answers: ${Object.values(RAW.riskScoring.APPETITE).map(q).join(', ')}.`);
w('| appetite probe | residual score | target | appetite |');
w('| --- | --- | --- | --- |');
for (const [label, r] of APPETITE_PROBES) {
  w(`| ${label} | ${n0(R.calculateResidualScore(r))} | ${JSON.stringify(r.target_score)} | ${q(R.getAppetiteStatus(r))} |`);
}
w();
w('- A residual EQUAL to the target is within appetite. With no target, or a target of zero, or a residual that cannot be scored, the answer is "Not set": the engine declines to report a pass it has no basis for.');
w();

/* ================================================================== *
 * SECTION 4
 * ================================================================== */
sec('SECTION 4: A calendar date, whole days, and a review due today (owned by Associate m04)');
w(`- A calendar date is read at LOCAL midnight from its leading YYYY-MM-DD, and so is the as-of date, so a whole number of days separates any two of them in every time zone. Whole days from the as-of date, ${AS_OF_ISO}:`);
w('| date given | as | parsed | days until |');
w('| --- | --- | --- | --- |');
for (const [label, d] of CALENDAR_PROBES) {
  const parsed = RAW.calendar.toDateOnlyString(d);
  ledger.push({ m: 'calendar', fn: 'toDateOnlyString', args: [enc(d)], result: enc(parsed) });
  const days = CAL.daysUntil(d, T());
  w(`| ${label} | ${JSON.stringify(d)} | ${parsed === null ? 'null' : parsed} | ${days === null ? 'null' : n0(days)} |`);
}
w();
w('- A date that does not exist is no date at all: 30 February and a thirteenth month both parse to null, and so does text. The engine never rolls an impossible date over into a real one.');
w('- A timestamp is read by its leading date only. The late-evening UTC timestamp above is the calendar date its first ten characters name, whatever the zone the reader is in.');
w();
w(`- A risk review is overdue when the risk is LIVE and its review date has PASSED: days until below zero. A review due on the as-of date is not overdue, and a risk that is not live carries no review obligation at all. On the OBODO register, read on ${AS_OF_ISO}:`);
w('| risk | status | next review | days until | review overdue |');
w('| --- | --- | --- | --- | --- |');
const LIVE = RAW.riskScoring.RISK_LIVE_STATUSES;
for (const r of OBODO_RISKS) {
  const days = CAL.daysUntil(r.next_review_date, T());
  w(`| ${r.id} | ${q(r.status)} | ${r.next_review_date ?? 'null'} | ${days === null ? 'null' : n0(days)} | ${yn(R.isReviewOverdue(r, T()))} |`);
}
w();
{
  const ob10 = OBODO_RISKS.find((r) => r.id === 'OB-10');
  w(`- OB-10 is ${q(ob10.status)} and its review date is ${n0(CAL.daysUntil(ob10.next_review_date, T()))} days away, and OB-09 is ${q(OBODO_RISKS.find((r) => r.id === 'OB-09').status)} with no review date. Neither can read overdue whatever its date, because the test asks the status first.`);
  const probe = { status: 'Closed', next_review_date: '2026-09-30' };
  w(`- The same question of a Closed risk whose review date passed the day before the as-of date: overdue ${yn(R.isReviewOverdue(probe, T()))}. The same risk as ${q('Open')}: overdue ${yn(R.isReviewOverdue({ ...probe, status: 'Open' }, T()))}.`);
}
w();

/* ================================================================== *
 * SECTION 5
 * ================================================================== */
sec('SECTION 5: The register as a whole: live risks, and counting by band (owned by Associate m05)');
w(`- Live statuses, the risks an organisation still carries: ${LIVE.map(q).join(', ')}. Not live: ${RAW.riskScoring.RISK_NOT_LIVE_STATUSES.map(q).join(', ')}. A Mitigated risk is still carried, because mitigation lowers the residual without removing the risk.`);
w();
w('The OBODO register, every risk derived once through deriveRiskFields:');
w('| risk | status | L | I | inherent | inherent band | residual L | residual I | residual | residual band | target | appetite |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of OBODO_RISKS) {
  const d = R.deriveRiskFields(r);
  w(`| ${r.id} | ${q(r.status)} | ${r.likelihood} | ${r.impact} | ${n0(d.inherentScore)} | ${q(d.inherentBand)} | ${JSON.stringify(r.residual_likelihood)} | ${JSON.stringify(r.residual_impact)} | ${n0(d.residualScore)} | ${q(d.residualBand)} | ${JSON.stringify(r.target_score)} | ${q(d.appetite_status)} |`);
}
w();
w('- `rating`, the column the register stores, is the INHERENT band, and it is written from the engine on every save.');
w();
const liveRisks = OBODO_RISKS.filter((r) => LIVE.includes(r.status));
w(`- The register holds ${n0(OBODO_RISKS.length)} risks and ${n0(liveRisks.length)} of them are live.`);
w('countByBand, which counts whatever list it is handed. Four populations of the same register:');
w(`| population | ${[...RAW.riskScoring.RISK_BAND_NAMES, RAW.riskScoring.NO_BAND].map(q).join(' | ')} |`);
w(`| --- | --- | --- | --- | --- | --- |`);
const POPS = [];
for (const [label, rows, opts] of [
  ['every risk, inherent', OBODO_RISKS, undefined],
  ['every risk, residual', OBODO_RISKS, { residual: true }],
  ['live risks, inherent', liveRisks, undefined],
  ['live risks, residual', liveRisks, { residual: true }],
]) {
  const c = opts ? R.countByBand(rows, opts) : R.countByBand(rows);
  POPS.push(c);
  w(`| ${label} | ${[...RAW.riskScoring.RISK_BAND_NAMES, RAW.riskScoring.NO_BAND].map((b) => n0(c[b])).join(' | ')} |`);
}
w();
w(`- The same register gives Critical counts of ${POPS.map((p) => n0(p.Critical)).join(', ')} across those four rows, ${n0(new Set(POPS.map((p) => p.Critical)).size)} different values, depending on two choices the CALLER makes: which risks to hand over, and whether to count inherent or residual. The engine does not filter by status. Each count is right for the question it answers, and a dashboard tile has to say which question that is.`);
w('# App surface: the Risk Register dashboard counts Open and Under Review risks and plots them INHERENT; the Heatmap tab plots the four live statuses INHERENT; the Assurance hub counts live risks through countByBand. RECON.md records the two heatmaps disagreeing as a finding.');
w();

/* ================================================================== *
 * SECTION 6
 * ================================================================== */
sec('SECTION 6: The OBODO register end to end (owned by Associate m06)');
{
  const pick = (id) => OBODO_RISKS.find((r) => r.id === id);
  for (const id of ['OB-02', 'OB-08', 'OB-01']) {
    const r = pick(id);
    const d = R.deriveRiskFields(r);
    w(`- ${id}, ${r.title}, ${q(r.status)}. Inherent ${n0(r.likelihood)} by ${n0(r.impact)} scores ${n0(d.inherentScore)}, ${q(d.inherentBand)}. Residual likelihood ${JSON.stringify(r.residual_likelihood)}, residual impact ${JSON.stringify(r.residual_impact)}: residual ${n0(d.residualScore)}, ${q(d.residualBand)}. Target ${JSON.stringify(r.target_score)}: ${q(d.appetite_status)}. Next review ${r.next_review_date}, ${n0(CAL.daysUntil(r.next_review_date, T()))} days from the as-of date, overdue ${yn(R.isReviewOverdue(r, T()))}.`);
  }
  const above = liveRisks.filter((r) => R.getAppetiteStatus(r) === RAW.riskScoring.APPETITE.ABOVE).map((r) => r.id);
  const within = liveRisks.filter((r) => R.getAppetiteStatus(r) === RAW.riskScoring.APPETITE.WITHIN).map((r) => r.id);
  const notSet = liveRisks.filter((r) => R.getAppetiteStatus(r) === RAW.riskScoring.APPETITE.NOT_SET).map((r) => r.id);
  const overdue = liveRisks.filter((r) => R.isReviewOverdue(r, T())).map((r) => r.id);
  w(`- Live risks above appetite: ${n0(above.length)} (${lst(above)}). Within: ${n0(within.length)} (${lst(within)}). Not set: ${n0(notSet.length)} (${lst(notSet)}).`);
  w(`- Live risks whose review is overdue on ${AS_OF_ISO}: ${n0(overdue.length)} (${lst(overdue)}). OB-01 is due on the as-of date itself and is not among them.`);
  const reduction = liveRisks.map((r) => [r.id, R.calculateRiskScore(r.likelihood, r.impact) - R.calculateResidualScore(r)]);
  w(`- Inherent minus residual on each live risk (derived, the two engine scores subtracted): ${reduction.map(([id, v]) => `${id} ${n0(v)}`).join(', ')}. OB-08 shows its whole inherent score as a reduction only because its residual is unscored, OB-11 shows zero because neither of its scores exists, and OB-03 shows zero because its residual was never assessed: a subtraction over an unscored or unassessed value describes no control at all.`);
}
w();

/* ================================================================== *
 * SECTION 7
 * ================================================================== */
const MX = RAW.managementOfChange;
sec('SECTION 7: A change and its stages: the legal moves and the final stages (owned by Professional m01)');
w(`- The stages, in workflow order: ${MX.STAGES.map(q).join(', ')}.`);
w(`- Active, still live work: ${MX.ACTIVE_STAGES.map(q).join(', ')}. In effect, on the facility: ${MX.IN_EFFECT_STAGES.map(q).join(', ')}. Terminal: ${MX.TERMINAL_STAGES.map(q).join(', ')}.`);
w(`- Change types: ${MX.CHANGE_TYPES.map(q).join(', ')}. The types that must carry an expiry date: ${MX.EXPIRING_TYPES.map(q).join(', ')}.`);
w();
w('| from | legal next stages |');
w('| --- | --- |');
for (const s of MX.STAGES) w(`| ${q(s)} | ${lst(M.nextStages(s).map(q))} |`);
w();
{
  const dead = MX.STAGES.filter((s) => RAW.managementOfChange.nextStages(s).length === 0);
  const intoImpl = MX.STAGES.filter((s) => RAW.managementOfChange.nextStages(s).includes('Implementation'));
  w(`- Only ${lst(intoImpl.map(q))} leads to Implementation. ${n0(dead.length)} stages lead nowhere (${lst(dead.map(q))}), and a change can step back from Screening, Review and Approval to the stage before.`);
}
w();
w('Moves the engine refuses, with its own words:');
for (const [label, moc, to] of [
  ['Review straight to Closed', { stage: 'Review' }, 'Closed'],
  ['Draft straight to Approval', { stage: 'Draft' }, 'Approval'],
  ['Implementation back to Approval', { stage: 'Implementation' }, 'Approval'],
  ['a Closed change moved anywhere', { stage: 'Closed' }, 'Implementation'],
  ['a Rejected change moved anywhere', { stage: 'Rejected' }, 'Review'],
]) w(`- ${refusal(label, M.canAdvance(moc, to, { approvals: [], actions: [] }))}`);
w(`- ${allowed('Draft to Screening', M.canAdvance({ stage: 'Draft' }, 'Screening', { approvals: [], actions: [] }))}`);
w();

/* ================================================================== *
 * SECTION 8
 * ================================================================== */
sec('SECTION 8: Approval levels: one signature a level, and a rejection that stops the gate (owned by Professional m02)');
w('- Levels come from the approval rows themselves: every distinct level present must carry at least one Approved row, and no row at any level may be Rejected. A row with no level counts as level 1.');
w(`- Approval statuses: ${MX.APPROVAL_STATUSES.map(q).join(', ')}.`);
w();
w('| approval set | levels | outstanding | rejected rows | complete |');
w('| --- | --- | --- | --- | --- |');
for (const [label, rows] of APPROVAL_SETS) {
  const s = M.approvalState(rows);
  w(`| ${label} | ${lst(s.levels.map(String))} | ${lst(s.outstanding.map(String))} | ${n0(s.rejected.length)} | ${yn(s.complete)} |`);
}
w();
w('- A Delegated row is not an Approved row, so its level stays outstanding. Two signers at one level need only one of them to sign. A rejection anywhere makes the set incomplete even when every level has an Approved row.');
w();

/* ================================================================== *
 * SECTION 9
 * ================================================================== */
sec('SECTION 9: Segregation of duties: the originator never approves, and only the assignee decides (owned by Professional m03)');
{
  const moc = ESANMI_MOCS.find((m) => m.id === 'ES-01');
  w(`- ES-01, ${moc.title}, was raised by ${moc.originator_id}. Its level 2 approval is assigned to u-emeka.`);
  w(`- ${refusal('assigning the originator as an approver', M.canAssignApprover(moc, moc.originator_id))}`);
  w(`- ${refusal('assigning nobody', M.canAssignApprover(moc, null))}`);
  w(`- ${allowed('assigning u-halima, who is independent of the change', M.canAssignApprover(moc, 'u-halima'))}`);
  const pending = { id: 'AP-02', level: 2, status: 'Pending', approver_id: 'u-emeka' };
  w(`- ${allowed('u-emeka deciding the approval assigned to u-emeka', M.canDecideApproval(pending, moc, 'u-emeka'))}`);
  w(`- ${refusal('u-halima deciding an approval assigned to u-emeka', M.canDecideApproval(pending, moc, 'u-halima'))}`);
  w(`- ${refusal('nobody signed in', M.canDecideApproval(pending, moc, null))}`);
  w(`- ${refusal('the originator deciding an approval somebody assigned to them', M.canDecideApproval({ ...pending, approver_id: moc.originator_id }, moc, moc.originator_id))}`);
  w(`- ${refusal('deciding an approval that is already Approved', M.canDecideApproval({ ...pending, status: 'Approved' }, moc, 'u-emeka'))}`);
  w(`- ${refusal('deciding an approval that is already Rejected', M.canDecideApproval({ ...pending, status: 'Rejected' }, moc, 'u-emeka'))}`);
  w('- The rule is owner policy, decided on 2026-09-18 (AS15, D1): an approval is decided only by the member it is assigned to, never by the change originator, and an absence is covered by reassigning the approval. The database enforces the same rule.');
}
w();

/* ================================================================== *
 * SECTION 10
 * ================================================================== */
sec('SECTION 10: Actions and the two gates: into Implementation and into Closed (owned by Professional m04)');
w(`- Action types: ${MX.ACTION_TYPES.map(q).join(', ')}. Action statuses: ${MX.ACTION_STATUSES.map(q).join(', ')}. Complete and Cancelled actions are finished; Open and In progress are not.`);
w('- Into Implementation: every approval level signed with no rejection (an Emergency change needs only its first level), no Pre-implementation action unfinished, and a Temporary or Emergency change needs a READABLE expiry date. Into Closed: no Implementation or Post-implementation action unfinished, and an Emergency change needs every level signed.');
w();
{
  const es01 = ESANMI_MOCS.find((m) => m.id === 'ES-01');
  const aps = (id) => ESANMI_APPROVALS.filter((a) => a.moc_id === id);
  const acs = (id) => ESANMI_ACTIONS.filter((a) => a.moc_id === id);
  const signed = [{ level: 1, status: 'Approved' }, { level: 2, status: 'Approved' }, { level: 3, status: 'Approved' }];
  w(`- ${refusal('ES-01 into Implementation as it stands, levels 2 and 3 unsigned', M.canAdvance(es01, 'Implementation', { approvals: aps('ES-01'), actions: acs('ES-01') }))}`);
  w(`- ${refusal('ES-01 into Implementation with every level signed and one Pre-implementation action still Open', M.canAdvance(es01, 'Implementation', { approvals: signed, actions: acs('ES-01') }))}`);
  w(`- ${allowed('ES-01 into Implementation with every level signed and its actions finished', M.canAdvance(es01, 'Implementation', { approvals: signed, actions: acs('ES-01').map((a) => ({ ...a, status: 'Complete' })) }))}`);
  w(`- ${refusal('a change with no approval rows at all', M.canAdvance(es01, 'Implementation', { approvals: [], actions: [] }))}`);
  w(`- ${refusal('a change with every level signed and one rejection', M.canAdvance(es01, 'Implementation', { approvals: [...signed, { level: 2, status: 'Rejected' }], actions: [] }))}`);
  w(`- ${refusal('a Temporary change whose expiry reads "after the turnaround"', M.canAdvance({ stage: 'Approval', type: 'Temporary', expiry_date: 'after the turnaround' }, 'Implementation', { approvals: signed, actions: [] }))}`);
  w(`- ${refusal('a Temporary change with no expiry date', M.canAdvance({ stage: 'Approval', type: 'Temporary' }, 'Implementation', { approvals: signed, actions: [] }))}`);
  w(`- ${allowed('a Temporary change with a readable expiry and every level signed', M.canAdvance({ stage: 'Approval', type: 'Temporary', expiry_date: '2026-12-31' }, 'Implementation', { approvals: signed, actions: [] }))}`);
  const es02 = ESANMI_MOCS.find((m) => m.id === 'ES-02');
  w(`- ${refusal('ES-02 into Closed with its Post-implementation action In progress', M.canAdvance(es02, 'Closed', { approvals: aps('ES-02'), actions: acs('ES-02') }))}`);
  w(`- ${allowed('ES-02 into Closed once that action is Complete', M.canAdvance(es02, 'Closed', { approvals: aps('ES-02'), actions: acs('ES-02').map((a) => ({ ...a, status: 'Complete' })) }))}`);
  w(`- ${allowed('ES-02 into Cancelled, which no action blocks', M.canAdvance(es02, 'Cancelled', { approvals: aps('ES-02'), actions: acs('ES-02') }))}`);
}
w();

/* ================================================================== *
 * SECTION 11
 * ================================================================== */
sec('SECTION 11: Temporary and emergency change: expiry, the lead, and ratification (owned by Professional m05)');
w(`- Expiry states: ${Object.values(MX.EXPIRY).map(q).join(', ')}. The lead before an expiry starts reading "Expiring soon" is EXPIRY_LEAD_DAYS, ${n0(MX.EXPIRY_LEAD_DAYS)} days, counted inclusively.`);
w('- Only a change IN EFFECT can expire. A temporary change still in Screening or Review is not running anywhere, so its expiry date is a plan.');
w();
w(`One Temporary change in Implementation, its expiry moved across the as-of date ${AS_OF_ISO}:`);
w('| expiry date | days until | expiry state |');
w('| --- | --- | --- |');
const shift = (days) => {
  const d = new Date(AS_OF_PARTS[0], AS_OF_PARTS[1] - 1, AS_OF_PARTS[2] + days);
  const s = RAW.calendar.toDateOnlyString(d);
  return s;
};
for (const k of EXPIRY_DAY_SWEEP) {
  const e = shift(k);
  w(`| ${e} | ${n0(CAL.daysUntil(e, T()))} | ${q(M.expiryState({ type: 'Temporary', stage: 'Implementation', expiry_date: e }, T()))} |`);
}
w();
w('The same expiry date, one day past, across types and stages:');
w('| type | stage | expiry state | counted expired |');
w('| --- | --- | --- | --- |');
for (const [type, stage] of [['Temporary', 'Implementation'], ['Emergency', 'Implementation'], ['Temporary', 'Closed'],
  ['Temporary', 'Review'], ['Temporary', 'Screening'], ['Temporary', 'Cancelled'], ['Permanent', 'Implementation']]) {
  const m = { type, stage, expiry_date: shift(-1) };
  w(`| ${q(type)} | ${q(stage)} | ${q(M.expiryState(m, T()))} | ${yn(M.isExpired(m, T()))} |`);
}
w(`- An expiry that cannot be read is no expiry: ${q(M.expiryState({ type: 'Temporary', stage: 'Implementation', expiry_date: 'after the turnaround' }, T()))} for a Temporary change in Implementation whose expiry reads "after the turnaround".`);
w();
w(`- An Emergency change may go into Implementation once its FIRST approval level has signed and nobody has rejected it. Every other level must then sign within EMERGENCY_RATIFY_DAYS, ${n0(MX.EMERGENCY_RATIFY_DAYS)} days, of the actual implementation date, and the change cannot close until they have. Ratification states: ${Object.values(MX.RATIFICATION).map(q).join(', ')}.`);
{
  const signed1 = [{ level: 1, status: 'Approved' }, { level: 2, status: 'Pending' }];
  w(`- ${allowed('an Emergency change in Approval into Implementation with level 1 signed and level 2 pending', M.canAdvance({ stage: 'Approval', type: 'Emergency', expiry_date: '2026-12-31' }, 'Implementation', { approvals: signed1, actions: [] }))}`);
  w(`- ${refusal('the same change with level 1 unsigned', M.canAdvance({ stage: 'Approval', type: 'Emergency', expiry_date: '2026-12-31' }, 'Implementation', { approvals: [{ level: 1, status: 'Pending' }, { level: 2, status: 'Pending' }], actions: [] }))}`);
  w(`- ${refusal('a Permanent change with level 1 signed and level 2 pending', M.canAdvance({ stage: 'Approval', type: 'Permanent' }, 'Implementation', { approvals: signed1, actions: [] }))}`);
  w(`- ${refusal('an Emergency change in Implementation into Closed with level 2 still unsigned', M.canAdvance({ stage: 'Implementation', type: 'Emergency' }, 'Closed', { approvals: signed1, actions: [] }))}`);
  w();
  w(`One Emergency change in Implementation with level 2 unsigned, its implementation date moved back from ${AS_OF_ISO}:`);
  w('| implemented on | days since | ratification due | state |');
  w('| --- | --- | --- | --- |');
  for (const k of RATIFY_DAY_SWEEP) {
    const went = shift(-k);
    const r = M.ratificationState({ type: 'Emergency', stage: 'Implementation', actual_implementation_date: went }, signed1, T());
    w(`| ${went} | ${n0(k)} | ${r.dueDate} | ${q(r.state)} |`);
  }
  const none = M.ratificationState({ type: 'Emergency', stage: 'Implementation' }, signed1, T());
  w(`- With no implementation date recorded: due ${none.dueDate === null ? 'null' : none.dueDate}, ${q(none.state)}. The window cannot be shown to be open, so it fails closed.`);
  const done = M.ratificationState({ type: 'Emergency', stage: 'Implementation', actual_implementation_date: shift(-30) },
    [{ level: 1, status: 'Approved' }, { level: 2, status: 'Approved' }], T());
  w(`- Every level signed: ${q(done.state)}, however long ago it went in.`);
  const perm = M.ratificationState({ type: 'Temporary', stage: 'Implementation', actual_implementation_date: shift(-30) }, signed1, T());
  w(`- A Temporary change: ${q(perm.state)}. Ratification belongs to the emergency route alone.`);
}
w('- The emergency route and its ratification window are owner policy (AS15, Q9, decided on 2026-09-18): reduced authority up front so a hazard can be dealt with, full review after the event.');
w();

/* ================================================================== *
 * SECTION 12
 * ================================================================== */
sec('SECTION 12: The ESANMI register end to end, summarised and sorted by urgency (owned by Professional m06)');
w(`The ESANMI change register, read on ${AS_OF_ISO}:`);
w('| change | type | stage | target | expiry | expiry state | overdue | ratification | due |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const m of ESANMI_MOCS) {
  const r = M.ratificationState(m, ESANMI_APPROVALS.filter((a) => a.moc_id === m.id), T());
  w(`| ${m.id} | ${q(m.type)} | ${q(m.stage)} | ${m.target_implementation_date ?? 'null'} | ${m.expiry_date ?? 'null'} | ${q(M.expiryState(m, T()))} | ${yn(M.isOverdue(m, T()))} | ${q(r.state)} | ${r.dueDate ?? 'null'} |`);
}
w();
{
  const lateStages = MX.ACTIVE_STAGES.filter((st) => !MX.IN_EFFECT_STAGES.includes(st));
  const inImpl = ESANMI_MOCS.filter((m) => m.stage === 'Implementation');
  const pastTarget = inImpl.filter((m) => CAL.daysUntil(m.target_implementation_date, T()) < 0);
  w(`- A change is overdue only BEFORE it is on the facility: in ${lst(lateStages.map(q))}, with its target implementation date passed. Of the ${n0(inImpl.length)} changes in Implementation here, ${n0(pastTarget.length)} are past their target date and none reads overdue, because being in effect means the target was met or passed by the fact of it. Late work after that point shows as overdue ACTIONS.`);
}
w();
w('The action log:');
w('| action | change | type | status | due |');
w('| --- | --- | --- | --- | --- |');
for (const a of ESANMI_ACTIONS) w(`| ${a.id} | ${a.moc_id} | ${q(a.action_type)} | ${q(a.status)} | ${a.due_date} |`);
w('- AC-09 names change ES-99, which is not in this register. An action whose change is not supplied still counts: not knowing the parent is no reason to hide the work.');
w();
{
  const s = M.summarise(ESANMI_MOCS, { actions: ESANMI_ACTIONS, approvals: ESANMI_APPROVALS }, T());
  w('summarise, the dashboard and report counts, computed once:');
  w('| count | value |');
  w('| --- | --- |');
  for (const k of ['total', 'active', 'awaitingApproval', 'expired', 'expiringSoon', 'overdue', 'openActions', 'overdueActions', 'ratificationPending', 'ratificationOverdue']) {
    w(`| ${k} | ${n0(s[k])} |`);
  }
  w(`- By stage: ${MX.STAGES.map((st) => `${q(st)} ${n0(s.byStage[st])}`).join(', ')}.`);
  w(`- By risk level: ${MX.RISK_LEVELS.map((rl) => `${q(rl)} ${n0(s.byRisk[rl])}`).join(', ')}.`);
  w('- openActions and overdueActions skip AC-06 and AC-07, whose changes (ES-06 Closed, ES-09 Cancelled) are finished and locked. They count AC-09, whose change is unknown. A Cancelled action (AC-08) is finished.');
}
w();
w(`byUrgency on ${AS_OF_ISO}, most urgent first. Expired changes first, then expiring soon, then overdue, then other live work, then everything finished; within a rank the earlier expiry or target date first:`);
w(`- ${sortWith('managementOfChange', 'byUrgency', [T()], ESANMI_MOCS).join(', ')}`);
w();

/* ================================================================== *
 * SECTION 13
 * ================================================================== */
const PX = RAW.peerReview;
sec('SECTION 13: The comment loop: six dispositions and who moves each one (owned by Expert m01)');
w(`- Review stages: ${PX.STAGES.map(q).join(', ')}. Active: ${PX.ACTIVE_STAGES.map(q).join(', ')}.`);
w(`- Comment severities, worst first: ${PX.SEVERITIES.map(q).join(', ')}. Blocking: ${PX.BLOCKING_SEVERITIES.map(q).join(', ')}.`);
w(`- Comment statuses: ${PX.COMMENT_STATUSES.map(q).join(', ')}. Resolved, needing nobody to act: ${PX.RESOLVED_STATUSES.map(q).join(', ')}.`);
w();
w('| from | legal next statuses | who makes each move |');
w('| --- | --- | --- |');
for (const s of PX.COMMENT_STATUSES) {
  const nx = P.nextStatuses(s);
  w(`| ${q(s)} | ${lst(nx.map(q))} | ${lst(nx.map((t) => `${t} by the ${PX.TRANSITION_ACTOR[t]}`))} |`);
}
w();
w('Every disposition asked for every move, the engine explaining each refusal in its own words:');
for (const from of PX.COMMENT_STATUSES) {
  for (const to of PX.COMMENT_STATUSES) {
    const msg = P.explainRefusal({ status: from, response_text: 'A response.' }, to);
    if (msg !== null) w(`- REFUSED, ${from} to ${to}: ${msg}`);
  }
}
w(`- REFUSED, Responded to Verified with no response text on the comment: ${P.explainRefusal({ status: 'Responded', response_text: '  ' }, 'Verified')}`);
w(`- REFUSED, a comment with no status, which reads as Open, moved to Closed: ${P.explainRefusal({}, 'Closed')}`);
{
  let legal = 0;
  for (const from of PX.COMMENT_STATUSES) for (const to of PX.COMMENT_STATUSES) if (P.canTransition(from, to)) legal += 1;
  w(`- Of the ${n0(PX.COMMENT_STATUSES.length * PX.COMMENT_STATUSES.length)} ordered pairs of statuses, ${n0(legal)} are legal moves.`);
}
w();

/* ================================================================== *
 * SECTION 14
 * ================================================================== */
sec('SECTION 14: Closing a review: the blocking comments, overdue reviews, and the counts (owned by Expert m02)');
{
  const ik01 = IKANG_REVIEWS.find((r) => r.id === 'IK-01');
  w(`- IK-01, ${ik01.title}, is in ${q(ik01.stage)}. Its comment log:`);
  w('| comment | severity | status | resolved | blocking |');
  w('| --- | --- | --- | --- | --- |');
  for (const c of IKANG_COMMENTS) w(`| ${c.id} | ${c.severity === null ? 'none' : q(c.severity)} | ${q(c.status)} | ${yn(P.isResolved(c))} | ${yn(P.isBlocking(c))} |`);
  const cc = P.canClose(IKANG_COMMENTS);
  w();
  w(`- ${refusal('closing IK-01 as it stands', cc)}`);
  w(`- The blocking comments are ${lst(cc.blocking.map((c) => c.id))}: ${n0(cc.blocking.length)} in all.`);
  w('- A Responded comment still blocks, because the reviewer has not accepted the response. A Rejected comment still blocks, because the reviewer did not accept it. A Minor, an Editorial or an unrated comment never blocks, open or not.');
  const after = IKANG_COMMENTS.map((c) => (cc.blocking.some((b) => b.id === c.id) ? { ...c, status: 'Withdrawn' } : c));
  w(`- ${allowed('closing IK-01 once its blocking comments are withdrawn, with a Minor, an Editorial and an unrated comment still Open', P.canClose(after))}`);
  const s1 = P.summarise([ik01], IKANG_COMMENTS, T());
  w(`- summarise over IK-01 and its own log: totalComments ${n0(s1.totalComments)}, openComments ${n0(s1.openComments)}, blockingComments ${n0(s1.blockingComments)}. By status: ${PX.COMMENT_STATUSES.map((st) => `${q(st)} ${n0(s1.byStatus[st])}`).join(', ')}. By severity: ${PX.SEVERITIES.map((sv) => `${q(sv)} ${n0(s1.bySeverity[sv])}`).join(', ')}.`);
  w('- The unrated comment C-09 is in the comment total and in openComments and in no severity column.');
  w(`- Comments worst first, unresolved before resolved (bySeverityThenAge): ${sortPlain('peerReview', 'bySeverityThenAge', IKANG_COMMENTS).join(', ')}.`);
}
w();
w(`The IKANG review register on ${AS_OF_ISO}:`);
w('| review | stage | due | overdue |');
w('| --- | --- | --- | --- |');
for (const r of IKANG_REVIEWS) w(`| ${r.id} | ${q(r.stage)} | ${r.due_date} | ${yn(P.isOverdue(r, T()))} |`);
{
  const s = P.summarise(IKANG_REVIEWS, [], T());
  w(`- Reviews ${n0(s.total)}, active ${n0(s.active)}, overdue ${n0(s.overdue)}. IK-02 is due on the as-of date and is not overdue. IK-04 is Cancelled and never overdue, whatever its date.`);
  w(`- byUrgency: ${sortWith('peerReview', 'byUrgency', [T()], IKANG_REVIEWS).join(', ')}.`);
}
{
  const ik01 = IKANG_REVIEWS.find((r) => r.id === 'IK-01');
  w(`- SEGREGATION OF DUTIES IN PEER REVIEW. The author of the work under review never reviews it. IK-01's author is ${ik01.author_id}. Reviewer roles: ${PX.REVIEWER_ROLES.map(q).join(', ')}. Putting people on the review:`);
  for (const [label, p] of IKANG_PARTICIPANTS) {
    const r = P.canAssignPeerReviewer(ik01, p);
    w(`- ${r.ok ? allowed(label, r) : refusal(label, r)}`);
  }
  w('- Acting on a comment: the moves TRANSITION_ACTOR gives to the reviewer (Verified, Rejected, Withdrawn) are never taken by the author. The author\'s own move (Responded) and the coordinator\'s (Closed) are not restricted by this rule.');
  const c03 = IKANG_COMMENTS.find((c) => c.id === 'C-03');
  const c01 = IKANG_COMMENTS.find((c) => c.id === 'C-01');
  const c02 = IKANG_COMMENTS.find((c) => c.id === 'C-02');
  for (const [label, c, to, who] of [
    [`the author verifying C-03, a Responded comment on their own work`, c03, 'Verified', ik01.author_id],
    [`the author rejecting C-03`, c03, 'Rejected', ik01.author_id],
    [`the author withdrawing C-01, an Open comment`, c01, 'Withdrawn', ik01.author_id],
    [`u-kemi, independent of the work, verifying C-03`, c03, 'Verified', 'u-kemi'],
    [`the author responding to C-01`, c01, 'Responded', ik01.author_id],
    [`the author closing out C-02, a Verified comment`, c02, 'Closed', ik01.author_id],
    [`u-kemi responding to C-02, which is already Verified`, c02, 'Responded', 'u-kemi'],
    [`nobody signed in, verifying C-03`, c03, 'Verified', null],
  ]) {
    const r = P.canActOnComment(c, to, ik01, who);
    w(`- ${r.ok ? allowed(label, r) : refusal(label, r)}`);
  }
  w('- This is the owner decision D1 of 2026-09-18 (segregation of duties), applied to peer review at ASC-0 in the engine; the app and the database follow it with the Suite pull request that ships ASC-0.');
}
w();
w('The whole IKANG register summarised, with the comments on the other reviews:');
{
  const all = [...IKANG_COMMENTS, ...IKANG_OTHER_COMMENTS];
  w('| comment | review | review stage | severity | status | blocking on its own |');
  w('| --- | --- | --- | --- | --- | --- |');
  for (const c of IKANG_OTHER_COMMENTS) {
    const rv = IKANG_REVIEWS.find((r) => r.id === c.review_id);
    w(`| ${c.id} | ${c.review_id} | ${q(rv.stage)} | ${q(c.severity)} | ${q(c.status)} | ${yn(P.isBlocking(c))} |`);
  }
  const s = P.summarise(IKANG_REVIEWS, all, T());
  w(`- summarise over all five reviews and all ${n0(all.length)} comments: totalComments ${n0(s.totalComments)}, open ${n0(s.openComments)}, blocking ${n0(s.blockingComments)}.`);
  w('- C-10 and C-11 are on IK-04, which is Cancelled and locked, so nobody can resolve them: they stay in the comment total and in the severity and status columns, and they are not counted as open or blocking. C-12 is on IK-02, which is live, and counts.');
}
w();

/* ================================================================== *
 * SECTION 15
 * ================================================================== */
const LX = RAW.lessonsLearned;
sec('SECTION 15: A lesson: its three parts, and the author who may not validate it (owned by Expert m03)');
w(`- Lesson statuses: ${LX.LESSON_STATUSES.map(q).join(', ')}. Live: ${LX.LESSON_LIVE_STATUSES.map(q).join(', ')}. Accepted by the organisation: ${LX.LESSON_ACCEPTED_STATUSES.map(q).join(', ')}. Visible to everyone: ${LX.LESSON_VISIBLE_STATUSES.map(q).join(', ')}.`);
w('- A lesson has substance when it records what happened, why it happened and what to do about it. The first two without the third are a story.');
w();
w('| lesson | status | substance | missing | accepted | visible |');
w('| --- | --- | --- | --- | --- | --- |');
for (const l of ONNE_LESSONS) {
  w(`| ${l.id} | ${q(l.status)} | ${yn(L.hasSubstance(l))} | ${lst(L.missingSubstance(l))} | ${yn(L.isAccepted(l))} | ${yn(L.isVisible(l))} |`);
}
w();
{
  const on01 = { ...ONNE_LESSONS.find((l) => l.id === 'ON-01'), status: 'Submitted' };
  const on06 = ONNE_LESSONS.find((l) => l.id === 'ON-06');
  w(`- ON-01 was written by ${on01.author_id}. Read as if it were still Submitted:`);
  w(`- ${refusal('its author validating it', L.canValidate(on01, on01.author_id))}`);
  w(`- ${refusal('its author validating it while typing a colleague name as the validator', L.canValidate(on01, on01.author_id, { validator_name: 'G. Okon' }))}`);
  w(`- ${allowed('u-grace, who did not write it, validating it', L.canValidate(on01, 'u-grace'))}`);
  w(`- ${allowed('u-grace recording an external reviewer by name', L.canValidate(on01, 'u-grace', { validator_name: 'An external reviewer' }))}`);
  w(`- ${refusal(`ON-06, which has no recommendation, validated by u-grace`, L.canValidate(on06, 'u-grace'))}`);
  w('- The actor is always the signed-in person doing the validation, whatever name is typed (AS15, Q10, decided on 2026-09-18). A typed name records an external reviewer and cannot launder the author.');
  w(`- ${refusal('ON-05 moved to Published after its validation record is removed', L.canAdvanceLesson({ ...ONNE_LESSONS.find((l) => l.id === 'ON-05'), validated_at: null, validated_by: null }, 'Published', {}))}`);
  w(`- ${allowed('ON-05, validated by u-grace, moved to Published', L.canAdvanceLesson(ONNE_LESSONS.find((l) => l.id === 'ON-05'), 'Published', {}))}`);
}
w();

/* ================================================================== *
 * SECTION 16
 * ================================================================== */
sec('SECTION 16: Proof of use: applications, the reuse record, and embedding (owned by Expert m04)');
w(`- Application targets: ${LX.TARGET_TYPES.map(q).join(', ')}. The two that are Suite registers and carry a real key: ${LX.SUITE_TARGET_TYPES.map(q).join(', ')}.`);
w(`- Outcomes: ${LX.APPLICATION_OUTCOMES.map(q).join(', ')}. The outcomes that changed something: ${LX.EMBEDDING_OUTCOMES.map(q).join(', ')}. A rejection is a real record and embeds nothing.`);
w();
w('The application log:');
w('| application | lesson | target | outcome | applied on |');
w('| --- | --- | --- | --- | --- |');
for (const a of ONNE_APPLICATIONS) w(`| ${a.id} | ${a.lesson_id} | ${q(a.target_type)} | ${q(a.outcome)} | ${a.applied_on} |`);
w();
w('The reuse record of each visible lesson, which is a count and never a claim:');
w('| lesson | total | applied | adopted | adapted | rejected | last applied on | targets changed |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const l of ONNE_LESSONS.filter((x) => LX.LESSON_VISIBLE_STATUSES.includes(x.status))) {
  const rr = L.reuseRecord(ONNE_APPLICATIONS.filter((a) => a.lesson_id === l.id));
  w(`| ${l.id} | ${n0(rr.total)} | ${n0(rr.applied)} | ${n0(rr.adopted)} | ${n0(rr.adapted)} | ${n0(rr.rejected)} | ${rr.lastAppliedOn ?? 'null'} | ${lst(rr.targets.map(q))} |`);
}
w('- ON-01 was last APPLIED on the date of its Adapted application. Its Rejected application is later and does not move that date, because a rejection applied nothing.');
w();
{
  const apps = (id) => ONNE_APPLICATIONS.filter((a) => a.lesson_id === id);
  const on = (id) => ONNE_LESSONS.find((l) => l.id === id);
  w(`- ${allowed('ON-01 marked Embedded', L.canAdvanceLesson(on('ON-01'), 'Embedded', { applications: apps('ON-01') }))}`);
  w(`- ${refusal('ON-03 marked Embedded, its one application a rejection', L.canAdvanceLesson(on('ON-03'), 'Embedded', { applications: apps('ON-03') }))}`);
  w(`- ${refusal('ON-04 marked Embedded, with no application at all', L.canAdvanceLesson(on('ON-04'), 'Embedded', { applications: apps('ON-04') }))}`);
  w(`- ${refusal('ON-10 archived with no reason', L.canAdvanceLesson(on('ON-10'), 'Archived', { patch: {} }))}`);
  w(`- ${allowed('ON-10 archived with a reason', L.canAdvanceLesson(on('ON-10'), 'Archived', { patch: { archive_reason: 'The quay lighting was replaced.' } }))}`);
  w(`- ${refusal('ON-10 superseded with no successor named', L.canAdvanceLesson(on('ON-10'), 'Superseded', { patch: {} }))}`);
  w(`- ${refusal('ON-10 superseded by itself', L.canAdvanceLesson(on('ON-10'), 'Superseded', { patch: { superseded_by: 'ON-10' } }))}`);
  w(`- ${refusal('a Draft lesson moved straight to Published', L.canAdvanceLesson(on('ON-07'), 'Published', {}))}`);
  w(`- ${refusal('an Archived lesson moved anywhere', L.canAdvanceLesson(on('ON-08'), 'Published', {}))}`);
}
w();
w('| from | legal next statuses |');
w('| --- | --- |');
for (const s of LX.LESSON_STATUSES) w(`| ${q(s)} | ${lst(L.nextLessonStatuses(s).map(q))} |`);
w();
w('What an application must carry before it is recorded:');
for (const [label, a] of APPLICATION_PROBES) {
  const r = L.canRecordApplication(a);
  w(`- ${r.ok ? allowed(label, r) : refusal(label, r)}`);
}
w();

/* ================================================================== *
 * SECTION 17
 * ================================================================== */
sec('SECTION 17: Lesson dates, the ONNE register summarised, and what needs attention (owned by Expert m05)');
w(`- A visible lesson reads "review due soon" from REVIEW_LEAD_DAYS, ${n0(LX.REVIEW_LEAD_DAYS)} days, before its review date, both ends counted, and "review overdue" once the date has passed. A lesson that is not visible has no review status at all.`);
w('| review due | days until | overdue | due soon |');
w('| --- | --- | --- | --- |');
for (const k of LESSON_REVIEW_SWEEP) {
  const l = { status: 'Published', review_due: shift(k) };
  w(`| ${l.review_due} | ${n0(CAL.daysUntil(l.review_due, T()))} | ${yn(L.isReviewOverdue(l, T()))} | ${yn(L.isReviewDueSoon(l, T()))} |`);
}
w();
w(`The ONNE register on ${AS_OF_ISO}:`);
w('| lesson | status | event date | age in days | review due | overdue | due soon | applied nowhere |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const l of ONNE_LESSONS) {
  const age = L.lessonAgeDays(l, T());
  w(`| ${l.id} | ${q(l.status)} | ${l.event_date} | ${age === null ? 'null' : n0(age)} | ${l.review_due ?? 'null'} | ${yn(L.isReviewOverdue(l, T()))} | ${yn(L.isReviewDueSoon(l, T()))} | ${yn(L.isUnapplied(l, ONNE_APPLICATIONS.filter((a) => a.lesson_id === l.id)))} |`);
}
w('- ON-05 is Validated with a review date inside the lead and reads neither overdue nor due soon, because it is not yet visible to anybody.');
w('- A lesson\'s age is counted from its event date. With no event date it falls back to the record\'s creation timestamp, read as the LOCAL calendar date of that instant (calendar.localDateOf), so the same row can be a day older in Lagos than in UTC. Every ONNE lesson records its event date, which is why every age above is the same in every zone.');
w();
{
  const s = L.summarise({ lessons: ONNE_LESSONS, applications: ONNE_APPLICATIONS }, T());
  w('summarise, the dashboard and report counts:');
  w('| count | value |');
  w('| --- | --- |');
  for (const k of ['lessons', 'live', 'visible', 'awaitingValidation', 'drafts', 'applications', 'applied', 'rejected', 'lessonsApplied', 'lessonsUnapplied', 'intoRiskRegister', 'intoMoc', 'reviewsOverdue', 'reviewsDueSoon']) {
    w(`| ${k} | ${n0(s[k])} |`);
  }
  w('- lessonsApplied and lessonsUnapplied count LESSONS, visible ones only. applied, rejected, intoRiskRegister and intoMoc count APPLICATIONS.');
  const byLesson = new Map();
  for (const a of ONNE_APPLICATIONS) {
    if (!byLesson.has(a.lesson_id)) byLesson.set(a.lesson_id, []);
    byLesson.get(a.lesson_id).push(a);
  }
  w(`- lessonByAttention, first to last: visible lessons nobody has applied, then lessons awaiting validation, then overdue reviews, then other live lessons, then the rest; newest event first within a rank: ${sortWith('lessonsLearned', 'lessonByAttention', [byLesson, T()], ONNE_LESSONS).join(', ')}.`);
}
w('# App surface: the Lessons Learned dashboard computes reviewsOverdue and reviewsDueSoon and does not display either. RECON.md records it.');
w();

/* ================================================================== *
 * SECTION 18
 * ================================================================== */
sec('SECTION 18: What these engines hold, what the owner decided, and what the oracles check (owned by Expert m05)');
w('- HELD ITEMS are rules these engines state but that no owner has decided, or behaviours that are limits of the engine. Each is taught as a stated limit and graded nowhere:');
w('  - A band is found by its lower edge alone, so any positive score bands, including a score no cell of the grid holds (Section 2).');
w('  - countByBand counts whatever it is handed (Section 5).');
w('  - An action on a change that is not in the register counts as open work (Section 12).');
w('  - Within one urgency rank, changes sort by expiry date when they have one and by target date otherwise, so the two keys mix.');
w('  - A comment whose review is not in the list handed to the peer review summary still counts as open work, as an MOC action with an unknown change does (Sections 12 and 14).');
w('  - A reviewer named by display name only cannot be matched to the author, so the independence rule allows one (Section 14); a review with no author recorded cannot be checked either.');
w('  - Publishing a lesson checks that a validation record exists and does not check again who validated it.');
w('  - The application counts in the lessons summary include applications on lessons that are not visible.');
w('  - An invalid as-of date makes daysUntil answer NaN rather than refuse, and a comparison on NaN is false either way, so every date rule reads as not due. Nothing in this course passes one.');
w('- OWNER DECISIONS in this course scope, all taken on 2026-09-18 under AS15 and each held in the engine, the app and where it matters the database: D1 segregation of duties on change approvals (Section 9) and, from ASC-0, on peer review (Section 14); Q9 emergency change authority and the ratification window (Section 11); Q10 validation by typed name (Section 15); Q3 fractional levels unscored (Sections 2 and 3). AS13-0 decided that a closed temporary change reads "Closed out" (Section 11).');
w();
w('The published golden case files, measured by reading them (golden, written by the oracles):');
w('| golden file | cases | cases carrying a repaired marker | functions exercised |');
w('| --- | --- | --- | --- |');
for (const m of ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned']) {
  const g = JSON.parse(fs.readFileSync(`${ROOT}/test-data/assurance/goldens/${m}_cases.json`, 'utf8'));
  const fns = new Set(g.cases.map((c) => c.fn || c.sort));
  w(`| ${m}_cases.json | ${n0(g.cases.length)} | ${n0(g.cases.filter((c) => c.repaired).length)} | ${n0(fns.size)} |`);
}
w('- Every exported function of each module is exercised by at least one golden case, and the gate replays every case in five time zones. The oracles were written from the rules as stated rather than from the JavaScript.');
w('- Every engine answer in THIS digest was replayed through the same oracles by oracle_bridge.py. A golden case checks the engine on the oracle author records; the bridge checks it on this course records.');
w();

/* ================================================================== *
 * SECTION 19
 * ================================================================== */
sec('SECTION 19: One loop across four registers: a lesson into a risk and into a change (owned by Expert m06)');
{
  const on01apps = ONNE_APPLICATIONS.filter((a) => a.lesson_id === 'ON-01');
  const into = on01apps.find((a) => a.target_type === 'Risk register');
  const risk = OBODO_RISKS.find((r) => r.id === into.target_risk_id);
  const d = R.deriveRiskFields(risk);
  w(`- ON-01, dropped object during a crane lift, was applied into the risk register on ${into.applied_on} (${q(into.outcome)}), naming ${risk.id}, ${risk.title}. That risk is ${q(risk.status)}, residual ${n0(d.residualScore)} ${q(d.residualBand)}, ${q(d.appetite_status)}.`);
  const intoMoc = ONNE_APPLICATIONS.find((a) => a.target_type === 'Management of change');
  const moc = ESANMI_MOCS.find((m) => m.id === intoMoc.target_moc_id);
  w(`- ${intoMoc.lesson_id} was applied into the change register on ${intoMoc.applied_on} (${q(intoMoc.outcome)}), naming ${moc.id}, ${moc.title}, now ${q(moc.stage)}.`);
  w(`- ${allowed('recording an application into the risk register that names the risk', L.canRecordApplication({ target_type: 'Risk register', target_risk_id: risk.id, outcome: 'Adopted' }))}`);
  w('- The trail runs both ways because both ends carry a key: the lesson names the risk row or the change record, and each of those is a record with its own state. An audit finding can be the SOURCE of a lesson (source type "Audit finding", ON-06 above); the audit and its finding belong to Compliance, Audit & Quality, and this course reads them only as a source.');
}
w();

/* ================================================================== *
 * SECTION 20
 * ================================================================== */
sec('SECTION 20: HISTORY, and it is labelled as history in this title and in the line below it: what was repaired in these engines, and what each repair teaches (owned by Expert m05)');
w('EVERYTHING IN THIS SECTION IS HISTORY AND IS LABELLED AS HISTORY. Nothing above this line is. Teach it as what the engines used to do, the way this section does.');
w();
{
  const rows = [];
  for (const m of ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned']) {
    const g = JSON.parse(fs.readFileSync(`${ROOT}/test-data/assurance/goldens/${m}_cases.json`, 'utf8'));
    const ids = [...new Set(g.cases.filter((c) => c.repaired).map((c) => c.repaired))].sort();
    rows.push([m, ids]);
  }
  w('The repair markers in the golden files, measured (each is a defect an oracle found, pinned as failing, then repaired and kept as a case):');
  for (const [m, ids] of rows) w(`- ${m}: ${lst(ids)}.`);
}
w('- HISTORY, ASC-0 (engines PR #212, the repairs these two assurance courses found while this digest was being built): a closed risk used to read review-overdue and an as-of date given as text used to be read as a UTC instant; a change already in Implementation used to read overdue against its target date; peer review used to hold no rule on who reviews, and its summary used to count comments on cancelled reviews as blocking for ever; and several refusals used to read "A archived", "level 2 and 3 has" and "1 critical comment still need".');
w('- HISTORY, AS12 to AS15: a risk review due today used to read overdue west of Greenwich, because the date was parsed as UTC midnight. A blank residual axis used to zero the whole residual. An impossible date such as 30 February used to roll over into a real one. An unreadable expiry used to read "Expiring soon" and pass the implementation gate. A comment with no severity used to sort above Critical. Actions on finished changes used to count as open work for ever (AS14). Emergency changes used to need every level signed before implementation, and a lesson author used to be able to validate their own lesson by typing a name (both AS15).');
w('- The general lesson is the one this programme runs on: each of these was found by an independent oracle written from the stated rule (AS12 onward), and each is now a golden case that fails if the defect returns.');
w();

/* ================================================================== *
 * THE AUDITS
 * ================================================================== */
const text = out.join('\n');
const refusalLines = text.split('\n').filter((l) => l.includes(REFUSED));
if (refusalLines.length < refusals) throw new Error('REFUSAL AUDIT: fewer refusal lines than guarded refusals');
if (guardedDateCalls < 50) throw new Error(`AS-OF GATE REFUSES: only ${guardedDateCalls} date calls were guarded`);
if (seen.size !== 20) throw new Error(`GENERATOR REFUSES: ${seen.size} sections emitted, 20 expected`);
if (NEGATIVE === 'omit') throw new Error('NEGATIVE CONTROL FAILED: an omitted as-of date was not caught');

fs.writeFileSync(CALLS_OUT, `${JSON.stringify({ asOf: AS_OF_ISO, calls: ledger }, null, 0)}\n`);
process.stderr.write(`riskchange_dump: ${seen.size} sections, ${ledger.length} engine calls ledgered, `
  + `${guardedDateCalls} date-taking calls each handed the as-of date, ${refusals} guarded refusals, `
  + `${answers} guarded allowances, ${DATE_TAKERS.length} date-taking exports found in the source\n`);
console.log(text);
