#!/usr/bin/env node
// W2 (publish inputs in prompts and lessons): writes w2/<course>.json.
//
//   node docs/graded-field-audit/w2/build_specs.mjs [course ...]
//
// Each spec carries, per tier, the inputs the prompt now publishes (taken from
// the capstone's own fixture or from a vendored engine return, never typed),
// the prompt edits that print them (rendered here from those inputs), the
// expected value of every graded field those inputs reproduce through the
// vendored engines (reproduce.mjs), and the annotation each field moves to.
// The builder refuses to write a spec whose inputs do not reproduce the key
// the fixture itself computes. docs/graded-field-audit/w2_capstones.py turns
// the prompt edits into guarded migrations against the live rows.
import * as fs from 'fs';
import * as path from 'path';
import { HERE, REPO, ENGINES, loadFixture, num } from './lib.mjs';
import { REPRODUCE, integritySurvey } from './reproduce.mjs';
import * as SM from '../../../packages/engines/engines/drilling/surveyMath.js';

const SCRATCH = process.env.W2_SCRATCH || '/tmp/w2-fixtures';
const DR = (w) => process.env[`W2_${w.toUpperCase()}`] || `/root/dr-wip-${w}`;

const within = (a, b, tol) => Math.abs(a - b) <= tol;
// A fixture length built by multiplication (3.5 * 0.0254) prints as its
// short decimal; reproduce.mjs then proves the key survives the rounding.
const short = (x) => Number(x.toPrecision(12));

// Every spec states where its published inputs came from, and the builder
// proves they reproduce the fixture's own graded values within tol.
function check(course, tier, got, fields) {
  for (const [k, [v, tol]] of Object.entries(fields)) {
    if (!(k in got)) throw new Error(`${course}/${tier}: reproduce returns no ${k}`);
    if (!within(got[k], v, tol)) throw new Error(`${course}/${tier}.${k}: published inputs give ${got[k]}, the fixture keys ${v} (tol ${tol})`);
  }
}

// ---------------------------------------------------------------------------
// integrity (DR11): KESTREL A-7
async function integrity() {
  const fx = await loadFixture(path.join(DR('integrity'), 'dr11_fields.mjs'), SCRATCH);
  const src = fs.readFileSync(fx.__W2_SOURCE, 'utf8');
  const constOf = (name) => Number(src.match(new RegExp(`const ${name} = ([0-9.e+-]+);`))[1]);
  const G = constOf('G');
  const PSI = constOf('PSI');
  const C = fx.CAP;
  const V = fx.capstoneValues();
  const fixtureFields = JSON.parse(fs.readFileSync(path.join(DR('integrity'), 'fields.json'), 'utf8'));
  const tolOf = Object.fromEntries(fixtureFields.map(([, k, , tol]) => [k, tol]));
  const psi = (pa) => {
    const p = Math.round((pa / PSI) * 1e6) / 1e6;
    if (p * PSI !== pa) throw new Error(`integrity: ${pa} Pa is not an exact psi rating`);
    return p;
  };

  // The D1 survey the fixture converts through, stated as the prompt states it.
  const golden = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/drilling/goldens/wellintegrity_cases.json'), 'utf8'));
  const survey = { kickoffMdM: 500, buildDegPer30m: 2, holdIncDeg: 40, aziDeg: 45 };
  const surveyMethod = { stepM: 30, endMdM: 3000 };
  const mine = integritySurvey({ ...survey, ...surveyMethod });
  // Minimum curvature is exact on a constant-rate arc, so the stated survey
  // must give the fixture's own TVDs whatever the station spacing.
  const V0 = V._aux.tvd;
  const gPath = SM.computeWellPath(golden.stations);
  const mPath = SM.computeWellPath(mine);
  for (const [md, want] of [[C.prodShoeMdM, V0.prodShoe], [C.surfShoeMdM, V0.surfShoe], [C.packerMdM, V0.packer], [C.waterDepthM, V0.wellhead]]) {
    const a = SM.stationAtMd(mine, mPath, md).tvd;
    const b = SM.stationAtMd(golden.stations, gPath, md).tvd;
    if (Math.abs(a - want) > 1e-9 || Math.abs(b - want) > 1e-9) throw new Error(`integrity: TVD at ${md} m MD: stated survey ${a}, golden ${b}, fixture ${want}`);
  }
  const inter = {
    g: G,
    paPerPsi: PSI,
    survey,
    aAnnulus: {
      fluidKgM3: C.aFluidKgM3,
      rows: [
        { name: '9-5/8 production casing burst', role: 'outer-casing-burst', limitPsi: psi(C.prodCsgBurstPa), where: 'at the production shoe', mdM: C.prodShoeMdM, backupKgM3: C.csgBackupKgM3 },
        { name: '5-1/2 completion tubing collapse', role: 'inner-tubing-collapse', limitPsi: psi(C.tubingCollapsePa), where: 'at the packer', mdM: C.packerMdM, backupKgM3: C.tubingBackupKgM3 },
        { name: '9-5/8 shoe formation strength', role: 'shoe-formation', lotKgM3: C.prodShoeLotKgM3, where: 'at the production shoe', mdM: C.prodShoeMdM, backupKgM3: C.csgBackupKgM3 },
        { name: 'Subsea wellhead annulus access rating', role: 'rating', limitPsi: psi(C.whAccessRatingPa), where: 'at the wellhead on the seabed', mdM: C.waterDepthM, backupKgM3: C.seawaterKgM3 },
      ],
    },
    bAnnulus: {
      fluidKgM3: C.bFluidKgM3,
      rows: [
        { name: '13-3/8 surface casing burst', kind: 'casing', factor: C.surfCsgDesignFactor, limitPsi: psi(C.surfCsgBurstPa), where: 'at the surface shoe', mdM: C.surfShoeMdM, backupKgM3: C.csgBackupKgM3 },
        { name: '9-5/8 production casing burst wear derated', kind: 'casing', factor: C.wornCsgFactor, limitPsi: psi(C.prodCsgBurstPa), where: 'at the production shoe', mdM: C.prodShoeMdM, backupKgM3: C.aFluidKgM3 },
        { name: '13-3/8 shoe formation strength', kind: 'formation', factor: 1, lotKgM3: C.surfShoeLotKgM3, where: 'at the surface shoe', mdM: C.surfShoeMdM, backupKgM3: C.csgBackupKgM3 },
      ],
    },
    displacement: {
      fluidKgM3: C.scenarioFluidKgM3,
      rows: [
        { name: '5-1/2 completion tubing collapse with the tubing gas filled', kind: 'completion-string', role: 'inner-tubing-collapse', limitPsi: psi(C.tubingCollapsePa), where: 'at the packer', mdM: C.packerMdM, backupKgM3: C.gasInTubingKgM3 },
      ],
    },
  };
  const rowText = (r, withRole) => `${r.name}, ${withRole ? `role ${r.role}` : `factor ${num(r.factor)}`}, ${
    r.lotKgM3 != null ? `a leak off equivalent of ${num(r.lotKgM3)} kg/m3 times g times the shoe TVD` : `${num(r.limitPsi)} psi`
  }, ${r.where} at ${num(r.mdM)} m MD, far side ${num(r.backupKgM3)} kg/m3`;
  const interText = [
    `THE WELL. The survey is vertical to ${num(survey.kickoffMdM)} m MD, builds at ${num(survey.buildDegPer30m)} degrees per 30 m on an azimuth of ${num(survey.aziDeg)} degrees to ${num(survey.holdIncDeg)} degrees at 1100 m MD, and holds ${num(survey.holdIncDeg)} degrees below that; take each true vertical depth from it by minimum curvature. Take g as ${num(G)} m/s2 and 1 psi as ${num(PSI)} Pa.`,
    `THE A ANNULUS holds ${num(inter.aAnnulus.fluidKgM3)} kg/m3 packer fluid and is bounded by four rows, each given as name, role, limit, depth and far side density: ${inter.aAnnulus.rows.map((r) => rowText(r, true)).join('; ')}.`,
    `THE B ANNULUS holds ${num(inter.bAnnulus.fluidKgM3)} kg/m3 and its three rows carry stated design and wear factors in place of the RP 90 roles: ${inter.bAnnulus.rows.map((r) => rowText(r, false)).join('; ')}.`,
    `THE DISPLACEMENT CASE puts ${num(inter.displacement.fluidKgM3)} kg/m3 brine in the A annulus while the tubing unloads to gas of ${num(C.gasInTubingKgM3)} kg/m3, and has one row: ${rowText(inter.displacement.rows[0], true)}.`,
  ].join(' ');
  // 1100 m is where the build reaches the hold angle; prove it rather than type it.
  const holdStart = mine.find((s) => s.inc === survey.holdIncDeg).md;
  if (holdStart !== 1100) throw new Error(`integrity: the build reaches ${survey.holdIncDeg} degrees at ${holdStart} m MD`);

  const adv = {
    stingerOdM: short(C.stingerOdM),
    stingerIdM: C.stingerIdM,
    plugs: [
      { name: 'P1 reservoir primary', topMdM: C.p1TopMdM, bottomMdM: C.p1BaseMdM, foundation: C.p1Foundation, isSurfacePlug: false, bore: 'in the 7 in liner', geometry: { holeIdM: C.linerIdM, excessPct: Math.round(C.p1ExcessFrac * 100), spacerAheadM3: C.p1SpacerAheadM3 } },
      { name: 'P2 reservoir secondary', topMdM: C.p2TopMdM, bottomMdM: C.p2BotMdM, foundation: 'none', isSurfacePlug: false, geometry: null },
      { name: 'P3 gas stringer primary', topMdM: C.p3TopMdM, bottomMdM: C.p3BotMdM, foundation: 'none', isSurfacePlug: false, bore: 'in the 9-5/8 casing', geometry: { holeIdM: C.prodCsgIdM, excessPct: Math.round(C.p3ExcessFrac * 100), spacerAheadM3: C.p3SpacerAheadM3 } },
      { name: 'P4 gas stringer secondary', topMdM: C.p4TopMdM, bottomMdM: C.p4BotMdM, foundation: 'none', isSurfacePlug: false, geometry: null },
      { name: 'S1 environmental plug', topMdM: C.s1TopMdM, bottomMdM: C.s1BotMdM, foundation: 'none', isSurfacePlug: true, bore: 'in the 13-3/8 casing', geometry: { holeIdM: C.surfCsgIdM, excessPct: Math.round(C.s1ExcessFrac * 100), spacerAheadM3: C.s1SpacerAheadM3 } },
    ],
    zones: [
      { name: 'Kestrel reservoir sand', topMdM: C.zoneResTopMdM, bottomMdM: C.zoneResBotMdM },
      { name: 'Shallow gas stringer', topMdM: C.zoneGasTopMdM, bottomMdM: C.zoneGasBotMdM },
    ],
    annularCement: { topMdM: C.annCemTopMdM, bottomMdM: C.annCemBotMdM, logged: C.annCemVerifiedByLog },
  };
  for (const [p, f] of [[adv.plugs[0], C.p1ExcessFrac], [adv.plugs[2], C.p3ExcessFrac], [adv.plugs[4], C.s1ExcessFrac]]) {
    if (p.geometry.excessPct / 100 !== f) throw new Error(`integrity: ${p.name} excess ${f} is not a whole percent`);
  }
  const plugText = (p) => `${p.name}, ${num(p.topMdM)} to ${num(p.bottomMdM)} m MD, ${
    p.geometry
      ? `${p.bore} of inside diameter ${num(p.geometry.holeIdM)} m, at ${num(p.geometry.excessPct)} percent excess with ${num(p.geometry.spacerAheadM3)} m3 of spacer ahead${p.foundation !== 'none' ? `, set on a ${p.foundation} foundation` : ''}`
      : 'with no placement designed'
  }${p.isSurfacePlug ? ', the surface plug' : ''}`;
  const advText = [
    `THE PLUGS are balanced through a stinger of ${num(adv.stingerOdM)} m outside diameter (3-1/2 in) and ${num(adv.stingerIdM)} m inside: ${adv.plugs.map(plugText).join('; ')}.`,
    `THE ZONES, both able to flow: ${adv.zones.map((z) => `${z.name}, ${num(z.topMdM)} to ${num(z.bottomMdM)} m MD`).join('; ')}.`,
    `THE ANNULAR CEMENT behind the 7 in liner opposite P1 runs from ${num(adv.annularCement.topMdM)} to ${num(adv.annularCement.bottomMdM)} m MD, and no cement evaluation log has been run on it.`,
  ].join(' ');

  const tiers = {
    intermediate: {
      why: 'Prompt only, no field moves. The prompt said each bounding element carries a limit, a true vertical depth, a far side density and a role, but gave none of them: the KESTREL A-7 rows, the annulus fluids and the D1 survey existed only in the generator /root/dr-wip-integrity/dr11_fields.mjs (B5 finding 1). The prompt now publishes the survey, both annuli and the displacement case row by row, with g and the psi conversion, so every field is the taught row arithmetic of m02 to m05 worked at full precision. Keys, expected values and tolerances are unchanged, so nobody is re-scored.',
      prompt_edits: [
        ['Each bounding element carries its own pressure limit, its true vertical depth, the density of whatever stands on the FAR side of it, and a role from which the RP 90 design factor is looked up.',
          `Each bounding element carries its own pressure limit, its depth, the density of whatever stands on the FAR side of it, and a role from which the RP 90 design factor is looked up, or a factor stated with it. ${interText}`],
      ],
      inputs: inter,
      method: { surveyStations: surveyMethod },
    },
    advanced: {
      why: 'Prompt only, no field moves. The P&A inputs (the five plug intervals, the three designed geometries, the zones and the annular cement interval) existed only in /root/dr-wip-integrity/dr11_fields.mjs; the prompt now publishes them, so each field is the taught closed form (capacities, spacer ratio, settle, margins, takeoff). The prompt also said field 6 sums every plug including the two without a designed placement, which was false: the engine sums designed placements only (plugAbandonment.js takeoff) and lists the other two by name. That sentence and the single "35 percent excess" (it is P1\'s; P3 and S1 carry their own) are corrected. Keys, expected values and tolerances are unchanged.',
      prompt_edits: [
        ['FIVE plugs are proposed across two flowing zones plus a surface phase, at 35 percent excess.',
          `FIVE plugs are proposed across two flowing zones plus a surface phase, each designed plug at its own stated excess. ${advText}`],
        ['Field 6 sums every plug including the two the programme does not design a placement for, so it is not the sum of the designed slurries alone.',
          'Field 6 is the programme takeoff: it sums the slurry of every plug with a designed placement, and the two plugs without one add no volume and are listed by name instead.'],
      ],
      inputs: adv,
    },
  };
  const fieldsOf = (tier) => Object.fromEntries(fixtureFields.filter(([t]) => t === tier).map(([, k, v, tol]) => [k, [v, tol]]));
  for (const [tier, t] of Object.entries(tiers)) {
    const got = REPRODUCE.integrity[tier](t.inputs, t.method || {});
    check('integrity', tier, got, fieldsOf(tier));
    // the fixture's own capstoneValues must agree with its fields file
    for (const [k, [v]] of Object.entries(fieldsOf(tier))) if (V[k] !== v) throw new Error(`integrity: fields.json ${k} is stale`);
    t.expected = Object.fromEntries(Object.entries(fieldsOf(tier)).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }]));
  }
  return { course: 'integrity', wave: 'w2', fixture: '/root/dr-wip-integrity/dr11_fields.mjs', tiers, tolOf };
}

