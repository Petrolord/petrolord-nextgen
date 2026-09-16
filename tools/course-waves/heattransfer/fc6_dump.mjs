// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of heattransfer_cases.json (plus
// sweeps around those inputs) and the TEACHING CASES this wave designed for
// itself: the Heat Exchanger & Cooling Studio's own shipped defaults, the ORON
// four-pass exchanger and the ANTAN air cooler bay. THE FC6 CAPSTONE RUNS
// DIFFERENT UNITS ENTIRELY: nothing here imports, reads or reproduces the
// capstone generator, the graded answer file, or any capstone stream, rate,
// heat capacity, terminal temperature, coefficient, fouling allowance,
// conductivity, bore, length, duty, ambient or barometric pressure.
//
// Usage:  sh /root/fc-wip-heattransfer/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-heattransfer/digest.txt
//
// Engine, vendored sha-identical with engines e4377b3 (the FC6-0 repair):
// engines/facilities/heatTransfer.js, which imports NOTHING. The walked import
// closure of the whole family is five paths and three edges.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the published case file, which is written by
// the ORACLE and is therefore a second method's answer rather than the
// engine's) or "derived" (arithmetic on engine values printed in the same
// block, with the arithmetic stated). Where the engine keeps a constant to
// itself, the constant is MEASURED by asking the engine a question about
// itself rather than typed. Nothing here reads a clock, a random number or a
// network, so the file reproduces byte for byte.
//
// NOTHING IN THIS FILE DESCRIBES WHAT THE ENGINE USED TO DO except the last
// section, which says so in its title and its first line. Repair history is
// provenance and lives in RECON.md, FINDINGS.md and the engine source
// comments, none of which is teaching truth.
import fs from 'fs';
import {
  STUDIO_HOT, STUDIO_COLD, STUDIO_TERMINALS, STUDIO_FILM, STUDIO_TUBE_FLUID,
  STUDIO_GEOMETRY, STUDIO_SEEDS, STUDIO_AIR,
  ORON_HOT, ORON_COLD, ORON_TERMINALS, ORON_FILM, ORON_TUBE_FLUID, ORON_GEOMETRY, ORON_SEEDS,
  ANTAN, ANTAN_AMBIENT_SWEEP, ANTAN_BAROMETRIC_SWEEP,
  F_P_SWEEP, F_R_FIXED, F_P_TENDING_TO_ZERO, F_R_LIMIT_SET,
  SHELL_P, SHELL_R, SHELL_COUNTS, SHELLS_OVER_THE_BOUND, SHELLS_NOT_A_WHOLE_NUMBER,
  UNREACHABLE_P, UNREACHABLE_R,
  NTU_SWEEP, CR_SWEEP, ARRANGEMENTS, COUNTER_EFFECTIVENESS_PROBE, CEILING_CR,
  OVER_CEILING_EFFECTIVENESS, CR_ABOVE_ONE,
  WALL_DO_IN, WALL_THICKNESS_SWEEP, WALL_K_SWEEP, WALL_FILMS,
  FILM_FLOW_SWEEP, FILM_LAMINAR_FLOW, FILM_TRANSITION_FLOW, FILM_WALL_VISCOSITY,
  FILM_SERVICE_REFUSED, FILM_SERVICE_UNKNOWN, FILM_UNEQUAL_TUBES, FILM_UNEQUAL_PASSES,
  BUNDLE_AREA_FT2, BUNDLE_LAYOUTS, BUNDLE_PASS_COUNTS, BUNDLE_PASSES_REFUSED, BUNDLE_LAYOUT_REFUSED,
  BALANCE_HOT_OUT_ABOVE_HOT_IN, BALANCE_COLD_OUT_BELOW_COLD_IN, BALANCE_ZERO_DUTY,
  BALANCE_DUTY_THAT_DISAGREES, BALANCE_PARALLEL_CROSS_DUTY, BALANCE_CROSSING_DUTY,
  ARRANGEMENT_MISCASED, ARRANGEMENT_UNKNOWN,
  FOULING_NEGATIVE, K_WALL_ZERO, FAN_EFFICIENCY_ZERO, FAN_EFFICIENCY_ABOVE_ONE,
  MOTOR_EFFICIENCY_ABOVE_ONE, STATIC_PRESSURE_NEGATIVE, DRAFT_TYPE_UNNAMED,
  AMBIENT_ABOVE_PROCESS_INLET,
  VISCOSITY_PROBE_CP, DENSITY_PROBE_F, DENSITY_PROBE_PSIA,
  contractCensus,
} from '/root/fc-wip-heattransfer/fc6_fields.mjs';

const ROOT = process.env.FC6_ENGINES || '/root/wt-fc6-nextgen/packages/engines';
const H = await import(`${ROOT}/engines/facilities/heatTransfer.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/facilities/goldens/heattransfer_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);      // degF, ft2, coefficients, inches, percent, groups
const r4 = (x) => num(x, 4);      // Btu/hr duties, capacity rates, UA
const r9 = (x) => num(x, 9);      // resistances, hr.ft2.F/Btu
const n0 = (x) => num(x, 0);      // counts
const yn = (b) => (b === true ? 'yes' : (b === false ? 'no' : 'null'));

/* ------------------------------------------------------------------ *
 * THE REFUSAL GUARD, and it is a BUILD-TIME guard over every refusal
 * block in this file rather than a rule somebody remembers.
 *
 * FC4's generator labelled one row a refusal and called a case that
 * ANSWERS, printing seven success fields under a refusal heading. Every
 * number on that line was real engine output, so no numeric sweep could
 * see it, and the digest taught an evidence shape the engine never
 * returns. Three things stop that here:
 *
 *   refusal()  asserts the call carried an `error` string, prints the
 *              engine's own message, and records the line it printed.
 *   answers()  asserts the opposite, for every row labelled an answer, so
 *              a row that reads as an answer and secretly refused is a
 *              build failure too. FC4 guarded only one direction.
 *   auditRefusalLines()  sweeps the ASSEMBLED OUTPUT at the end. Every
 *              line that reads as a refusal must be one refusal() printed,
 *              or be declared prose with a reason. That is what makes this
 *              a guard over the class instead of a guard over the calls
 *              somebody remembered to wrap.
 * ------------------------------------------------------------------ */
const REFUSAL_LINES = new Set();
let refusalCalls = 0;
let answerCalls = 0;
const refusal = (label, r, evidence = []) => {
  refusalCalls += 1;
  if (!r || typeof r !== 'object' || typeof r.error !== 'string') {
    throw new Error(`GENERATOR REFUSES: the row "${label}" is labelled a refusal and the engine ANSWERED it. `
      + `A refusal row computed from a successful call prints real numbers under a false heading, which no numeric `
      + `sweep can see. Keys returned: ${r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r)}`);
  }
  const extra = evidence.filter((k) => r[k] !== undefined && r[k] !== null)
    .map((k) => `${k} ${typeof r[k] === 'number' ? e6(r[k]) : String(r[k])}`);
  const line = `- REFUSED, ${label}: ${r.error}${extra.length ? `  [evidence beside the message: ${extra.join(', ')}]` : ''}`;
  // SOME ENGINE MESSAGES CARRY HISTORY INSIDE THEM. A refusal that says what
  // the engine used to return is quoting the engine verbatim, which is right,
  // and it puts an unframed history sentence into the teaching truth, which is
  // not. So the frame is printed on the line IMMEDIATELY BEFORE, which is where
  // the prose gate and a reader both look for one. It is printed every time
  // rather than once, because framing that is four rows above frames nothing.
  if (/\bused to\b|\bno longer\b/i.test(r.error)) {
    w('- FRAMED AS REPAIR HISTORY: the engine message on the next line also states the behaviour FC6-0 replaced. That half of the message is history and is not what the engine does now.');
  }
  REFUSAL_LINES.add(line);
  w(line);
  return r;
};
const answers = (label, r) => {
  answerCalls += 1;
  if (!r || typeof r !== 'object' || typeof r.error === 'string') {
    throw new Error(`GENERATOR REFUSES: the row "${label}" is labelled an answer and the engine REFUSED it: `
      + `${r && r.error ? r.error : String(r)}`);
  }
  return r;
};
/**
 * THE BUILD-TIME GUARD OVER THE WHOLE CLASS, in two halves.
 *
 * HALF ONE, THE OUTPUT. Only refusal() may emit a line carrying the refusal
 * prefix, and the number of such lines must equal the number of refusal()
 * calls. A refusal row typed by hand, or copied from another block, is a build
 * failure rather than a sentence somebody has to notice.
 *
 * HALF TWO, THE SOURCE, and this is the half that generalises. Every call this
 * generator makes to the engine must be LABELLED: wrapped in answers(), wrapped
 * in refusal(), or assigned and then checked against its own `error` key within
 * the next few lines. That is what makes the label-versus-call defect
 * impossible here rather than absent here. FC4's generator had one unlabelled
 * call and it printed seven success fields under a refusal heading.
 */
const auditRefusals = () => {
  const PREFIX = '- REFUSED, ';
  const emitted = out.filter((l) => l.startsWith(PREFIX));
  const unknown = emitted.filter((l) => !REFUSAL_LINES.has(l));
  if (unknown.length) {
    throw new Error(`GENERATOR REFUSES: ${unknown.length} line(s) carry the refusal prefix and the refusal guard `
      + `did not print them:\n${unknown.join('\n')}`);
  }
  if (emitted.length !== REFUSAL_LINES.size) {
    throw new Error(`GENERATOR REFUSES: ${REFUSAL_LINES.size} refusal line(s) were built and ${emitted.length} `
      + 'reached the output, so a refusal row was dropped or duplicated');
  }
  // THE RUNNING FILE, not a path typed into it. A hard-coded path is how this
  // very audit passed its own negative control once: the control patched a copy
  // and the audit went on reading the original.
  const src = fs.readFileSync(new URL(import.meta.url), 'utf8');
  const lines = src.split('\n');
  // The two exports with NO error contract cannot be wrapped: one hands back a
  // copy of a frozen table and the other is the documented bare-number leaf.
  // They are exempt BY NAME and the exemption is printed.
  const NO_ERROR_CONTRACT = ['bundleConstants', 'airDensityLbFt3'];
  const calls = [];
  lines.forEach((line, i) => {
    [...line.matchAll(/\bH\.([A-Za-z]\w*)\s*\(/g)].forEach((hit) => {
      const name = hit[1];
      // THE STATEMENT, not a window. A window is how a permissive audit passes:
      // a neighbouring line's error check labels a call that has none of its
      // own. The statement runs from the last line that began one to the line
      // whose bracket depth returns to zero.
      let from = i;
      while (from > 0 && !/^\s*(?:const|let|var|return|if|w\(|\[|refusal\(|answers\(|[A-Za-z_$][\w$]*\s*=|\}|\)\.|.*=>\s*\{?$)/.test(lines[from])) from -= 1;
      let depth = 0; let to = from;
      for (let j = from; j < Math.min(lines.length, from + 40); j += 1) {
        for (const ch of lines[j]) {
          if ('([{'.includes(ch)) depth += 1;
          if (')]}'.includes(ch)) depth -= 1;
        }
        to = j;
        if (depth <= 0 && /[;,]\s*$|\)\s*$|\}\s*$/.test(lines[j]) && j >= i) break;
      }
      const statement = lines.slice(from, to + 1).join('\n');
      let labelled = NO_ERROR_CONTRACT.includes(name) || /answers\(|refusal\(/.test(statement);
      // The third honest form: assign it, then read its own error key.
      if (!labelled) {
        const assign = /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*H\./.exec(statement);
        if (assign) {
          const after = lines.slice(to, Math.min(lines.length, to + 14)).join('\n');
          // Its own error key read, or the value handed to one of the two
          // wrappers on a following line. Both are the call saying what it
          // expects; neither is a neighbour saying it for it.
          labelled = new RegExp(`\\b${assign[1]}\\.error\\b`).test(after)
            || new RegExp(`(?:answers|refusal)\\([^;]*\\b${assign[1]}\\b`).test(after);
        }
      }
      calls.push({ line: i + 1, name, labelled, exempt: NO_ERROR_CONTRACT.includes(name), text: line.trim().slice(0, 90) });
    });
  });
  const unlabelled = calls.filter((c) => !c.labelled);
  const exempt = calls.filter((c) => c.exempt);
  w(`# GENERATOR AUDIT: ${refusalCalls} refusal-labelled call(s), every one of which the engine refused; `
    + `${answerCalls} answer-labelled call(s), every one of which the engine answered; ${calls.length} engine call site(s) `
    + `in this generator, ${calls.length - unlabelled.length} labelled, ${exempt.length} exempt by name because they have `
    + `no error contract to check (${[...new Set(exempt.map((c) => c.name))].join(', ')}).`);
  if (unlabelled.length) {
    throw new Error(`GENERATOR REFUSES: ${unlabelled.length} engine call(s) reach the output unlabelled:\n`
      + unlabelled.map((c) => `  line ${c.line}: ${c.text}`).join('\n'));
  }
};

/* ------------------------------------------------------------------ *
 * The chains, run once each so every section reads the same answer.
 * ------------------------------------------------------------------ */
const chain = (hot, cold, terms, arrangement = 'counter') => {
  const cH = answers('hot capacity rate', H.capacityRate(hot)).cBtuHrF;
  const cC = answers('cold capacity rate', H.capacityRate(cold)).cBtuHrF;
  const bal = answers('energy balance', H.energyBalance({ cHot: cH, cCold: cC, ...terms, arrangement }));
  const l = answers('log mean', H.lmtd({ thIn: terms.thIn, thOut: bal.thOut, tcIn: terms.tcIn, tcOut: bal.tcOut, arrangement }));
  const g = answers('P and R', H.lmtdGroups({ thIn: terms.thIn, thOut: bal.thOut, tcIn: terms.tcIn, tcOut: bal.tcOut }));
  return {
    cHot: cH, cCold: cC, cMin: Math.min(cH, cC), cMax: Math.max(cH, cC), bal, l, g,
  };
};

/**
 * THE TUBE COUNT IS A LOOP AND THIS CLOSES IT, exactly as the studio does:
 * the film needs a count, the count needs an area, and the area needs the
 * film. The map is a contraction, so plain iteration settles. The trail is
 * returned because a reader should see it settle rather than be told it does.
 */
