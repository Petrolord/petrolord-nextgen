// GATE: every one of the eighteen graded fields is RE-MEASURED against the
// PRE-REPAIR engine, and the declared stable set must be exactly what held.
//
// WHY. A sibling wave ordered its capstone on the REASONING that two fields
// could not have moved when the repair was vendored, and one of them had. A
// stability claim is MEASURED here, never reasoned about.
//
// It requires a NAMED CAUSE for every field that moved, requires that the cause
// is one of the repair's own changes, and reports an unexplained movement rather
// than passing it. A field the pre-repair engine cannot even produce counts as
// MOVED with the reason "the door did not exist", which is the honest answer for
// a field the repair created.
//
//   node gate_movement.mjs
//   node gate_movement.mjs --claim-everything-stable   THE NEGATIVE CONTROL
//
// The control declares all eighteen stable and must exit 1 naming every field
// that actually moved. Exit 0 clean, 1 on a finding, 2 if it cannot run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = '/root/fc-wip-corrosion';
const NOW_ROOT = process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines';
const PRE = process.env.FC9_PREREPAIR || `${HERE}/scratch/prerepair/corrosion.js`;
if (!fs.existsSync(PRE)) { console.log(`REFUSED: no pre-repair engine at ${PRE}`); process.exit(2); }
const PRE_COMMIT = fs.existsSync(`${HERE}/scratch/prerepair/COMMIT`)
  ? fs.readFileSync(`${HERE}/scratch/prerepair/COMMIT`, 'utf8').trim() : 'unrecorded';
const NOW = await import(`${NOW_ROOT}/engines/facilities/corrosion.js`);
const OLD = await import(PRE);
const FIELDS = JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8'));
if (FIELDS.length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const SRC = fs.readFileSync(`${HERE}/fc9_capstone.mjs`, 'utf8');
const scenario = (name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) { console.log(`REFUSED: cannot read the ${name} scenario`); process.exit(2); }
  const o = {};
  [...m[1].matchAll(/(\w+):\s*(-?[\d.]+)\s*,/g)].forEach((f) => { o[f[1]] = Number(f[2]); });
  return o;
};
const O = scenario('OBIGBO');
const N = scenario('NEMBE');
const S = scenario('SOKU');

const nCommon = { tC: N.tC, pTotalBar: N.pTotalBar, co2MolFrac: N.co2MolFrac, ph: N.ph, velocityMS: N.velocityMS, diameterM: N.diameterM, flowRegime: 'waterWet' };
const sCommon = { tC: S.tC, pTotalBar: S.pTotalBar, co2MolFrac: S.co2MolFrac, ph: S.ph, velocityMS: S.velocityMS, diameterM: S.diameterM, flowRegime: 'waterWet' };