// ---------------------------------------------------------------------------
// wellcost (DR12): MERLIN A-12
async function wellcost() {
  const fx = await loadFixture(path.join(DR('wellcost'), 'dr12_fields.mjs'), SCRATCH);
  const C = fx.CAP;
  const D = fx.CASE_DOC;
  const V = fx.capstoneValues();
  const fixtureFields = JSON.parse(fs.readFileSync(path.join(DR('wellcost'), 'fields.json'), 'utf8'));
  for (const [, k, v] of fixtureFields) if (V[k] !== v) throw new Error(`wellcost: fields.json ${k} is stale`);
  const activities = D.program.activities.map((a) => ({ ...a }));
  const items = D.costs.items.map((i) => ({ ...i }));
  const nptPct = Math.round(D.program.nptFrac * 1000) / 10;
  const contingencyPct = Math.round(D.costs.contingencyFrac * 1000) / 10;
  if (nptPct / 100 !== D.program.nptFrac || contingencyPct / 100 !== D.costs.contingencyFrac) throw new Error('wellcost: percentages do not round-trip');
  const id = (label) => activities.find((a) => a.label === label).id;
  const base = { activities, nptPct };

  const actText = (a) => {
    switch (a.kind) {
      case 'drill': return `${a.label}: drill from ${num(a.fromMdM)} to ${num(a.toMdM)} m at ${num(a.ropMPerHr)} m/h`;
      case 'trip': return `${a.label}: round trip from ${num(a.mdM)} m at ${num(a.tripSpeedMPerHr)} m/h`;
      case 'casing': return `${a.label}: run to ${num(a.mdM)} m at ${num(a.runSpeedMPerHr)} m/h plus ${num(a.flatHr)} h flat`;
      default: return `${a.label}: flat, ${num(a.durationHr)} h`;
    }
  };
  const letter = (aid) => String.fromCharCode(97 + activities.findIndex((a) => a.id === aid));
  const progText = `THE PROGRAMME, in order, each activity given as its label, then its kind and its inputs: ${activities.map((a) => `(${letter(a.id)}) ${actText(a)}`).join('; ')}.`;
  const itemText = (it, withAt) => `${it.label}: ${it.category}, ${
    it.basis === 'lump' ? `a lump of ${num(it.value)} USD${withAt ? ` booked at the end of activity (${letter(it.atActivityId)})` : ''}`
      : it.basis === 'per-day' ? `per day at ${num(it.rate)} USD a day` : `per metre at ${num(it.rate)} USD a metre drilled`}`;
  const itemsText = (withAt) => `THE LINE ITEMS, each given as its label, then its category and its basis with its rate or value: ${items.map((it) => itemText(it, withAt)).join('; ')}.`;
  if (items.some((it) => !['per-day', 'per-meter', 'lump'].includes(it.basis))) throw new Error('wellcost: unknown basis');

  const rigItems = ['k1', 'k2'];
  if (items.find((i) => i.id === 'k1').rate !== C.rigRateUsdPerDay || items.find((i) => i.id === 'k2').rate !== C.spreadRateUsdPerDay) throw new Error('wellcost: rig items moved');
  const cpm = {
    rigRateItems: rigItems,
    intermediate: { drill: id('Drill 17-1/2in intermediate hole'), trip: id('Round trip at 2180 m'), bitCostUsd: C.intBitCostUsd, connectionHr: C.intConnectionHr },
    reservoir: { drill: id('Drill 8-1/2in reservoir hole'), trip: id('Round trip at TD'), bitCostUsd: C.resBitCostUsd, connectionHr: C.resConnectionHr },
  };
  const cpmText = `THE COST PER METRE of a section takes the bit cost plus the rig rate per hour times the sum of that section's productive drilling hours, its connection hours and the productive hours of its round trip, all over the section length, with the rig rate per hour taken as the rig dayrate plus the integrated services spread, over 24. The intermediate section is activity (${letter(cpm.intermediate.drill)}) with a bit cost of ${num(cpm.intermediate.bitCostUsd)} USD, ${num(cpm.intermediate.connectionHr)} connection hours and the round trip (${letter(cpm.intermediate.trip)}); the reservoir section is activity (${letter(cpm.reservoir.drill)}) with a bit cost of ${num(cpm.reservoir.bitCostUsd)} USD, ${num(cpm.reservoir.connectionHr)} connection hours and the round trip (${letter(cpm.reservoir.trip)}).`;

  const risk = D.risk;
  const uLabel = (u) => (u.target === 'activity'
    ? `the ${u.field === 'ropMPerHr' ? 'rate of penetration' : 'duration'} of activity (${letter(u.id)}), in ${u.field === 'ropMPerHr' ? 'm/h' : 'h'}`
    : `the ${u.field === 'rate' ? 'rate' : 'value'} of the ${items.find((i) => i.id === u.id).label} line, in ${u.field === 'rate' ? 'USD a day' : 'USD'}`);
  const riskText = `THE DECLARED RANGES, each triangular as minimum, most likely and maximum, sampled in this order: ${risk.uncertainties.map((u) => `${uLabel(u)}: ${num(u.dist.min)}, ${num(u.dist.mode)}, ${num(u.dist.max)}`).join('; ')}. The risked run prices the base with no contingency line, because the risk model takes the place of the provision. The same case, with these ranges in this order, seed ${num(risk.seed)} and ${num(risk.iterations)} iterations, is the Suite case file ${W3_WELLCOST_CASE}: in the Well Cost and Time Estimator pick a wellbore, choose Import case and that file, open the Risk tab, run the Monte Carlo and switch on Full precision to read fields 4 to 6.`;
  if (risk.uncertainties.some((u) => u.dist.type !== 'triangular')) throw new Error('wellcost: a non-triangular range');

  const graded = {
    reservoirDrill: id('Drill 8-1/2in reservoir hole'), tdTrip: id('Round trip at TD'), liner: id('Run and cement 7in liner'),
    intCasing: id('Run and cement 13-3/8in casing'), evaluation: id('Wireline evaluation at TD'),
  };
  const fieldsOf = (tier) => Object.fromEntries(fixtureFields.filter(([t]) => t === tier).map(([, k, v, tol]) => [k, [v, tol]]));
  const tiers = {
    beginner: {
      why: 'Prompt only, no field moves. The prompt said the MERLIN A-12 programme was supplied with the capstone, but it existed only in /root/dr-wip-wellcost/dr12_fields.mjs (B5 finding 1). The prompt now lists the seventeen activities in order with their kinds and inputs, so every field is the taught closed form of m03 to m05 worked in a spreadsheet. Keys, expected values and tolerances are unchanged.',
      prompt_edits: [['The non-productive allowance is 28.5 percent.', `The non-productive allowance is 28.5 percent. ${progText}`]],
      inputs: base,
      method: { graded },
    },
    intermediate: {
      why: 'Prompt only, no field moves. The line items, their rates, bases and categories, and the cost per metre inputs existed only in the generator; the prompt now lists the programme, the ten line items and the two sections, so every field is the taught AFE and cost per metre arithmetic. Keys, expected values and tolerances are unchanged.',
      prompt_edits: [
        ['The line items, their rates, their bases and their categories are supplied.', `The non-productive allowance is ${num(nptPct)} percent. ${progText} ${itemsText(false)}`],
        ['The contingency is 23.5 percent.', `The contingency is 23.5 percent. ${cpmText}`],
      ],
      inputs: { ...base, items, contingencyPct, cpm },
    },
    advanced: {
      why: 'Prompt only, no field moves. The programme, the line items with the activity each lump is booked at, and the declared risk ranges existed only in the generator; the prompt now publishes all three, so the curve fields are spreadsheet work. The three risked fields are a seeded run of the Suite canonical sampler: the prompt now points at W3\'s case file (Suite #568), which the Well Cost and Time Estimator imports and runs at seed 20260904 and prints at full precision behind its Full precision switch (W3 verified all 16 keys through wctRun, wctFullPrecision.test.jsx). This file must not go live before the Suite zip carrying #554 to #568.',
      prompt_edits: [
        ['Six values for MERLIN A-12.', `Six values for MERLIN A-12. The non-productive allowance is ${num(nptPct)} percent. ${progText} ${itemsText(true)} ${riskText}`],
        ['with the declared ranges supplied:', 'with the declared ranges stated above:'],
      ],
      inputs: { ...base, items, uncertainties: risk.uncertainties },
      method: { graded, risk: { iterations: risk.iterations, seed: risk.seed } },
      suite_only: ['mc_cost_p10_usd', 'mc_cost_p90_usd', 'mc_days_p50'],
      suite_route: {
        source_ref: `Suite Well Cost and Time Estimator, Risk tab with Full precision on, case file public/course-cases/wellcost-merlin-a12-advanced.wct.json (${W3_WELLCOST_CASE}), Suite PR #568`,
        evidence: 'W3 (Suite #568): the case file carries the MERLIN A-12 programme, items and the five ranges in generator order at seed 20260904 and 20000 iterations; loaded through the studio\'s wctRun it reproduces all 16 wellcost keys within tol (wctFullPrecision.test.jsx), and RiskTab prints them at full precision behind the switch. The prompt now names the file and the route.',
      },
    },
  };
  for (const [tier, t] of Object.entries(tiers)) {
    const got = REPRODUCE.wellcost[tier](t.inputs, t.method || {});
    const f = fieldsOf(tier);
    check('wellcost', tier, got, Object.fromEntries(Object.entries(f).filter(([k]) => !(t.suite_only || []).includes(k))));
    t.expected = Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] ?? null }]));
  }
  return { course: 'wellcost', wave: 'w2', fixture: '/root/dr-wip-wellcost/dr12_fields.mjs', tiers };
}

