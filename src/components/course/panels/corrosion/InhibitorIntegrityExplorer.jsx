import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  inhibitorArithmetic, wallShear, theCoupling, allowanceAndLife, bindingConstraint,
  studioDefaults, heldItems, AVAILABILITY_SWEEP,
} from './corrosionLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// The corrosion inhibitor and integrity explorer.
//
// THE ONE LESSON THIS MODULE EXISTS TO TEACH. A 95 percent corrosion inhibitor
// running 80 percent of the time is not a 95 percent solution. The uninhibited
// rate applies for the fraction of the time the programme is off, and it is that
// time average that eats the wall. The engine takes EFFICIENCY and AVAILABILITY
// as separate inputs and reports the effective protection, the shortfall in
// percentage points and the metal-loss ratio against the datasheet figure.
//
// THE WALL SHEAR DECIDES WHETHER THE CREDIT IS TAKEN AT ALL. Above the
// film-stripping threshold the engine removes the corrosion inhibitor credit and
// reports the credited rate beside the uncredited one, so the cost of that
// verdict is visible rather than implied. Both shear thresholds are HELD, both
// Blasius constants are HELD, and the branch switch is a real discontinuity that
// the engine reports rather than smooths.
//
// INTEGRITY HERE MEANS ONE ARITHMETIC: an allowance divided by a rate. This panel
// shows no inspection interval, no minimum thickness, no retirement thickness and
// no fitness-for-service verdict, and it lists all four as NOT PROVIDED rather
// than being silent about them. It shows no unbounded life off a zero rate and no
// passing verdict taken from one.
//
// This module's friction factor and this module's Reynolds number are labelled as
// this module's wherever they appear, because the Pipeline & Line Sizing course
// computes its own with a different correlation and a different transition, and
// the two will not agree on the same pipe.
//
// Every figure here is a return value of the vendored engine through
// corrosionLab. Nothing on this page computes a shear, a rate or a life, and
// nothing reads a clock.
//
// NO P LABEL. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['programme', 'Efficiency and availability as separate inputs, and what the programme delivers'],
  ['shear', "Wall shear, this module's friction factor, and the credit it takes away"],
  ['allowance', 'The allowance, the remaining life, and a zero rate that is not a pass'],
  ['binding', 'The binding constraint, and the four answers this module does not have'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24'];

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

const Absent = ({ children }) => (
  <div className="mt-3 rounded-md border border-slate-600 bg-slate-900/40 p-3">
    <p className="text-slate-300 text-xs font-medium mb-1">NOT PROVIDED</p>
    <p className="text-xs text-slate-400 mb-0">{children}</p>
  </div>
);

const Quote = ({ children }) => (
  <p className="mt-2 mb-0 border-l-2 border-slate-600 pl-3 text-xs text-slate-400 font-mono">{children}</p>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const ProgrammeMode = ({ i, availability }) => {
  if (!i) return <Note>The corrosion inhibitor reader did not return a sweep.</Note>;
  const row = i.rows.find((r) => r.availabilityPct === Number(availability)) || i.rows[0];
  const chart = i.rows.map((r) => ({
    avail: r.availabilityPct, effective: r.effectiveInhibitionPct, shortfall: r.inhibitorShortfallPp, loss: r.metalLossRatio,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Corrosion inhibitor efficiency, as typed" value={six(row.efficiencyPct)} unit="percent" />
        <Tile label="Availability, a separate input" value={six(row.availabilityPct)} unit="percent" />
        <Tile label="Effective protection the line actually sees" value={six(row.effectiveInhibitionPct)} unit="percent" />
        <Tile label="Shortfall against the datasheet figure" value={six(row.inhibitorShortfallPp)} unit="percentage points" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Read the third tile against the first. A corrosion inhibitor at {six(row.efficiencyPct)} percent efficiency
        running {six(row.availabilityPct)} percent of the time delivers {six(row.effectiveInhibitionPct)} percent
        effective protection, and the metal loss is {six(row.metalLossRatio)} times what the datasheet number would
        give. AVAILABILITY IS WHAT LIMITS IT. Efficiency does not.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="avail" tick={AXIS} label={{ value: 'availability, percent', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="effective" name="effective protection, percent" stroke={SERIES[0]} dot isAnimationActive={false} />
            <Line dataKey="shortfall" name="shortfall, percentage points" stroke={SERIES[1]} dot isAnimationActive={false} />
            <Line dataKey="loss" name="metal loss against the datasheet" stroke={SERIES[2]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['efficiency percent', 'availability percent', 'effective protection percent', 'shortfall pp', 'rate mm/yr', 'metal loss against the datasheet']}
        rows={i.rows.map((r) => [
          six(r.efficiencyPct), six(r.availabilityPct), six(r.effectiveInhibitionPct),
          six(r.inhibitorShortfallPp), six(r.rateMmYr), six(r.metalLossRatio),
        ])}
      />
      <Note>
        The warning fires on the EFFECTIVE SHORTFALL at any efficiency, with a trigger measured at
        {' '}{six(i.shortfallTriggerPp)} percentage points. At the shipped studio defaults the effective protection is
        {' '}{six(i.appEffectivePct)} percent and the shortfall is {six(i.appShortfallPp)} percentage points. The
        engine's own warning at eighty percent availability:
      </Note>
      <Quote>{i.eightyWarning}</Quote>
      <Tbl
        head={['clamped input', 'effective protection percent', 'the clamp the engine named']}
        rows={i.clamps.map((c) => [
          `efficiency ${six(c.efficiencyPct)}, availability ${six(c.availabilityPct)}`,
          six(c.effectiveInhibitionPct), c.clamps.join('; '),
        ])}
      />
      <Note>
        A typed 100 percent efficiency gives exactly the availability, {six(i.hundredEffectivePct)} percent, with no
        clamp and no hidden ceiling. The engine adds a note saying what that arithmetic is:
      </Note>
      <Quote>{i.hundredNote}</Quote>
      <Held>
        Nothing on this view is held, and that is the point of it. Every number here is arithmetic over two typed
        percentages, with no correlation constant anywhere in the chain, which is why the corrosion inhibitor
        arithmetic is the one part of this engine a capstone can grade without leaning on a number nobody can source.
      </Held>
    </>
  );
};

export const ShearMode = ({ s, c }) => {
  if (!s || !c) return <Note>The shear reader did not return its streams.</Note>;
  const chart = s.velocityRows.map((r) => ({ u: r.velocityMS, tau: r.tauPa }));
  return (
    <>
      <TileGrid>
        <Tile label="Film-stripping threshold, measured out of the engine" value={six(s.filmStripPa)} unit="Pa" />
        <Tile label="Stripping velocity on the fast teaching stream" value={six(s.strippingVelocityMS)} unit="m/s" />
        <Tile label="The shear there" value={six(s.strippingTauPa)} unit="Pa" />
        <Tile label="Shear jump across the branch switch" value={six(s.switchJump)} unit="times" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The wall shear is what decides whether a corrosion inhibitor film survives, so it is the number the rate depends
        on. It is built from THIS MODULE&apos;S friction factor, on a two-branch Blasius form switching at THIS
        MODULE&apos;S Reynolds number of {six(s.switchRe)}. The Pipeline &amp; Line Sizing course computes its own
        friction factor and its own Reynolds number with a different correlation and a different transition, and the two
        will not agree on the same pipe.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="u" tick={AXIS} label={{ value: 'velocity, m/s', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis tick={AXIS} label={{ value: 'wall shear, Pa', angle: -90, fill: '#94a3b8', fontSize: 11, position: 'insideLeft' }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={s.filmStripPa} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'the stripping threshold, HELD', fill: '#fbbf24', fontSize: 10 }} />
            <Line dataKey="tau" name="wall shear, Pa" stroke={SERIES[0]} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={["stream", "this module's Reynolds number", 'branch', "this module's friction factor", 'wall shear Pa', 'film risk']}
        rows={s.streamRows.map((r) => [r.name, four(r.reynolds), r.branch, six(r.fanningFriction), six(r.tauPa), r.filmRisk])}
      />
      <Tbl
        head={["this module's Reynolds number", 'branch', "this module's friction factor", 'wall shear Pa', 'nearSwitch']}
        rows={s.branchRows.map((r) => [four(r.reynolds), r.branch, six(r.fanningFriction), six(r.tauPa), String(r.nearSwitch)])}
      />
      <Note>
        THE BRANCH SWITCH IS A GENUINE DISCONTINUITY. At the switch the wall shear jumps by a factor of
        {' '}{six(s.switchJump)} across two ten-thousandths of this module&apos;s Reynolds number, which is a fraction
        of a percent of velocity. The engine does not smooth it, because smoothing it would be a third invented
        correlation. Inside ten percent of the switch it sets a flag and returns this note:
      </Note>
      <Quote>{s.nearSwitchNote}</Quote>
      <Tbl
        head={['stream', 'film stripped', 'rate mm/yr', 'rate with the corrosion inhibitor credit kept mm/yr', 'ratio', 'life yr', 'life with the credit kept yr']}
        rows={c.rows.map((r) => [
          r.name, String(r.filmStripped), six(r.rateMmYr), six(r.rateWithCreditMmYr), six(r.ratio),
          r.lifeYr === null ? 'WITHHELD' : six(r.lifeYr),
          r.lifeWithCreditYr === null ? 'WITHHELD' : six(r.lifeWithCreditYr),
        ])}
      />
      <Note>
        The ratio between the two rate columns is pure corrosion inhibitor arithmetic: it is exactly the reciprocal of
        the retained fraction the programme leaves, {six(c.reciprocalOfRetained)}, because the two rates share the whole
        correlation chain and it divides out. The engine&apos;s own warning when the credit goes:
      </Note>
      <Quote>{c.tunuWarning}</Quote>
      <Held>
        BOTH wall shear thresholds, the stripping threshold and the moderate band, and BOTH Blasius constants along with
        the laminar to turbulent switch. Four unsourced numbers decide a coloured word, a warning paragraph and now the
        rate itself. The film-risk word on these tables is a label over them and not a measurement.
      </Held>
      <Absent>
        There is no erosional-velocity criterion in this module. The wall shear here is computed for one purpose, which
        is whether a corrosion inhibitor film survives, and mechanical erosion from entrained solids or from liquid
        impingement is not modelled at all. The Casing &amp; Tubing Design course owns the erosional velocity criterion.
      </Absent>
    </>
  );
};

export const AllowanceMode = ({ a, d }) => {
  if (!a || !d) return <Note>The allowance reader did not return its streams.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Corrosion allowance" value={six(d.remainingMm + 0)} unit="mm remaining" />
        <Tile label="Remaining life at the studio defaults" value={six(d.remainingYears)} unit="yr" />
        <Tile label="Allowance the design life demands" value={six(d.requiredAllowanceMm)} unit="mm" />
        <Tile label="Shortfall" value={six(d.shortfallMm)} unit="mm" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        INTEGRITY HERE MEANS ONE ARITHMETIC: a remaining allowance divided by a rate. That is the whole scope of this
        door. The required allowance is the rate times the design life and it IGNORES what has already gone, so it is
        the allowance a new line would need; the shortfall compares it against what is LEFT. The two fields answer two
        different questions.
      </p>
      <Tbl
        head={['stream', 'rate mm/yr', 'remaining mm', 'remaining yr', 'allowance the design life demands mm', 'shortfall mm', 'meets the design life']}
        rows={a.rows.map((r) => (r.withheld
          ? [r.name, six(r.rateMmYr), 'WITHHELD', 'WITHHELD', 'WITHHELD', 'WITHHELD', 'WITHHELD']
          : [r.name, six(r.rateMmYr), six(r.remainingMm), six(r.remainingYears), six(r.requiredAllowanceMm), six(r.shortfallMm), String(r.meetsDesignLife)]))}
      />
      <Note>
        Worked at a stated rate of 0.250000 mm/yr on a 4 mm allowance with 1.2 mm gone and a 20 year design life: the
        required allowance is {six(a.workedRequiredAllowanceMm)} mm, the remaining allowance is
        {' '}{six(a.workedRemainingMm)} mm, the shortfall is {six(a.workedShortfallMm)} mm, and the allowance that
        actually reinstates the design life is {six(a.reinstatingAllowanceMm)} mm. The gap between the last two is
        exactly the consumed depth.
      </Note>
      <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
        <p className="text-red-300 text-xs font-medium mb-1">A ZERO RATE IS NOT A PASS</p>
        <p className="text-xs text-slate-300 mb-0">
          At a zero rate the remaining life comes back as {String(a.zeroRemainingYears)} and the verdict as
          {' '}{String(a.zeroMeetsDesignLife)}, with an `unbounded` flag of {String(a.zeroUnbounded)}. There is no
          infinite life on this page and no passing verdict taken from one, because an unbounded life is reachable from
          an oil-wet assumption, from a stream with no CO2 and from a perfect corrosion inhibitor, and the strongest
          reassurance on a screen should not arrive from the weakest input.
        </p>
      </div>
      <Quote>{a.zeroNote}</Quote>
      <Tbl
        head={['what was asked', "the engine's own message"]}
        rows={a.refusals.map((r) => [r.label, r.error])}
      />
      <Absent>
        An inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment. All
        four are absent from this engine and all four are what a reader of a corrosion and integrity studio will look
        for, so they are listed here rather than left to be discovered. Producing any of them means adopting a standard
        this module does not carry.
      </Absent>
    </>
  );
};

export const BindingMode = ({ b, h }) => {
  if (!b || !h) return <Note>The binding reader did not return its cases.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Different constraints across six streams" value={String(b.distinct.length)} />
        <Tile label="Held items the engine declares" value={String(h.heldCount)} />
        <Tile label="Items it declares NOT PROVIDED" value={String(h.notProvidedCount)} />
        <Tile label="Claims withdrawn rather than retuned" value={String(h.withdrawn.length)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A screen that returns seven independent numbers and reconciles none of them is a screen the reader has to
        summarise themselves, and they will summarise it by reading the largest number. The engine names WHICH of its
        own limits governs the answer, in descending order of what would change first, and every one of them is derived
        from what is already computed.
      </p>
      <Tbl
        head={['stream', 'binding constraint', 'the value it turns on']}
        rows={b.rows.map((r) => [r.name, r.what, r.valueLabel === null ? 'none, the model does not apply' : r.valueLabel])}
      />
      <Tbl
        head={['case', 'binding constraint', 'what the reader should do about it']}
        rows={b.cases.map((c) => [c.label, c.what, c.valueLabel === null ? 'read the withheld block, because no rate verdict is being offered' : c.valueLabel])}
      />
      <Note>
        A binding constraint is a summary and never a recommendation. It names the limit that governs the number, and it
        is silent about what to buy, when to inspect and what thickness to retire at, because the module has none of
        those.
      </Note>
      <Held>
        <span className="block mb-1">Every item the engine itself declares unsourced, in its own words:</span>
        <span className="block">{h.held.map((x, i) => `${i + 1}. ${x}`).join('  ')}</span>
      </Held>
      <Absent>
        {h.notProvided.join('. ')}.
      </Absent>
    </>
  );
};

const InhibitorIntegrityExplorer = ({ initialMode = 'programme' }) => {
  const [mode, setMode] = useState(initialMode);
  const [availability, setAvailability] = useState(String(AVAILABILITY_SWEEP[4]));

  const i = useMemo(() => (mode === 'programme' ? safe(inhibitorArithmetic) : null), [mode]);
  const s = useMemo(() => (mode === 'shear' ? safe(wallShear) : null), [mode]);
  const c = useMemo(() => (mode === 'shear' ? safe(theCoupling) : null), [mode]);
  const a = useMemo(() => (mode === 'allowance' ? safe(allowanceAndLife) : null), [mode]);
  const d = useMemo(() => (mode === 'allowance' ? safe(studioDefaults) : null), [mode]);
  const b = useMemo(() => (mode === 'binding' ? safe(bindingConstraint) : null), [mode]);
  const h = useMemo(() => (mode === 'binding' ? safe(heldItems) : null), [mode]);

  return (
    <PanelShell
      title="Corrosion inhibitor and integrity explorer"
      subtitle="What the corrosion inhibitor programme actually delivers, the wall shear that can take its credit away, and what the allowance actually buys. Integrity here means one arithmetic: an allowance divided by a rate."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        {mode === 'programme' && (
          <SelectField
            label="Availability, percent"
            value={availability}
            onChange={setAvailability}
            options={AVAILABILITY_SWEEP.map((a2) => [String(a2), `${a2} percent`])}
          />
        )}
      </FieldGrid>
      <div className="mt-3">
        {mode === 'programme' && <ProgrammeMode i={i} availability={availability} />}
        {mode === 'shear' && <ShearMode s={s} c={c} />}
        {mode === 'allowance' && <AllowanceMode a={a} d={d} />}
        {mode === 'binding' && <BindingMode b={b} h={h} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Corrosion & Integrity engine through the teaching
        lab, in the engine's own units: wall shear in pascals, allowances in millimetres, rates in millimetres a year
        and lives in years. The band label the engine can return is not shown here as a measurement, because the bands
        that produce it are unsourced.
      </Note>
    </PanelShell>
  );
};

export default InhibitorIntegrityExplorer;