/** Compute one graded field against a given module. NaN where the module cannot. */
const compute = (E, key) => {
  const safe = (f) => { try { const v = f(); return Number.isFinite(v) ? v : NaN; } catch { return NaN; } };
  const retained = (common, eff, avail) => safe(() => {
    const r = E.corrosionRate({ ...common, inhibitorEfficiencyPct: eff, inhibitorAvailabilityPct: avail });
    return r.rateMmYr / r.uninhibitedMmYr;
  });
  const bisect = (lo, hi, pred) => {
    let a = lo; let b = hi; const pa = pred(a);
    if (pa === pred(b)) return NaN;
    for (let i = 0; i < 300; i += 1) {
      const m = (a + b) / 2;
      if (pred(m) === pa) a = m; else b = m;
      if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
    }
    return (a + b) / 2;
  };
  const nRet = retained(nCommon, N.inhibitorEfficiencyPct, N.inhibitorAvailabilityPct);
  const nRate = N.surveyedUninhibitedMmYr * nRet;
  const nBase = { corrosionAllowanceMm: N.corrosionAllowanceMm, consumedMm: N.consumedMm, designLifeYears: N.designLifeYears };
  const sRet = retained(sCommon, S.inhibitorEfficiencyPct, S.inhibitorAvailabilityPct);
  const sRate = S.surveyedUninhibitedMmYr * sRet;
  const sBase = { corrosionAllowanceMm: S.corrosionAllowanceMm, consumedMm: S.consumedMm, designLifeYears: S.designLifeYears };
  const table = {
    obigbo_co2_partial_pressure_bar: () => E.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).pco2Bar,
    obigbo_h2s_partial_pressure_psia: () => E.sourServiceScreen({ ph2sBar: O.pTotalBar * O.h2sMolFrac }).ph2sPsia,
    obigbo_h2s_to_co2_mole_ratio: () => E.corrosionRegime({
      ph2sBar: O.pTotalBar * O.h2sMolFrac,
      pco2Bar: E.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).pco2Bar,
    }).ratio,
    obigbo_reynolds_number: () => E.wallShearStressPa({
      velocityMS: O.velocityMS, diameterM: O.diameterM, densityKgM3: O.densityKgM3, viscosityPaS: O.viscosityPaS,
    }).reynolds,
    obigbo_effective_inhibition_pct: () => E.corrosionRate({
      tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac, ph: O.ph, velocityMS: O.velocityMS,
      diameterM: O.diameterM, flowRegime: 'waterWet', waterCutFrac: O.waterCutFrac,
      inhibitorEfficiencyPct: O.inhibitorEfficiencyPct, inhibitorAvailabilityPct: O.inhibitorAvailabilityPct,
    }).effectiveInhibitionPct,
    obigbo_metal_loss_ratio_vs_datasheet: () => {
      const base = {
        tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac, ph: O.ph, velocityMS: O.velocityMS,
        diameterM: O.diameterM, flowRegime: 'waterWet', inhibitorEfficiencyPct: O.inhibitorEfficiencyPct,
      };
      return E.corrosionRate({ ...base, inhibitorAvailabilityPct: O.inhibitorAvailabilityPct }).rateMmYr
        / E.corrosionRate({ ...base, inhibitorAvailabilityPct: 100 }).rateMmYr;
    },
    nembe_retained_metal_loss_fraction: () => nRet,
    nembe_inhibitor_shortfall_pp: () => E.corrosionRate({
      ...nCommon, inhibitorEfficiencyPct: N.inhibitorEfficiencyPct, inhibitorAvailabilityPct: N.inhibitorAvailabilityPct,
    }).inhibitorShortfallPp,
    nembe_inhibited_rate_mmyr: () => nRate,
    nembe_remaining_life_yr: () => E.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
    nembe_required_allowance_mm: () => E.remainingLife({ ...nBase, rateMmYr: nRate }).requiredAllowanceMm,
    nembe_life_lost_to_availability_yr: () => E.remainingLife({
      ...nBase, rateMmYr: N.surveyedUninhibitedMmYr * retained(nCommon, N.inhibitorEfficiencyPct, 100),
    }).remainingYears - E.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
    soku_tolerable_rate_mmyr: () => bisect(1e-6, 5, (r) => E.remainingLife({ ...sBase, rateMmYr: r }).meetsDesignLife === true),
    soku_required_availability_pct: () => bisect(1, 100, (a) => E.corrosionRate({
      ...sCommon, inhibitorEfficiencyPct: S.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
    }).effectiveInhibitionPct >= S.targetEffectiveProtectionPct),
    soku_availability_for_design_life_pct: () => bisect(1, 100, (a) => E.remainingLife({
      ...sBase, rateMmYr: S.surveyedUninhibitedMmYr * retained(sCommon, S.inhibitorEfficiencyPct, a),
    }).meetsDesignLife === true),
    soku_allowance_to_reinstate_mm: () => bisect(2, 40, (ca) => E.remainingLife({
      ...sBase, corrosionAllowanceMm: ca, rateMmYr: sRate,
    }).meetsDesignLife === true),
    soku_stripped_film_life_yr: () => E.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears,
    soku_film_credit_life_ratio: () => E.remainingLife({ ...sBase, rateMmYr: sRate }).remainingYears
      / E.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears,
  };
  if (!table[key]) { console.log(`REFUSED: gate_movement has no recipe for ${key}`); process.exit(2); }
  return safe(table[key]);
};

/**
 * THE DECLARED CAUSES. A field that moved must have one, and the cause must name
 * a change the FC9-0 repair actually made. A field declared STABLE must be
 * bit-identical against the pre-repair engine.
 */
const CAUSES = {
  obigbo_h2s_partial_pressure_psia:
    'THE FIELD DID NOT EXIST. The pre-repair sourServiceScreen reported its H2S partial pressure in '
    + 'bar only, with no psia value and no exact conversion factor, while a comment in the same file '
    + 'claimed the threshold WAS 0.05 psia. The repair added BAR_TO_PSIA exactly and derived the psia '
    + 'value from it, so this field moved from not-a-number to a number rather than from one number '
    + 'to another',
  nembe_inhibitor_shortfall_pp:
    'THE FIELD DID NOT EXIST. `inhibitorShortfallPp` is new. The pre-repair guard compared the '
    + 'efficiency against 0.9, which is why it was silent at the app\'s own default of exactly 90, '
    + 'and it returned no shortfall figure at all. Same shape: not-a-number to a number',
};

