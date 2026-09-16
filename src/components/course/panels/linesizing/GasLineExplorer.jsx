import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  gasLineBasics, transmissionForms, elevationGroup, outletPressure, profileMarch, professionalReading,
} from './linesizingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Gas line explorer, the Professional tier. THE MOMENT THE FLUID COMPRESSES:
// the driving group stops being a difference of pressures and becomes a
// difference of their SQUARES, four published forms answer the same question
// and disagree by a third, and the outlet pressure has no closed form at all.
//
// THE CEILING IS THE CENTREPIECE. Every form is driven by p1 squared less es
// times p2 squared, so the outlet a rate approaches as it falls to nothing is
// the inlet over the square root of es, and NOT the inlet. On a descent that
// ceiling sits ABOVE the inlet and the outlet legitimately does too; on a climb
// it sits BELOW. Both signs are on the ceiling table and both are reachable.
//
// The tier's traverse is a LIQUID march: the tier is what this panel follows,
// not the fluid, and the traverse is where a refusal hands back its own
// evidence rather than a bare failure.
//
// Every figure on this page is a return value from linesizingLab, which is a
// return value from the vendored engines on the teaching trunk. Nothing here
// computes a rate, a pressure or an elevation factor, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const ten = (v) => (Number.isFinite(v) ? Number(v).toFixed(10) : 'none');

