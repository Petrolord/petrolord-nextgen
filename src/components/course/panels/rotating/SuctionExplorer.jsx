import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  suctionSide, marginAndRule, speedAndTrim, crossingAndMap, twoPumpsAndWater,
} from './rotatingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Suction and changes explorer, the Professional tier. A DUTY POINT THAT WORKS
// ON PAPER FAILS IN THREE WAYS, and this panel is all three. It fails on
// suction, where the available head is assembled from the real suction side and
// the margin over required is a separate question from adequacy. It fails on
// change, where a speed change follows the affinity laws exactly and a trim
// does not, and where applying either law to a duty POINT does not give a new
// duty point because the system curve did not move. And it fails on the fluid,
// because a catalogue curve is a water curve.
//
// Every figure on this page is a return value from rotatingLab, which is a
// return value from the vendored Pump Station Designer engine on the teaching
// pump OKONO P-1201. Nothing here computes an available head, a margin, an
// affinity factor or a correction, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no percentile
// label appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');
const raw = (v) => (v === null || v === undefined ? 'none' : String(v));

export const MODES = [
  ['npsh', 'NPSH available: the pressure head, the static column, the friction, and a liquid already flashing'],
  ['margin', 'The margin: the rule measured out of the engine, its three severities, and a verdict with no input'],
  ['changes', 'A speed change and a trim: the exact law printed as a subtraction, beside one that is not exact'],
  ['crossing', 'The crossing and the map: a re-solved duty beside a scaled old one'],
  ['machines', 'Two machines: parallel at equal head, series at equal flow'],
  ['viscosity', 'A catalogue curve is a water curve: the Hydraulic Institute correction'],
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

/** A warning or a refusal shown as one. The wording is the engine's. */
const EngineSays = ({ label, message, tone = 'amber' }) => (
  <div className={`mt-2 rounded-md border p-2 ${tone === 'red' ? 'border-red-800/60 bg-red-950/20' : 'border-sky-800/60 bg-sky-950/20'}`}>
    <p className={`text-xs font-medium mb-1 ${tone === 'red' ? 'text-red-300' : 'text-sky-300'}`}>{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

const shapeText = (sh) => {
  if (!sh) return 'none';
  if (sh.scalar) return String(sh.value);
  return `{ ${sh.entries.map(([k, kind, v]) => {
    if (kind === 'function') return `${k}: <function>`;
    if (kind === 'string') return `${k}: "${v}"`;
    if (kind === 'array') return `${k}: [${v.join(' | ')}]`;
    if (kind === 'null') return `${k}: null`;
    if (kind === 'undefined') return `${k}: undefined`;
    if (kind === 'object') return `${k}: {object}`;
    return `${k}: ${String(v)}`;
  }).join(', ')} }`;
};

// ---------------------------------------------------------------------------

export const NpshMode = ({ s }) => {
  if (!s) return <Note>The suction reader did not return the survey.</Note>;
  const chart = s.padding.map((r) => ({
    suction: r.suctionPressurePsia, pressureHead: r.pressureHeadFt, npsha: r.npshaFt,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Pressure head over vapour pressure" value={six(s.pressureHeadFt)} unit="ft" />
        <Tile label="Static column" value={six(s.suction.staticSuctionLiftFt)} unit="ft" />
        <Tile label="Suction friction" value={six(s.suction.suctionFrictionFt)} unit="ft" />
        <Tile label="NPSH available" value={six(s.npshaFt)} unit="ft" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The available head is assembled from the real suction side rather than typed into a box, which is what makes
        every row below movable. The three parts sum on the row: {six(s.pressureHeadFt)} plus
        {' '}{six(s.suction.staticSuctionLiftFt)} less {six(s.suction.suctionFrictionFt)} gives
        {' '}{six(s.threePartSumDerivedFt)} ft, which is the engine's own answer.
      </p>
      <Tbl
        head={['suction psia', 'pressure head ft', 'NPSH available ft']}
        rows={s.padding.map((r) => [six(r.suctionPressurePsia), six(r.pressureHeadFt), six(r.npshaFt)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="suction" tick={AXIS} label={{ value: 'suction pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="pressureHead" name="pressure head, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="npsha" name="NPSH available, ft" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        Two suctions worth reading against each other. One sits exactly AT the vapour pressure, at
        {' '}{six(s.atVapour.suctionPressurePsia)} psia against {six(s.atVapour.vapourPressurePsia)} psia, giving a
        pressure head of {six(s.atVapour.pressureHeadFt)} ft and an available head of {six(s.atVapour.npshaFt)} ft. The
        other sits BELOW it, at {six(s.belowVapour.suctionPressurePsia)} psia against
        {' '}{six(s.belowVapour.vapourPressurePsia)} psia, where the pressure head is
        {' '}{six(s.belowVapour.pressureHeadFt)} ft and the static column still leaves
        {' '}{six(s.belowVapour.npshaFt)} ft available.
      </p>
      <EngineSays label="At the vapour pressure" message={s.atVapour.warning} />
      <EngineSays label="Below the vapour pressure" message={s.belowVapour.warning} />
      <Note>
        The second of those is the one worth reading twice. A caller reading only the number sees an ordinary positive
        answer. The warning is the only thing on that return that says the liquid is already flashing, and an available
        figure on its own decides nothing at all until it is judged against what the machine requires.
      </Note>
    </>
  );
};

export const MarginMode = ({ m }) => {
  if (!m) return <Note>The margin reader did not return the rule.</Note>;
  const chart = m.sweep.map((r) => ({
    suction: r.suctionPressurePsia, margin: r.marginFt, required: r.requiredMarginFt,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Required NPSH, stated by the vendor" value={six(m.npshrFt)} unit="ft" />
        <Tile label="The floor, measured" value={nine(m.floorFt)} unit="ft" />
        <Tile label="The fraction, measured" value={nine(m.fraction)} />
        <Tile label="Where they change places" value={nine(m.crossoverFt)} unit="ft" />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Both halves of the rule are MEASURED out of the engine, and so is the required NPSH where they swap: the floor
        is read at a required NPSH too small for the percentage to reach it, the fraction at one too large for the floor
        to reach it, and the crossing is found by halving until the engine's own answer leaves the floor. The quotient
        of the first two gives {nine(m.crossoverByQuotientDerivedFt)} ft by a different route.
      </p>
      <Tbl
        head={['suction psia', 'NPSH available ft', 'margin ft', 'required margin ft', 'ratio', 'pass', 'severity']}
        rows={m.sweep.map((r) => [six(r.suctionPressurePsia), six(r.npshaFt), six(r.marginFt), six(r.requiredMarginFt), six(r.ratio), String(r.pass), r.severity])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="suction" tick={AXIS} label={{ value: 'suction pressure, psia', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#475569" />
            <Line dataKey="margin" name="margin, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="required" name="required margin, ft" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['required NPSH ft', 'required margin the engine applies ft', 'the half that bound', 'the available head that exactly satisfies it ft', 'the ratio there']}
        rows={m.rule.map((r) => [six(r.npshrFt), six(r.requiredMarginFt), r.boundHalf, six(r.exactlySatisfiedFt), nine(r.ratioThere)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A margin rule and a ratio rule are two different rules, and the last column is where that shows. On every row
        the fraction governs, the boundary ratio is the same number, so a reader could mistake one rule for the other
        and never notice. On the row the floor governs it is different: {nine(m.governedRatioAtFour)} against
        {' '}{nine(m.governedRatioAtVendorNpshr)}, a difference of {raw(m.governedRatioDifferenceDerived)}.
      </p>
      <Tbl
        head={['case', 'margin ft', 'required margin ft', 'severity', 'pass', 'what the engine says']}
        rows={m.severities.map((r) => [r.label, six(r.marginFt), six(r.requiredMarginFt), r.severity, String(r.pass), r.note === null ? 'null' : r.note])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-1">
        A verdict needs an input. The available head is the whole of what this function judges, so an unreadable one is
        refused rather than classified: there is no severity to report and no pass flag to set.
      </p>
      {m.unreadable.map((r) => (
        <EngineSays key={r.label} tone="red" label={r.label} message={shapeText(r.shape)} />
      ))}
      <Held>
        The margin rule itself, the larger of a {nine(m.floorFt)} ft floor and a {nine(m.fraction)} fraction of
        required. Both halves are measurable out of the engine and are measured above; the rule is customary and this
        repository holds no publication for it, so it is taught as a limit and never as an answer. No graded value in
        this course is a required margin, a pass flag or a severity.
      </Held>
      <Note>
        The required NPSH a vendor publishes is itself measured at a three percent head drop, so bare equality between
        available and required is already cavitation rather than the edge of it.
      </Note>
    </>
  );
};

export const ChangesMode = ({ s }) => {
  if (!s) return <Note>The change reader did not return the sweeps.</Note>;
  const chart = s.trim.map((r) => ({
    ratio: r.diameterRatio, ideal: r.idealHeadFt, real: r.headFt, shortfall: r.shortfallPct,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Asked at duty flow" value={six(s.baseQGpm)} unit="gpm" />
        <Tile label="Asked at duty head" value={six(s.baseHeadFt)} unit="ft" />
        <Tile label="Asked at brake power" value={six(s.baseBrakeHp)} unit="hp" />
        <Tile label="The band reported without comment" value={`${six(s.bandLow)} to ${six(s.bandHigh)}`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A speed change follows the affinity laws exactly for a geometrically similar machine, and the last two columns
        below are what exactly means: the head quotient against the speed ratio squared and the power quotient against
        it cubed, subtracted rather than described.
      </p>
      <Tbl
        head={['speed ratio', 'flow gpm', 'head ft', 'brake hp', 'head quotient less the ratio squared', 'power quotient less the ratio cubed', 'warned']}
        rows={s.speed.map((r) => [six(r.speedRatio), six(r.qGpm), six(r.headFt), six(r.brakeHp), raw(r.headLessSquareDerived), raw(r.powerLessCubeDerived), String(r.warned)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The band the engine will report a ratio over without comment is walked out of it by halving until the warning
        changes state: {six(s.bandLow)} to {six(s.bandHigh)}. At a ratio of {six(s.farRatio)} the laws still apply and
        the engine still applies them, giving {six(s.far.qGpm)} gpm at {six(s.far.headFt)} ft and
        {' '}{six(s.far.brakeHp)} brake hp, with a warning attached.
      </p>
      <EngineSays label={`At a speed ratio of ${six(s.farRatio)}`} message={s.far.warning} />
      <Held>
        That band is a sanity bound rather than a published correlation limit. No publication in this repository says
        where the affinity laws stop describing a real machine, so it is warned on, never used to refuse, and taught as
        a limit and never as an answer. The speed law itself is NOT held: it is the affinity law and it is exact.
      </Held>
      <p className="text-xs text-slate-400 mt-3 mb-0">An impeller trim does not follow those laws:</p>
      <Tbl
        head={['trim ratio', 'trim percent', 'ideal flow gpm', 'real flow gpm', 'ideal head ft', 'real head ft', 'shortfall percent', 'implied efficiency ratio']}
        rows={s.trim.map((r) => [six(r.diameterRatio), six(r.trimPercent), six(r.idealQGpm), six(r.qGpm), six(r.idealHeadFt), six(r.headFt), six(r.shortfallPct), nine(r.impliedEfficiencyRatio)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ratio" tick={AXIS} label={{ value: 'trim ratio', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="ideal" name="ideal head, ft" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line dataKey="real" name="head the model returns, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['boundary', 'trim ratio', 'trim percent', 'shortfall percent']}
        rows={s.boundaries.map((r) => [r.label, six(r.diameterRatio), raw(r.trimPercent), raw(r.shortfallPct)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The first of those is where binary floating point meets a rule written in decimal. A trim ratio meant to be
        exactly five percent puts the trim percent at {raw(s.slack.atStartTrimPercent)}, above five by
        {' '}{raw(s.slack.aboveFiveDerived)}, and the shortfall on that row is still
        {' '}{raw(s.slack.atStartShortfallPct)}, so the comparison carries a slack. Halving until the shortfall leaves
        zero measures it: the last ratio without one gives {raw(s.slack.lastWithoutTrimPercent)} and the first with one
        gives {raw(s.slack.firstWithTrimPercent)}, so the boundary the engine really applies sits
        {' '}{raw(s.slack.boundaryAboveFiveDerived)} above five percent.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The power leg of a trim is the IDEAL cube while the head and flow legs are both de-rated, so the return implies
        an efficiency change. At a trim ratio of {six(s.cap.diameterRatio)} the flow is
        {' '}{nine(s.cap.flowShareDerived)} of ideal and the head {nine(s.cap.headShareDerived)}, a product of
        {' '}{nine(s.cap.productDerived)}, while the brake power is {nine(s.cap.powerShareOfIdealCubeDerived)} of the
        ideal cube. The engine RETURNS that implied ratio as {nine(s.cap.impliedEfficiencyRatio)} rather than leaving it
        to be discovered by division, and the two agree to {raw(s.cap.impliedLessDerivedDifference)}.
      </p>
      <Held>
        The trim shortfall model. The engine's own comment calls it the published shortfall and names no publication, so
        it is taught as a limit and never as an answer. Its power leg is left as the ideal cube for the same reason:
        de-rating it would invent a second unsourced model on top of the first. No graded value in this course is a
        trimmed flow, head or shortfall.
      </Held>
    </>
  );
};

export const CrossingMode = ({ c }) => {
  if (!c) return <Note>The crossing reader did not return the comparison.</Note>;
  const chart = c.speeds.map((r) => ({
    ratio: r.speedRatio, reSolved: r.reSolvedQGpm, onePoint: r.onePointQGpm,
  }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The studio draws its chart and its duty headline from a scaled CURVE re-intersected with the station, and it
        also shows where the old duty point lands on that new curve. Those are two different questions and it labels
        them as two: the crossing is the operating point, and the affinity map is where the machine you had ends up on
        the machine you now have. The scaling factors below are read out of the engine at a unit duty rather than
        restated, which is what keeps the curve and the point from drifting apart.
      </p>
      <Tbl
        head={['speed ratio', 'trim ratio', 'flow factor', 'head factor']}
        rows={c.factors.map((r) => [six(r.speedRatio), six(r.diameterRatio), nine(r.qScale), nine(r.hScale)])}
      />
      <Tbl
        head={['speed ratio', 're-solved flow gpm', 're-solved head ft', 'one-point flow gpm', 'one-point head ft', 'flow quotient', 'head quotient']}
        rows={c.speeds.map((r) => [six(r.speedRatio), six(r.reSolvedQGpm), six(r.reSolvedHeadFt), six(r.onePointQGpm), six(r.onePointHeadFt), nine(r.flowQuotientDerived), nine(r.headQuotientDerived)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="ratio" tick={AXIS} label={{ value: 'speed ratio', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="reSolved" name="re-solved crossing, gpm" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="onePoint" name="affinity map of the old duty, gpm" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['trim ratio', 're-solved flow gpm', 're-solved head ft', 'one-point flow gpm', 'one-point head ft', 'flow quotient', 'head quotient']}
        rows={c.trims.map((r) => [six(r.diameterRatio), six(r.reSolvedQGpm), six(r.reSolvedHeadFt), six(r.onePointQGpm), six(r.onePointHeadFt), nine(r.flowQuotientDerived), nine(r.headQuotientDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Read the trim ratio of 0.950000 row, where the shortfall model contributes nothing at all: its shortfall percent
        is {raw(c.at95.shortfallPct)}. The two answers are still {six(c.at95.reSolvedQGpm)} gpm and
        {' '}{six(c.at95.onePointQGpm)} gpm, a quotient of {nine(c.at95.quotientDerived)}. The gap there is the system
        curve refusing to move when the machine changed, so the machine meets it somewhere else.
      </p>
      <Note>
        And the map does lie ON the new curve, which is the other half of the same statement: the scaled curve read at
        the one-point flow gives {six(c.at95.scaledCurveAtOnePointFt)} ft against a one-point head of
        {' '}{six(c.at95.onePointHeadFt)} ft, a difference of {raw(c.at95.onCurveDifferenceDerivedFt)} ft. It is a real
        point on the machine you now have. It is simply not where that machine will run.
      </Note>
    </>
  );
};

export const MachinesMode = ({ p }) => {
  if (!p) return <Note>The combination reader did not return the stacks.</Note>;
  const chart = p.parallel.map((r) => ({
    machines: r.machines, flow: r.qGpm, overOne: r.overOneMachineDerived, perMachine: r.perMachineDerivedGpm,
  }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Both stacks work into the friction-dominated station of the Associate tier: a static head of
        {' '}{six(p.staticHeadFt)} ft and a friction head of {six(p.frictionHeadFt)} ft at {six(p.atFlowGpm)} gpm. That
        is where the second machine result actually bites.
      </p>
      <Tbl
        head={['machines in parallel', 'duty flow gpm', 'duty head ft', 'flow over one machine', 'flow per machine gpm']}
        rows={p.parallel.map((r) => [String(r.machines), six(r.qGpm), six(r.headFt), nine(r.overOneMachineDerived), six(r.perMachineDerivedGpm)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="machines" tick={AXIS} label={{ value: 'machines in parallel', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#475569" strokeDasharray="3 3" />
            <Line dataKey="overOne" name="flow over one machine" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two machines do not give two, and the per-machine column says why: each one is running further left on its own
        curve while the station demands more head for the extra flow. This is the result the combination functions exist
        to make visible.
      </p>
      <Tbl
        head={['machines in series', 'duty flow gpm', 'duty head ft', 'head over one machine']}
        rows={p.series.map((r) => [String(r.machines), six(r.qGpm), six(r.headFt), nine(r.overOneMachineDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A series stack reads back exactly: at {six(p.readBack.qGpm)} gpm one machine makes {six(p.readBack.oneHeadFt)} ft
        and three in series make {six(p.readBack.threeHeadFt)} ft, a quotient of {nine(p.readBack.quotientDerived)}.
      </p>
      <p className="text-xs text-slate-400 mt-3 mb-1">
        A count is a number of machines, so it is guarded as a whole number rather than merely as one or more:
      </p>
      <EngineSays tone="red" label="Two and a half pumps in parallel" message={p.halfInParallel} />
      <EngineSays tone="red" label="Two and a half pumps in series" message={p.halfInSeries} />
      <p className="text-xs text-slate-400 mt-2 mb-1">
        And a stack carries the droop of the curve it was built from, so it refuses a duty point for the same reason one
        machine does:
      </p>
      <EngineSays tone="red" label="A stack built from a curve that rises with flow" message={p.stackDroopRefusal} />
    </>
  );
};

export const ViscosityMode = ({ p }) => {
  if (!p) return <Note>The correction reader did not return the factors.</Note>;
  const chart = p.viscosity.map((r) => ({
    viscosity: r.viscosityCSt, cQ: r.cQ, cEta: r.cEta,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Best efficiency flow" value={six(p.qBepGpm)} unit="gpm" />
        <Tile label="Best efficiency head" value={six(p.headBepFt)} unit="ft" />
        <Tile label="Speed" value={six(p.speedRpm)} unit="rpm" />
        <Tile label="B at water viscosity" value={nine(p.waterB)} />
      </TileGrid>
      <Tbl
        head={['viscosity cSt', 'B', 'flow factor', 'head factor', 'efficiency factor', 'corrected flow gpm', 'corrected head ft', 'note or warning']}
        rows={p.viscosity.map((r) => [six(r.viscosityCSt), nine(r.B), nine(r.cQ), nine(r.cH), nine(r.cEta),
          r.correctedPresent ? six(r.correctedQGpm) : 'absent',
          r.correctedHeadPresent ? six(r.correctedHeadFt) : 'absent',
          r.warned ? 'warning set' : (r.note ? r.note : 'null')])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="viscosity" tick={AXIS} scale="log" domain={['auto', 'auto']} label={{ value: 'viscosity, cSt', fill: '#94a3b8', fontSize: 10, position: 'insideBottom', offset: -2 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => nine(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="cQ" name="flow factor" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="cEta" name="efficiency factor" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        B is the correlating parameter, and it is a real positive number at water viscosity: the engine reports
        {' '}{nine(p.waterB)} there and {nine(p.justOverB)} a millionth above it, a difference of
        {' '}{raw(p.bDifferenceDerived)}. B says how far from water the fluid is. The decision not to correct is a
        separate statement, and it is carried by the note.
      </p>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The return shape is the same on every branch. On the two no-correction branches the corrected values are the
        catalogue values themselves: at water viscosity the corrected flow is {six(p.waterCorrectedQGpm)} gpm against a
        stated best efficiency flow of {six(p.qBepGpm)} gpm, a difference of
        {' '}{raw(p.waterCorrectedLessBepDerived)} gpm. The catalogue values unchanged is an answer, and it is returned
        as one.
      </p>
      {p.viscosityWarnings.map((r) => (
        <EngineSays key={r.viscosityCSt} label={`At ${six(r.viscosityCSt)} cSt`} message={r.warning} />
      ))}
      <Held>
        The whole Hydraulic Institute correction. B, the flow factor, the head factor and the efficiency factor are an
        empirical correlation with no publication in this repository, and the head factor is taken equal to the flow
        factor at best efficiency, which simplifies the standard further. This wave's oracle checks the arithmetic at
        sixty digits, the closed-form inverse of the flow factor, and the monotonicity both factors must have, and that
        is arithmetic evidence only. It is taught as a limit and never as an answer, and no graded value in this course
        is a corrected flow, head or efficiency.
      </Held>
    </>
  );
};

const SuctionExplorer = ({ initialMode = 'npsh' }) => {
  const [mode, setMode] = useState(initialMode);
  const s = useMemo(() => (mode === 'npsh' ? safe(suctionSide) : null), [mode]);
  const m = useMemo(() => (mode === 'margin' ? safe(marginAndRule) : null), [mode]);
  const ch = useMemo(() => (mode === 'changes' ? safe(speedAndTrim) : null), [mode]);
  const cr = useMemo(() => (mode === 'crossing' ? safe(crossingAndMap) : null), [mode]);
  const p = useMemo(() => ((mode === 'machines' || mode === 'viscosity') ? safe(twoPumpsAndWater) : null), [mode]);

  return (
    <PanelShell
      title="Suction and changes explorer"
      subtitle="OKONO P-1201 in field units: NPSH available assembled from its three parts, the margin rule measured out of the engine with its three severities, a trim beside a speed change, parallel and series re-solved, and the Hydraulic Institute factors."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'npsh' && <NpshMode s={s} />}
        {mode === 'margin' && <MarginMode m={m} />}
        {mode === 'changes' && <ChangesMode s={ch} />}
        {mode === 'crossing' && <CrossingMode c={cr} />}
        {mode === 'machines' && <MachinesMode p={p} />}
        {mode === 'viscosity' && <ViscosityMode p={p} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored Pump Station Designer engine on the teaching pump,
        printed to the precision the teaching digest prints. Heads are in feet, flows in gpm, pressures in psia and
        viscosity in centistokes.
      </Note>
    </PanelShell>
  );
};

export default SuctionExplorer;
