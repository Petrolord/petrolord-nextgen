import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  blowdownMarch, depressuringTime, stepStudy, pointSource,
} from './reliefLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Blowdown and radiation explorer, for the Expert tier's first four modules.
//
// A RELIEF VALVE KEEPS THE PRESSURE FROM RISING AND A BLOWDOWN ORIFICE TAKES THE
// INVENTORY OUT. They are two different questions about one vessel, and this
// panel is the second of them.
//
// THE OVERLAY IS THE POINT OF THE FIRST VIEW. The closed-form integral of the
// same mass balance the march evaluates is drawn over the marched answer, because
// a coefficient applied twice anywhere inside a march is invisible on the answer
// and visible only in a ratio. The ratio is printed rather than described.
//
// THE FLAT LINE IN THE ORIFICE VIEW IS A HARDER TEACHING POINT THAN THE CURVE
// BESIDE IT. The end state is fixed by the pressure ratio and the isentropic
// exponent, so the orifice decides only how long the vessel takes to get there.
//
// THE SETBACK IS NOT TAUGHT HERE and this course grades no setback. The merged
// Separation and Slug Catching course owns the flare setback and the four
// customary allowable intensities, and this view says so by name. What it draws
// is the intensity against distance and the inverse against a stated allowable.
//
// Every figure on this page is a return value from reliefLab, which is a return
// value from the vendored pressure relief engine on the teaching stream
// AFIESERE. Nothing here marches, integrates or computes an intensity, nothing
// imports an engine, and nothing reads a clock. Every warning shown is the
// engine's own returned message.
//
// EVERY VIEW RENDERS ITS EMPTY STATE FIRST. The readers run in an effect.
//
// NO PERCENTILE. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['march', 'The march, with the closed form of the same balance drawn over it'],
  ['step', 'The step refinement study, and the answer coming to a stop'],
  ['orifice', 'The time against the orifice, the fifteen minutes read off the curve, and the flat end state'],
  ['radiation', 'The point source asked both ways, and two engines with the same four rows'],
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

/** A soft state the engine reports on a call that succeeded. The text is the engine's. */
const Soft = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-amber-800/60 bg-amber-950/20 p-2">
    <p className="text-amber-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