// ---------------------------------------------------------------------------
// nodal (PD1): NEMBE-14. The conditions live in the course lab (nodalLab.js
// CAP), which is the capstone's own generator in this repository.
async function nodal() {
  const labPath = path.join(REPO, 'src/components/course/panels/nodal/nodalLab.js');
  const lab = fs.readFileSync(labPath, 'utf8');
  const i = lab.indexOf('export const CAP = {');
  const j = lab.indexOf('\n};', i);
  // eslint-disable-next-line no-new-func
  const CAP = new Function(`return ${lab.slice(i + 'export const CAP = '.length, j + 2)}`)();
  const qMinFraction = Number(lab.match(/TUBING_CURVE_QMIN_FRACTION = ([0-9.e-]+);/)[1]);
  const scanLo = Number(lab.match(/SCAN_LO_FRACTION = ([0-9.e-]+);/)[1]);
  const scanHi = Number(lab.match(/SCAN_HI_FRACTION = ([0-9.e-]+);/)[1]);
  if (qMinFraction !== 1e-3 || scanLo !== 1e-3 || scanHi !== 0.999) throw new Error('nodal: the sampling fractions the prompt states in words have moved');
  const ipr = { prPsia: CAP.prPsia, pbPsia: CAP.pbPsia, testQStbd: CAP.testQStbd, testPwfPsia: CAP.testPwfPsia };
  const outflow = { pWhPsia: CAP.pWhPsia, gGravPsi: CAP.gGravPsi, qRefStbd: CAP.qRefStbd, kFricPsiPerStbd2: CAP.kFricPsiPerStbd2 };
  const method = { iprPoints: CAP.iprPoints, qMinFraction };
  const rel = `bhp(q) = pWh + ${num(outflow.gGravPsi)} / (1 + q/${num(outflow.qRefStbd)}) + ${num(outflow.kFricPsiPerStbd2)} q^2`;
  const iprText = `reservoir pressure ${num(ipr.prPsia)} psia, bubble point ${num(ipr.pbPsia)} psia and one test of ${num(ipr.testQStbd)} stb/d at ${num(ipr.testPwfPsia)} psia`;
  const fields = (tier) => {
    const test = fs.readFileSync(path.join(REPO, 'src/components/course/panels/nodal/nodalLab.test.js'), 'utf8');
    const out = {};
    for (const m of test.matchAll(/\['(beginner|intermediate|advanced)', '([a-z0-9_]+)', ([0-9.e+-]+), ([0-9.e+-]+)\]/g)) {
      if (m[1] === tier) out[m[2]] = [Number(m[3]), Number(m[4])];
    }
    return out;
  };
  const tiers = {
    intermediate: {
      why: 'Prompt only, no field moves. The prompt called the tubing curve "the gravity-plus-friction relation supplied with this capstone" and never stated its constants (3835, 600, 0.000238 lived only in nodalLab.js CAP), nor where the 49 points start (B5 finding 1). The prompt now states the relation, the wellhead pressure and the sampling, and restates the inflow the open flow comes from, so the four tubing fields are spreadsheet work on a form the course teaches (intermediate m03 l03). The two lift gas fields still need a Cullender and Smith march with the engine z; they stay class display for the W4 panel mode.',
      prompt_edits: [
        ['The tubing curve is the gravity-plus-friction relation supplied with this capstone, evaluated at a wellhead pressure of 1,236 psia over 49 points from just above zero to the absolute open flow.',
          `The tubing curve is the gravity-plus-friction relation ${rel}, with bhp and pWh in psia and q in stb/d, evaluated at a wellhead pressure of ${num(outflow.pWhPsia)} psia at ${num(CAP.vlpPoints)} evenly spaced rates from one thousandth of the absolute open flow up to the absolute open flow itself. The open flow is the Associate tier's, from its composite inflow: ${iprText}.`],
      ],
      inputs: { ipr, outflow, vlpPoints: CAP.vlpPoints },
      method,
      not_reproduced: ['liftgas_valve_pwf_psia', 'liftgas_mid_pmf_psia'],
    },
    advanced: {
      why: 'Prompt only, no field moves. The node needs the tubing relation, which no prompt stated, and the grid needed its span: the prompt now states the Associate inflow, the Professional outflow with its constants, and that the 900 points only bracket each crossing, which is then solved exactly. Every field is then a spreadsheet root find (verified: the roots match the key to about 1e-6 stb/d).',
      prompt_edits: [
        ['Solve on a 900-point grid.',
          `The inflow is the Associate tier's composite relation (${iprText}) and the outflow is the Professional tier's tubing relation ${rel} psia at a wellhead pressure of ${num(outflow.pWhPsia)} psia. Solve on a ${num(CAP.nGrid)}-point grid of rates evenly spaced from one thousandth to 0.999 of the absolute open flow: the grid only brackets each crossing, and a crossing is the exact rate at which the two pressures agree, with its flowing pressure read off the inflow.`],
      ],
      inputs: { ipr, outflow, nGrid: CAP.nGrid, sweepPwhPsia: CAP.sweepGradedPwhPsia },
      method,
    },
  };
  for (const [tier, t] of Object.entries(tiers)) {
    const got = REPRODUCE.nodal[tier](t.inputs, t.method);
    const f = fields(tier);
    if (Object.keys(f).length !== 6) throw new Error(`nodal/${tier}: ${Object.keys(f).length} pinned fields`);
    check('nodal', tier, got, Object.fromEntries(Object.entries(f).filter(([k]) => !(t.not_reproduced || []).includes(k))));
    t.expected = Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] ?? null }]));
  }
  return { course: 'nodal', wave: 'w2', fixture: 'src/components/course/panels/nodal/nodalLab.js (CAP)', tiers };
}

