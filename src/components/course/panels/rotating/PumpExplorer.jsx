import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  engineScope, twoCurves, dutyPointSolved, powerHeadPressure, whereTheDutyLanded,
} from './rotatingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Pump explorer, the Associate tier. A MACHINE HAS NO OPERATING POINT UNTIL IT
// IS CONNECTED TO SOMETHING: the catalogue points become a fitted curve, the
// station becomes a system curve, and the duty is SOLVED as the one flow where
// they cross. Everything after that, the power, the pressure, the region,
// hangs off that solved number and moves when the station does.
//
// THE SOLVE REPORTS ITSELF, and this panel shows the report. The bracket, the
// residual, the halvings and the convergence flag are all on the page, beside
// the case that makes the flag come out false, because a flag made only of the
// bracket width could never be false and would validate nothing.
//
// Every figure on this page is a return value from rotatingLab, which is a
// return value from the vendored Pump Station Designer engine on the teaching
// pump OKONO P-1201. Nothing here computes a head, a flow, a power or a
// pressure, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));

export const MODES = [
  ['curves', 'Two curves: the catalogue fit, its conditioning, and a crossing you can see before it is solved'],
  ['duty', 'The duty point: the crossing, the report the solve leaves behind, and the flag that can be false'],
  ['power', 'Power, head and pressure: the chain, and the two packagings measured out of the engine'],
  ['regions', 'Where the duty landed: the four bands and both sides of every boundary'],
  ['refusals', 'What the engine refuses: a returned object carrying its own message'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={h} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Held = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

/** A refusal shown as a refusal. The message is the engine's, through the lab. */
const Refusal = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const CurvesMode = ({ c }) => {
  if (!c) return <Note>The curve reader did not return the fit.</Note>;
  const chart = c.crossing.map((r) => ({
    flow: r.qGpm, pump: r.pumpHeadFt, system: r.systemHeadFt, difference: r.differenceDerivedFt,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Shutoff head, fitted" value={six(c.shutoffHeadFt)} unit="ft" />
        <Tile label="R squared" value={c.rSquared === null ? 'null' : nine(c.rSquared)} />
        <Tile label="Condition number" value={six(c.conditionNumber)} />
        <Tile label="Droops" value={String(c.droops)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        R squared says how well the fitted curve describes the four catalogue points. The condition number says whether
        the linear system behind the fit was solvable at all. Those are two different questions, and the engine reports
        both. Across the {c.conditionCount} point sets this course fits, the reported figure runs from
        {' '}{six(c.conditionMin)} to {six(c.conditionMax)}, which is what normal equations cost: the conditioning of the
        design matrix is squared, and double precision has about sixteen decimal digits to pay it with.
      </p>
      <Tbl
        head={['point set', 'condition number', 'R squared', 'droops']}
        rows={c.conditionSets.map((r) => [r.label, six(r.conditionNumber), r.rSquared === null ? 'null' : nine(r.rSquared), String(r.droops)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Three identical heads have no variance to explain, so the total sum of squares is zero and R squared is
        undefined. The engine returns null there. A horizontal line explains nothing, and null is what that looks like
        in a return.
      </p>
      <Tbl
        head={['flow gpm', 'catalogue head ft', 'fitted head ft', 'residual ft']}
        rows={c.readback.map((r) => [six(r.qGpm), six(r.catalogueHeadFt), six(r.fittedHeadFt), six(r.residualDerivedFt)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A quadratic through four points misses all four. The catalogue reads {six(c.catalogueShutoffFt)} ft at zero flow
        and the fit puts the shutoff at {six(c.shutoffHeadFt)} ft, a difference of {six(c.shutoffMissDerivedFt)} ft.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="flow" tick={AXIS} label={{ value: 'flow, gpm', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#475569" />
            <Line dataKey="pump" name="pump head, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="system" name="system head, ft" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line dataKey="difference" name="pump less system, ft" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The system curve is stated as a friction head at a flow rather than as a coefficient, and the engine returns the
        coefficient that implies: k = {nine(c.system.kFt)} ft per gpm squared, over a static head of
        {' '}{six(c.system.staticReadBackFt)} ft. The pink line starts positive and ends negative. The flow where it is
        zero is the duty point.
      </p>
      <Tbl
        head={['flow gpm', 'pump head ft', 'system head ft', 'pump less system ft']}
        rows={c.crossing.map((r) => [six(r.qGpm), six(r.pumpHeadFt), six(r.systemHeadFt), six(r.differenceDerivedFt)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A point set that RISES with flow is not a centrifugal head curve. Its fitted c2 is {six(c.rising.c2)}, positive
        where a drooping curve is negative, and the engine says so twice: once in prose and once in a field. The
        machine-readable half is `droops`, and it comes back {String(c.rising.droops)}. The duty solve reads that field.
      </p>
      <Refusal label="The engine's warning on a rising point set" message={c.rising.warning} />
    </>
  );
};

export const DutyMode = ({ d }) => {
  if (!d) return <Note>The duty reader did not return the solve.</Note>;
  const chart = d.staticSweep.filter((r) => !r.refused).map((r) => ({
    staticHead: r.staticHeadFt, flow: r.qGpm, head: r.headFt,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Duty flow" value={six(d.qGpm)} unit="gpm" />
        <Tile label="Duty head" value={six(d.headFt)} unit="ft" />
        <Tile label="Halvings taken" value={raw(d.iterations)} unit="of a cap of 200" />
        <Tile label="Converged" value={String(d.converged)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        At the returned flow the pump makes {six(d.pumpHeadAtDutyFt)} ft and the system demands
        {' '}{six(d.systemHeadFt)} ft. The difference is {raw(d.solvedDifferenceDerivedFt)} ft, which is what solved
        means here. The bracket the search stopped on is {raw(d.bracketGpm)} gpm and the head difference at the flow it
        returned is {raw(d.residualFt)} ft.
      </p>
      <div className="mt-3 rounded-md border border-slate-700 bg-[#0F172A] p-3">
        <p className="text-white text-xs font-medium mb-2">The flag is made of the residual as well as the bracket</p>
        <p className="text-xs text-slate-400 mb-2">
          On a bracketed sign change, bisection always collapses. A flag made only of the bracket width could never come
          back false, so it would be a check that validates nothing. Here is the case the residual half catches: a curve
          that returns a non-finite head over part of its range sends the comparison false at every step there and
          marches the search quietly to the bottom of that stretch.
        </p>
        <Tbl
          head={['', 'flow gpm', 'bracket gpm', 'halvings', 'residual ft', 'converged']}
          rows={[
            ['the healthy solve', six(d.qGpm), raw(d.bracketGpm), raw(d.iterations), raw(d.residualFt), String(d.converged)],
            ['a curve that goes non-finite', six(d.poisoned.qGpm), raw(d.poisoned.bracketGpm), raw(d.poisoned.iterations), raw(d.poisoned.residualFt), String(d.poisoned.converged)],
          ]}
        />
        <p className="text-xs text-slate-400 mt-2 mb-0">
          The second row is {six(d.poisoned.awayFromTrueDerivedGpm)} gpm away from where those curves really cross, and
          its bracket is at the resolution of the numbers themselves. A bracket-only flag would have called it
          converged. Ask that question of every flag you meet: what input makes it false?
        </p>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The solve stops when the midpoint stops moving rather than after a fixed count. A blind 200 halvings gives
        {' '}{six(d.blindGpm)} gpm on the same pair of curves, a difference of {raw(d.blindDifferenceDerivedGpm)} gpm, so
        adding the report moved nothing: the loop breaks where the blind one was already standing still.
      </p>
      <Tbl
        head={['static head ft', 'duty flow gpm', 'duty head ft']}
        rows={d.staticSweep.map((r) => [six(r.staticHeadFt), r.refused ? 'refused' : six(r.qGpm), r.refused ? 'refused' : six(r.headFt)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="staticHead" tick={AXIS} label={{ value: 'static head, ft', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="flow" name="duty flow, gpm" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="head" name="duty head, ft" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Moving the station moves the duty, which is the whole reason it is solved rather than typed. On the
        friction-dominated station the same pump lands at {six(d.friction.qGpm)} gpm and {six(d.friction.headFt)} ft, of
        which {six(d.friction.staticHeadFt)} ft is static and {six(d.friction.frictionShareDerivedFt)} ft is friction.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-1">Three refusals that are real answers:</p>
      <Refusal label="A curve that rises with flow" message={d.risingRefusal} />
      <Refusal label="A station the pump cannot start" message={d.tooHigh.error} />
      <p className="text-xs text-slate-400 mt-1 mb-0">
        That one hands back its evidence: a shutoff head of {six(d.tooHigh.shutoffHeadFt)} ft against a system static
        head of {six(d.tooHigh.systemStaticHeadFt)} ft, a gap of {six(d.tooHigh.gapDerivedFt)} ft.
      </p>
      <Refusal label="A search limit set below the crossing" message={d.searchLimitRefusal} />
      <p className="text-xs text-slate-400 mt-1 mb-0">
        The last one is a question about the search rather than about the machine, and the message says which.
      </p>
    </>
  );
};

export const PowerMode = ({ p }) => {
  if (!p) return <Note>The power reader did not return the chain.</Note>;
  const chart = p.gravities.map((r) => ({ gravity: r.sg, psi: r.dischargePsi }));
  return (
    <>
      <TileGrid>
        <Tile label="Hydraulic power" value={six(p.hydraulicHp)} unit="hp" />
        <Tile label="Brake power" value={six(p.brakeHp)} unit="hp" />
        <Tile label="Motor input" value={six(p.motorInputHp)} unit="hp" />
        <Tile label="Motor input" value={six(p.motorInputKw)} unit="kW" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        All four are asked AT the solved duty of {six(p.qGpm)} gpm and {six(p.headFt)} ft, so all four move when the
        station does. The pump loses {six(p.pumpLossDerivedHp)} hp and the motor a further
        {' '}{six(p.motorLossDerivedHp)} hp.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Head belongs to the machine and pressure belongs to the fluid in it. The same {six(p.headFt)} ft makes
        {' '}{six(p.dischargePsi)} psi on this brine, and converting back gives {six(p.roundTripFt)} ft.
      </p>
      <Tbl
        head={['gravity', 'head ft', 'discharge psi']}
        rows={p.gravities.map((r) => [six(r.sg), six(r.headFt), six(r.dischargePsi)])}
      />
      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="gravity" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="psi" name="discharge, psi" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The engine exports no constants, so each packaging below is MEASURED by asking the engine a question about
        itself rather than typed here.
      </p>
      <Tbl
        head={['packaging', 'measured value', 'how it was measured']}
        rows={[
          ['feet of head per psi at gravity 1', nine(p.measured.ftPerPsi), 'the head a single psi makes'],
          ['the horsepower packaging', six(p.measured.horsepowerPackaging), 'one over the hydraulic power at unit flow, head, gravity and efficiency'],
          ['kilowatts per horsepower', six(p.measured.kwPerHp), 'the motor input in kW over the motor input in hp at an efficiency of one'],
          ['the DEFAULT motor efficiency', six(p.measured.defaultMotorEfficiency), 'the brake power over the motor input with the argument omitted'],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both packagings carry a water density inside them, and the two can be compared. The pressure packaging implies
        {' '}{six(p.densityFromPressurePackagingDerived)} lb per ft3 and the power packaging
        {' '}{six(p.densityFromPowerPackagingDerived)} lb per ft3, a difference of
        {' '}{raw(p.densityDifferenceDerived)} lb per ft3. Two field packagings that look unrelated turn out to be one
        constant, and their quotient is {six(p.packagingQuotientDerived)}.
      </p>
      <Held>
        What that implied density is away from real water. The packagings are the engine's own definitions and are
        measurable here; the handbook figure they approximate is not in this repository, so it is taught as a limit and
        never as an answer.
      </Held>
    </>
  );
};

export const RegionsMode = ({ r }) => {
  if (!r) return <Note>The region reader did not return the bands.</Note>;
  const chart = r.bands.map((b) => ({ percent: b.percentOfBep, flow: b.qGpm }));
  return (
    <>
      <TileGrid>
        <Tile label="Duty flow" value={six(r.qGpm)} unit="gpm" />
        <Tile label="Best efficiency flow, stated" value={six(r.qBepGpm)} unit="gpm" />
        <Tile label="Percent of best efficiency flow" value={six(r.percentOfBep)} unit="percent" />
        <Tile label="Region" value={r.region} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{r.note}</p>
      <Tbl
        head={['flow gpm', 'percent of BEP', 'region', 'preferred', 'note present']}
        rows={r.bands.map((b) => [six(b.qGpm), six(b.percentOfBep), b.region, String(b.preferred), String(b.notePresent)])}
      />
      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="flow" tick={AXIS} label={{ value: 'flow, gpm', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={100} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'best efficiency flow', fill: '#BFFF00', fontSize: 10 }} />
            <ReferenceDot x={r.qGpm} y={r.percentOfBep} r={4} fill="#f472b6" stroke="none" />
            <Line dataKey="percent" name="percent of best efficiency flow" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both sides of every boundary are on the table above, because a band that misclassifies its own edge is a defect
        rather than a rounding question. What each region costs is the part of this return worth reading:
      </p>
      <Tbl
        head={['percent of BEP', 'region', 'what it costs']}
        rows={r.notes.map((x) => [six(x.percentOfBep), x.region, x.note])}
      />
      <Held>
        The bands themselves, at 50, 70, 120 and 140 percent of best efficiency flow. They are customary and this
        repository holds no publication for them, so they are taught as limits and never as answers, and no graded value
        in this course is a region, a percentage of best efficiency flow or a preferred flag.
      </Held>
      <Note>
        Read the note above 120 percent carefully. The required NPSH climbs steeply with flow there, and this module
        carries the required NPSH as a single number rather than as a curve against flow. The vendor curve has to be
        read at THIS flow before the suction margin means anything, and the engine says so in its own words.
      </Note>
    </>
  );
};

export const RefusalsMode = ({ s }) => {
  if (!s) return <Note>The scope reader did not return the refusals.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Pump module exports" value={raw(s.pumpExports)} />
        <Tile label="Compression module exports" value={raw(s.compressionExports)} />
        <Tile label="Pump states with no answer" value={raw(s.pumpSoftStates.length)} />
        <Tile label="Compression states with no answer" value={raw(s.compressionSoftStates.length)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Every refusal in both modules is a RETURNED OBJECT carrying an error string. Neither module throws, so a caller
        checks a property rather than catching. {s.bareNumberNames.length} exports hand back a bare number and have
        nowhere to put an error key at all: {s.bareNumberNames.join(', ')}. Those five hold a documented contract
        instead, and the Expert panel shows each of them keeping it.
      </p>
      <Tbl
        head={['the state the pump module has no answer for', 'the message it returns']}
        rows={s.pumpSoftStates.map((x) => [x.label, x.error])}
      />
      <Tbl
        head={['the state the compression module has no answer for', 'the message it returns']}
        rows={s.compressionSoftStates.map((x) => [x.label, x.error])}
      />
      <Note>
        These two modules size MACHINES. What the piping costs in pressure is a line-sizing question and lives
        elsewhere. There is no surge line, no recycle valve, no seal or bearing calculation, no machine curve and no
        wheel selection anywhere in this package. A vendor performance run on a specific frame answers those questions,
        and this course does not.
      </Note>
    </>
  );
};

const PumpExplorer = ({ initialMode = 'curves' }) => {
  const [mode, setMode] = useState(initialMode);
  const c = useMemo(() => (mode === 'curves' ? safe(twoCurves) : null), [mode]);
  const d = useMemo(() => (mode === 'duty' ? safe(dutyPointSolved) : null), [mode]);
  const p = useMemo(() => (mode === 'power' ? safe(powerHeadPressure) : null), [mode]);
  const r = useMemo(() => (mode === 'regions' ? safe(whereTheDutyLanded) : null), [mode]);
  const s = useMemo(() => (mode === 'refusals' ? safe(engineScope) : null), [mode]);

  return (
    <PanelShell
      title="Pump explorer"
      subtitle="OKONO P-1201 in field units: the catalogue fit and the station it works into, the duty solved as their crossing with the report the solve leaves behind, the power chain, and the four regions either side of best efficiency flow."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'curves' && <CurvesMode c={c} />}
        {mode === 'duty' && <DutyMode d={d} />}
        {mode === 'power' && <PowerMode p={p} />}
        {mode === 'regions' && <RegionsMode r={r} />}
        {mode === 'refusals' && <RefusalsMode s={s} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Pump Station Designer engine on the teaching pump,
        printed to the precision the lessons use. Flows are in gpm, heads in feet, pressures in psi and power
        in horsepower and kilowatts.
      </Note>
    </PanelShell>
  );
};

export default PumpExplorer;