export const EMPTY_STATE = 'No engine value has been read yet. This view calls the vendored pressure relief engine through the teaching lab and fills in once it answers.';
const Empty = () => <Note>{EMPTY_STATE}</Note>;

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const MarchMode = ({ b }) => {
  if (!b) return <Empty />;
  const chart = b.trajectory.map((s) => ({
    t: s.timeS, p: s.pressurePsia, temp: s.temperatureR,
  }));
  const closed = b.closedCases.map((c) => ({
    label: c.label, marched: c.marchedS, closedForm: c.closedFormS, ratio: c.ratioDerived,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Time to the end pressure" value={six(b.timeS)} unit="s" />
        <Tile label="The same in minutes, derived" value={six(b.timeMinDerived)} />
        <Tile label="Starting inventory" value={four(b.initialMassLb)} unit="lb" />
        <Tile label="Final temperature" value={six(b.finalTR)} unit="degR" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="t" type="number" domain={[0, 'dataMax']} tick={AXIS} label={{ value: 'time, s', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="p" tick={AXIS} />
            <YAxis yAxisId="t" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="p" y={b.finalPPsia} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: `the end pressure, ${six(b.finalPPsia)} psia`, fill: '#BFFF00', fontSize: 10 }} />
            <ReferenceLine yAxisId="p" x={b.closedFormS} stroke="#f472b6" strokeDasharray="2 3" label={{ value: 'the closed form', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <Line yAxisId="p" dataKey="p" name="pressure, psia" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="t" dataKey="temp" name="temperature, degR" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The pink line is the closed-form integral of the SAME mass balance the march evaluates, built from the engine&apos;s
        own coefficient C, the measured universal gas constant of {twelve(b.universalGasConstant)} and the stated
        geometry. The march returns {six(b.timeS)} s and the integral gives {six(b.closedFormS)} s, a ratio of
        {' '}{twelve(b.closedFormRatioDerived)}. A discharge coefficient applied twice, a coefficient hidden inside the
        mass flow, or an isentropic exponent off by one would all show up as a ratio away from one, which is exactly what
        makes a hidden coefficient visible.
      </Note>
      <Tbl
        head={['case', 'marched time s', 'closed form time s', 'ratio']}
        rows={closed.map((c) => [c.label, six(c.marched), six(c.closedForm), twelve(c.ratio)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The discharge coefficient is the caller&apos;s figure and nothing multiplies it. The same vessel at three
        coefficients gives {six(b.cdCases[0].timeS)} s, {six(b.cdCases[1].timeS)} s and {six(b.cdCases[2].timeS)} s, so
        the ratio of the first time to the last is {twelve(b.cdTimeRatioDerived)} against a coefficient ratio of
        {' '}{twelve(b.cdFactorRatioDerived)}.
      </p>
      <Tbl
        head={['returned', 'value']}
        rows={[
          ['inventory left at the end', `${four(b.massRemainingLb)} lb`],
          ['fraction of the inventory removed, derived', six(b.fractionRemovedDerived)],
          ['final temperature in degF, derived', six(b.finalTFDerived)],
          ['steps taken', String(b.steps)],
          ['steps that had to be subdivided', String(b.substeps)],
          ['stations returned', String(b.stationCount)],
          ['the time step used', `${six(b.dtS)} s`],
          ['the pressure below which the choked assumption stops holding', `${six(b.chokedToPsia)} psia`],
          ['warning', b.warning === null ? 'none' : b.warning],
        ]}
      />
      <Note>
        The pressure falls at every one of the {b.stationCount} stations and the vessel gets colder all the way down,
        because the gas left behind is the gas doing the expanding.
      </Note>
    </>
  );
};

export const StepMode = ({ s }) => {
  if (!s) return <Empty />;
  const chart = s.rows.map((r) => ({
    logDt: Math.log10(r.dtS), time: r.timeS, ratio: r.ratioToFinestDerived, steps: r.steps,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Halvings walked" value={s.halvings} />
        <Tile label="Refinement factor, derived" value={six(s.refinementFactorDerived)} />
        <Tile label="Total movement in the time" value={twelve(s.totalMovementSDerived)} unit="s" />
        <Tile label="Steps subdivided at the stated step" value={`${s.statedSubsteps} of ${s.statedSteps}`} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="logDt" tick={AXIS} tickFormatter={(v) => `1e${v.toFixed(1)}`} label={{ value: 'time step, s', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="t" tick={AXIS} domain={['dataMin', 'dataMax']} tickFormatter={(v) => v.toFixed(4)} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} tickFormatter={(v) => v.toFixed(6)} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => twelve(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="r" y={1} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: 'the finest step', fill: '#BFFF00', fontSize: 10 }} />
            <Line yAxisId="t" dataKey="time" name="time, s" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="r" dataKey="ratio" name="time against the finest, ratio" stroke="#f472b6" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        An explicit march has a step and a reader is entitled to know what that step is worth. The step is halved
        {' '}{s.halvings} times over a CONTIGUOUS sequence, because a convergence table is only honest over a contiguous
        slice. Across a {six(s.refinementFactorDerived)}-fold refinement the time moves by
        {' '}{twelve(s.totalMovementSDerived)} s in total, which is smaller than the precision this course prints a time
        at. That is what it looks like when an answer stops moving.
      </Note>
      <Tbl
        head={['time step s, stated', 'time s', 'final temperature degR', 'steps', 'substeps', 'time against the finest, ratio']}
        rows={s.rows.map((r) => [six(r.dtS), six(r.timeS), six(r.finalTR), r.steps, r.substeps, twelve(r.ratioToFinestDerived)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The march lands ON the end pressure rather than stepping past it: it finishes at
        {' '}{twelve(s.landsOnTheEndPressure.finalPPsia)} psia against a target of
        {' '}{six(s.landsOnTheEndPressure.targetPsia)} psia, a difference of
        {' '}{twelve(s.landsOnTheEndPressure.differencePsiaDerived)} psia. Without that the answer would be quantised to
        one step and refining it would step rather than converge.
      </p>
      <Tbl
        head={['case, stated', 'time s', 'final pressure psia', 'final temperature degR', 'steps', 'substeps']}
        rows={s.hardGeometryRows.map((r) => [r.label, six(r.timeS), six(r.finalPPsia), six(r.finalTR), r.steps, r.substeps])}
      />
      <Note>
        Those three are a small vessel through a large orifice, which is where a fixed step has the least to work with.
        Every one reaches its end pressure and reports a time above zero, and the substep column is why: no step may
        remove more than a twentieth of the inventory, so the engine cuts a step that would and reports how many it cut.
      </Note>
    </>
  );
};

export const OrificeMode = ({ d }) => {
  if (!d) return <Empty />;
  const chart = d.orificeRows.map((r) => ({
    d: r.orificeDIn, time: r.timeS, minutes: r.timeMinDerived, temp: r.finalTR,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The orifice that takes exactly fifteen minutes" value={six(d.fifteenMinuteOrificeIn)} unit="in" />
        <Tile label="The time the march returns there" value={six(d.fifteenMinuteTimeS)} unit="s" />
        <Tile label="Distinct final temperatures across the sweep" value={d.distinctFinalTemperatures} />
        <Tile label="Doubling the orifice multiplies the time by" value={twelve(d.doublingRatioDerived)} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="d" type="number" domain={[0.5, 3]} tick={AXIS} label={{ value: 'blowdown orifice, in', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="t" tick={AXIS} />
            <YAxis yAxisId="k" orientation="right" tick={AXIS} domain={[300, 380]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="t" y={d.fifteenMinuteTimeS} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: `the customary fifteen minutes, ${six(d.fifteenMinuteTimeS)} s`, fill: '#BFFF00', fontSize: 10 }} />
            <ReferenceDot yAxisId="t" x={d.fifteenMinuteOrificeIn} y={d.fifteenMinuteTimeS} r={5} fill="#BFFF00" stroke="none" label={{ value: `${six(d.fifteenMinuteOrificeIn)} in`, fill: '#BFFF00', fontSize: 10, position: 'right' }} />
            <Line yAxisId="t" dataKey="time" name="time, s" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="k" dataKey="temp" name="final temperature, degR" stroke="#f472b6" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The pink line is flat, and that flatness is the harder of the two teaching points on this chart. The end state is
        fixed by the pressure ratio and the isentropic exponent, so the orifice decides only how long the vessel takes to
        get there. Counted rather than eyeballed, the sweep reaches {d.distinctFinalTemperatures} distinct final
        temperature across {d.orificeRows.length} orifices. The fifteen minute orifice is read off the blue curve by
        bisection on the engine&apos;s own time rather than asserted, and the time does not scale with the diameter:
        doubling it from one inch multiplies the time by {twelve(d.doublingRatioDerived)}.
      </Note>
      <Tbl
        head={['orifice in, stated', 'time s', 'time min, derived', 'final temperature degR', 'steps', 'substeps']}
        rows={d.orificeRows.map((r) => [six(r.orificeDIn), six(r.timeS), six(r.timeMinDerived), six(r.finalTR), r.steps, r.substeps])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        What DOES move the end state is the end pressure, because that is what fixes the expansion ratio. The march
        states its own limit as well: it assumes choked flow the whole way down, and the engine names the pressure below
        which that stops holding at {six(d.chokedFloorPsia)} psia.
      </p>
      <Tbl
        head={['end pressure psia, stated', 'time s', 'final temperature degR', 'final degF, derived', 'fraction of inventory removed']}
        rows={d.endPressureRows.map((r) => [six(r.pEndPsia), six(r.timeS), six(r.finalTR), six(r.finalTFDerived), six(r.fractionRemovedDerived)])}
      />
      <Soft label="What the engine returns at an end pressure below its own choked floor" message={d.belowTheFloorWarning} />
    </>
  );
};

export const RadiationMode = ({ p }) => {
  if (!p) return <Empty />;
  const chart = p.distanceRows.map((r) => ({ d: r.distanceM, k: r.intensityKWm2 }));
  return (
    <>
      <TileGrid>
        <Tile label="Heat release, derived" value={four(p.flare.heatReleaseKwDerived)} unit="kW" />
        <Tile label="Intensity at the stated distance" value={six(p.flare.intensityAtStatedKWm2)} unit="kW/m2" />
        <Tile label="The solid angle, measured" value={twelve(p.solidAngle)} />
        <Tile label="Round trip through the inverse" value={twelve(p.roundTrip.ratioDerived)} />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="d" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'distance from the flare, m', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} tickFormatter={(v) => Number(v).toFixed(3)} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceDot x={p.flare.statedDistanceM} y={p.flare.intensityAtStatedKWm2} r={5} fill="#BFFF00" stroke="none" label={{ value: `${six(p.flare.statedDistanceM)} m`, fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <Line dataKey="k" name="radiant intensity, kW/m2" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The intensity falls with the square of the distance, which is why both axes are logarithmic and the curve is a
        straight line. Read any two rows and form the ratio of the intensities against the ratio of the squared
        distances.
      </Note>
      <Tbl
        head={['distance m, stated', 'intensity kW/m2']}
        rows={p.distanceRows.map((r) => [six(r.distanceM), six(r.intensityKWm2)])}
      />
      <Tbl
        head={['radiated fraction, stated', 'transmissivity, stated', 'intensity at the stated distance kW/m2']}
        rows={p.factorRows.map((r) => [six(r.fractionRadiated), six(r.transmissivity), six(r.intensityKWm2)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The engine carries this model in both directions, and the inverse against a STATED allowable is the second half.
        At a stated {six(p.roundTrip.statedDistanceM)} m the forward direction returns
        {' '}{twelve(p.roundTrip.intensityKWm2)} kW/m2, and handing that figure back as the allowable returns
        {' '}{twelve(p.roundTrip.distanceBackM)} m, a ratio of {twelve(p.roundTrip.ratioDerived)}. A ROUND TRIP THROUGH A
        FUNCTION AND ITS OWN INVERSE IS AN IDENTITY AND PROVES NOTHING ABOUT THE MODEL. It proves the two
        implementations agree, and what makes the model itself checked is an oracle that finds the sphere area by
        quadrature and the inverse by bisection on that same quadrature. The published rows below are the inverse run
        against the golden file at two stated allowables:
      </p>
      <Tbl
        head={['release kW', 'stated allowable kW/m2', 'published distance m', 'engine distance m']}
        rows={p.publishedInverseRows.map((r) => [four(r.qKw), six(r.allowableKwM2), six(r.distanceM), six(r.engineDistanceM)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THE SETBACK IS NOT TAUGHT HERE. A flare setback computed from a heat release, the pool fire behind it and the four
        customary allowable intensities is owned by {p.setbackOwnedBy}. This course teaches the point source as this
        engine&apos;s second copy of the same model and hands the setback question back by name. What is worth showing is
        that two engines in this package export the identical four rows, and that a test asserts they stay equal, so one
        learner cannot meet two sets of words for one published table.
      </p>
      <Tbl
        head={['kW/m2', 'the wording in the pressure relief engine', 'the wording in the spacing engine', 'equal']}
        rows={p.twoTables.map((r) => [six(r.kWm2), r.reliefLabel, r.spacingLabel === null ? 'none' : r.spacingLabel, r.equal ? 'yes' : 'no'])}
      />
      <Held>
        The four customary allowable radiant intensities and their labels. The values are customary and the wording is
        this package&apos;s own, and no publication in this repository checks either. They are taught as a
        limit and never as an answer. Nothing graded in this course reads a row of this table, and the setback that reads
        them belongs to the merged sibling course named above.
      </Held>
    </>
  );
};

const BlowdownExplorer = ({ initialMode = 'march' }) => {
  const [mode, setMode] = useState(initialMode);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const b = useMemo(() => (ready && mode === 'march' ? safe(blowdownMarch) : null), [ready, mode]);
  const s = useMemo(() => (ready && mode === 'step' ? safe(stepStudy) : null), [ready, mode]);
  const d = useMemo(() => (ready && mode === 'orifice' ? safe(depressuringTime) : null), [ready, mode]);
  const p = useMemo(() => (ready && mode === 'radiation' ? safe(pointSource) : null), [ready, mode]);

  return (
    <PanelShell
      title="Blowdown and radiation explorer"
      subtitle="A vessel emptying itself, on AFIESERE. The march with the closed form of the same balance drawn over it, the step refinement study, the time against the orifice with the customary fifteen minutes read off the curve and the end state flat beside it, and the point source asked in both directions."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'march' && <MarchMode b={b} />}
        {mode === 'step' && <StepMode s={s} />}
        {mode === 'orifice' && <OrificeMode d={d} />}
        {mode === 'radiation' && <RadiationMode p={p} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored pressure relief engine on the teaching stream,
        printed to the precision the teaching digest prints. Volumes are in ft3, pressures in psia, temperatures in degR,
        masses in lb, times in s, orifices in in, heat release in kW, distances in m and radiant flux in kW/m2. The two
        model decisions behind the march are stated rather than hidden: a constant compressibility along the path, and
        choked flow throughout, with the engine naming the pressure below which the second stops holding.
      </Note>
    </PanelShell>
  );
};

export default BlowdownExplorer;