// ---------------------------------------------------------------------------
// gaswell (PD5): IMIRINGI-7. The fixture is the committed wave generator.
async function gaswell() {
  const fxPath = path.join(REPO, 'tools/course-waves/gaswell/pd5_fields.mjs');
  const fx = await loadFixture(fxPath, SCRATCH);
  const C = fx.CAP;
  const V = fx.capstoneValues();
  const fixtureFields = JSON.parse(fs.readFileSync(path.join(REPO, 'tools/course-waves/gaswell/fields.json'), 'utf8'));
  for (const [, k, v] of fixtureFields) if (V[k] !== v) throw new Error(`gaswell: fields.json ${k} is stale`);
  const GPm = await import('../../../packages/engines/engines/production/gasProperties.js');
  const DP = 10; // z to ten decimals: a critical rate moves as z^-0.75, so 5e-11 in z is far inside every tol
  const sut = GPm.suttonPseudoCriticals(C.gasSg);
  const wa = GPm.wichertAziz({ ...sut });
  if (wa.tpcR !== sut.tpcR || wa.ppcPsia !== sut.ppcPsia) throw new Error('gaswell: the sweet-gas correction is not an identity');
  const tpcR = Number(sut.tpcR.toFixed(6));
  const ppcPsia = Number(sut.ppcPsia.toFixed(6));
  // The DAK constants the prompt prints are read out of the vendored engine.
  const gpSrc = fs.readFileSync(path.join(ENGINES, 'engines/production/gasProperties.js'), 'utf8');
  const dakBlock = gpSrc.slice(gpSrc.indexOf('const DAK = {'), gpSrc.indexOf('};', gpSrc.indexOf('const DAK = {')));
  const A = [...dakBlock.matchAll(/a(\d+): (-?[0-9.]+)/g)].sort((x, y) => x[1] - y[1]).map((m) => m[2]);
  if (A.length !== 11) throw new Error('gaswell: could not read the eleven DAK constants');
  const dakText = `For this gas Sutton gives a pseudo-critical temperature Tpc of ${num(tpcR)} degR and a pseudo-critical pressure Ppc of ${num(ppcPsia)} psia (a sweet gas, so no acid gas correction). Dranchuk and Abou-Kassem then make z the root of z = 1 + (A1 + A2/Tpr + A3/Tpr^3 + A4/Tpr^4 + A5/Tpr^5) rr + (A6 + A7/Tpr + A8/Tpr^2) rr^2 - A9 (A7/Tpr + A8/Tpr^2) rr^5 + A10 (1 + A11 rr^2) (rr^2/Tpr^3) exp(-A11 rr^2), where rr = 0.27 Ppr / (z Tpr), Tpr is the absolute temperature over Tpc, Ppr is the pressure over Ppc, and A1 to A11 are ${A.join(', ')}; solve it by goal seek or iteration.`;
  // An independent evaluation of the printed equation, to prove the text says
  // what the engine solves (a check on the COPY, not a gate on the key).
  const a = A.map(Number);
  const tprW = GPm.toRankine(C.stations[0].tF) / tpcR;
  const pprW = C.stations[0].pPsia / ppcPsia;
  const g = (z) => { const r = (0.27 * pprW) / (z * tprW); return 1 + (a[0] + a[1] / tprW + a[2] / tprW ** 3 + a[3] / tprW ** 4 + a[4] / tprW ** 5) * r + (a[5] + a[6] / tprW + a[7] / tprW ** 2) * r * r - a[8] * (a[6] / tprW + a[7] / tprW ** 2) * r ** 5 + a[9] * (1 + a[10] * r * r) * (r * r / tprW ** 3) * Math.exp(-a[10] * r * r) - z; };
  let lo = 0.5; let hi = 1.2;
  for (let k = 0; k < 200; k += 1) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
  if (Math.abs((lo + hi) / 2 - V.wh_z_dak) > 1e-9) throw new Error(`gaswell: the printed DAK equation gives z ${(lo + hi) / 2}, the key is ${V.wh_z_dak}`);

  const zAt = (pPsia, tF) => Number(GPm.naturalGasZ({ pPsia, tF, gasSg: C.gasSg }).toFixed(DP));
  const below = C.stations.slice(1).map((st) => ({ depthFt: st.depthFt, pPsia: st.pPsia, tF: st.tF, z: zAt(st.pPsia, st.tF) }));
  const plungerZ = zAt(C.linePressurePsia, C.plungerAvgTF);
  const zText = `z at each station below the wellhead, from the package's own natural gas correlation (Sutton with Dranchuk and Abou-Kassem) at that station's pressure and temperature, is: ${below.map((st) => `${num(st.depthFt)} ft ${num(st.z, DP)}`).join('; ')}. For the plunger, z at the ${num(C.linePressurePsia)} psia line pressure and the ${num(C.plungerAvgTF)} degF average tubing temperature is ${num(plungerZ, DP)}. The wellhead z is the Associate tier's own graded answer and nothing in this tier needs it.`;
  const plunger = {
    depthFt: C.plungerDepthFt, idIn: C.plungerIdIn, linePressurePsia: C.linePressurePsia, casingPressurePsia: C.casingPressurePsia,
    slugLengthFt: C.slugLengthFt, liquidSg: C.liquidSg, plungerWeightLb: C.plungerWeightLb, avgTF: C.plungerAvgTF, z: plungerZ, wellGlrScfBbl: C.wellGlrScfBbl,
  };
  const design = {
    gasSg: C.gasSg, qMscfd: C.qMscfd, tubingIdIn: C.tubingIdIn, wellheadPsia: C.stations[0].pPsia,
    brine: { sigmaDyneCm: C.brineSigmaDyneCm, rhoLbFt3: C.brineRhoLbmFt3 },
    stations: below, candidatesIdIn: C.candidatesIdIn, plunger,
  };
  const cycle = { riseFtMin: C.riseFtMin, fallInGasFtMin: C.fallInGasFtMin, fallInLiquidFtMin: C.fallInLiquidFtMin, afterflowMin: C.afterflowMin, shutInMin: C.shutInMin };
  const method = { midDepthFt: C.stations[C.gradedProfileIndex].depthFt };
  const tiers = {
    beginner: {
      why: 'Prompt only, no field moves. Every beginner field needs z from Sutton and Dranchuk and Abou-Kassem, which no lesson or panel gives (B5 finding 1). z at the wellhead IS field 1, so printing it would hand that field over; the prompt instead states the Sutton pseudo-criticals for this gas and the DAK equation with its eleven constants (read from the vendored engine), so z is a spreadsheet goal seek and the other five fields are the taught closed forms on it. Keys, expected values and tolerances are unchanged.',
      prompt_edits: [
        ['Take the compressibility factor from the package\'s own natural gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and NOT from a flat assumption.',
          `Take the compressibility factor from the package's own natural gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and NOT from a flat assumption. ${dakText}`],
      ],
      inputs: {
        gasSg: C.gasSg, tpcR, ppcPsia, dak: A.map(Number), wellhead: { pPsia: C.stations[0].pPsia, tF: C.stations[0].tF },
        tubingIdIn: C.tubingIdIn, qMscfd: C.qMscfd,
        brine: { sigmaDyneCm: C.brineSigmaDyneCm, rhoLbFt3: C.brineRhoLbmFt3 },
        condensate: { sigmaDyneCm: C.condSigmaDyneCm, rhoLbFt3: C.condRhoLbmFt3 },
      },
      method: {},
    },
    intermediate: {
      why: 'Prompt only, no field moves. The prompt asked for z at every station from the package correlation, which only the engine could supply (B5 finding 1). It now states z at the four stations below the wellhead and at the plunger\'s average conditions (vendored naturalGasZ, ten decimals), so the critical rates, the sizing and the plunger balance are the taught closed forms. The wellhead z is left out: it is the beginner key.',
      prompt_edits: [
        ['Take z from the package\'s own natural gas correlation at EVERY station, and convert temperature at the door.',
          `Take z from the package's own natural gas correlation at EVERY station, and convert temperature at the door: ${zText}`],
      ],
      inputs: design,
      method,
    },
    advanced: {
      why: 'Prompt only, no field moves. As intermediate: z at the four stations below the wellhead and at the plunger conditions is stated, so every field is a closed form. The sentence calling field 3 one of the only two values reachable by hand is no longer true and now says fields 3 and 6 need no z at all.',
      prompt_edits: [
        ['Take z from the package\'s own natural gas correlation at every station and convert temperature at the door.',
          `Take z from the package's own natural gas correlation at every station and convert temperature at the door: ${zText}`],
        ['Field 3 is one of the two graded values in this course reachable by hand, field 6 being the other, and doing field 3 by hand with the textbook water gradient FAILS:',
          'Field 3 needs no z at all, and neither does field 6, and doing field 3 by hand with the textbook water gradient FAILS:'],
      ],
      inputs: { ...design, plunger: { ...plunger, cycle } },
      method,
    },
  };
  const fieldsOf = (tier) => Object.fromEntries(fixtureFields.filter(([t]) => t === tier).map(([, k, v, tol]) => [k, [v, tol]]));
  for (const [tier, t] of Object.entries(tiers)) {
    const got = REPRODUCE.gaswell[tier](t.inputs, t.method);
    check('gaswell', tier, got, fieldsOf(tier));
    t.expected = Object.fromEntries(Object.entries(fieldsOf(tier)).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }]));
  }
  return { course: 'gaswell', wave: 'w2', fixture: 'tools/course-waves/gaswell/pd5_fields.mjs', tiers };
}