const closeTheLoop = (ch, film, fluid, geom, seeds, mLbHr, cpBtuLbF) => {
  const step = (nTubes) => {
    const f = H.tubeSideFilm({
      mLbHr, diIn: film.diIn, ...fluid, cpBtuLbF, nTubes, passes: geom.passes, service: 'heating',
    });
    if (f.error) return { error: f.error, atTubes: nTubes };
    const u = H.overallUOutside({ ...film, hiBtuHrFt2F: f.hBtuHrFt2F });
    if (u.error) return { error: u.error, atTubes: nTubes };
    const a = H.areaRequired({ qBtuHr: ch.bal.qBtuHr, uBtuHrFt2F: u.uDirtyBtuHrFt2F, lmtdF: ch.l.lmtdF, f: 1 });
    if (a.error) return { error: a.error, atTubes: nTubes };
    const t = H.tubeCount({ areaFt2: a.areaFt2, doIn: film.doIn, ...geom });
    if (t.error) return { error: t.error, atTubes: nTubes };
    return { film: f, u, area: a, tubes: t, atTubes: nTubes };
  };
  let cur = null; let seed = null; const refused = [];
  for (const s of seeds) {
    const r = step(s);
    if (r.error) { refused.push({ atTubes: s, error: r.error }); } else { cur = r; seed = s; break; }
  }
  if (!cur) throw new Error(`GENERATOR REFUSES: no seed in ${seeds.join(', ')} evaluates`);
  const trail = [seed];
  for (let i = 0; i < 40; i += 1) {
    const next = cur.tubes.nTubes;
    if (next === trail[trail.length - 1]) {
      return { ...cur, trail, iterations: i + 1, converged: true, refusedSeeds: refused };
    }
    trail.push(next);
    cur = step(next);
    if (cur.error) throw new Error(`GENERATOR REFUSES: the loop died at ${cur.atTubes} tubes: ${cur.error}`);
  }
  throw new Error('GENERATOR REFUSES: the tube count did not settle');
};

const ST = chain(STUDIO_HOT, STUDIO_COLD, STUDIO_TERMINALS);
const ST_LOOP = closeTheLoop(ST, STUDIO_FILM, STUDIO_TUBE_FLUID, STUDIO_GEOMETRY, STUDIO_SEEDS,
  STUDIO_COLD.mLbHr, STUDIO_COLD.cpBtuLbF);
const OR = chain(ORON_HOT, ORON_COLD, ORON_TERMINALS);
const OR_LOOP = closeTheLoop(OR, ORON_FILM, ORON_TUBE_FLUID, ORON_GEOMETRY, ORON_SEEDS,
  ORON_COLD.mLbHr, ORON_COLD.cpBtuLbF);
const ST_AIR = answers('the studio air cooler', H.airCooler(STUDIO_AIR));
const AN_AIR = answers('the ANTAN bay', H.airCooler(ANTAN));
const CENSUS = contractCensus(H);
const DC = H.DECLARED_CONSTANTS;
const DB = H.DECLARED_BOUNDS;
const HELD = H.HELD_FOR_LITERATURE;

// ------------------------------------------------------------------ header
w('# FC6 Heat Exchange & Cooling. Teaching digest.');
w('# Temperatures, log means, areas, overall coefficients, film coefficients, diameters, percentages and dimensionless groups print to six decimals; duties, capacity rates and UA in Btu an hour to four; resistances in hr.ft2.F per Btu to nine; tube and shell counts are whole numbers.');
w('# Field units throughout: Btu an hour, degF, lb an hour, ft2, Btu an hour per ft2 per degF, hr.ft2.F per Btu, inches, psia, inches of water, brake horsepower.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w(`# Built against engines e4377b3, vendored sha-identical. Every figure below is that engine's own answer at the inputs named beside it, except a line that says golden or derived.`);
w('# A GOLDEN LINE IS NOT THE ENGINE ANSWERING. The published case file is written by the oracle, which reaches each answer by a different route, so a golden figure beside an engine figure is two methods agreeing to as many digits as the two of them agree to.');
w();
// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What this engine rates and sizes, and what it refuses (owned by Associate m01)');
w();
w('# App surface: the Heat Exchanger & Cooling Studio has three tabs over one exchanger. Sizing takes a duty and returns a surface and a bundle, Rating takes a surface and returns what it delivers, and Air Cooler sizes a bay and then rates it on a hot afternoon.');
w('- This engine answers four questions about one exchanger. What duty do these two streams exchange, what driving force do they exchange it across, what coefficient does the surface carry, and how much surface and how many tubes does that take. It then rates a machine you already have, in both directions, and sizes an air cooler.');
w('- What is NOT here: no shell-side film coefficient from stream analysis, no pressure drop, no vibration check, no condensation or boiling, no fin geometry, no rigorous cross-flow rating. The shell side stays an input and the module says so. Pressure drop in a line belongs to the Pipeline and Line Sizing engine, and machine work belongs to Rotating Equipment.');
w(`- The contract belongs to the ${CENSUS.doors.length} exports that are called with a NAMED-ARGUMENT OBJECT, which is every door the studio calls. Each of them answers with an object, and each refusal puts a named string on an \`error\` key. The other callable exports, ${CENSUS.helpers.join(' and ')}, do not take one: the first is a leaf correlation with nowhere to put an error key, which answers with a bare number and says it has no answer with a bare NaN that its one caller turns into a named refusal, and the second hands back a copy of the held bundle table and takes no argument at all.`);
w(`- This module exports ${CENSUS.names.length} names in all, ${CENSUS.frozen.length} of them frozen tables rather than functions: the declared constants, the declared bounds, and the held-for-literature register that Section 20 reads.`);
w();
w('Every door, asked a question it can answer and a question it cannot:');
w('| export | answers with an object | keys on the answer | refuses with a named string | refusal carries evidence |');
w('| --- | --- | --- | --- | --- |');
CENSUS.doors.forEach((d) => w(`| ${d.name} | ${yn(d.answersWithAnObject)} | ${n0(d.answerKeys)} | ${yn(d.refusesWithANamedString)} | ${yn(d.refusalCarriesEvidence)} |`));
w();
w(`- Read the fourth column first: every door refuses with a NAMED string, so one guard shape works everywhere. Then read the last one. On these probes ${n0(CENSUS.doors.filter((d) => d.refusalCarriesEvidence).length)} of the ${n0(CENSUS.doors.length)} doors handed back MORE than a message, which is the numbers that produced the state they refused. A panel that shows only the message throws that away.`);
w('- The one scalar helper is the air density, and the module documents the exception rather than making it silently: a leaf correlation has nowhere to put an error key.');
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: The energy balance, its four terminals, and the refusals that protect it (owned by Associate m02)');
w();
w('- A capacity rate is a mass flow times a heat capacity, in Btu an hour per degF. It is the whole of what the balance knows about a stream.');
w('| stream | lb an hour | Btu per lb per degF | capacity rate, Btu an hour per degF |');
w('| --- | --- | --- | --- |');
w(`| the studio hot stream | ${r4(STUDIO_HOT.mLbHr)} | ${e6(STUDIO_HOT.cpBtuLbF)} | ${r4(ST.cHot)} |`);
w(`| the studio cold stream | ${r4(STUDIO_COLD.mLbHr)} | ${e6(STUDIO_COLD.cpBtuLbF)} | ${r4(ST.cCold)} |`);
w(`| the ORON hot stream | ${r4(ORON_HOT.mLbHr)} | ${e6(ORON_HOT.cpBtuLbF)} | ${r4(OR.cHot)} |`);
w(`| the ORON cold stream | ${r4(ORON_COLD.mLbHr)} | ${e6(ORON_COLD.cpBtuLbF)} | ${r4(OR.cCold)} |`);
w();
w(`- The studio case states its HOT outlet, so the duty is the hot capacity rate times the hot temperature drop, and the cold outlet is the answer: ${r4(ST.bal.qBtuHr)} Btu an hour, cold leaving at ${e6(ST.bal.tcOut)} degF. The engine reports which of the three it worked from, on the \`basis\` key, and here it says "${ST.bal.basis}".`);
w(`- ORON on the same basis: ${r4(OR.bal.qBtuHr)} Btu an hour, cold leaving at ${e6(OR.bal.tcOut)} degF.`);
w(`- The smaller of the two capacity rates is the one that governs a rating. On the studio case that is ${r4(ST.cMin)} against ${r4(ST.cMax)}, and the capacity ratio is ${e6(ST.cMin / ST.cMax)} (derived, the smaller over the larger).`);
w();
w('The same duty stated three ways, on the studio streams. All three agree, and the engine names which one it used:');
w('| stated | duty, Btu an hour | hot outlet, degF | cold outlet, degF | basis |');
w('| --- | --- | --- | --- | --- |');
[['the hot outlet', { thOut: STUDIO_TERMINALS.thOut }],
 ['the cold outlet', { tcOut: ST.bal.tcOut }],
 ['the duty itself', { qBtuHr: ST.bal.qBtuHr }]].forEach(([label, arg]) => {
  const r = answers(`the balance from ${label}`, H.energyBalance({
    cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, ...arg, arrangement: 'counter',
  }));
  w(`| ${label} | ${r4(r.qBtuHr)} | ${e6(r.thOut)} | ${e6(r.tcOut)} | ${r.basis} |`);
});
w();
w('Six states this balance will not compute, each one a state a saved study can carry, and each refusal naming the box rather than the physics:');
refusal('a hot outlet above the hot inlet', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, thOut: BALANCE_HOT_OUT_ABOVE_HOT_IN, arrangement: 'counter' }));
refusal('a cold outlet below the cold inlet', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, tcOut: BALANCE_COLD_OUT_BELOW_COLD_IN, arrangement: 'counter' }));
refusal('a stated duty of zero', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, qBtuHr: BALANCE_ZERO_DUTY, arrangement: 'counter' }));
refusal('a stated duty beside a stated outlet that disagrees with it', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, qBtuHr: BALANCE_DUTY_THAT_DISAGREES, thOut: STUDIO_TERMINALS.thOut, arrangement: 'counter' }));
refusal('a duty that crosses the two streams', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, qBtuHr: BALANCE_CROSSING_DUTY, arrangement: 'counter' }), ['thOutIfReached', 'tcOutIfReached']);
refusal('a duty no PARALLEL exchanger can deliver, refused by the parallel test', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, qBtuHr: BALANCE_PARALLEL_CROSS_DUTY, arrangement: 'parallel' }), ['thOutIfReached', 'tcOutIfReached']);
w();
w('The same duty that a parallel unit cannot deliver, put to a counter-current one:');
{
  const ok = answers('the same duty counter-current', H.energyBalance({ cHot: ST.cHot, cCold: ST.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, qBtuHr: BALANCE_PARALLEL_CROSS_DUTY, arrangement: 'counter' }));
  w(`- Counter-current: ${r4(ok.qBtuHr)} Btu an hour, hot leaving ${e6(ok.thOut)} degF and cold leaving ${e6(ok.tcOut)} degF. The arrangement is an input to the balance, and the test it applies is the test for that arrangement.`);
}
w('- The two outlets on those two refusal rows above are labelled `thOutIfReached` and `tcOutIfReached`, which is the evidence beside the message: the temperatures the duty implies, handed back so a caller can show why the state is impossible.');
w();
w('And the arrangement itself, read three ways:');
{
  const good = answers('a lowercase arrangement', H.lmtd({ ...STUDIO_TERMINALS, thOut: STUDIO_TERMINALS.thOut, tcOut: ST.bal.tcOut, arrangement: 'parallel' }));
  w(`- Given in lower case, parallel flow pairs the two ends the other way and the log mean is ${e6(good.lmtdF)} degF against the counter-current ${e6(ST.l.lmtdF)} degF on the same four temperatures.`);
}
{
  const cased = answers('an arrangement with a capital letter', H.lmtd({ ...STUDIO_TERMINALS, thOut: STUDIO_TERMINALS.thOut, tcOut: ST.bal.tcOut, arrangement: ARRANGEMENT_MISCASED }));
  w(`- Given as ${ARRANGEMENT_MISCASED}, with a capital letter, the same case answers ${e6(cased.lmtdF)} degF, because case and surrounding space no longer decide which method runs.`);
}
refusal('an arrangement this module does not carry', H.lmtd({ ...STUDIO_TERMINALS, thOut: STUDIO_TERMINALS.thOut, tcOut: ST.bal.tcOut, arrangement: ARRANGEMENT_UNKNOWN }));
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: The log mean, the two pairings, and the arithmetic mean it sits below (owned by Associate m03)');
w();
w('- The driving force is the log mean of the two END temperature differences. Which two ends they are is what the arrangement decides: counter-current pairs each inlet with the other outlet, parallel flow pairs the two inlets and then the two outlets.');
w('| case | arrangement | end one, degF | end two, degF | log mean, degF | arithmetic mean, degF (derived, the two ends added and halved) | equal ends |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[['the studio case', ST, STUDIO_TERMINALS], ['ORON', OR, ORON_TERMINALS]].forEach(([label, ch, terms]) => {
  ARRANGEMENTS.filter((a) => a !== 'shell1').forEach((arr) => {
    const r = answers(`${label} ${arr}`, H.lmtd({ thIn: terms.thIn, thOut: ch.bal.thOut, tcIn: terms.tcIn, tcOut: ch.bal.tcOut, arrangement: arr }));
    w(`| ${label} | ${arr} | ${e6(r.dt1)} | ${e6(r.dt2)} | ${e6(r.lmtdF)} | ${e6((r.dt1 + r.dt2) / 2)} | ${yn(r.equalEnds)} |`);
  });
});
GOLD.lmtd.forEach((row, i) => {
  const r = answers(`golden lmtd row ${i}`, H.lmtd({ thIn: row.thIn, thOut: row.thOut, tcIn: row.tcIn, tcOut: row.tcOut, arrangement: 'counter' }));
  w(`| published case ${n0(i + 1)}, golden ${e6(row.lmtdF)} | counter | ${e6(r.dt1)} | ${e6(r.dt2)} | ${e6(r.lmtdF)} | ${e6((r.dt1 + r.dt2) / 2)} | ${yn(r.equalEnds)} |`);
});
w();
w('- THE LOG MEAN IS STRICTLY BELOW THE ARITHMETIC MEAN WHENEVER THE TWO ENDS DIFFER, and equal to it when they do not. That is an analytic limit and it needs no publication to check it. Read the last three columns of every row above.');
w(`- The published case with the closest two ends is the one where the two means come nearest: end differences of ${e6(answers('the equal-ended published case', H.lmtd({ thIn: GOLD.lmtd[2].thIn, thOut: GOLD.lmtd[2].thOut, tcIn: GOLD.lmtd[2].tcIn, tcOut: GOLD.lmtd[2].tcOut })).dt1)} and ${e6(answers('the same case again', H.lmtd({ thIn: GOLD.lmtd[2].thIn, thOut: GOLD.lmtd[2].thOut, tcIn: GOLD.lmtd[2].tcIn, tcOut: GOLD.lmtd[2].tcOut })).dt2)} degF.`);
{
  const equal = answers('an exchanger with equal end differences', H.lmtd({ thIn: GOLD.lmtd[2].thIn, thOut: GOLD.lmtd[2].thIn - (GOLD.lmtd[2].tcOut - GOLD.lmtd[2].tcIn), tcIn: GOLD.lmtd[2].tcIn, tcOut: GOLD.lmtd[2].tcOut }));
  w(`- Drive the two ends to the same number and the engine says so rather than dividing by a logarithm of one: log mean ${e6(equal.lmtdF)} degF with equal ends reported as ${yn(equal.equalEnds)}.`);
}
w('- A 1-2 shell exchanger asks for the log mean too, and gets the counter-current one with a note attached. The note is the point: that figure is not the corrected driving force, and the correction is the next section.');
{
  const sh = answers('the shell1 reading of the studio case', H.lmtd({ thIn: STUDIO_TERMINALS.thIn, thOut: ST.bal.thOut, tcIn: STUDIO_TERMINALS.tcIn, tcOut: ST.bal.tcOut, arrangement: 'shell1' }));
  w(`- On the studio case: log mean ${e6(sh.lmtdF)} degF, basis reported as "${sh.basis}", note "${sh.note}".`);
}
refusal('a log mean asked for on three terminals', H.lmtd({ thIn: STUDIO_TERMINALS.thIn, thOut: ST.bal.thOut, tcIn: STUDIO_TERMINALS.tcIn }));
refusal('a log mean across streams that have crossed', H.lmtd({ thIn: STUDIO_TERMINALS.thIn, thOut: STUDIO_TERMINALS.tcIn, tcIn: STUDIO_TERMINALS.tcIn, tcOut: STUDIO_TERMINALS.thIn }), ['dt1', 'dt2']);
w();
// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: Area from the duty, the coefficient and the driving force (owned by Associate m04)');
w();
w('- The surface is the duty divided by the coefficient, the correction factor and the log mean. Nothing else. Which means every error in any of those three arrives in the area unchanged.');
w('| case | duty, Btu an hour | U dirty, Btu an hour per ft2 per degF | F | log mean, degF | area, ft2 |');
w('| --- | --- | --- | --- | --- | --- |');
{
  const stA = answers('the studio area', H.areaRequired({ qBtuHr: ST.bal.qBtuHr, uBtuHrFt2F: ST_LOOP.u.uDirtyBtuHrFt2F, lmtdF: ST.l.lmtdF, f: 1 }));
  const orA = answers('the ORON area', H.areaRequired({ qBtuHr: OR.bal.qBtuHr, uBtuHrFt2F: OR_LOOP.u.uDirtyBtuHrFt2F, lmtdF: OR.l.lmtdF, f: 1 }));
  w(`| the studio case | ${r4(ST.bal.qBtuHr)} | ${e6(ST_LOOP.u.uDirtyBtuHrFt2F)} | ${e6(1)} | ${e6(ST.l.lmtdF)} | ${e6(stA.areaFt2)} |`);
  w(`| ORON | ${r4(OR.bal.qBtuHr)} | ${e6(OR_LOOP.u.uDirtyBtuHrFt2F)} | ${e6(1)} | ${e6(OR.l.lmtdF)} | ${e6(orA.areaFt2)} |`);
  GOLD.areaRequired.forEach((row, i) => {
    const r = answers(`golden area row ${i}`, H.areaRequired({ qBtuHr: row.qBtuHr, uBtuHrFt2F: row.uBtuHrFt2F, lmtdF: row.lmtdF, f: row.f }));
    w(`| published case ${n0(i + 1)}, golden ${e6(row.areaFt2)} | ${r4(row.qBtuHr)} | ${e6(row.uBtuHrFt2F)} | ${e6(row.f)} | ${e6(row.lmtdF)} | ${e6(r.areaFt2)} |`);
  });
  w();
  w(`- The studio case again with the same duty and the same coefficient but the CLEAN coefficient instead of the dirty one: ${e6(answers('the clean-coefficient area', H.areaRequired({ qBtuHr: ST.bal.qBtuHr, uBtuHrFt2F: ST_LOOP.u.uCleanBtuHrFt2F, lmtdF: ST.l.lmtdF, f: 1 })).areaFt2)} ft2 against ${e6(stA.areaFt2)} ft2. The surface you buy is sized on the dirty coefficient, because the exchanger has to do its duty when it is dirty.`);
}
refusal('an area asked for at a zero coefficient', H.areaRequired({ qBtuHr: ST.bal.qBtuHr, uBtuHrFt2F: 0, lmtdF: ST.l.lmtdF, f: 1 }));
refusal('an area asked for at an F above one', H.areaRequired({ qBtuHr: ST.bal.qBtuHr, uBtuHrFt2F: ST_LOOP.u.uDirtyBtuHrFt2F, lmtdF: ST.l.lmtdF, f: 1 + 1e-6 }));
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: Tubes: the surface of one, the count, the pass rounding, and the overshoot (owned by Associate m05)');
w();
w('- One tube carries pi times its outside diameter in feet times its length. The count is the area divided by that, ROUNDED UP twice: once to a whole tube, and again to a whole multiple of the pass count, because a multi-pass bundle puts the same number of tubes in every pass.');
w('| case | area asked for, ft2 | one tube, ft2 | passes | tubes | tubes a pass | actual area, ft2 | overshoot, percent |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
[['the studio case', ST_LOOP, STUDIO_GEOMETRY], ['ORON', OR_LOOP, ORON_GEOMETRY]].forEach(([label, loop, geom]) => {
  w(`| ${label} | ${e6(loop.area.areaFt2)} | ${e6(loop.tubes.areaPerTubeFt2)} | ${n0(geom.passes)} | ${n0(loop.tubes.nTubes)} | ${n0(loop.tubes.tubesPerPass)} | ${e6(loop.tubes.actualAreaFt2)} | ${e6(loop.tubes.areaMarginPct)} |`);
});
GOLD.tubeCount.forEach((row, i) => {
  const r = answers(`golden tube count row ${i}`, H.tubeCount({ areaFt2: row.areaFt2, doIn: row.doIn, tubeLengthFt: row.tubeLengthFt, layoutDeg: row.layoutDeg, passes: row.passes, bundleClearanceIn: row.bundleClearanceIn }));
  w(`| published case ${n0(i + 1)}, golden ${n0(row.nTubes)} tubes | ${e6(row.areaFt2)} | ${e6(r.areaPerTubeFt2)} | ${n0(row.passes)} | ${n0(r.nTubes)} | ${n0(r.tubesPerPass)} | ${e6(r.actualAreaFt2)} | ${e6(r.areaMarginPct)} |`);
});
w();
w('- THE OVERSHOOT IS ALWAYS POSITIVE and it is reported rather than left for the reader to notice. A whole number of tubes cannot land exactly on a required area, so the surface you get is always at or above the surface you asked for.');
w(`- The rounding to a whole multiple of the passes is what makes the count usable: a count that does not divide equally cannot be fed back into the film, which is the loop Section 6 closes. On the studio case the count before that second rounding would have been ${n0(Math.ceil(ST_LOOP.area.areaFt2 / ST_LOOP.tubes.areaPerTubeFt2))} (derived, the area over one tube rounded up) and the engine returns ${n0(ST_LOOP.tubes.nTubes)}.`);
refusal(`a tube count asked for at ${BUNDLE_PASSES_REFUSED} passes, which this module carries no bundle constants for`, H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, passes: BUNDLE_PASSES_REFUSED }));
refusal('a tube count asked for at a zero area', H.tubeCount({ areaFt2: 0, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, passes: STUDIO_GEOMETRY.passes }));
w();

// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: The studio default case, end to end, with the tube count closed (owned by Associate m06 and Professional m06)');
w();
w('- This is the case the Heat Exchanger & Cooling Studio opens with. Every figure in this section is on that screen, and a reader can check the whole chain against an app.');
w('- The chain is a LOOP. It is not a line. The film needs a tube count, the count needs an area, the area needs the coefficient, and the coefficient needs the film. The map is a contraction, so plain iteration settles, and the trail is worth seeing settle.');
w(`- The studio walks a seed ladder, ${STUDIO_SEEDS.join(', ')} tubes, because an intermediate count can land in the band the film refuses. The first seed that evaluates starts the loop.`);
w(`- The trail on this case: ${ST_LOOP.trail.join(', ')} tubes, converged in ${n0(ST_LOOP.iterations)} passes of the loop.`);
w(`- ORON, four passes, its own ladder ${ORON_SEEDS.join(', ')}: trail ${OR_LOOP.trail.join(', ')} tubes, converged in ${n0(OR_LOOP.iterations)} passes.`);
w();
w('The studio case at its converged tube count, top to bottom:');
w('| quantity | value |');
w('| --- | --- |');
[['hot capacity rate, Btu an hour per degF', r4(ST.cHot)],
 ['cold capacity rate, Btu an hour per degF', r4(ST.cCold)],
 ['duty, Btu an hour', r4(ST.bal.qBtuHr)],
 ['cold outlet, degF', e6(ST.bal.tcOut)],
 ['log mean driving force, degF', e6(ST.l.lmtdF)],
 ['P', e6(ST.g.p)],
 ['R', e6(ST.g.r)],
 ['tube-side Reynolds number', e6(ST_LOOP.film.re)],
 ['tube-side Prandtl number', e6(ST_LOOP.film.pr)],
 ['tube-side regime', ST_LOOP.film.regime],
 ['inside film coefficient, Btu an hour per ft2 per degF', e6(ST_LOOP.film.hBtuHrFt2F)],
 ['U clean, Btu an hour per ft2 per degF', e6(ST_LOOP.u.uCleanBtuHrFt2F)],
 ['U dirty, Btu an hour per ft2 per degF', e6(ST_LOOP.u.uDirtyBtuHrFt2F)],
 ['fouling penalty, percent', e6(ST_LOOP.u.foulingPenaltyPct)],
 ['controlling resistance', ST_LOOP.u.controlling],
 ['its runner up', ST_LOOP.u.runnerUp],
 ['the margin between them, percent', e6(ST_LOOP.u.controllingMarginPct)],
 ['is that margin clear of the declared threshold', yn(ST_LOOP.u.controllingClear)],
 ['area required, ft2', e6(ST_LOOP.area.areaFt2)],
 ['tubes', n0(ST_LOOP.tubes.nTubes)],
 ['tubes a pass', n0(ST_LOOP.tubes.tubesPerPass)],
 ['actual area, ft2', e6(ST_LOOP.tubes.actualAreaFt2)],
 ['area overshoot, percent', e6(ST_LOOP.tubes.areaMarginPct)],
 ['bundle diameter, inches', e6(ST_LOOP.tubes.bundleDiameterIn)],
 ['shell diameter, inches', e6(ST_LOOP.tubes.shellDiameterIn)],
].forEach(([k, v]) => w(`| ${k} | ${v} |`));
w();
w('ORON, the same chain on a four-pass bundle:');
w('| quantity | value |');
w('| --- | --- |');
[['duty, Btu an hour', r4(OR.bal.qBtuHr)],
 ['cold outlet, degF', e6(OR.bal.tcOut)],
 ['log mean driving force, degF', e6(OR.l.lmtdF)],
 ['tube-side Reynolds number', e6(OR_LOOP.film.re)],
 ['tube-side Prandtl number', e6(OR_LOOP.film.pr)],
 ['inside film coefficient, Btu an hour per ft2 per degF', e6(OR_LOOP.film.hBtuHrFt2F)],
 ['U dirty, Btu an hour per ft2 per degF', e6(OR_LOOP.u.uDirtyBtuHrFt2F)],
 ['area required, ft2', e6(OR_LOOP.area.areaFt2)],
 ['tubes', n0(OR_LOOP.tubes.nTubes)],
 ['tubes a pass', n0(OR_LOOP.tubes.tubesPerPass)],
 ['bundle diameter, inches', e6(OR_LOOP.tubes.bundleDiameterIn)],
 ['shell diameter, inches', e6(OR_LOOP.tubes.shellDiameterIn)],
].forEach(([k, v]) => w(`| ${k} | ${v} |`));
w();
w('- SELF-CONSISTENCY, which is the check that catches a loop that has not closed. At the converged count the duty, the coefficient, the area and the driving force satisfy the equation they were built from.');
w(`- On the studio case: U times area times F times the log mean is ${r4(ST_LOOP.u.uDirtyBtuHrFt2F * ST_LOOP.area.areaFt2 * 1 * ST.l.lmtdF)} Btu an hour (derived, the four figures above multiplied) against the duty of ${r4(ST.bal.qBtuHr)} Btu an hour.`);
w(`- On ORON: ${r4(OR_LOOP.u.uDirtyBtuHrFt2F * OR_LOOP.area.areaFt2 * 1 * OR.l.lmtdF)} Btu an hour against ${r4(OR.bal.qBtuHr)}.`);
w();
// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: P and R, and a correction factor computed rather than typed (owned by Professional m01)');
w();
w('- P and R are the two dimensionless groups the correction factor is written in. P is the cold rise over the span between the two inlets. R is the hot drop over the cold rise.');
w('| case | P | R | F at one shell pass | warning |');
w('| --- | --- | --- | --- | --- |');
{
  [['the studio case', ST], ['ORON', OR]].forEach(([label, ch]) => {
    const f = answers(`${label} F`, H.lmtdCorrectionF({ p: ch.g.p, r: ch.g.r, shellPasses: 1 }));
    w(`| ${label} | ${e6(ch.g.p)} | ${e6(ch.g.r)} | ${e6(f.f)} | ${f.warning ? 'yes' : 'none'} |`);
  });
  GOLD.fCorrection.forEach((row, i) => {
    const f = answers(`golden F row ${i}`, H.lmtdCorrectionF({ p: row.p, r: row.r, shellPasses: row.shellPasses }));
    w(`| published case ${n0(i + 1)}, golden ${e6(row.f)} | ${e6(row.p)} | ${e6(row.r)} | ${e6(f.f)} | ${f.warning ? 'yes' : 'none'} |`);
  });
}
w();
w(`- F across P at a fixed R of ${e6(F_R_FIXED)}. Read the third column, then the rows below the table: this one sweep carries all three behaviours, an answer, an answer with the steep-curve warning, and a configuration one shell pass cannot reach at all.`);
w('| P | F | warning |');
w('| --- | --- | --- |');
F_P_SWEEP.forEach((p) => {
  const f = H.lmtdCorrectionF({ p, r: F_R_FIXED, shellPasses: 1 });
  if (f.error) { refusal(`F at P of ${e6(p)} and R of ${e6(F_R_FIXED)}`, f); return; }
  answers(`F at P of ${e6(p)}`, f);
  w(`| ${e6(p)} | ${e6(f.f)} | ${f.warning ? 'yes' : 'none'} |`);
});
w();
w('- The warning is not a refusal. The engine answers and says the curve is steep here, so a small error in the terminal temperatures swings the area badly, and the remedy is another shell rather than accepting the number.');
w();
w('- AN ANALYTIC LIMIT: F TENDS TO ONE AS P TENDS TO ZERO, at every R. A vanishing cold rise is a vanishing departure from counter-current flow, so there is nothing left to correct. This needs no publication to check.');
w(`| P | ${F_R_LIMIT_SET.map((r) => `F at R ${e6(r)}`).join(' | ')} |`);
w(`| --- | ${F_R_LIMIT_SET.map(() => '---').join(' | ')} |`);
F_P_TENDING_TO_ZERO.forEach((p) => {
  const cells = F_R_LIMIT_SET.map((r) => e6(answers(`F at P ${e6(p)} R ${e6(r)}`, H.lmtdCorrectionF({ p, r, shellPasses: 1 })).f));
  w(`| ${e6(p)} | ${cells.join(' | ')} |`);
});
w();
w('- Read the columns downward. Every one of them climbs toward one, and the R equals one column reaches it by its own branch of the closed form rather than by the general one.');
refusal('P given at one', H.lmtdCorrectionF({ p: 1, r: F_R_FIXED, shellPasses: 1 }));
refusal('R given at zero', H.lmtdCorrectionF({ p: SHELL_P, r: 0, shellPasses: 1 }));
{
  const r = H.lmtdGroups({ thIn: STUDIO_TERMINALS.thIn, thOut: ST.bal.thOut, tcIn: STUDIO_TERMINALS.tcIn, tcOut: STUDIO_TERMINALS.tcIn });
  refusal('P and R asked for on a cold stream that does not change temperature', r);
}
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: Shells in series, a declared bound, and the equivalent single-shell P (owned by Professional m02)');
w();
w(`- One duty, at P of ${e6(SHELL_P)} and R of ${e6(SHELL_R)}, bought with one shell up to the declared maximum of ${n0(DB.maxShellPasses)}:`);
w('| shells in series | equivalent single-shell P | F | warning |');
w('| --- | --- | --- | --- |');
SHELL_COUNTS.forEach((n) => {
  const f = H.lmtdCorrectionF({ p: SHELL_P, r: SHELL_R, shellPasses: n });
  if (f.error) { refusal(`${n0(n)} shells at this duty`, f); return; }
  answers(`${n0(n)} shells`, f);
  w(`| ${n0(n)} | ${e6(f.p1)} | ${e6(f.f)} | ${f.warning ? 'yes' : 'none'} |`);
});
w();
w('- The conversion is the whole mechanism. N shells in series are rated by converting the whole unit P into the P a SINGLE shell would see, and then reading the same closed form. The equivalent P falls as shells are added, which is why F rises.');
w('- The published multi-shell cases, five of the seven at an R away from one, which is the branch the conversion is easiest to get wrong in:');
w('| P | R | shells | equivalent single-shell P | F | golden F |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.fMultiShell.forEach((row, i) => {
  const f = answers(`golden multi-shell row ${i}`, H.lmtdCorrectionF({ p: row.p, r: row.r, shellPasses: row.shellPasses }));
  w(`| ${e6(row.p)} | ${e6(row.r)} | ${n0(row.shellPasses)} | ${e6(f.p1)} | ${e6(f.f)} | ${e6(row.f)} |`);
});
w();
w(`- THE BOUND IS DECLARED BY THIS MODULE AND IS NOT A PUBLISHED LIMIT, and the refusal says so. It exists because F climbs toward one as shells are added, so an unbounded box makes any duty reachable by typing a bigger number.`);
refusal(`${n0(SHELLS_OVER_THE_BOUND)} shells in series, one past the declared bound`, H.lmtdCorrectionF({ p: SHELL_P, r: SHELL_R, shellPasses: SHELLS_OVER_THE_BOUND }));
refusal(`${e6(SHELLS_NOT_A_WHOLE_NUMBER)} shells, which is not a whole number of shells`, H.lmtdCorrectionF({ p: SHELL_P, r: SHELL_R, shellPasses: SHELLS_NOT_A_WHOLE_NUMBER }));
w(`- Read that second refusal again. It names both whole numbers either side and says the engine will not pick one, because ${n0(Math.floor(SHELLS_NOT_A_WHOLE_NUMBER))} and ${n0(Math.ceil(SHELLS_NOT_A_WHOLE_NUMBER))} shells give materially different F: ${e6(answers('the lower shell count', H.lmtdCorrectionF({ p: SHELL_P, r: SHELL_R, shellPasses: Math.floor(SHELLS_NOT_A_WHOLE_NUMBER) })).f)} against ${e6(answers('the higher shell count', H.lmtdCorrectionF({ p: SHELL_P, r: SHELL_R, shellPasses: Math.ceil(SHELLS_NOT_A_WHOLE_NUMBER) })).f)}.`);
w();
w(`- A duty one shell cannot reach at all, at P of ${e6(UNREACHABLE_P)} and R of ${e6(UNREACHABLE_R)}, and the same duty as shells are added:`);
[1, 2, 3, 4].forEach((n) => {
  const f = H.lmtdCorrectionF({ p: UNREACHABLE_P, r: UNREACHABLE_R, shellPasses: n });
  if (f.error) { refusal(`the unreachable duty at ${n0(n)} shell pass or passes`, f); return; }
  w(`- At ${n0(n)} shells the same duty answers: equivalent single-shell P ${e6(f.p1)}, F ${e6(f.f)}${f.warning ? ', with the steep-curve warning' : ''}.`);
});
w('- That is the shape to carry away. A configuration can be infeasible rather than merely inefficient, and the answer is a refusal that tells you to add a shell.');
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: The overall coefficient, assembled from five named resistances (owned by Professional m03)');
w();
w(`- The coefficient is a sum of resistances in series, and it is referred to the OUTSIDE tube surface. The engine says which area on every answer: "${ST_LOOP.u.referenceArea}". This matters inside this package, because a second export in the production domain is called overallU and is referred to a stated BORE instead. A coefficient without its reference area is not a number you can use.`);
w('- The five terms, on the studio case at its converged tube count:');
w('| term | resistance, hr.ft2.F per Btu | share of the total, percent |');
w('| --- | --- | --- |');
Object.keys(ST_LOOP.u.resistances).forEach((k) => {
  w(`| ${k} | ${r9(ST_LOOP.u.resistances[k])} | ${e6(ST_LOOP.u.resistanceSharePct[k])} |`);
});
w(`| the total | ${r9(ST_LOOP.u.totalResistance)} | ${e6(Object.values(ST_LOOP.u.resistanceSharePct).reduce((a, b) => a + b, 0))} |`);
w();
w(`- The five add to the total: ${r9(Object.values(ST_LOOP.u.resistances).reduce((a, b) => a + b, 0))} (derived, the five rows above added) against the engine's ${r9(ST_LOOP.u.totalResistance)}.`);
w(`- U dirty is one over that total: ${e6(ST_LOOP.u.uDirtyBtuHrFt2F)}. U clean is one over the three terms that are not fouling: ${e6(ST_LOOP.u.uCleanBtuHrFt2F)}.`);
w(`- The fouling penalty is ${e6(ST_LOOP.u.foulingPenaltyPct)} percent.`);
w(`- AND THAT PENALTY IS AN IDENTITY. It is not an extra calculation: the two fouling terms as a share of the total come to ${e6((ST_LOOP.u.resistances.outsideFouling + ST_LOOP.u.resistances.insideFouling) / ST_LOOP.u.totalResistance * 100)} percent (derived, the outside and inside fouling rows over the total). The penalty in percent IS the fouling share of the resistance stack, because one minus clean over total is exactly the fouling terms over the total.`);
w();
w('- The inside terms are referred to the outside area by the diameter ratio, and that is visible in the numbers rather than asserted:');
w(`- The inside film coefficient is ${e6(ST_LOOP.film.hBtuHrFt2F)}, so one over it is ${r9(1 / ST_LOOP.film.hBtuHrFt2F)} (derived). The engine's inside film resistance is ${r9(ST_LOOP.u.resistances.insideFilm)}, which is the first figure multiplied by the diameter ratio ${e6(STUDIO_FILM.doIn / STUDIO_FILM.diIn)} (derived, the outside diameter over the inside one).`);
w(`- The inside fouling allowance is ${r9(STUDIO_FILM.foulingIn)} as typed and ${r9(ST_LOOP.u.resistances.insideFouling)} in the stack, by the same ratio. The outside fouling allowance of ${r9(STUDIO_FILM.foulingOut)} is already on the reference area and is carried unchanged.`);
w();
w('The published coefficient cases, and the defaults row:');
w('| ho | hi | do | di | U clean | golden U clean | U dirty | golden U dirty | controlling |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.u.concat([GOLD.uDefaults]).forEach((row, i) => {
  const r = answers(`golden u row ${i}`, H.overallUOutside({
    hoBtuHrFt2F: row.hoBtuHrFt2F, hiBtuHrFt2F: row.hiBtuHrFt2F, doIn: row.doIn, diIn: row.diIn,
    ...(row.kWallBtuHrFtF !== undefined ? { kWallBtuHrFtF: row.kWallBtuHrFtF } : {}),
    ...(row.foulingOut !== undefined ? { foulingOut: row.foulingOut } : {}),
    ...(row.foulingIn !== undefined ? { foulingIn: row.foulingIn } : {}),
  }));
  w(`| ${e6(row.hoBtuHrFt2F)} | ${e6(row.hiBtuHrFt2F)} | ${e6(row.doIn)} | ${e6(row.diIn)} | ${e6(r.uCleanBtuHrFt2F)} | ${e6(row.uCleanBtuHrFt2F)} | ${e6(r.uDirtyBtuHrFt2F)} | ${e6(row.uDirtyBtuHrFt2F)} | ${r.controlling} |`);
});
w();
w('- The golden columns sit beside the engine columns on purpose. The oracle builds this stack on each term OWN area and refers it to the outside only at the end, and it takes the wall term by quadrature rather than by a logarithm, so the agreement in those columns is two methods meeting and not one method restated.');
refusal(`a negative outside fouling allowance of ${r9(FOULING_NEGATIVE)}`, H.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: ST_LOOP.film.hBtuHrFt2F, foulingOut: FOULING_NEGATIVE }));
refusal('a wall conductivity of zero', H.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: ST_LOOP.film.hBtuHrFt2F, kWallBtuHrFtF: K_WALL_ZERO }));
refusal('an inside diameter above the outside one', H.overallUOutside({ ...STUDIO_FILM, doIn: STUDIO_FILM.diIn, diIn: STUDIO_FILM.doIn, hiBtuHrFt2F: ST_LOOP.film.hBtuHrFt2F }));
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: The controlling resistance, its runner up, and the margin that decided it (owned by Professional m03)');
w();
w('- Naming the largest resistance is the point of assembling U from its parts, because that is the term worth spending money on. A one-word verdict decided by a two percent gap is a coin toss wearing a result clothes, so the engine reports the runner up and the margin as well.');
w('| case | controlling | runner up | margin, percent of the controlling term | clear of the declared threshold |');
w('| --- | --- | --- | --- | --- |');
[['the studio case', ST_LOOP.u], ['ORON', OR_LOOP.u]].forEach(([label, u]) => {
  w(`| ${label} | ${u.controlling} | ${u.runnerUp} | ${e6(u.controllingMarginPct)} | ${yn(u.controllingClear)} |`);
});
GOLD.u.concat([GOLD.uDefaults]).forEach((row, i) => {
  const r = answers(`golden u margin row ${i}`, H.overallUOutside({
    hoBtuHrFt2F: row.hoBtuHrFt2F, hiBtuHrFt2F: row.hiBtuHrFt2F, doIn: row.doIn, diIn: row.diIn,
    ...(row.kWallBtuHrFtF !== undefined ? { kWallBtuHrFtF: row.kWallBtuHrFtF } : {}),
    ...(row.foulingOut !== undefined ? { foulingOut: row.foulingOut } : {}),
    ...(row.foulingIn !== undefined ? { foulingIn: row.foulingIn } : {}),
  }));
  w(`| published case ${n0(i + 1)} | ${r.controlling} | ${r.runnerUp} | ${e6(r.controllingMarginPct)} | ${yn(r.controllingClear)} |`);
});
w();
w(`- THE THRESHOLD IS DECLARED BY THIS MODULE AT ${n0(DB.controllingMarginPct)} PERCENT AND IS NOT PUBLISHED. It is a reporting threshold: above it the engine lets the word stand, below it the answer carries a note telling you to treat the two terms as jointly controlling instead of acting on the word.`);
{
  const near = answers('a case whose verdict is not clear', H.overallUOutside({
    hoBtuHrFt2F: 1 / ST_LOOP.u.resistances.outsideFilm, hiBtuHrFt2F: (STUDIO_FILM.doIn / STUDIO_FILM.diIn) / (ST_LOOP.u.resistances.outsideFilm * 1.02),
    doIn: STUDIO_FILM.doIn, diIn: STUDIO_FILM.diIn, kWallBtuHrFtF: STUDIO_FILM.kWallBtuHrFtF, foulingOut: 0, foulingIn: 0,
  }));
  w(`- Built deliberately near: outside film ${r9(near.resistances.outsideFilm)} against inside film ${r9(near.resistances.insideFilm)}, a margin of ${e6(near.controllingMarginPct)} percent, clear reported as ${yn(near.controllingClear)}, and the note reads "${near.controllingNote}".`);
}
w();
// --------------------------------------------------------------- SECTION 11
w('# SECTION 11: The thin-wall limit, and the factor it fixes (owned by Professional m04)');
w();
w('- A cylindrical wall resistance carries the outside diameter times the logarithm of the diameter ratio, over twice the conductivity. As the wall gets thin that expression has to collapse onto the flat plate, which is the thickness over the conductivity and nothing else. THAT LIMIT IS A KNOWN TRUTH AND NEEDS NO PUBLICATION, and it is the limit that fixes the factor of two.');
w(`- Measured by asking the engine for a coefficient with both films made negligible, at an outside diameter of ${e6(WALL_DO_IN)} inches, so the total resistance IS the wall:`);
w(`| wall thickness, inches | ${WALL_K_SWEEP.map((k) => `wall resistance at k ${n0(k)}`).join(' | ')} | ${WALL_K_SWEEP.map((k) => `flat plate at k ${n0(k)}`).join(' | ')} |`);
w(`| --- | ${WALL_K_SWEEP.map(() => '---').join(' | ')} | ${WALL_K_SWEEP.map(() => '---').join(' | ')} |`);
WALL_THICKNESS_SWEEP.forEach((t) => {
  const engine = WALL_K_SWEEP.map((k) => answers(`the wall at ${e6(t)} inches and k ${n0(k)}`, H.overallUOutside({
    ...WALL_FILMS, doIn: WALL_DO_IN, diIn: WALL_DO_IN - 2 * t, kWallBtuHrFtF: k, foulingOut: 0, foulingIn: 0,
  })).resistances.wall);
  const plate = WALL_K_SWEEP.map((k) => (t / 12) / k);
  w(`| ${e6(t)} | ${engine.map(r9).join(' | ')} | ${plate.map(r9).join(' | ')} |`);
});
w();
w('- Read the two halves of the table against each other row by row. They converge as the wall thins, and the ratio says how fast:');
w('| wall thickness, inches | wall resistance over flat plate, at the middle conductivity |');
w('| --- | --- |');
WALL_THICKNESS_SWEEP.forEach((t) => {
  const k = WALL_K_SWEEP[1];
  const engine = answers(`the wall ratio at ${e6(t)} inches`, H.overallUOutside({
    ...WALL_FILMS, doIn: WALL_DO_IN, diIn: WALL_DO_IN - 2 * t, kWallBtuHrFtF: k, foulingOut: 0, foulingIn: 0,
  })).resistances.wall;
  w(`| ${e6(t)} | ${e6(engine / ((t / 12) / k))} |`);
});
w();
w('- THE LIMIT IS WHAT A TRANSCRIPTION CANNOT CATCH. Move that factor of two the same way in the engine and in the oracle and the two files go on agreeing with each other perfectly, and neither of them agrees with the flat plate. An independent method is worth more than a matching one, and an analytic limit is worth more than both when the method is the thing in doubt.');
w(`- The wall is the smallest of the five terms on the studio case, at ${e6(ST_LOOP.u.resistanceSharePct.wall)} percent of the total. That is usual for metal and it is not a reason to skip it: the three conductivity columns above stand in inverse proportion to their conductivities, so a less conductive wall moves the term by the same factor in the other direction.`);
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The tube-side film: Reynolds, Prandtl, three regimes, and a band nobody here can state (owned by Professional m04)');
w();
w('- The film coefficient inside the tubes is computed, and it is the only place in this module where a FITTED correlation is used. Reynolds and Prandtl come out on every call so they can be checked.');
w(`- At the studio's converged count of ${n0(ST_LOOP.tubes.nTubes)} tubes in ${n0(STUDIO_GEOMETRY.passes)} passes, which is ${n0(ST_LOOP.film.tubesPerPass)} tubes a pass: Reynolds ${e6(ST_LOOP.film.re)}, Prandtl ${e6(ST_LOOP.film.pr)}, regime ${ST_LOOP.film.regime}, film coefficient ${e6(ST_LOOP.film.hBtuHrFt2F)}.`);
w('- The count is what sets the velocity, so it sets the Reynolds number, so it sets the film. A coefficient computed at a tube count the same screen contradicts is not a coefficient of anything:');
w('| tubes, at the studio two passes | tubes a pass | Reynolds | regime | film coefficient | U dirty that follows | area that follows, ft2 |');
w('| --- | --- | --- | --- | --- | --- | --- |');
ST_LOOP.trail.concat([ST_LOOP.tubes.nTubes]).filter((n, i, a) => a.indexOf(n) === i).forEach((n) => {
  const f = H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: n, passes: STUDIO_GEOMETRY.passes, service: 'heating' });
  if (f.error) { refusal(`the film at ${n0(n)} tubes`, f, ['re', 'pr', 'tubesPerPass']); return; }
  const u = answers(`U at ${n0(n)} tubes`, H.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: f.hBtuHrFt2F }));
  const a = answers(`the area at ${n0(n)} tubes`, H.areaRequired({ qBtuHr: ST.bal.qBtuHr, uBtuHrFt2F: u.uDirtyBtuHrFt2F, lmtdF: ST.l.lmtdF, f: 1 }));
  w(`| ${n0(n)} | ${n0(f.tubesPerPass)} | ${e6(f.re)} | ${f.regime} | ${e6(f.hBtuHrFt2F)} | ${e6(u.uDirtyBtuHrFt2F)} | ${e6(a.areaFt2)} |`);
});
w();
w('- The flow through one bundle, swept, at the converged count:');
w('| tube-side flow, lb an hour | Reynolds | regime | film coefficient |');
w('| --- | --- | --- | --- |');
FILM_FLOW_SWEEP.forEach((m) => {
  const f = H.tubeSideFilm({ mLbHr: m, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' });
  if (f.error) { refusal(`the film at ${r4(m)} lb an hour`, f, ['re', 'pr']); return; }
  answers(`the film at ${r4(m)} lb an hour`, f);
  w(`| ${r4(m)} | ${e6(f.re)} | ${f.regime} | ${e6(f.hBtuHrFt2F)}${f.warning ? ' (with a warning)' : ''} |`);
});
w();
w(`- Below a Reynolds number of ${n0(DC.transitionReLow)} the engine uses the laminar constant-wall-temperature limit, and says what that costs in a warning:`);
{
  const lam = answers('the laminar film', H.tubeSideFilm({ mLbHr: FILM_LAMINAR_FLOW, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  w(`- At ${r4(FILM_LAMINAR_FLOW)} lb an hour: Reynolds ${e6(lam.re)}, regime ${lam.regime}, film coefficient ${e6(lam.hBtuHrFt2F)}, and the warning reads "${lam.warning}".`);
  const lam2 = answers('the laminar film at twice the flow', H.tubeSideFilm({ mLbHr: 2 * FILM_LAMINAR_FLOW, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  w(`- Double that flow and the film coefficient is ${e6(lam2.hBtuHrFt2F)}, the same number, at a Reynolds of ${e6(lam2.re)}. The warning said it would not move with the flow, and it does not.`);
}
w(`- Between ${n0(DC.transitionReLow)} and ${n0(DC.transitionReHigh)} the engine REFUSES, and hands back the Reynolds number that put the case there, because no correlation in that band is trustworthy and sizing on a fiction is worse than being told to change something:`);
refusal(`the film in the transition band, at ${r4(FILM_TRANSITION_FLOW)} lb an hour`, H.tubeSideFilm({ mLbHr: FILM_TRANSITION_FLOW, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }), ['re', 'pr', 'tubesPerPass']);
w();
w('- The Sieder-Tate viscosity ratio, applied when a wall viscosity is given:');
{
  const plain = answers('the film without a wall viscosity', H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  const st = answers('the film with a wall viscosity', H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, muWallCp: FILM_WALL_VISCOSITY, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  w(`| wall viscosity given | Sieder-Tate applied | correction factor | film coefficient |`);
  w('| --- | --- | --- | --- |');
  w(`| none | ${yn(plain.siederTate)} | ${plain.siederTateFactor === undefined ? 'null' : e6(plain.siederTateFactor)} | ${e6(plain.hBtuHrFt2F)} |`);
  w(`| ${e6(FILM_WALL_VISCOSITY)} cp | ${yn(st.siederTate)} | ${e6(st.siederTateFactor)} | ${e6(st.hBtuHrFt2F)} |`);
}
w();
w('- A tube count that cannot divide equally into its passes is refused, because a multi-pass bundle puts the same number of tubes in every pass:');
refusal(`${n0(FILM_UNEQUAL_TUBES)} tubes in ${n0(FILM_UNEQUAL_PASSES)} passes`, H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: FILM_UNEQUAL_TUBES, passes: FILM_UNEQUAL_PASSES, service: 'heating' }));
w();
w('- THE VALIDITY BAND OF THIS CORRELATION IS NOT ESTABLISHED IN THIS REPOSITORY, in Reynolds or in Prandtl, and the engine says so rather than pretending otherwise. Every answer carries a `correlation` block:');
w(`- On the studio case that block reports a validity band of ${String(ST_LOOP.film.correlation.validityBand)}, with the Reynolds and Prandtl numbers beside it, and a note that reads: "${ST_LOOP.film.correlation.note}"`);
w('- That is the honest shape for a held item. The numbers a reader would need to check the band against their own source are handed over, and nothing here grades them.');
w();
w('The published film cases:');
w('| flow, lb an hour | bore, inches | viscosity, cp | Reynolds | golden Reynolds | Prandtl | film coefficient | golden film coefficient |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.tubeFilm.forEach((row, i) => {
  const f = H.tubeSideFilm({
    mLbHr: row.mLbHr, diIn: row.diIn, muCp: row.muCp, kBtuHrFtF: row.kBtuHrFtF, cpBtuLbF: row.cpBtuLbF,
    ...(row.muWallCp !== undefined ? { muWallCp: row.muWallCp } : {}),
    ...(row.nTubes !== undefined ? { nTubes: row.nTubes } : {}),
    ...(row.passes !== undefined ? { passes: row.passes } : {}),
  });
  answers(`golden film row ${i}`, f);
  w(`| ${r4(row.mLbHr)} | ${e6(row.diIn)} | ${e6(row.muCp)} | ${e6(f.re)} | ${e6(row.re)} | ${e6(f.pr)} | ${e6(f.hBtuHrFt2F)} | ${e6(row.hBtuHrFt2F)} |`);
});
w();
w('- THE ENGINE AND THE ORACLE DISAGREE IN THE LAST DIGITS OF THOSE COLUMNS AND THE DISAGREEMENT IS UNDERSTOOD. The oracle forms no flow area at all, taking Reynolds as four times the mass flow over pi times the diameter times the viscosity, and it derives every unit conversion from the SI definitions rather than typing one. The engine types a rounded viscosity conversion. Section 20 measures that rounding and shows the residual it causes is exactly it.');
w();
// --------------------------------------------------------------- SECTION 13
w('# SECTION 13: The cooling exponent this module declines to invent (owned by Professional m05)');
w();
w('- The correlation carries a Prandtl exponent, and the heating form and the cooling form use DIFFERENT ones. Only the heating form is established in this repository.');
w('- So a cooled tube side is REFUSED. Not answered with the heating exponent, and not answered with a cooling exponent invented here:');
refusal(`a tube side declared as ${FILM_SERVICE_REFUSED}`, H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: FILM_SERVICE_REFUSED }));
refusal(`a tube side declared as ${FILM_SERVICE_UNKNOWN}, which this module carries no form for at all`, H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, ...STUDIO_TUBE_FLUID, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: FILM_SERVICE_UNKNOWN }));
w();
w(`- The refusal states the size of the thing it is declining to guess, and the engine's own register says it too: "${HELD.dittusBoelterCoolingExponent}"`);
w(`- The studio's own Prandtl number is ${e6(ST_LOOP.film.pr)}, which is the neighbourhood that statement is about, and the engine reports that number on every call so a reader can see which neighbourhood they are in.`);
w(`- The answer the engine DOES give, at the same conditions with the tube side declared as heating: film coefficient ${e6(ST_LOOP.film.hBtuHrFt2F)}, with the service reported back as ${ST_LOOP.film.service} so a reader can see which form produced it.`);
w();
w('- WHY THE REFUSAL IS THE RIGHT ANSWER AND NOT A GAP. Answering a cooled tube side with the heating exponent would be a confident wrong number, and a confident wrong number is the worst thing an engine can return. Inventing the cooling exponent here would be worse, because it would carry no source at all and would then be quoted as though it did.');
w('- What a caller does instead: type the film coefficient. The module takes a stated inside film, and the studio offers that box, so a hot tube side is designed with a coefficient the engineer stands behind rather than one the engine guessed.');
w('- Nothing in this course grades a cooled tube side, and nothing in it grades a film coefficient at all, for exactly this reason.');
w();

// --------------------------------------------------------------- SECTION 14
w('# SECTION 14: The bundle, the shell, and the two layout rows that are identical (owned by Expert m04)');
w();
w(`- A bundle diameter comes from a fitted geometry form: the tube outside diameter times the tube count over a constant, raised to the reciprocal of an exponent. The constant and the exponent depend on the layout angle and the pass count, and this module carries ${n0(Object.keys(H.bundleConstants()).length)} layouts across ${n0(Object.keys(H.bundleConstants()['30']).length)} pass counts.`);
w(`- One area of ${e6(BUNDLE_AREA_FT2)} ft2 at the studio's tube size, across every layout and pass count the module carries:`);
w('| layout, degrees | passes | tubes | bundle diameter, inches | shell diameter, inches | layout note |');
w('| --- | --- | --- | --- | --- | --- |');
BUNDLE_LAYOUTS.forEach((layoutDeg) => {
  BUNDLE_PASS_COUNTS.forEach((passes) => {
    const t = answers(`the bundle at ${n0(layoutDeg)} degrees and ${n0(passes)} passes`, H.tubeCount({
      areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt,
      layoutDeg, passes, bundleClearanceIn: STUDIO_GEOMETRY.bundleClearanceIn,
    }));
    w(`| ${n0(layoutDeg)} | ${n0(passes)} | ${n0(t.nTubes)} | ${e6(t.bundleDiameterIn)} | ${e6(t.shellDiameterIn)} | ${t.layoutNote ? 'yes' : 'none'} |`);
  });
});
w();
w('- READ THE LAST TWO LAYOUT BLOCKS AGAINST EACH OTHER. Every figure is the same. The constants this module carries for those two layouts are IDENTICAL in all four pass counts, so that input does nothing between them, and the engine attaches a note saying exactly that rather than letting the box look live.');
{
  const K = H.bundleConstants();
  const same = JSON.stringify(K['45']) === JSON.stringify(K['90']);
  w(`- Measured rather than asserted: the two constant rows compare equal as data, ${yn(same)}.`);
  const t30 = answers('the bundle at the first layout', H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, layoutDeg: BUNDLE_LAYOUTS[0], passes: STUDIO_GEOMETRY.passes, bundleClearanceIn: STUDIO_GEOMETRY.bundleClearanceIn }));
  const t45 = answers('the bundle at the second layout', H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, layoutDeg: BUNDLE_LAYOUTS[1], passes: STUDIO_GEOMETRY.passes, bundleClearanceIn: STUDIO_GEOMETRY.bundleClearanceIn }));
  w(`- The first layout against the second IS live: bundle ${e6(t30.bundleDiameterIn)} against ${e6(t45.bundleDiameterIn)} inches at the same area and pass count, a ratio of ${e6(t45.bundleDiameterIn / t30.bundleDiameterIn)} (derived, the second over the first). So the input is not decorative in general, and the note names the pair it is inert between.`);
  w(`- The note itself, printed by the engine on any answer at either of those two layouts: "${t45.layoutNote}"`);
}
w();
w(`- THE EIGHT CONSTANT PAIRS ARE HELD FOR LITERATURE. Their source is not established in this repository, and the engine's own register says so: "${HELD.bundleConstants}"`);
w('- The shell diameter is the bundle plus a clearance, and the clearance is an INPUT because it depends on the head type. The engine adds it once:');
{
  const t = answers('the bundle at the studio clearance', H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, layoutDeg: BUNDLE_LAYOUTS[0], passes: STUDIO_GEOMETRY.passes, bundleClearanceIn: STUDIO_GEOMETRY.bundleClearanceIn }));
  const t0 = answers('the same bundle with no clearance', H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, layoutDeg: BUNDLE_LAYOUTS[0], passes: STUDIO_GEOMETRY.passes, bundleClearanceIn: 0 }));
  w(`- At the studio clearance of ${e6(STUDIO_GEOMETRY.bundleClearanceIn)} inches the shell is ${e6(t.shellDiameterIn)} inches; at no clearance it is ${e6(t0.shellDiameterIn)}, which is the bundle diameter itself. The difference is ${e6(t.shellDiameterIn - t0.shellDiameterIn)} inches (derived), which is the clearance, once.`);
}
refusal(`a layout of ${n0(BUNDLE_LAYOUT_REFUSED)} degrees, which this module carries no constants for`, H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, layoutDeg: BUNDLE_LAYOUT_REFUSED, passes: STUDIO_GEOMETRY.passes }));
refusal('a negative bundle-to-shell clearance', H.tubeCount({ areaFt2: BUNDLE_AREA_FT2, doIn: STUDIO_FILM.doIn, tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt, passes: STUDIO_GEOMETRY.passes, bundleClearanceIn: -STUDIO_GEOMETRY.bundleClearanceIn }));
w();
w('The published bundle cases:');
w('| area, ft2 | tube outside diameter, inches | length, ft | layout | passes | tubes | golden tubes | bundle diameter | golden bundle diameter |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.tubeCount.forEach((row, i) => {
  const t = answers(`golden bundle row ${i}`, H.tubeCount({ areaFt2: row.areaFt2, doIn: row.doIn, tubeLengthFt: row.tubeLengthFt, layoutDeg: row.layoutDeg, passes: row.passes, bundleClearanceIn: row.bundleClearanceIn }));
  w(`| ${e6(row.areaFt2)} | ${e6(row.doIn)} | ${e6(row.tubeLengthFt)} | ${n0(row.layoutDeg)} | ${n0(row.passes)} | ${n0(t.nTubes)} | ${n0(row.nTubes)} | ${e6(t.bundleDiameterIn)} | ${e6(row.bundleDiameterIn)} |`);
});
w();
w('- The oracle reaches the bundle diameter by BISECTING on the diameter until the geometry form balances, rather than raising a ratio to a reciprocal power. That is what makes the golden column independent: inverting an exponent is one of the easiest errors to make in this expression and the hardest to see in an answer.');
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: Effectiveness and NTU in both directions, two ceilings, and the arrangement with none (owned by Expert m01)');
w();
w('- A rating asks the other question. Given a surface, what fraction of the most heat that could possibly be moved does this machine actually move. Effectiveness is that fraction, and NTU is the surface written dimensionlessly.');
w(`| NTU | ${CR_SWEEP.map((cr) => `counter at Cr ${e6(cr)}`).join(' | ')} | ${CR_SWEEP.map((cr) => `parallel at Cr ${e6(cr)}`).join(' | ')} | ${CR_SWEEP.map((cr) => `1-2 shell at Cr ${e6(cr)}`).join(' | ')} |`);
w(`| --- | ${CR_SWEEP.concat(CR_SWEEP, CR_SWEEP).map(() => '---').join(' | ')} |`);
NTU_SWEEP.forEach((ntu) => {
  const cells = [];
  ARRANGEMENTS.forEach((arr) => {
    CR_SWEEP.forEach((cr) => {
      cells.push(e6(answers(`effectiveness at NTU ${e6(ntu)} Cr ${e6(cr)} ${arr}`, H.effectivenessFromNtu({ ntu, cr, arrangement: arr })).effectiveness));
    });
  });
  w(`| ${e6(ntu)} | ${cells.join(' | ')} |`);
});
w();
w('- Read any column downward: effectiveness rises with NTU. Read across the capacity ratios at a fixed NTU: it falls as the ratio rises. Read the three arrangements against each other at the same NTU and capacity ratio: counter-current is the highest of the three, every time.');
w('- THE TWO CEILINGS ARE THE POINT OF THIS SECTION. A parallel-flow unit and a 1-2 shell unit each have an effectiveness they cannot pass at ANY area, and the engine reports it as `ceiling` on every answer:');
w('| capacity ratio | parallel ceiling | 1-2 shell ceiling | counter-current ceiling |');
w('| --- | --- | --- | --- |');
CR_SWEEP.forEach((cr) => {
  const cells = ARRANGEMENTS.map((arr) => {
    const r = answers(`the ceiling at Cr ${e6(cr)} ${arr}`, H.effectivenessFromNtu({ ntu: NTU_SWEEP[NTU_SWEEP.length - 1], cr, arrangement: arr }));
    return r.ceiling === null ? 'none' : e6(r.ceiling);
  });
  w(`| ${e6(cr)} | ${cells[1]} | ${cells[2]} | ${cells[0]} |`);
});
w();
w('- COUNTER-CURRENT FLOW HAS NO CEILING BELOW ONE, and that is the entry in the last column: the engine reports null rather than a number. It is an analytic truth and it is also the default arrangement on the Rating tab, so it is the one a reader meets first.');
w(`- Proved by asking for an NTU at effectivenesses climbing toward one, at a capacity ratio of ${e6(CEILING_CR)}:`);
w('| effectiveness asked for | counter-current NTU | parallel | 1-2 shell |');
w('| --- | --- | --- | --- |');
COUNTER_EFFECTIVENESS_PROBE.forEach((eff) => {
  const cells = ARRANGEMENTS.map((arr) => {
    const r = H.ntuFromEffectiveness({ effectiveness: eff, cr: CEILING_CR, arrangement: arr });
    return r.error ? `refused, ceiling ${r.ceiling === undefined ? 'null' : e6(r.ceiling)}` : e6(r.ntu);
  });
  w(`| ${e6(eff)} | ${cells[0]} | ${cells[1]} | ${cells[2]} |`);
});
w();
w('- The counter-current column answers every time and the other two stop. A counter-current unit needs more and more surface as the effectiveness approaches one, without bound, and that is the honest answer rather than a refusal.');
w('- The refusals in those two columns carry the CEILING beside the message, which is the number that says how far the arrangement can go:');
refusal(`a parallel unit asked for an effectiveness of ${e6(OVER_CEILING_EFFECTIVENESS)} at a capacity ratio of ${e6(CEILING_CR)}`, H.ntuFromEffectiveness({ effectiveness: OVER_CEILING_EFFECTIVENESS, cr: CEILING_CR, arrangement: 'parallel' }), ['ceiling']);
refusal(`a 1-2 shell unit asked for the same effectiveness`, H.ntuFromEffectiveness({ effectiveness: OVER_CEILING_EFFECTIVENESS, cr: CEILING_CR, arrangement: 'shell1' }), ['ceiling']);
refusal(`a capacity ratio of ${e6(CR_ABOVE_ONE)}, which is the two capacity rates passed the wrong way round`, H.effectivenessFromNtu({ ntu: NTU_SWEEP[2], cr: CR_ABOVE_ONE }));
w();
w('- The two directions are inverses, and the engine is checked in both. The published cases run each way:');
w('| NTU | capacity ratio | arrangement | effectiveness | golden effectiveness | NTU recovered from that effectiveness |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.epsNtu.forEach((row, i) => {
  const e = answers(`golden eps row ${i}`, H.effectivenessFromNtu({ ntu: row.ntu, cr: row.cr, arrangement: row.arrangement }));
  const back = H.ntuFromEffectiveness({ effectiveness: e.effectiveness, cr: row.cr, arrangement: row.arrangement });
  w(`| ${e6(row.ntu)} | ${e6(row.cr)} | ${row.arrangement} | ${e6(e.effectiveness)} | ${e6(row.effectiveness)} | ${back.error ? 'refused' : e6(back.ntu)} |`);
});
w();
w('- The last column is the inversion returning the NTU the row started with. That is a self-consistency check and it is NOT evidence that either direction is right: an identity between a function and its own inverse holds whether or not either one is correct. The golden column is the evidence, because the oracle reaches it by marching the differential equations rather than by algebra.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: The capacity ratio at zero, where all three arrangements collapse onto one curve (owned by Expert m01)');
w();
w('- A capacity ratio of zero is a stream changing phase: it absorbs heat without changing temperature. At that limit the arrangement stops mattering, and all three collapse onto the same curve.');
w('| NTU | counter | parallel | 1-2 shell | the three all equal |');
w('| --- | --- | --- | --- | --- |');
NTU_SWEEP.forEach((ntu) => {
  const vals = ARRANGEMENTS.map((arr) => answers(`the Cr zero collapse at NTU ${e6(ntu)} ${arr}`, H.effectivenessFromNtu({ ntu, cr: 0, arrangement: arr })).effectiveness);
  w(`| ${e6(ntu)} | ${e6(vals[0])} | ${e6(vals[1])} | ${e6(vals[2])} | ${yn(vals[0] === vals[1] && vals[1] === vals[2])} |`);
});
w();
w('- THAT IS AN ANALYTIC LIMIT AND IT DISCRIMINATES. Three separate closed forms, three separate branches of the code, one answer. A wrong constant in any one of the three breaks the row it sits on and nothing else, which is exactly the kind of error a single published case cannot find.');
w(`- The ceiling at that limit is ${e6(answers('the ceiling at a capacity ratio of zero', H.effectivenessFromNtu({ ntu: NTU_SWEEP[0], cr: 0, arrangement: 'parallel' })).ceiling)} for every arrangement, because with nothing limiting the cold side there is no arrangement penalty left to pay.`);
w('- The published cases include one row in each arrangement at that limit, so the collapse is in the golden file and not only in this table.');
w();
// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: The air cooler: the air balance, the draft type, the barometer, and the correction it declines (owned by Expert m02)');
w();
w('- An air cooler has no cooling water. It has ambient air, a fan and a bundle, and the ambient temperature is the thing the design is hostage to.');
w('- The design point of the two teaching bays:');
w('| quantity | the studio bay | ANTAN |');
w('| --- | --- | --- |');
[['duty, Btu an hour', r4(STUDIO_AIR.qBtuHr), r4(ANTAN.qBtuHr)],
 ['process in, degF', e6(STUDIO_AIR.processInF), e6(ANTAN.processInF)],
 ['process out, degF', e6(STUDIO_AIR.processOutF), e6(ANTAN.processOutF)],
 ['design ambient, degF', e6(STUDIO_AIR.ambientF), e6(ANTAN.ambientF)],
 ['air rise, degF', e6(STUDIO_AIR.airRiseF), e6(ANTAN.airRiseF)],
 ['air outlet, degF', e6(ST_AIR.airOutF), e6(AN_AIR.airOutF)],
 ['log mean, degF', e6(ST_AIR.lmtdF), e6(AN_AIR.lmtdF)],
 ['U, Btu an hour per ft2 per degF', e6(STUDIO_AIR.uBtuHrFt2F), e6(ANTAN.uBtuHrFt2F)],
 ['bare surface, ft2', e6(ST_AIR.areaFt2), e6(AN_AIR.areaFt2)],
 ['air, lb an hour', r4(ST_AIR.airLbHr), r4(AN_AIR.airLbHr)],
 ['draft type', ST_AIR.draftType, AN_AIR.draftType],
 ['fan inlet, degF', e6(ST_AIR.fanInletF), e6(AN_AIR.fanInletF)],
 ['barometric pressure, psia', e6(ST_AIR.barometricPsia), e6(AN_AIR.barometricPsia)],
 ['air density at the fan inlet, lb per ft3', r9(ST_AIR.airDensityLbFt3), r9(AN_AIR.airDensityLbFt3)],
 ['actual ft3 a minute', r4(ST_AIR.acfm), r4(AN_AIR.acfm)],
 ['fan brake horsepower', e6(ST_AIR.fanBhp), e6(AN_AIR.fanBhp)],
 ['motor horsepower', e6(ST_AIR.motorHp), e6(AN_AIR.motorHp)],
].forEach(([k, a, b]) => w(`| ${k} | ${a} | ${b} |`));
w();
w(`- The air outlet is the ambient plus the rise, and the air mass follows from the duty and the rise through the module's declared air heat capacity. On the studio bay: ${r4(ST_AIR.airLbHr)} lb an hour carrying ${r4(STUDIO_AIR.qBtuHr)} Btu an hour across ${e6(STUDIO_AIR.airRiseF)} degF implies a heat capacity of ${e6(STUDIO_AIR.qBtuHr / (ST_AIR.airLbHr * STUDIO_AIR.airRiseF))} Btu per lb per degF (derived, the duty over the air mass and the rise). THAT IS THE DECLARED CONSTANT, measured out of the engine's own answer rather than read from its source.`);
w();
w('- THE DRAFT TYPE IS AN INPUT AND IT IS NOT A DETAIL. A forced-draft fan sits below the bundle and handles ambient air. An induced-draft fan sits above it and handles the heated air leaving. Those are different densities, so they are different volumes, so they are different fan powers.');
w('| draft type | fan inlet, degF | air density, lb per ft3 | actual ft3 a minute | fan brake horsepower | motor horsepower |');
w('| --- | --- | --- | --- | --- | --- |');
['forced', 'induced'].forEach((draftType) => {
  const r = answers(`the studio bay as ${draftType} draft`, H.airCooler({ ...STUDIO_AIR, draftType }));
  w(`| ${draftType} | ${e6(r.fanInletF)} | ${r9(r.airDensityLbFt3)} | ${r4(r.acfm)} | ${e6(r.fanBhp)} | ${e6(r.motorHp)} |`);
});
{
  const f = answers('the forced-draft bay', H.airCooler({ ...STUDIO_AIR, draftType: 'forced' }));
  const i = answers('the induced-draft bay', H.airCooler({ ...STUDIO_AIR, draftType: 'induced' }));
  w(`- The gap between the two, on the same bay: a fan power ratio of ${e6(i.fanBhp / f.fanBhp)} (derived, the induced over the forced). The engine will not pick one for you, and it reports the fan inlet temperature so the answer says which machine it belongs to.`);
}
refusal(`a draft type of ${DRAFT_TYPE_UNNAMED}, which is neither of the two this module carries`, H.airCooler({ ...STUDIO_AIR, draftType: DRAFT_TYPE_UNNAMED }));
w();
w('- THE BAROMETER IS AN INPUT TOO, because the duty of this machine is set by air density and a bay on a plateau breathes thinner air:');
w('| barometric pressure, psia | air density at the fan inlet, lb per ft3 | actual ft3 a minute | fan brake horsepower |');
w('| --- | --- | --- | --- |');
ANTAN_BAROMETRIC_SWEEP.forEach((barometricPsia) => {
  const r = answers(`the ANTAN bay at ${e6(barometricPsia)} psia`, H.airCooler({ ...ANTAN, barometricPsia }));
  w(`| ${e6(barometricPsia)} | ${r9(r.airDensityLbFt3)} | ${r4(r.acfm)} | ${e6(r.fanBhp)} |`);
});
w();
w(`- The air density is an ideal-gas density, and it can be measured out of the engine directly. At ${e6(DENSITY_PROBE_F)} degF and ${e6(DENSITY_PROBE_PSIA)} psia it returns ${r9(H.airDensityLbFt3(DENSITY_PROBE_F, DENSITY_PROBE_PSIA))} lb per ft3.`);
w(`- That one export answers with a BARE NUMBER rather than an object, and it is the documented exception to the module's error contract. Below absolute zero it returns ${String(H.airDensityLbFt3(-1000, DENSITY_PROBE_PSIA))}, which the bay turns into a named refusal rather than passing on.`);
w();
w('- AND THE CORRECTION THIS BAY DOES NOT HAVE. An air cooler is a CROSS-FLOW machine. The closed form or chart for its correction factor is not established in this repository, so the bare surface above is sized on the COUNTER-CURRENT log mean with no correction at all, and the engine says so on every answer rather than letting a silent one stand.');
w(`- On both bays the reported correction is ${String(ST_AIR.fCorrection)}, and the note reads: "${ST_AIR.fNote}"`);
w('- What that means for a reader: the surface in the table above is a counter-current-basis surface and a real bay needs more. The number is not wrong, it is a stated basis, and the honest form of a held item is to name the basis rather than to quietly apply a one.');
w();
w('Six states a bay will not compute, every one of them a box in the studio:');
refusal('a fan efficiency of zero', H.airCooler({ ...STUDIO_AIR, fanEfficiency: FAN_EFFICIENCY_ZERO }));
refusal(`a fan efficiency of ${e6(FAN_EFFICIENCY_ABOVE_ONE)}`, H.airCooler({ ...STUDIO_AIR, fanEfficiency: FAN_EFFICIENCY_ABOVE_ONE }));
refusal(`a motor efficiency of ${e6(MOTOR_EFFICIENCY_ABOVE_ONE)}`, H.airCooler({ ...STUDIO_AIR, motorEfficiency: MOTOR_EFFICIENCY_ABOVE_ONE }));
refusal(`a fan static pressure of ${e6(STATIC_PRESSURE_NEGATIVE)} inches of water`, H.airCooler({ ...STUDIO_AIR, staticPressureInH2O: STATIC_PRESSURE_NEGATIVE }));
refusal('an empty design ambient temperature', H.airCooler({ ...STUDIO_AIR, ambientF: NaN }));
refusal('a process outlet above the process inlet', H.airCooler({ ...STUDIO_AIR, processOutF: STUDIO_AIR.processInF + 1 }));
w();