export const MODES = [
  ['forms', 'Four forms: one line, four published answers, and the spread between them'],
  ['elevation', 'The elevation group: the two different things a hill does'],
  ['ceiling', 'The outlet pressure: the bracket, the ceiling, and both signs of it'],
  ['profile', 'Marching a profile: the station list, and a refusal that keeps its evidence'],
  ['reading', 'The Professional reading: a trunk end to end'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
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

const Held = ({ note }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
    <p className="text-xs text-slate-300 mb-0">{note}</p>
  </div>
);

/** A refusal shown as a refusal: the engine's own message, never a retyped one. */
const Refusal = ({ label, message, children }) => (
  <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
    {children}
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const FormsMode = ({ g, t }) => {
  if (!g || !t) return <Note>The gas readers did not return the trunk.</Note>;
  const chart = t.forms.map((f) => ({ form: f.form, rate: f.qScfd }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Inlet" value={six(g.p1Psia)} unit="psia" />
          <Tile label="Outlet" value={six(g.p2Psia)} unit="psia" />
          <Tile label="Driving group (derived)" value={four(g.drivingGroupDerived)} unit="psia squared" />
          <Tile label="Base conditions" value={`${six(g.tbR)} degR`} unit={`and ${six(g.pbPsia)} psia`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The driving group is the difference of the SQUARES. A liquid line subtracts pressures; a gas line subtracts
        their squares, because the density the friction sees is itself proportional to the pressure. And the base a
        rate is quoted at is not atmospheric: {six(g.pbPsia)} psia and atmospheric are a quarter of a psi apart, so two
        forms quoted at different bases are not comparable even when they agree.
      </p>
      <Tbl
        head={['form', 'rate scfd', 'against Weymouth']}
        rows={t.forms.map((f) => [f.form, four(f.qScfd), six(f.againstWeymouthDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="form" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="rate" name="rate, scfd" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The spread from the lowest to the highest is {six(t.spreadDerived)}. Four published answers to one question,
        and choosing between them is engineering rather than arithmetic. General Flow also returns the friction factor
        it settled on, {ten(t.generalFDarcy)}, and it is the only one of the four that says anything about the pipe's
        roughness at all.
      </p>
      <Tbl
        head={['form', 'rate at 10 in', 'rate at 20 in', 'measured exponent']}
        rows={t.exponents.map((x) => [x.form, four(x.at10), four(x.at20), ten(x.exponentDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The exponent is measured by doubling the bore and reading the engine. It is the single most important number in
        a gas form, because it is what says how much a bigger pipe buys.
      </p>
      <Tbl
        head={['efficiency', 'weymouth', 'panhandleA', 'panhandleB', 'general']}
        rows={t.efficiencyRows.map((r) => [six(r.efficiency), ...r.rates.map((q) => four(q))])}
      />
      <Held note={t.held.note} />
      <Tbl
        head={['published case', 'engine scfd', 'golden scfd']}
        rows={t.published.map((c) => [
          `${c.input.equation}, ${six(c.input.idIn)} in over ${six(c.input.lengthMi)} mi, ${six(c.input.p1Psia)} to ${six(c.input.p2Psia)} psia`,
          four(c.qScfd), four(c.goldenScfd),
        ])}
      />
    </>
  );
};

export const ElevationMode = ({ e }) => {
  if (!e) return <Note>The elevation reader did not return the group.</Note>;
  const chart = e.byForm.map((r) => ({ form: r.form, up: r.upFractionDerived, down: r.downFractionDerived }));
  return (
    <>
      <Tbl
        head={['elevation change ft', 's', 'e to the s', 'equivalent length factor']}
        rows={e.rows.map((r) => [six(r.elevChangeFt), ten(r.s), ten(r.es), ten(r.leFactor)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A hill does two things and they are not the same thing. It scales the outlet pressure inside the driving group
        through e to the s, and it changes the length the friction acts over through the equivalent length factor. At
        zero elevation both collapse to one, and the Weymouth rate with the hill set to zero stands
        {' '}{four(e.flatAgainDifferenceDerived)} scfd from the flat rate, so the flat form is what the adjusted form
        becomes. The coefficient inside s, measured out of the engine rather than typed,
        is {Number(e.coefficientDerived).toFixed(12)}.
      </p>
      <Tbl
        head={['form', 'flat scfd', 'up scfd', 'down scfd', 'up as a fraction', 'down as a fraction']}
        rows={e.byForm.map((r) => [r.form, four(r.flat), four(r.up), four(r.down), six(r.upFractionDerived), six(r.downFractionDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="form" tick={AXIS} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'flat', fill: '#BFFF00', fontSize: 10 }} />
            <Bar dataKey="up" name="uphill, fraction of flat" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="down" name="downhill, fraction of flat" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Uphill is not the mirror of downhill. The two fractions on each row do not average to one, because the term is
        an exponential and an exponential is not symmetric about zero.
      </Note>
    </>
  );
};

export const CeilingMode = ({ o }) => {
  if (!o) return <Note>The outlet reader did not return the bracket.</Note>;
  const chart = o.ceilings.map((c) => ({
    elev: six(c.elevChangeFt), ceiling: c.ceilingPsiaDerived, against: c.againstInletDerived,
  }));
  return (
    <>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        The engine has no closed inversion. It bisects on the outlet pressure, calling the published form at each step,
        inside a bracket that runs from atmospheric up to the pressure at which the driving group vanishes. That upper
        end is the inlet over the square root of e to the s, and it is NOT the inlet: a hill moves it.
      </p>
      <Tbl
        head={['form', 'rate scfd', 'outlet recovered psia', 'against the stated outlet']}
        rows={o.roundTrips.map((r) => [r.form, four(r.qScfd), r.error ? r.error : six(r.p2Psia), r.error ? 'refused' : six(r.againstStatedDerived)])}
      />
      <Tbl
        head={['elevation change ft', 'e to the s', 'the outlet a vanishing rate approaches, psia', 'against the inlet, psi']}
        rows={o.ceilings.map((c) => [six(c.elevChangeFt), ten(c.es), six(c.ceilingPsiaDerived), six(c.againstInletDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="elev" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'the inlet', fill: '#BFFF00', fontSize: 10 }} />
            <Bar dataKey="against" name="ceiling less the inlet, psi" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A flat line ends its bracket at its own inlet. A DESCENT ends it above the inlet, because the column recovers
        more head than the friction spends. A CLIMB ends it below, because the column costs head that no rate gets
        back. Reading the last column is reading how much of the answer a bracket of atmospheric to the inlet would
        have been unable to express, and it is signed in both directions.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label={`Down ${six(o.steepDownFt)} ft, the outlet stands at`} value={six(o.steepOutletPsia)} unit={`psia, which is ${six(o.steepAboveInletPsi)} psia ABOVE the inlet of ${six(o.p1Psia)}`} />
          <Tile label="The inverse recovers" value={six(o.steepInverseShape.p2Psia)} unit="psia" />
          <Tile label="And reports a drop of" value={six(o.steepInverseShape.dpPsi)} unit="psi, negative" />
          <Tile label="Forward against inverse" value={six(o.steepInverseErrorDerived)} unit="psi" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        On a descent the drop comes back NEGATIVE, and that is the answer rather than an error state: the line arrives
        higher than it left. THE CONTROL runs the same descent with an outlet genuinely BELOW the inlet,
        {' '}{six(o.controlP2Psia)} psia: the inverse recovers {six(o.controlRecoveredPsia)} psia for an error of
        {' '}{six(o.controlErrorDerived)} psi. Both answers come out of the same bisection, so a round trip that
        succeeds can be told apart from a solver that merely stopped at its own bracket.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label={`Up ${six(o.steepUpFt)} ft, asked for ${four(o.steepUpScfd)} scfd`} value={six(o.upP2Psia)} unit="psia" />
          <Tile label="A drop of" value={six(o.upDpPsi)} unit="psi, positive" />
          <Tile label="The ceiling on that climb" value={six(o.upCeilingPsiaDerived)} unit="psia, below the inlet" />
          <Tile label="Asked for a rate it cannot carry" value="refused" unit="rather than approximated" />
        </TileGrid>
      </div>
      <Refusal label={`A climb under a near-atmospheric inlet of ${six(o.starvedP1Psia)} psia`} message={o.starvedError} />
      <Refusal label="A rate the line cannot carry at all" message={o.unreachableError} />
      <Note>
        The climb is the commoner case and the one a bracket of atmospheric to the inlet got wrong by the widest
        margin. Both refusals above are the engine's own message, shown rather than swallowed into a generic failure.
      </Note>
    </>
  );
};

export const ProfileMode = ({ p }) => {
  if (!p) return <Note>The traverse reader did not return the stations.</Note>;
  const chart = p.stations.map((s) => ({
    distance: six(s.distanceFt), flat: s.flatPPsia, ridge: s.ridgePPsia,
  }));
  const d = p.dead;
  return (
    <>
      <Tbl
        head={['station', 'distance ft', 'flat elevation ft', 'flat pressure psia', 'ridge elevation ft', 'ridge pressure psia']}
        rows={p.stations.map((s) => [String(s.index), six(s.distanceFt), six(s.flatElevFt), six(s.flatPPsia), six(s.ridgeElevFt), six(s.ridgePPsia)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="distance" tick={AXIS} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="flat" name="flat, psia" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line dataKey="ridge" name="over the ridge, psia" stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both arrive at {six(p.arrivalPsia)} psia having spent {six(p.spentPsi)} psi, because the ridge climbs
        {' '}{six(p.riseFt)} ft and gives all of it back. The ARRIVAL is the same and the middle of the line is not: at
        the crest the ridge stands at {six(p.crestRidgePsia)} psia against {six(p.crestFlatPsia)} psia, a difference of
        {' '}{six(p.crestDifferenceDerived)} psi. A line is sized on its worst station and not on its last one.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Marched" value={six(p.spentPsi)} unit="psi" />
          <Tile label="One shot over the same length" value={six(p.oneShotPsi)} unit="psi" />
          <Tile label="Difference" value={six(p.marchAgainstOneShotDerived)} unit="psi" />
          <Tile label="What the traverse drops" value={six(p.fittingsGapDerived)} unit="psi, exactly the fittings" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A liquid is incompressible, so marching it buys the station list and nothing else. The gap against the
        one-shot call carrying {six(p.sumK)} velocity heads is exactly the fittings, because the traverse has no
        resistance-sum argument at all.
      </p>
      <Refusal label="Where a line dies, the traverse refuses" message={d.error}>
        <div className="mt-3">
          <TileGrid>
            <Tile label="Stations it stands behind" value={String(d.stationCount)} unit={`last at ${six(d.lastDistanceFt)} ft`} />
            <Tile label="Last pressure it stands behind" value={six(d.lastPPsia)} unit="psia" />
            <Tile label="The distance it died at" value={six(d.diedAtFt)} unit="ft" />
            <Tile label="The pressure the arithmetic produced" value={six(d.diedAtPsia)} unit="psia, which is not a pressure" />
          </TileGrid>
        </div>
        <p className="text-xs text-slate-400 mt-3 mb-0">
          It refuses WITH the evidence attached rather than instead of it, so a die-out is diagnosable: the duty was
          {' '}{six(d.input.qBpd)} bpd of {six(d.input.rhoLbFt3)} lb/ft3 at {six(d.input.muCp)} cp through
          {' '}{six(d.input.idIn)} in over {six(d.input.lengthFt)} ft, entering at {six(d.input.p1Psia)} psia. The
          single call underneath still answers, because a DROP is not a PRESSURE and nothing about it is unphysical:
          the same line spends {six(d.singleCallPsi)} psi. A rate that costs more than the inlet holds is a rate the
          line cannot pass, and the traverse is the call that knows the inlet.
        </p>
      </Refusal>
    </>
  );
};

export const TrunkReadingMode = ({ r }) => {
  if (!r) return <Note>The Professional reading did not return the trunk.</Note>;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Weymouth" value={four(r.weymouthScfd)} unit="scfd" />
          <Tile label="Panhandle A" value={four(r.panhandleAScfd)} unit="scfd" />
          <Tile label="Panhandle B" value={four(r.panhandleBScfd)} unit="scfd" />
          <Tile label="General Flow" value={four(r.generalScfd)} unit={`scfd, at f ${ten(r.generalFDarcy)}`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        End to end: {six(r.idIn)} in over {six(r.lengthMi)} miles from {six(r.p1Psia)} to {six(r.p2Psia)} psia gives a
        driving group of {four(r.drivingGroupDerived)} psia squared. Put the trunk up {six(r.upFt)} ft and the Weymouth
        rate falls to {four(r.upScfd)}; down the same and it rises to {four(r.downScfd)}. Asked for
        {' '}{four(r.targetScfd)} scfd the line delivers at {six(r.targetP2Psia)} psia.
      </p>
      <Note>
        Four forms and one line. The spread across the four forms is {six(r.formSpreadDerived)}, one step of bore
        from {six(r.boreLoIn)} in to {six(r.boreHiIn)} in is {six(r.boreSpreadDerived)}, and the second over the first
        is {six(r.boreOverFormDerived)}. On this trunk one step of bore moves the answer further than the choice of
        form does, and a designer has to defend both.
      </Note>
    </>
  );
};

const GasLineExplorer = ({ initialMode = 'forms' }) => {
  const [mode, setMode] = useState(initialMode);
  const g = useMemo(() => (mode === 'forms' ? safe(gasLineBasics) : null), [mode]);
  const t = useMemo(() => (mode === 'forms' ? safe(transmissionForms) : null), [mode]);
  const e = useMemo(() => (mode === 'elevation' ? safe(elevationGroup) : null), [mode]);
  const o = useMemo(() => (mode === 'ceiling' ? safe(outletPressure) : null), [mode]);
  const p = useMemo(() => (mode === 'profile' ? safe(profileMarch) : null), [mode]);
  const r = useMemo(() => (mode === 'reading' ? safe(professionalReading) : null), [mode]);

  return (
    <PanelShell
      title="Gas line explorer"
      subtitle="The gas trunk in field units: four published forms on one line, the elevation group, the bracket the outlet solve ends at and both signs of it, and a marched profile that refuses with its own evidence."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'forms' && <FormsMode g={g} t={t} />}
        {mode === 'elevation' && <ElevationMode e={e} />}
        {mode === 'ceiling' && <CeilingMode o={o} />}
        {mode === 'profile' && <ProfileMode p={p} />}
        {mode === 'reading' && <TrunkReadingMode r={r} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored line-hydraulics engine on the teaching trunk.
        Gas work is in scfd and MILES, because that is the unit the published transmission forms are stated in; the
        traverse is in feet, because it is a liquid march and the Professional tier owns it.
      </Note>
    </PanelShell>
  );
};

export default GasLineExplorer;