const waveFields = (rel) => JSON.parse(fs.readFileSync(path.join(REPO, 'tools/course-waves', rel), 'utf8'));
const fieldsFrom = (list, tier, keys) => Object.fromEntries(list.filter(([t, k]) => t === tier && keys.includes(k)).map(([, k, v, tol]) => [k, [v, tol]]));
const objLiteral = (src, decl, open = '{', close = '}') => {
  const i = src.indexOf(decl);
  if (i < 0) throw new Error(`no ${decl}`);
  let depth = 0; let j = src.indexOf(open, i);
  const start = j;
  for (; j < src.length; j += 1) {
    if (src[j] === open) depth += 1;
    if (src[j] === close) { depth -= 1; if (depth === 0) break; }
  }
  // eslint-disable-next-line no-new-func
  return new Function(`return ${src.slice(start, j + 1)}`)();
};

// Lesson edits are applied here, idempotently, so every number they print
// is taken from the engine source or a fixture rather than typed.
function applyLesson(rel, anchor, insertion) {
  const file = path.join(REPO, rel);
  let text = fs.readFileSync(file, 'utf8');
  if (text.includes(insertion)) return;
  if (text.split(anchor).length !== 2) throw new Error(`${rel}: lesson anchor not found exactly once`);
  text = text.replace(anchor, anchor + insertion);
  fs.writeFileSync(file, text);
}
const checkCopy = (where, t) => {
  if (/[–—]/.test(t)) throw new Error(`${where}: em or en dash in new copy`);
  if (/,\s*not\b(?!-)/.test(t)) throw new Error(`${where}: an "X, not Y" contrastive in new copy`);
};

// ---------------------------------------------------------------------------
// cementing (DR7) advanced: state E x I
async function cementing() {
  const src = fs.readFileSync(path.join(DR('cementing'), 'dr7_fields.mjs'), 'utf8');
  const casing = objLiteral(src, 'const CAP_CASING =');
  const hole = objLiteral(src, 'const CAP_HOLE =', '[', ']');
  const CAP = objLiteral(src, 'const CAP =');
  const golden = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/drilling/goldens/cementing_cases.json'), 'utf8'));
  const fx = JSON.parse(fs.readFileSync(path.join(DR('cementing'), 'fields.json'), 'utf8'));
  const TDm = await import('../../../packages/engines/engines/drilling/torqueDrag.js');
  const ei = TDm.stringProperties({ odM: casing.odM, idM: casing.idM }).eiNm2;
  const eiText = Number(ei.toFixed(8));
  const eGpa = TDm.STEEL_E_PA / 1e9;
  const inputs = {
    casing: { odM: casing.odM, idM: casing.idM, weightKgM: casing.weightKgM },
    bendingStiffnessNm2: eiText, steelEGpa: eGpa,
    casedToMdM: hole[0].to_md_m, casedIdM: hole[0].casing_id_m, openToMdM: hole[1].to_md_m, openHoleIdM: hole[1].hole_id_m,
    spacingM: CAP.centralizer.spacingM, restoringForceN: CAP.centralizer.restoringForceN, standoffAtForce: CAP.centralizer.standoffAtRestoringForce,
    mudKgM3: CAP.standoffMudKgM3, rigidBladeOdM: CAP.rigidBladeOdM,
  };
  const method = {
    stations: golden.cases[0].stations, casedHoleIdM: hole[0].hole_id_m,
    casingDepths: { shoeMd: casing.shoeMd, floatCollarMd: casing.floatCollarMd, hangerMd: casing.hangerMd },
  };
  const keys = ['min_standoff', 'standoff_at_centralizer_at_min', 'required_spacing_m', 'min_standoff_rigid'];
  const f = fieldsFrom(fx, 'advanced', keys);
  const got = REPRODUCE.cementing.advanced(inputs, method);
  check('cementing', 'advanced', got, f);
  if (Math.abs(got.bending_stiffness_nm2 - eiText) > 1e-6) throw new Error('cementing: printed E x I is not the engine value');
  const text = `Its bending stiffness E x I is ${num(eiText)} N m2, which is E = ${num(eGpa)} GPa on I = pi/64 (OD^4 - ID^4).`;
  checkCopy('cementing', text);
  return {
    course: 'cementing', wave: 'w2', fixture: '/root/dr-wip-cementing/dr7_fields.mjs',
    tiers: {
      advanced: {
        why: 'Prompt only, no field moves. Fields 1 and 3 need the mid-span sag, which needs E x I of the 9-5/8 inch casing; the lessons give E x I only as a number for 7 inch casing and never E or the I formula, and E = 200 or 207 GPa moves the answer by 1e-3 or 3e-5 against tol 5e-7 (B5 finding 1). The prompt now states E x I (vendored stringProperties) and how it is built, so both are hand work from m02 l04 and m03 l01. Keys, expected values and tolerances are unchanged.',
        prompt_edits: [['on the same slant trajectory.', `on the same slant trajectory. ${text}`]],
        inputs, method,
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
        fields_moved_class: ['min_standoff', 'required_spacing_m'],
      },
    },
  };
}