// --------------------------------------------------------------- SECTION 18
w('# SECTION 18: The hot day, rated at fixed UA and fixed air mass (owned by Expert m03)');
w();
w('- A bay is bought for its worst afternoon. So the question is not what it does on its design day, it is what it still does when the air arrives hotter than the day it was sized on.');
w('- WHAT A MACHINE ACTUALLY HOLDS ON A HOT AFTERNOON IS ITS SURFACE AND ITS AIR MASS. Those two fix UA and both capacity rates, so they fix NTU and the capacity ratio, so they fix the EFFECTIVENESS. The duty then follows from the inlet temperature difference alone, and the new process outlet and the new air rise come out with it.');
w('- AND THAT IS WHY THIS RATING NEEDS NO ARRANGEMENT AND NO CORRECTION FACTOR. Effectiveness is taken from its DEFINITION at the design point, the duty over the smaller capacity rate times the inlet span, so the one correction this module cannot source never enters. The engine states the basis on every answer.');
w(`- The basis it states: "${ST_AIR.hotDay.basis}"`);
w();
w('The studio bay across its design point, hotter and colder:');
w('| check ambient, degF | regime | duty fraction | duty, Btu an hour | process out, degF | air rise, degF | air out, degF | effectiveness | NTU | capacity ratio | UA, Btu an hour per degF | hot-day log mean, degF | design outlet reached |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
ANTAN_AMBIENT_SWEEP.forEach((checkAmbientF) => {
  const r = answers(`the studio bay checked at ${e6(checkAmbientF)} degF`, H.airCooler({ ...STUDIO_AIR, checkAmbientF }));
  const d = r.hotDay;
  if (d.error) { refusal(`the studio bay checked at ${e6(checkAmbientF)} degF`, d); return; }
  w(`| ${e6(d.ambientF)} | ${d.regime} | ${e6(d.dutyFraction)} | ${r4(d.qBtuHr)} | ${e6(d.processOutF)} | ${e6(d.airRiseF)} | ${e6(d.airOutF)} | ${e6(d.effectiveness)} | ${e6(d.ntu)} | ${e6(d.cr)} | ${r4(d.uaBtuHrF)} | ${e6(d.lmtdF)} | ${yn(d.designOutletReached)} |`);
});
w();
w('The ANTAN bay, the same sweep:');
w('| check ambient, degF | regime | duty fraction | duty, Btu an hour | process out, degF | air rise, degF | effectiveness | NTU | capacity ratio | UA, Btu an hour per degF |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
ANTAN_AMBIENT_SWEEP.forEach((checkAmbientF) => {
  const r = answers(`the ANTAN bay checked at ${e6(checkAmbientF)} degF`, H.airCooler({ ...ANTAN, checkAmbientF }));
  const d = r.hotDay;
  if (d.error) { refusal(`the ANTAN bay checked at ${e6(checkAmbientF)} degF`, d); return; }
  w(`| ${e6(d.ambientF)} | ${d.regime} | ${e6(d.dutyFraction)} | ${r4(d.qBtuHr)} | ${e6(d.processOutF)} | ${e6(d.airRiseF)} | ${e6(d.effectiveness)} | ${e6(d.ntu)} | ${e6(d.cr)} | ${r4(d.uaBtuHrF)} |`);
});
w();
w('- Read the effectiveness, the NTU, the capacity ratio and the UA columns. They do not move down either table. That is the whole mechanism in four columns: the machine is the same machine at every ambient, and what changes is the air it is given.');
w('- Read the duty fraction and the process outlet columns together. As the air gets hotter the duty falls AND the process leaves hotter. Those two go together and a rating that reports one without the other is asserting something it did not compute.');
w(`- The self-consistency of the rated answer, on the studio bay at its own default check ambient: the duty is ${r4(ST_AIR.hotDay.qBtuHr)} Btu an hour, and the process capacity rate times the drop from the inlet to the new outlet is ${r4((STUDIO_AIR.qBtuHr / (STUDIO_AIR.processInF - STUDIO_AIR.processOutF)) * (STUDIO_AIR.processInF - ST_AIR.hotDay.processOutF))} (derived, the design duty over the design process drop, times the new drop).`);
w(`- The air side agrees too: the air capacity rate times the new rise is ${r4((STUDIO_AIR.qBtuHr / STUDIO_AIR.airRiseF) * ST_AIR.hotDay.airRiseF)} Btu an hour (derived, the design duty over the design rise, times the new rise).`);
w();
w('- A COLD DAY IS A CAPABILITY AND NOT A DELIVERED DUTY, and the engine says so in words rather than printing a number above one and leaving it:');
{
  const cold = answers('the studio bay on a cold morning', H.airCooler({ ...STUDIO_AIR, checkAmbientF: ANTAN_AMBIENT_SWEEP[0] }));
  w(`- At ${e6(ANTAN_AMBIENT_SWEEP[0])} degF the bay is labelled "${cold.hotDay.regime}", the duty fraction is ${e6(cold.hotDay.dutyFraction)}, and the note reads: "${cold.hotDay.note}"`);
}
{
  const hot = answers('the studio bay on its default hot afternoon', H.airCooler(STUDIO_AIR));
  w(`- And on the hot side, the note names both numbers that moved: "${hot.hotDay.note}"`);
}
refusal(`a check ambient of ${e6(AMBIENT_ABOVE_PROCESS_INLET)} degF, which is hotter than the process it is meant to cool`, answers('the bay whose hot-day block refuses', H.airCooler({ ...STUDIO_AIR, checkAmbientF: AMBIENT_ABOVE_PROCESS_INLET })).hotDay);
w();
w('The published hot-day cases, which the oracle reaches by the OTHER method:');
w('| design duty, Btu an hour | process in, degF | process out, degF | design ambient, degF | check ambient, degF | duty fraction | golden duty fraction | duty, Btu an hour | golden duty | process out, degF | golden process out | air rise, degF | golden air rise | UA | golden UA |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.hotDay.forEach((row, i) => {
  // The published rows carry UA and no U, because THE HOT-DAY RATING DOES NOT
  // DEPEND ON U AT ALL: UA is the duty over the design log mean whatever U and
  // the area separately are. The U passed here is the studio's, and the row
  // below this table measures that independence rather than asserting it.
  const r = answers(`golden hot day row ${i}`, H.airCooler({
    qBtuHr: row.qBtuHr, processInF: row.processInF, processOutF: row.processOutF, ambientF: row.ambientF,
    airRiseF: row.airRiseF, uBtuHrFt2F: STUDIO_AIR.uBtuHrFt2F, checkAmbientF: row.checkAmbientF,
  }));
  const d = r.hotDay;
  w(`| ${r4(row.qBtuHr)} | ${e6(row.processInF)} | ${e6(row.processOutF)} | ${e6(row.ambientF)} | ${e6(row.checkAmbientF)} | ${e6(d.dutyFraction)} | ${e6(row.dutyFraction)} | ${r4(d.qBtuHr)} | ${r4(row.hotQBtuHr)} | ${e6(d.processOutF)} | ${e6(row.hotProcessOutF)} | ${e6(d.airRiseF)} | ${e6(row.hotAirRiseF)} | ${r4(d.uaBtuHrF)} | ${r4(row.uaBtuHrF)} |`);
});
w();
w('- THE PUBLISHED ROWS CARRY UA AND NO OVERALL COEFFICIENT, and that is not an omission. UA is the duty over the design log mean, so the hot-day rating cannot see U and the area separately at all. Measured rather than asserted, by rating the same bay at two different coefficients:');
w('| U, Btu an hour per ft2 per degF | bare surface, ft2 | UA, Btu an hour per degF | duty fraction | process out on the hot day, degF |');
w('| --- | --- | --- | --- | --- |');
[STUDIO_AIR.uBtuHrFt2F, ANTAN.uBtuHrFt2F, STUDIO_AIR.uBtuHrFt2F * 10].forEach((u) => {
  const r = answers(`the studio bay at a coefficient of ${e6(u)}`, H.airCooler({ ...STUDIO_AIR, uBtuHrFt2F: u }));
  w(`| ${e6(u)} | ${e6(r.areaFt2)} | ${r4(r.hotDay.uaBtuHrF)} | ${e6(r.hotDay.dutyFraction)} | ${e6(r.hotDay.processOutF)} |`);
});
w();
w('- The surface column moves and the last three do not. A learner who has seen that understands what the rating holds fixed better than any sentence about it can teach them.');
w();

// --------------------------------------------------------------- SECTION 19
w('# SECTION 19: The second method, and what two methods agreeing buys (owned by Expert m03)');
w();
w('- The hot day above was rated by effectiveness-NTU. There is another classical way to the same answer, and it is genuinely independent: solve the duty out of the surface equation itself, at the fixed UA and at whatever log mean the new outlet and the new air rise produce.');
w('- If both methods are right they must agree, because a rated answer has to satisfy the surface equation it came from. So the product of the fixed UA and the hot-day log mean is a CHECK and not a restatement:');
w('| case | check ambient, degF | rated duty, Btu an hour | UA times the hot-day log mean, Btu an hour | the two as a ratio |');
w('| --- | --- | --- | --- | --- |');
[['the studio bay', STUDIO_AIR], ['ANTAN', ANTAN]].forEach(([label, bay]) => {
  ANTAN_AMBIENT_SWEEP.forEach((checkAmbientF) => {
    const d = answers(`${label} at ${e6(checkAmbientF)} degF`, H.airCooler({ ...bay, checkAmbientF })).hotDay;
    if (d.error || d.lmtdF === null) return;
    w(`| ${label} | ${e6(checkAmbientF)} | ${r4(d.qBtuHr)} | ${r4(d.uaBtuHrF * d.lmtdF)} | ${e6((d.uaBtuHrF * d.lmtdF) / d.qBtuHr)} |`);
  });
});
w();
w('- Every ratio in the last column is one to the precision this digest prints. TWO METHODS AGREE WHERE A SINGLE METHOD CAN ONLY BE CONSISTENT WITH ITSELF.');
w('- AND THAT IS THE LESSON OF THIS WHOLE COURSE, stated once, here. A rating that holds a duty and an outlet temperature that its own duty cannot produce satisfies NEITHER method. Checking it against a second method is what turns an answer into a result. The oracle behind the published rows above does exactly this: it bisects on the duty until the surface equation balances, and it never evaluates the effectiveness relation at all.');
w('- What an independent method is, and what it is not. Restating the same expression in SI units and converting back is a multiply followed by a divide: it checks the units and nothing else. Marching a differential equation to the answer a closed form claims, or bisecting on a different equation entirely, is a second method. The difference is whether the check could have failed for a reason other than a typing error.');
w();
w('- The other places this digest shows two methods meeting, all of them in the golden columns above:');
w('| what | the engine route | the oracle route |');
w('| --- | --- | --- |');
[['the log mean', 'the closed form with a logarithm', 'integrating the driving force it is the closed form of, which never evaluates a logarithm'],
 ['effectiveness, counter-current', 'the closed form', 'a fourth-order march of the two-stream system with a linear shot'],
 ['effectiveness, 1-2 shell', 'the closed form', 'a march of the three-stream shell and two-pass system, with the tube turn-around as a boundary condition'],
 ['the correction factor', 'the Bowman closed form', 'the ratio of the counter-current NTU to the 1-2 NTU inverted from that march'],
 ['the shell-count conversion', 'converting the whole-unit P to a single-shell P', 'marching N shells in series and recovering the whole-unit P'],
 ['the overall coefficient', 'the resistance sum referred to the outside', 'each term on its OWN area, referred to the outside at the end, with the wall by quadrature'],
 ['the tube-side Reynolds number', 'a mass velocity through a formed flow area', 'four times the mass flow over pi times the bore times the viscosity, which forms no area at all'],
 ['the bundle diameter', 'a ratio raised to a reciprocal exponent', 'bisecting on the diameter until the geometry form balances'],
 ['the fan power', 'the customary constant with inches of water in it', 'a pressure rise in pascals, which MEASURES the water density that constant is written against'],
 ['the hot day', 'effectiveness-NTU at fixed UA', 'bisecting the surface equation at the same fixed UA'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('- Read the last column for what it does NOT contain: a second copy of the first. Where a route could only have been a transcription, the golden file would tell you the two files agree and nothing more.');
w();

// --------------------------------------------------------------- SECTION 20
w('# SECTION 20: What no route here can check: the held register, the fitted numbers and two measured roundings (owned by Expert m05)');
w();
w(`- The module exports a register of what it cannot source, and it carries ${n0(Object.keys(HELD).length)} entries, counted here by reading the register itself. Every return that depends on one says so. No citation is invented for any of them, and NOTHING IN THIS COURSE GRADES ONE.`);
w(`- AND THE MODULE'S OWN HEADER SAYS SIX. Read the register: ${Object.keys(HELD).join(', ')}. That is ${n0(Object.keys(HELD).length)} entries against a header sentence that says six, and the register is the authority because it is the thing the returns point at. A COUNT IS WORTH MEASURING RATHER THAN QUOTING, even from the module that owns it, and this is the cheapest possible demonstration of why.`);
w('| held item | what the engine does about it |');
w('| --- | --- |');
Object.keys(HELD).forEach((k) => w(`| ${k} | ${HELD[k]} |`));
w();
w('- THE DIFFERENCE BETWEEN A PIN AND A VALIDATION, which is the most useful thing in this section. The declared constants below are pinned BY LITERAL in the engine gate. Pinning a number does not make it right. It makes changing it a reviewed act instead of a silent one, and that is worth having: it is not the same thing as evidence, and no lesson in this course may present it as evidence.');
w('| declared constant | value |');
w('| --- | --- |');
Object.keys(DC).forEach((k) => w(`| ${k} | ${typeof DC[k] === 'number' ? (Number.isInteger(DC[k]) ? n0(DC[k]) : e6(DC[k])) : String(DC[k])} |`));
w();
w('| declared bound | value | why it is declared rather than published |');
w('| --- | --- | --- |');
w(`| maxShellPasses | ${n0(DB.maxShellPasses)} | the correction factor climbs toward one as shells are added, so an unbounded box makes any duty reachable by typing a bigger number |`);
w(`| controllingMarginPct | ${n0(DB.controllingMarginPct)} | a one-word verdict decided by a two percent gap is a coin toss, so below this margin the answer carries a note instead |`);
w();
w('- TWO OF THOSE CONSTANTS ARE MEASURED RATHER THAN PINNED, because they are roundings of exact derivations, and the residual each one causes can be measured out of the engine itself.');
{
  // The viscosity conversion, measured by asking the film for a Reynolds number
  // at a unit viscosity and reading back what it divided by.
  const oneCp = answers('the film at a unit viscosity', H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, muCp: VISCOSITY_PROBE_CP, kBtuHrFtF: STUDIO_TUBE_FLUID.kBtuHrFtF, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  const twoCp = answers('the film at twice that viscosity', H.tubeSideFilm({ mLbHr: STUDIO_COLD.mLbHr, diIn: STUDIO_FILM.diIn, muCp: 2 * VISCOSITY_PROBE_CP, kBtuHrFtF: STUDIO_TUBE_FLUID.kBtuHrFtF, cpBtuLbF: STUDIO_COLD.cpBtuLbF, nTubes: ST_LOOP.tubes.nTubes, passes: STUDIO_GEOMETRY.passes, service: 'heating' }));
  w(`- The Prandtl number at a unit viscosity is ${e6(oneCp.pr)} and the heat capacity and conductivity it was formed from are conditions of the case, so the conversion the engine used is ${e6(oneCp.pr * STUDIO_TUBE_FLUID.kBtuHrFtF / STUDIO_COLD.cpBtuLbF)} (derived, the Prandtl number times the conductivity over the heat capacity). The engine's declared figure is ${e6(DC.cpToLbFtHr)}.`);
  w(`- The Reynolds number at twice that viscosity is ${e6(twoCp.re)} against ${e6(oneCp.re)}, a ratio of ${e6(twoCp.re / oneCp.re)} (derived), which is what a Reynolds number inversely proportional to viscosity has to give.`);
  w(`- The golden file carries the exactly derived conversion beside the engine's rounded one: ${e6(GOLD.derivedConstants.cpToLbFtHrDerived)} derived against ${e6(GOLD.derivedConstants.cpToLbFtHrEngine)} in the engine, a ratio of ${num(GOLD.derivedConstants.cpToLbFtHrEngine / GOLD.derivedConstants.cpToLbFtHrDerived, 12)} (golden, and derived from those two golden figures).`);
  w(`- The gas constant the air density uses: ${e6(DC.gasConstantPsiaFt3LbmolR)} in the engine against ${e6(GOLD.derivedConstants.gasConstantPsiaFt3LbmolRDerived)} derived from the SI gas constant, a ratio of ${num(DC.gasConstantPsiaFt3LbmolR / GOLD.derivedConstants.gasConstantPsiaFt3LbmolRDerived, 12)} (derived from those two figures).`);
  w('- NEITHER IS MOVED, and that is a decision rather than an oversight: moving either would move every shipped number that reads it, in this module and in the apps built on it. What is done instead is that the residual each one causes downstream is asserted to EQUAL the rounding, so the named cause is itself a check.');
}
{
  // THE RANKINE OFFSET IS A LITERAL INSIDE THE DENSITY HELPER rather than a row
  // of DECLARED_CONSTANTS, so it cannot be read off the table above. It can be
  // MEASURED out of two density calls, because an ideal-gas density is inversely
  // proportional to absolute temperature: the offset is the only unknown in the
  // ratio of two densities at two known temperatures.
  const t1 = DENSITY_PROBE_F;
  const t2 = DENSITY_PROBE_F * 2;
  const r1 = H.airDensityLbFt3(t1, DENSITY_PROBE_PSIA);
  const r2 = H.airDensityLbFt3(t2, DENSITY_PROBE_PSIA);
  const offset = (t2 * r2 - t1 * r1) / (r1 - r2);
  w(`- The Rankine offset the density uses is a literal inside that helper rather than a row of the table above, and it can be MEASURED out of two calls: densities of ${r9(r1)} and ${r9(r2)} lb per ft3 at ${e6(t1)} and ${e6(t2)} degF imply an offset of ${e6(offset)} degR (derived, from those two densities and those two temperatures, because an ideal-gas density is inversely proportional to absolute temperature and the offset is the only unknown left).`);
}
w(`- And one constant that is MEASURED rather than cited: the fan constant implies a water density. The golden file carries it at ${e6(GOLD.derivedConstants.waterLbFt3ImpliedBy6356)} lb per ft3 (golden), which is water at roughly the temperature of a warm afternoon. That is a MEASUREMENT and not a citation, and it is recorded as one. The oracle's fan route goes through pascals with that density and carries no customary constant at all, so moving the constant in both files still fails.`);
w();
w('- WHAT IS NOT REPAIRED AND WILL NOT BE, in this module, until a publication settles it:');
w(`- ${HELD.bundleConstants}`);
w(`- ${HELD.dittusBoelterBand}`);
w(`- ${HELD.dittusBoelterCoolingExponent}`);
w(`- ${HELD.siederTateExponent}`);
w(`- ${HELD.crossFlowF}`);
w(`- ${HELD.defaultsProvenance}`);
w('- The shell-side film coefficient also stays an INPUT. A rigorous shell-side coefficient needs stream analysis that belongs in a dedicated rating package, and this module has always said so.');
w();
w('- THE GOLDEN FILE IS DECLARED SYNTHETIC AND THE REASON IS STATED. This repository carries no published heat exchanger case to take a row from, and inventing a citation would be worse than saying so. What stands in for published data is three things: route independence, the constant pins, and the analytic limits this digest has already shown, which are known truths that need no citation and which DISCRIMINATE.');
w(`- The golden carries ${n0(Object.keys(GOLD).length)} sections and ${n0(Object.values(GOLD).reduce((a, v) => a + (Array.isArray(v) ? v.length : 1), 0))} rows (counted here by reading the file).`);
w('| analytic limit | what it fixes |');
w('| --- | --- |');
[['a thin cylindrical wall is a flat plate', 'the factor of two in the wall term, which no transcription check can fix because moving it in both files leaves the two files agreeing'],
 ['the log mean is strictly below the arithmetic mean at unequal ends', 'the substitution of one mean for the other, which was the worst paired plant the recon found'],
 ['the correction factor tends to one as P tends to zero', 'the whole shape of the correction curve at small cold rises'],
 ['the parallel ceiling and the 1-2 shell ceiling', 'the two closed forms at high NTU, where a wrong constant shows as a ceiling that is not reached'],
 ['every arrangement collapses onto one curve at a capacity ratio of zero', 'three separate branches against one another, at a limit where all three must agree'],
 ['counter-current flow has no ceiling', 'the claim that every arrangement has one, which is false and was in the help text'],
 ['self-consistency across the whole chain', 'a duty, a coefficient, a surface and a driving force that do not satisfy the equation they came from'],
].forEach(([a, b]) => w(`| ${a} | ${b} |`));
w();

// --------------------------------------------------------------- SECTION 21
w('# SECTION 21: HISTORY, and it is labelled as history in this title and in the line below it: what this engine was repaired for, and what each case teaches (owned by Expert m05 l01)');
w();
w('EVERYTHING IN THIS SECTION IS HISTORY AND IS LABELLED AS HISTORY. Nothing above this line is. If you teach any of it, say plainly that it is what the engine used to do, the way this section does. A sentence about former behaviour that reads as current behaviour is the defect; the subject itself is not.');
w();
w('This module was repaired after a recon raised findings against it, its published cases, its oracle and the studio that composes it. Four of them are worth teaching, because each one is a general lesson that happens to have an example here.');
w();
w('1. A RATING THAT ASSERTED TWO NUMBERS ITS OWN ANSWER COULD NOT PRODUCE. Before FC6-0 the hot-day block held the process outlet temperature FIXED and scale the duty by the ratio of two log means. Those two things cannot both be true: if the duty falls, the outlet rises. The general lesson is that a result carrying several numbers has to be self-consistent, and that the cheapest way to find out is to compute one of them from the others.');
w('- The shape of the old error, in numbers that are CURRENT. At the studio bay design point the process capacity rate is the duty over the process drop, and the air capacity rate is the duty over the air rise:');
{
  const cP = STUDIO_AIR.qBtuHr / (STUDIO_AIR.processInF - STUDIO_AIR.processOutF);
  const cA = STUDIO_AIR.qBtuHr / STUDIO_AIR.airRiseF;
  w(`- Process capacity rate ${r4(cP)} and air capacity rate ${r4(cA)} Btu an hour per degF (derived, each from the design duty and its own temperature change).`);
  w(`- So any duty on this bay implies an air rise of the duty over ${r4(cA)}, and a process outlet of the inlet minus the duty over ${r4(cP)}. A rating that reports a duty, an outlet and a rise has already said all three, whether it computed them together or not.`);
  w(`- The rated answer at the studio's own check ambient satisfies all three: duty ${r4(ST_AIR.hotDay.qBtuHr)}, outlet ${e6(ST_AIR.hotDay.processOutF)} degF, air rise ${e6(ST_AIR.hotDay.airRiseF)} degF.`);
}
w();
w('2. A COEFFICIENT COMPUTED AT A TUBE COUNT THE SAME SCREEN CONTRADICTED. Before FC6-0 the studio passed a hard-coded tube count into the film while printing a different count beside it. The general lesson is that a screen showing two numbers that disagree about the same thing is a screen where one of them was never computed, and that the fix is to close the loop rather than to choose a better constant.');
w('- The trail in Section 6 is what closing it looks like, and the table in Section 12 is what it costs: the film, the coefficient and the area at each count on the way.');
w();
w('3. A CAPITAL LETTER THAT WAS A FORTY PERCENT ERROR. Before FC6-0 the arrangement was matched against one lowercase string, so anything else became counter-current silently. The general lesson is that a defaulted input is worse than a refused one, because a default answers a question the caller did not ask and never says it did. Section 2 shows what the module does now with all three cases: the lowercase string, the capitalised one and an unknown one.');
w();
w('4. A GATE THAT COULD NOT CATCH ANY OF IT. The suite the module shipped with was green against every one of these. The general lesson is the one this whole programme runs on: a gate that restates the formula it is checking has not checked it, and the way to find out is to break the engine on purpose and see whether the gate notices. Section 19 is what a check that could have failed looks like.');
w();
w('- WHERE THE REST OF IT LIVES, AND HOW TO READ IT. The engine source records what changed in its own comments, because a good repair records what it changed. Those comments are PROVENANCE. A sentence lifted out of one arrives with no frame around it, and a writer cannot frame what they did not know was history. The count below is MEASURED by reading the vendored source with a stated rule rather than quoted from a report.');
{
  const src = fs.readFileSync(`${ROOT}/engines/facilities/heatTransfer.js`, 'utf8').split('\n');
  const RULE = /^\s*(\*|\/\/).*(used to|no longer|until FC6-0)/;
  const WIDE = /^\s*(\*|\/\/).*(used to|no longer|before the repair|formerly|had been|prior to|was the bug|instead of|was on screen)/i;
  w(`- Comment lines in packages/engines/engines/facilities/heatTransfer.js carrying "used to", "no longer" or this repair's own name: ${n0(src.filter((l) => RULE.test(l)).length)}. Widening the rule to nine keywords takes the same file to ${n0(src.filter((l) => WIDE.test(l)).length)}.`);
  w('- Both the file and the rule are stated because a count of this kind means nothing without them. A count across the whole vendored tree is DELIBERATELY NOT QUOTED, because it answers to work in other modules and would go stale at the next facilities wave without anything in this engine changing.');
}
w();
w('- RECON.md, FINDINGS.md and FINDINGS-heattransfer.md are provenance too, and their numbers are STALE BY CONSTRUCTION: the repair changed the app own defaults, so a figure from before it is a figure about a machine that no longer exists. Read them to understand the work. Never quote one.');
w();

auditRefusals();
console.log(out.join('\n'));