/* WHAT THIS GATE CORRECTED IN MY OWN CLAIMS, recorded because it is the point of
   having it. Four fields were declared MOVED on the REASONING that the repair's
   inhibitor clamp and its remaining-life changes would reach them. All four are
   BIT IDENTICAL: the clamp only bites outside nought to a hundred and every
   capstone scenario is inside it, and the remaining-life changes were a zero-rate
   branch and two new fields, neither of which this capstone's arithmetic goes
   through. A stability claim is measured, never reasoned about, and the same
   sentence has now caught a wave in both directions. */

const CLAIM_ALL_STABLE = process.argv.includes('--claim-everything-stable');
/** The fields this wave DECLARES stable, bit for bit, across the repair. */
const DECLARED_STABLE = CLAIM_ALL_STABLE ? FIELDS.map((f) => f[1]) : [
  'obigbo_co2_partial_pressure_bar',
  'obigbo_h2s_to_co2_mole_ratio',
  'obigbo_reynolds_number',
  'obigbo_effective_inhibition_pct',
  'obigbo_metal_loss_ratio_vs_datasheet',
  'nembe_retained_metal_loss_fraction',
  'nembe_inhibited_rate_mmyr',
  'nembe_remaining_life_yr',
  'nembe_required_allowance_mm',
  'nembe_life_lost_to_availability_yr',
  'soku_tolerable_rate_mmyr',
  'soku_required_availability_pct',
  'soku_availability_for_design_life_pct',
  'soku_allowance_to_reinstate_mm',
  'soku_stripped_film_life_yr',
  'soku_film_credit_life_ratio',
];

const rows = [];
const findings = [];
FIELDS.forEach(([tier, key, value]) => {
  const now = compute(NOW, key);
  const old = compute(OLD, key);
  const same = Object.is(now, old);
  const declared = DECLARED_STABLE.includes(key);
  const cause = CAUSES[key] || null;
  rows.push({ tier, key, now, old, same, declared, cause });
  if (!Number.isFinite(now)) findings.push(`${key} does not evaluate against the CURRENT engine`);
  if (Math.abs(now - value) > 1e-12 * Math.max(Math.abs(value), 1)) {
    findings.push(`${key} re-measured as ${now} against the ${value} in fields.json`);
  }
  if (declared && !same) {
    findings.push(`DECLARED STABLE BUT IT MOVED: ${key} was ${old} and is ${now}`);
  }
  if (!declared && same) {
    findings.push(`DECLARED MOVED BUT IT IS BIT IDENTICAL: ${key} is ${now} on both engines, so the `
      + 'cause below is a claim about a change that did not reach this field');
  }
  if (!declared && !cause) findings.push(`MOVED WITH NO NAMED CAUSE: ${key}`);
  if (declared && cause) findings.push(`DECLARED STABLE AND ALSO CARRIES A CAUSE: ${key}`);
});

const moved = rows.filter((r) => !r.same);
const stable = rows.filter((r) => r.same);
console.log(`gate_movement: eighteen graded fields re-measured against the PRE-REPAIR engine at ${PRE_COMMIT.slice(0, 7)}`);
console.log(`  pre-repair source: ${PRE} (${fs.readFileSync(PRE, 'utf8').split('\n').length} lines against `
  + `${fs.readFileSync(`${NOW_ROOT}/engines/facilities/corrosion.js`, 'utf8').split('\n').length} today)`);
console.log(`  BIT IDENTICAL across the repair: ${stable.length}`);
console.log(`  MOVED: ${moved.length}`);
console.log();
console.log('field                                 tier          pre-repair                current                   verdict');
rows.forEach((r) => {
  console.log(`${r.key.padEnd(37)} ${r.tier.padEnd(13)} ${String(r.old).padEnd(25)} ${String(r.now).padEnd(25)} `
    + `${r.same ? 'identical' : 'MOVED'}`);
});
console.log();
moved.forEach((r) => console.log(`  CAUSE for ${r.key}: ${r.cause || 'NONE DECLARED'}`));
console.log();
console.log(`  FINDINGS: ${findings.length}`);
findings.forEach((f) => console.log(`   ${f}`));
if (CLAIM_ALL_STABLE) {
  const wrong = findings.filter((f) => f.startsWith('DECLARED STABLE BUT IT MOVED')).length;
  console.log(`  NEGATIVE CONTROL: all eighteen declared stable. Expected the ${moved.length} that `
    + `actually moved to be reported, got ${wrong}.`);
  process.exit(wrong === moved.length && moved.length > 0 ? 1 : 2);
}
process.exit(findings.length ? 1 : 0);