// ---------------------------------------------------------------------------
// stimulation (DR10) beginner: state the two pressures at the job TVD
async function stimulation() {
  const fx = await loadFixture(path.join(DR('stimulation'), 'dr10_fields.mjs'), SCRATCH);
  const C = fx.CAP;
  const V = fx.capstoneValues();
  const src = fs.readFileSync(fx.__W2_SOURCE, 'utf8');
  const m2PerMd = Number(src.match(/const MD_PER_M2 = ([0-9.e-]+);/)[1]);
  const mPerIn = Number(src.match(/const IN = ([0-9.e-]+);/)[1]);
  const fl = JSON.parse(fs.readFileSync(path.join(DR('stimulation'), 'fields.json'), 'utf8'));
  const f = fieldsFrom(fl, 'beginner', ['q_max_matrix_m3s']);
  const inputs = {
    rwIn: C.rwM / mPerIn, reM: C.reM, kMd: C.kMd, m2PerMd, hM: C.acidHM, kOverKs: C.kOverKs, rsM: C.rsM,
    tvdM: Number(V._aux.midTvdM.toFixed(3)), pFracPa: Number(V._aux.closurePa.toFixed(2)), pResPa: Number(V._aux.pResPa.toFixed(2)), acidMuPaS: C.acidMuPaS,
  };
  if (Math.abs(inputs.rwIn - 4.875) > 1e-12) throw new Error('stimulation: rw is not 4.875 in');
  inputs.rwIn = 4.875;
  const method = { mPerIn };
  const got = REPRODUCE.stimulation.beginner(inputs, method);
  check('stimulation', 'beginner', got, f);
  const text = `At the job's true vertical depth of ${num(inputs.tvdM, 3)} m the fracturing pressure, the closure stress there, is ${num(inputs.pFracPa)} Pa and the reservoir pressure is ${num(inputs.pResPa)} Pa. Take the acid viscosity as exactly ${num(inputs.acidMuPaS)} Pa.s and 1 mD as ${num(m2PerMd)} m2.`;
  checkCopy('stimulation', text);
  return {
    course: 'stimulation', wave: 'w2', fixture: '/root/dr-wip-stimulation/dr10_fields.mjs',
    tiers: {
      beginner: {
        why: 'Prompt only, no field moves. Field 6 needs the fracturing and reservoir pressures at the true vertical depth of 2380 m MD, which the generator interpolated from the golden survey and profiles and no lesson or panel prints (B5 finding 1). The prompt now states both at 2033.000 m TVD, with the exact acid viscosity and the mD conversion, so the Darcy ceiling of m05 l02 is a hand calculation. Keys, expected values and tolerances are unchanged.',
        prompt_edits: [['The job is placed at 2380 m measured depth.', `The job is placed at 2380 m measured depth. ${text}`]],
        inputs: { ...inputs, tvdM: num(inputs.tvdM, 3) }, method,
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
      },
    },
  };
}

// W3 (Suite #554 to #568) gives the Separator Studio and the Facility Layout
// Mapper a Full precision switch; W3 left this brief to W2 so that one wave
// writes it, and supplied the sentence (/root/w3-apply/STATUS.md).
const W3_SEPARATION = 'Read the figures in the Separator Studio and the Facility Layout Mapper with their Full precision switch on (at the top of the page): they print them to the precision this capstone grades, with no digit grouping.';
// W3's wellcost case file (Suite #568, public/course-cases/), served by the Suite.
const W3_WELLCOST_CASE = 'https://petrolord.com/course-cases/wellcost-merlin-a12-advanced.wct.json';

// ---------------------------------------------------------------------------
// separation (FC1) advanced: publish the ADANGA yard
async function separation() {
  const labSrc = fs.readFileSync(path.join(REPO, 'src/components/course/panels/separation/separationLab.js'), 'utf8');
  const datum = objLiteral(labSrc, 'export const ADANGA_DATUM =');
  const mPerDegLat = Number(labSrc.match(/const ADANGA_M_PER_DEG_LAT = ([0-9.]+);/)[1]);
  const mPerDegLonAtEquator = Number(labSrc.match(/const ADANGA_M_PER_DEG_LON = ([0-9.]+) \* Math\.cos\(\(ADANGA_DATUM\.lat \* Math\.PI\) \/ 180\);/)[1]);
  const block = labSrc.slice(labSrc.indexOf('export const ADANGA_ITEMS = ['), labSrc.indexOf('];', labSrc.indexOf('export const ADANGA_ITEMS = [')));
  const items = [...block.matchAll(/\{ id: '([^']+)', name: '([^']+)', type: '([^']+)', (?:\.\.\.adangaAt\((-?[0-9.]+), (-?[0-9.]+)\)|lat: null, lon: null) \}/g)]
    .map((m) => ({ id: m[1], name: m[2], type: m[3], northM: m[4] == null ? null : Number(m[4]), eastM: m[5] == null ? null : Number(m[5]) }));
  if (items.length !== 10) throw new Error(`separation: read ${items.length} ADANGA items`);
  const sources = objLiteral(labSrc, 'export const ADANGA_SOURCES =', '[', ']');
  const spSrc = fs.readFileSync(path.join(ENGINES, 'engines/facilities/spacing.js'), 'utf8');
  const rEarth = Number(spSrc.match(/const R_EARTH_M = ([0-9.]+);/)[1]);
  // A radiation source whose item was never placed is skipped by the engine;
  // the prompt names it without figures, so it rides in `method`.
  const placedIds = new Set(items.filter((it) => it.northM != null).map((it) => it.id));
  const inputs = { datum, mPerDegLat, mPerDegLonAtEquator, earthRadiusM: rEarth, items, sources: sources.filter((x) => placedIds.has(x.id)) };
  const sepMethod = { unplacedSources: sources.filter((x) => !placedIds.has(x.id)) };
  const fl = waveFields('separation/fields.json');
  const f = fieldsFrom(fl, 'advanced', ['adanga_worst_absolute_shortfall_m', 'adanga_worst_relative_fraction']);
  const got = REPRODUCE.separation.advanced(inputs, sepMethod);
  check('separation', 'advanced', got, f);
  const placed = items.filter((it) => it.northM != null);
  const text = `THE YARD, each item given as its name, its type and its position in metres north and east of the datum at ${num(datum.lat)} N, ${num(datum.lon)} E: ${placed.map((it) => `${it.name}, ${it.type}, ${num(it.northM)} N ${num(it.eastM)} E`).join('; ')}. Turn an offset into latitude and longitude as the Mapper does, at ${num(mPerDegLat)} m per degree of latitude and ${num(mPerDegLonAtEquator)} m times the cosine of the datum latitude per degree of longitude, and measure every distance centre to centre by the haversine formula on a sphere of radius ${num(rEarth)} m. ${W3_SEPARATION}`;
  checkCopy('separation', text);
  return {
    course: 'separation', wave: 'w2', fixture: 'src/components/course/panels/separation/separationLab.js (ADANGA_*)',
    tiers: {
      advanced: {
        why: 'Prompt only, no field moves. The ADANGA item positions existed only in capstone-only code (separationLab.js ADANGA_ITEMS, guarded from panels), so neither layout ranking could be worked (B5 finding 1). The prompt now states each placed item as north and east offsets from the datum, the two scale factors the Mapper uses and the haversine radius, so both shortfalls are a hand calculation (intermediate m05 l02). It also asks for the fraction to six decimals, which is what its tol of 1e-6 needs; "four decimals or better" failed a learner who followed it. The Facility Layout Mapper print (SpacingPanel.jsx:179) is W3.',
        prompt_edits: [
          ['with a portable flare that was never placed and a second slop tank carrying no coordinates.', `with a portable flare that was never placed and a second slop tank carrying no coordinates. ${text}`],
          ['Lengths in ft, times in s, distances in m and the fraction as a fraction, to four decimals or better.', 'Lengths in ft, times in s and distances in m to four decimals or better, and the fraction as a fraction to six decimals.'],
        ],
        inputs, method: sepMethod,
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
        annot_updates: {
          adanga_worst_absolute_shortfall_m: { prompt_precision: 'Lengths in ft, times in s and distances in m to four decimals or better', prompt_decimals: 4, display_scale: 1 },
          adanga_worst_relative_fraction: { prompt_precision: 'and the fraction as a fraction to six decimals', prompt_decimals: 6, display_scale: 1 },
        },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// producedwater (FC7) beginner: state the 15.56 C reference (prompt and lesson)
async function producedwater() {
  const pwSrc = fs.readFileSync(path.join(ENGINES, 'engines/facilities/producedWater.js'), 'utf8');
  const refC = Number(pwSrc.match(/\(1 - crudeThermalExpansionPerC \* \(tC - ([0-9.]+)\)\)/)[1]);
  const PWm = await import('../../../packages/engines/engines/facilities/producedWater.js');
  const K = PWm.DECLARED_CONSTANTS;
  const probe = PWm.oilDensityKgM3({ apiGravity: 27.5, tC: refC });
  if (probe.rhoKgM3 !== probe.sg60 * K.crudeReferenceWaterKgM3) throw new Error('producedwater: the thinning does not vanish at the stated reference');
  const fl = waveFields('producedwater/fields.json');
  const f = fieldsFrom(fl, 'beginner', ['ogulagha_oil_density_kgm3']);
  const inputs = { api: 27.5, tC: 58.5, refC, expansionPerC: K.crudeThermalExpansionPerC, referenceWaterKgM3: K.crudeReferenceWaterKgM3 };
  const got = REPRODUCE.producedwater.beginner(inputs, {});
  check('producedwater', 'beginner', got, f);
  // the printed chain, evaluated independently: a check on the copy
  const chain = (141.5 / (131.5 + inputs.api)) * inputs.referenceWaterKgM3 * (1 - inputs.expansionPerC * (inputs.tC - refC));
  if (Math.abs(chain - f.ogulagha_oil_density_kgm3[0]) > 1e-9) throw new Error('producedwater: the printed chain does not give the key');
  const promptText = `The crude chain takes a specific gravity at 60 F of 141.5 / (131.5 + API) against the declared reference water of ${num(inputs.referenceWaterKgM3)} kg/m3, thinned by ${num(inputs.expansionPerC)} per degree C above a reference temperature of ${num(refC)} C.`;
  const lessonText = ` The thinning is measured from a reference temperature of ${num(refC)} C, which is 60 F taken to two decimals, so the whole chain is 141.5 / (131.5 + API) x ${num(inputs.referenceWaterKgM3)} x (1 - ${num(inputs.expansionPerC)} (T - ${num(refC)})) with T in C. Use ${num(refC)} exactly: the unrounded 60 F, 15.5556 C, moves a density by a few thousandths of a kg/m3.`;
  checkCopy('producedwater', promptText + lessonText);
  const lesson = 'src/content/courses/producedwater/beginner/m02-the-water-and-the-oil/l04-crude-density-from-api-gravity.md';
  const anchor = 'and the result is then thinned by temperature at a declared rate of 0.0007 for each degree.';
  applyLesson(lesson, anchor, lessonText);
  return {
    course: 'producedwater', wave: 'w2', fixture: 'packages/engines/engines/facilities/producedWater.js (oilDensityKgM3)',
    tiers: {
      beginner: {
        why: 'Prompt and lesson, no field moves. The lesson taught 141.5/(131.5 + API) x 999 thinned at 0.0007 per degree but never the reference temperature; the engine uses 15.56 C, and the exact 60 F (15.5556 C) a learner would use gives 862.321424, 0.0028 from the key against tol 1e-4 (B5). The prompt and beginner m02 l04 now state 15.56 C, so the crude density is an exact hand calculation. The other five beginner fields stay with the W4 panel mode.',
        prompt_edits: [['are the module\'s own declared choices, and nothing else is looked up.', `are the module's own declared choices, and nothing else is looked up. ${promptText}`]],
        lesson_edits: [[lesson, anchor, lessonText]],
        inputs, method: {},
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// linesizing (FC2) intermediate: print the three transmission forms (lessons)
async function linesizing() {
  const labSrc = fs.readFileSync(path.join(REPO, 'src/components/course/panels/linesizing/linesizingLab.js'), 'utf8');
  const BRASS = objLiteral(labSrc, 'export const BRASS =');
  const muCp = Number(labSrc.match(/BRASS_MU_CP = ([0-9.e-]+);/)[1]);
  const roughnessIn = Number(labSrc.match(/BRASS_ROUGHNESS_IN = ([0-9.e-]+);/)[1]);
  const contractScfd = Number(labSrc.match(/BRASS_CONTRACT_SCFD = ([0-9.e]+);/)[1]);
  const lhSrc = fs.readFileSync(path.join(ENGINES, 'engines/facilities/lineHydraulics.js'), 'utf8');
  const body = (name) => lhSrc.slice(lhSrc.indexOf(`export const ${name} =`), lhSrc.indexOf('export const', lhSrc.indexOf(`export const ${name} =`) + 10));
  const need = (name, re) => { const m = body(name).match(re); if (!m) throw new Error(`linesizing: ${name} no longer carries ${re}`); return m; };
  const wey = need('weymouthQ', /const q = ([0-9.]+) \* efficiency \* \(tbR \/ pbPsia\)\s*\* Math\.sqrt\(driving \/ \(sg \* tAvgR \* leMi \* zAvg\)\) \* idIn \*\* \(8 \/ 3\);/);
  const phb = need('panhandleBQ', /const q = ([0-9.]+) \* efficiency \* \(tbR \/ pbPsia\) \*\* ([0-9.]+)\s*\* \(driving \/ \(sg \*\* ([0-9.]+) \* tAvgR \* leMi \* zAvg\)\) \*\* ([0-9.]+) \* idIn \*\* ([0-9.]+);/);
  const gen = need('generalFlowQ', /let f = ([0-9.]+);[\s\S]*q = ([0-9.]+) \* efficiency \* \(tbR \/ pbPsia\)\s*\* Math\.sqrt\(driving \/ \(sg \* tAvgR \* leMi \* zAvg \* f\)\) \* idIn \*\* ([0-9.]+);[\s\S]*const re = \(([0-9.]+) \* q \* sg\) \/ \(idIn \* muCp\);/);
  const cb = lhSrc.match(/const next = -2 \* Math\.log10\(relRough \/ ([0-9.]+) \+ \(([0-9.]+) \* invSqrt\) \/ re\);/);
  const base = lhSrc.match(/export const BASE_CONDITIONS = \{ tbR: ([0-9.]+), pbPsia: ([0-9.]+) \};/);
  const elev = lhSrc.match(/const s = \(([0-9.]+) \* sg \* \(elevChangeFt \|\| 0\)\) \/ \(tAvgR \* zAvg\);/);
  if (!cb || !base || !elev || !lhSrc.includes('leFactor: (es - 1) / s') || !lhSrc.includes('const driving = p1Psia * p1Psia - es * p2Psia * p2Psia;')) throw new Error('linesizing: engine forms moved');
  const [tb, pb] = [base[1], base[2]];
  const common = `Here Q is in scfd at the base conditions of ${tb} degR and ${pb} psia, E is the transmission efficiency, p1 and p2 are the inlet and outlet pressures in psia, G the gas gravity, T the average flowing temperature in degR, Z the average compressibility, d the bore in inches and Le the equivalent length in miles. The elevation group is module 3's: s = ${elev[1]} G dH / (T Z) with dH in ft, positive when the outlet sits higher, and Le = L (e^s - 1) / s, which is L itself on a flat line where e^s is 1.`;
  const weyText = `\n\n## The form\n\nThe engine evaluates the GPSA Weymouth form:\n\n    Q = ${wey[1]} E (Tb/Pb) [(p1^2 - e^s p2^2) / (G T Le Z)]^0.5 d^(8/3)\n\n${common} The diameter exponent 8/3 is the 2.6666666667 quoted above. Solving the same form for p2 at a stated rate is one line of algebra, p2 = [(p1^2 - (Q / (${wey[1]} E (Tb/Pb) d^(8/3)))^2 G T Le Z) / e^s]^0.5; the engine bisects instead (module 4) and lands on the same pressure.`;
  const phbText = `\n\n## The Panhandle B form\n\n    Q = ${phb[1]} E (Tb/Pb)^${phb[2]} [(p1^2 - e^s p2^2) / (G^${phb[3]} T Le Z)]^${phb[4]} d^${phb[5]}\n\nwith the same symbols, base conditions and elevation group as Weymouth in the previous lesson. Every exponent in it is part of the correlation, so a spreadsheet has to carry each one exactly as printed.`;
  const genText = `\n\n## The form, and the loop\n\n    Q = ${gen[2]} E (Tb/Pb) [(p1^2 - e^s p2^2) / (G T Le Z f)]^0.5 d^${gen[3]}\n\nwith f the Darcy friction factor and the other symbols as in the Weymouth lesson. The friction factor is Colebrook's, 1/f^0.5 = -2 log10(e/(3.7 d) + 2.51/(Re f^0.5)) with e the absolute roughness in inches, at the gas Reynolds number Re = ${gen[4]} Q G / (d mu) with mu in cP. The loop starts from f = ${gen[1]}: compute Q, then Re from that Q, then solve Colebrook for a new f by repeating its right hand side until it stops changing, and go round again until f settles. The rate and the friction factor it settles on are the pair the engine returns.`;
  if (cb[1] !== '3.7' || cb[2] !== '2.51') throw new Error('linesizing: the Colebrook constants moved');
  checkCopy('linesizing', weyText + phbText + genText);
  const L1 = 'src/content/courses/linesizing/intermediate/m02-the-four-transmission-forms/l01-weymouth.md';
  const L2 = 'src/content/courses/linesizing/intermediate/m02-the-four-transmission-forms/l02-the-two-panhandles.md';
  const L3 = 'src/content/courses/linesizing/intermediate/m02-the-four-transmission-forms/l03-general-flow-and-its-iteration.md';
  const a1 = 'Everything it knows about the pipe is the bore and the length.';
  const a2 = 'and will not be able to say which of them a quoted rate came from.';
  const a3 = 'and the friction factor it settled on is returned beside the rate rather than discarded.';
  applyLesson(L1, a1, weyText);
  applyLesson(L2, a2, phbText);
  applyLesson(L3, a3, genText);
  const inputs = { ...BRASS, muCp, roughnessIn, contractScfd };
  const fl = waveFields('linesizing/fields.json');
  const keys = ['brass_weymouth_scfd', 'brass_panhandleb_scfd', 'brass_general_scfd', 'brass_general_friction_factor', 'brass_outlet_pressure_psia'];
  const f = fieldsFrom(fl, 'intermediate', keys);
  const got = REPRODUCE.linesizing.intermediate(inputs, {});
  check('linesizing', 'intermediate', got, f);
  // The printed forms, evaluated independently of the engine: a check that
  // the lesson copy says what the engine computes.
  {
    const B = BRASS; const TbPb = Number(tb) / Number(pb);
    const sE = (Number(elev[1]) * B.sg * B.elevChangeFt) / (B.tAvgR * B.zAvg); const es = Math.exp(sE); const Le = B.lengthMi * (es - 1) / sE;
    const drv = B.p1Psia ** 2 - es * B.p2Psia ** 2;
    const qW = Number(wey[1]) * B.efficiency * TbPb * Math.sqrt(drv / (B.sg * B.tAvgR * Le * B.zAvg)) * B.idIn ** (8 / 3);
    const qB = Number(phb[1]) * B.efficiency * TbPb ** Number(phb[2]) * (drv / (B.sg ** Number(phb[3]) * B.tAvgR * Le * B.zAvg)) ** Number(phb[4]) * B.idIn ** Number(phb[5]);
    let fG = Number(gen[1]); let qG = 0;
    for (let k = 0; k < 200; k += 1) {
      qG = Number(gen[2]) * B.efficiency * TbPb * Math.sqrt(drv / (B.sg * B.tAvgR * Le * B.zAvg * fG)) * B.idIn ** Number(gen[3]);
      const Re = (Number(gen[4]) * qG * B.sg) / (B.idIn * muCp);
      let x = 1 / Math.sqrt(fG);
      for (let m = 0; m < 200; m += 1) x = -2 * Math.log10(roughnessIn / B.idIn / 3.7 + 2.51 * x / Re);
      fG = 1 / (x * x);
    }
    const K = Number(wey[1]) * B.efficiency * TbPb * B.idIn ** (8 / 3);
    const p2 = Math.sqrt((B.p1Psia ** 2 - (contractScfd / K) ** 2 * B.sg * B.tAvgR * Le * B.zAvg) / es);
    const copy = { brass_weymouth_scfd: qW, brass_panhandleb_scfd: qB, brass_general_scfd: qG, brass_general_friction_factor: fG, brass_outlet_pressure_psia: p2 };
    for (const [k, [v, tol]] of Object.entries(f)) if (!within(copy[k], v, tol / 10)) throw new Error(`linesizing: the printed form for ${k} gives ${copy[k]}, the key is ${v}`);
  }
  return {
    course: 'linesizing', wave: 'w2', fixture: 'src/components/course/panels/linesizing/linesizingLab.js (BRASS*)',
    tiers: {
      intermediate: {
        why: 'Lessons only, no prompt or field moves. The intermediate lessons never wrote the Weymouth, Panhandle B or General Flow forms (their constants lived only in lineHydraulics.js), no panel takes the BRASS inputs and the Suite has no forward-rate mode (B5 finding 1). Intermediate m02 l01, l02 and l03 now print the three forms, the base conditions, the elevation group, Colebrook and the General Flow loop, read from the vendored engine, so the four BRASS rates and the friction factor are spreadsheet work on the inputs the prompt already states, and the Weymouth inversion makes the outlet pressure a hand step too. Reaches learners with the next NextGen zip.',
        prompt_edits: [],
        lesson_edits: [[L1, a1, weyText], [L2, a2, phbText], [L3, a3, genText]],
        inputs: { ...inputs, contractScfd: '92000000' }, method: {},
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// heattransfer (FC6) intermediate: write the shells-in-series conversion (lesson)
async function heattransfer() {
  const htSrc = fs.readFileSync(path.join(ENGINES, 'engines/facilities/heatTransfer.js'), 'utf8');
  if (!htSrc.includes('const s = ((1 - p * r) / (1 - p)) ** (1 / n);') || !htSrc.includes('p1 = (s - 1) / (s - r);') || !htSrc.includes('p1 = p / (n - p * (n - 1));')) throw new Error('heattransfer: the conversion moved');
  const cap = fs.readFileSync(path.join(REPO, 'tools/course-waves/heattransfer/fc6_fields_capstone.mjs'), 'utf8');
  const T = objLiteral(cap, 'export const UBIT_TERMINALS =');
  const shells = Number(cap.match(/export const UBIT_SHELLS_IN_SERIES = ([0-9]+);/)[1]);
  const text = `\n\n## The conversion itself\n\nFor N shells in series at a whole unit P and R, the engine first forms\n\n    S = ((1 - P R) / (1 - P))^(1/N)\n\nand then takes the equivalent single-shell P as\n\n    P1 = (S - 1) / (S - R)\n\nWhere R is 1 that quotient has no value, and the limit is used instead: P1 = P / (N - P (N - 1)). Both are one line in a spreadsheet, and either one reproduces the equivalent single-shell P column of the two tables below from its P, R and shell count.`;
  checkCopy('heattransfer', text);
  const L1 = 'src/content/courses/heattransfer/intermediate/m02-shells-in-series/l01-the-equivalent-single-shell-p.md';
  const a1 = 'so the value the closed form was actually read at is visible rather than implied.';
  applyLesson(L1, a1, text);
  const inputs = { hotInF: T.thIn, hotOutF: T.thOut, coldInF: T.tcIn, coldOutF: T.tcOut, shells };
  const f = fieldsFrom(waveFields('heattransfer/fields.json'), 'intermediate', ['ubit_p1_two_shells']);
  const got = REPRODUCE.heattransfer.intermediate(inputs, {});
  check('heattransfer', 'intermediate', got, f);
  {
    const P = (T.tcOut - T.tcIn) / (T.thIn - T.tcIn); const R = (T.thIn - T.thOut) / (T.tcOut - T.tcIn);
    const S = ((1 - P * R) / (1 - P)) ** (1 / shells);
    if (!within((S - 1) / (S - R), f.ubit_p1_two_shells[0], f.ubit_p1_two_shells[1] / 10)) throw new Error('heattransfer: the printed conversion does not give the key');
  }
  return {
    course: 'heattransfer', wave: 'w2', fixture: 'tools/course-waves/heattransfer/fc6_fields_capstone.mjs (UBIT_*)',
    tiers: {
      intermediate: {
        why: 'Lesson only, no prompt or field moves. The equivalent single-shell P is printed by no panel or Suite surface, and intermediate m02 l01 tabulated its outputs without the conversion (heatTransfer.js lmtdCorrectionF). The lesson now writes the conversion and its R = 1 limit, so the field is hand work on the four terminal temperatures the prompt states. Reaches learners with the next NextGen zip. The F print (Suite SizingPanels.jsx) stays W3.',
        prompt_edits: [],
        lesson_edits: [[L1, a1, text]],
        inputs, method: {},
        expected: Object.fromEntries(Object.entries(f).map(([k, [v, tol]]) => [k, { expected: v, tol, reproduced: got[k] }])),
      },
    },
  };
}

const BUILDERS = { integrity, nodal, wellcost, gaswell, cementing, stimulation, separation, producedwater, linesizing, heattransfer };

const want = process.argv.slice(2);
for (const [course, build] of Object.entries(BUILDERS)) {
  if (want.length && !want.includes(course)) continue;
  const spec = await build();
  delete spec.tolOf;
  fs.writeFileSync(path.join(HERE, `${course}.json`), JSON.stringify(spec, null, 1) + '\n');
  console.log(`wrote w2/${course}.json:`, Object.entries(spec.tiers).map(([t, v]) => `${t} ${Object.keys(v.expected || {}).length} field(s)`).join(', '));
}
