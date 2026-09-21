import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot, ReferenceArea,
} from 'recharts';
import {
  wettedGeometry, fireDuty, fireCase, dropletSettling, knockoutDrum, LIMIT_MARKER,
} from './reliefLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Fire and drum explorer. Where the load comes from and where the liquid goes,
// for the Professional tier throughout and for the Expert module about an input
// that changes nothing.
//
// THE FIRE CASE IS THE ONE ROUTE THAT COMPUTES ITS OWN LOAD, and it starts from
// geometry. Everything else in this module is handed a relief load. So the first
// two views are the geometry and the duty, in that order, and the letter at the
// end of the chain is the last thing on the page rather than the first.
//
// THE SAME CIRCULAR SEGMENT DECIDES TWO THINGS IN THE DRUM: how much vapour
// space there is, and how far a droplet has to fall. That is why the segment
// view sits between the settling view and the drum view, and why the one point
// where a depth fraction and an area fraction agree strictly between empty
// and full is marked. The two ends agree trivially and are not marked.
//
// Every figure on this page is a return value from reliefLab, which is a return
// value from the vendored pressure relief engine on the teaching streams
// BENISEDE and ODIDI. Nothing here computes a wetted area, a duty, a settling
// velocity or a drum length, nothing imports an engine, and nothing reads a
// clock. Every refusal and every note shown is the engine's own returned text.
//
// EVERY VIEW RENDERS ITS EMPTY STATE FIRST. The readers run in an effect, so no
// engine number reaches the first paint.
//
// NO PERCENTILE. Nothing in this course is a distribution.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

export const MODES = [
  ['wetted', 'The wetted area against the level, in both orientations, with half full marked'],
  ['duty', 'The pool fire duty and the load, and the two answers that move them'],
  ['segment', 'The segment area fraction against the depth fraction, and the one point between the ends they agree'],
  ['settling', 'Settling against droplet size, with the low Reynolds cap drawn'],
  ['drum', 'The drum length and the L over D against diameter, and the holdup that turns'],
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

/**
 * A quantity this course teaches as a stated limit and never as an answer. The
 * heading names WHICH kind of not-derived it is, in the lab's own marker words.
 */
const Held = ({ label = 'HELD FOR LITERATURE', children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">{label.toUpperCase()}</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

/** Text the engine returns on a successful call to name a decision it left to the caller. */
const EngineNote = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-sky-800/60 bg-sky-950/20 p-2">
    <p className="text-sky-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

const Refusal = ({ label, message }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">{label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{message}</p>
  </div>
);

export const EMPTY_STATE = 'No engine value has been read yet. This view calls the vendored pressure relief engine through the teaching lab and fills in once it answers.';
const Empty = () => <Note>{EMPTY_STATE}</Note>;

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const WettedMode = ({ w }) => {
  if (!w) return <Empty />;
  const chart = w.rows.map((r) => ({
    level: r.liquidLevelFt, horizontal: r.horizontalFt2, vertical: r.verticalFt2, ratio: r.horizontalOverVerticalDerived,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="BENISEDE lying down" value={four(w.lyingFt2)} unit="ft2" />
        <Tile label="The same vessel standing up" value={four(w.standingFt2)} unit="ft2" />
        <Tile label="Lying over standing" value={twelve(w.lyingOverStandingDerived)} />
        <Tile label="Full, the whole lateral surface" value={four(w.fullFt2)} unit="ft2" />
      </TileGrid>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="level" type="number" domain={[0, 12]} tick={AXIS} label={{ value: 'liquid level, ft', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="a" tick={AXIS} />
            <YAxis yAxisId="r" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="a" x={w.halfFull.levelFt} stroke="#BFFF00" strokeDasharray="4 3" label={{ value: 'half full', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <ReferenceDot yAxisId="a" x={w.halfFull.levelFt} y={w.halfFull.wettedFt2} r={4} fill="#BFFF00" stroke="none" />
            <Line yAxisId="a" dataKey="horizontal" name="lying down, ft2" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="a" dataKey="vertical" name="standing up, ft2" stroke="#f472b6" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="r" dataKey="ratio" name="lying over standing" stroke="#fbbf24" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The marked level is the one case with an analytic answer. At a level of exactly {six(w.halfFull.levelFt)} ft the
        engine returns {four(w.halfFull.wettedFt2)} ft2 and half the lateral surface of the cylinder is
        {' '}{four(w.halfFull.halfTheLateralSurfaceFt2)} ft2, a ratio of {twelve(w.halfFull.ratioDerived)}. Any geometry
        that is wrong away from half full can still be exactly right there, which is why the whole level is walked rather
        than one point checked.
      </Note>
      <Tbl
        head={['level ft, stated', 'level as a fraction of the diameter', 'lying down ft2', 'standing up ft2', 'lying over standing']}
        rows={w.rows.map((r) => [six(r.liquidLevelFt), six(r.levelFractionDerived), four(r.horizontalFt2), four(r.verticalFt2), six(r.horizontalOverVerticalDerived)])}
      />
      <EngineNote label="What the engine returns on every fire duty" message={w.heightLimitNote} />
      <Held label={LIMIT_MARKER}>
        The 25 ft wetted-height limit. Where that height falls depends on a plot elevation the engine is never told, so
        the truncation is the caller&apos;s job and it arrives as the note above rather than as arithmetic. Taught as a
        limit and never as an answer. The heads are ignored as well, which is standard screening practice and
        conservative for the shell term.
      </Held>
    </>
  );
};

export const DutyMode = ({ f, c }) => {
  if (!f || !c) return <Empty />;
  const envChart = f.envRows.map((r) => ({
    env: r.envFactor, drained: r.dutyDrainedBtuHr, undrained: r.dutyUndrainedBtuHr, load: r.loadDrainedLbHr,
  }));
  const areaChart = f.areaRows.map((r) => ({ area: r.wettedFt2, duty: r.dutyBtuHr, perFt2: r.dutyPerFt2Derived }));
  return (
    <>
      <TileGrid>
        <Tile label="Wetted area" value={four(f.wettedFt2)} unit="ft2" />
        <Tile label="Pool fire duty" value={four(c.chain.dutyBtuHr)} unit="Btu/hr" />
        <Tile label="Relief load" value={four(c.chain.loadLbHr)} unit="lb/hr" />
        <Tile label="Orifice the load demands" value={`${c.chain.orifice} at ${six(c.chain.margin)}`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Two things move this duty and they are different kinds of thing. The drainage answer is a BOOLEAN that switches
        between two published constants, {four(f.constantDrainedBtuHr)} and {four(f.constantUndrainedBtuHr)} Btu/hr at a
        unit area, a factor of {twelve(f.drainageFactorDerived)} between them. The environment factor is a typed CREDIT
        against its own table and it multiplies. The exponent the area is raised to is {twelve(f.exponent)}, measured as
        the log ratio of two duties an order of area apart.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={envChart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="env" type="number" domain={[0.1, 1]} tick={AXIS} label={{ value: 'environment factor, stated', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="q" tick={AXIS} />
            <YAxis yAxisId="w" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="q" dataKey="drained" name="duty with drainage, Btu/hr" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="q" dataKey="undrained" name="duty without drainage, Btu/hr" stroke="#f87171" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="w" dataKey="load" name="relief load with drainage, lb/hr" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['environment factor, stated', 'duty with drainage Btu/hr', 'duty without Btu/hr', 'relief load lb/hr']}
        rows={f.envRows.map((r) => [six(r.envFactor), four(r.dutyDrainedBtuHr), four(r.dutyUndrainedBtuHr), four(r.loadDrainedLbHr)])}
      />
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={areaChart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="area" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'wetted area, ft2', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="q" tick={AXIS} />
            <YAxis yAxisId="p" orientation="right" tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="q" dataKey="duty" name="duty, Btu/hr" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="p" dataKey="perFt2" name="duty per ft2, Btu/hr" stroke="#fbbf24" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The exponent is below one, so the duty PER SQUARE FOOT falls as the vessel gets bigger. It runs from
        {' '}{four(f.areaRows[0].dutyPerFt2Derived)} Btu/hr at {four(f.areaRows[0].wettedFt2)} ft2 down to
        {' '}{four(f.areaRows[6].dutyPerFt2Derived)} at {four(f.areaRows[6].wettedFt2)} ft2, which is the second curve
        rather than something to infer from the first.
      </Note>
      <Tbl
        head={['latent heat Btu/lb, stated', 'relief load lb/hr', 'warned']}
        rows={f.latentRows.map((r) => [six(r.latentBtuLb), four(r.loadLbHr), r.warned ? 'yes' : 'no'])}
      />
      {f.latentRows.filter((r) => r.warning).slice(0, 1).map((r) => (
        <Refusal key={r.latentBtuLb} label={`a latent heat of ${six(r.latentBtuLb)} Btu/lb, below the measured edge at ${six(f.latentWarnBtuLb)}`} message={r.warning} />
      ))}
      <Tbl
        head={['changed input', 'wetted ft2', 'duty Btu/hr', 'load lb/hr', 'required in2', 'orifice']}
        rows={c.whatMovesTheLetter.map((r) => [r.changed, four(r.wettedFt2), four(r.dutyBtuHr), four(r.loadLbHr), six(r.areaIn2), r.orifice])}
      />
      <Note>
        Each row of the last table changes ONE input of the chain and carries the change all the way through to a letter.
        The drainage answer alone moves the selection, and so does reading the same vessel standing up rather than lying
        down. The string false is truthy in JavaScript, so a select element that sent one
        would buy the drainage credit without saying so, and the engine refuses a drainage answer that is not a real
        boolean.
      </Note>
      <Held>
        The two pool fire constants and the published exponent. The oracle checks the USC pair against the published SI
        pair with the exponent carried through the unit conversion, which checks the UNIT PACKAGING rather than the
        pool-fire physics. Taught as a limit and never as an answer, and nothing graded in this course reads a fire duty
        or a fire relief load.
      </Held>
    </>
  );
};

export const SegmentMode = ({ k }) => {
  if (!k) return <Empty />;
  const chart = k.segmentRows.map((r) => ({
    depth: r.depthFraction, area: r.liquidAreaFraction, vapour: r.vapourAreaFractionDerived, same: r.depthFraction,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="At half depth the area fraction is" value={twelve(k.halfDepthAreaFraction)} />
        <Tile label="At a depth fraction of 0.1" value={six(k.segmentRows[1].liquidAreaFraction)} />
        <Tile label="At a depth fraction of 0.75" value={six(k.segmentRows[4].liquidAreaFraction)} />
        <Tile label="Depth fractions walked" value={k.segmentRows.length} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="depth" type="number" domain={[0, 1]} tick={AXIS} label={{ value: 'depth fraction, which is what a level instrument reads', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis tick={AXIS} domain={[0, 1]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceDot x={0.5} y={0.5} r={5} fill="#BFFF00" stroke="none" label={{ value: 'the one agreement between the ends', fill: '#BFFF00', fontSize: 10, position: 'right' }} />
            <Line dataKey="area" name="liquid AREA fraction" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line dataKey="vapour" name="vapour area fraction" stroke="#f472b6" strokeWidth={2} dot isAnimationActive={false} />
            <Line dataKey="same" name="the depth fraction itself" stroke="#94a3b8" strokeDasharray="4 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The dashed line is the depth fraction read against itself, and the blue curve is the AREA fraction the same depth
        produces. They meet at one point and only one, and that single crossing is the whole lesson about what a stated
        fraction is a fraction OF. At a tenth of the depth the area fraction is {six(k.segmentRows[1].liquidAreaFraction)}
        and at three quarters of the depth it is {six(k.segmentRows[4].liquidAreaFraction)}.
      </Note>
      <Tbl
        head={['depth fraction, stated', 'liquid area fraction', 'vapour area fraction']}
        rows={k.segmentRows.map((r) => [six(r.depthFraction), six(r.liquidAreaFraction), six(r.vapourAreaFractionDerived)])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        The size of the convention is printed rather than asserted. The same drum read with the stated fraction as a LEVEL
        and then as an AREA fraction gives two different lengths everywhere except at half full:
      </p>
      <Tbl
        head={['fraction, stated', 'length ft read as a level', 'length ft read as an area fraction', 'ratio']}
        rows={k.conventionRows.map((r) => [six(r.fraction), six(r.lengthAsLevelFt), six(r.lengthAsAreaFractionFt), six(r.ratioDerived)])}
      />
      <Note>
        Exactly right at half full and wrong either side of it is the hardest kind of geometry defect to see, because half
        full is the one case anybody checks.
      </Note>
    </>
  );
};

export const SettlingMode = ({ d }) => {
  if (!d) return <Empty />;
  const chart = d.rows.map((r) => ({
    micron: r.dropletMicron, ud: r.udFtS, dragC: r.dragC, reynolds: r.reynolds,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="ODIDI vapour density, derived" value={six(d.vapourDensityLbFt3Derived)} unit="lb/ft3" />
        <Tile label="Actual vapour rate, derived" value={six(d.actualVapourRateAcfsDerived)} unit="acfs" />
        <Tile label="Dropout velocity at the stated droplet" value={six(d.statedPair.udFtS)} unit="ft/s" />
        <Tile label="Its drag coefficient" value={six(d.statedPair.dragC)} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A droplet falls at the speed where form drag balances its buoyant weight. The drag coefficient depends on the
        Reynolds number and the Reynolds number depends on the speed, so the engine iterates and returns the PAIR it
        converged on, in {d.statedPair.iterations} passes on a residual of {twelve(d.statedPair.residual)}. The velocity
        returned is the one that drag coefficient gives, so a reader can put the pair back into the balance and get the
        same answer.
      </p>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="micron" type="number" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'droplet size, micron', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="u" tick={AXIS} />
            <YAxis yAxisId="c" orientation="right" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="c" y={d.dragCap} stroke="#f87171" strokeDasharray="4 3" label={{ value: 'the low Reynolds cap', fill: '#f87171', fontSize: 10 }} />
            <Line yAxisId="u" dataKey="ud" name="dropout velocity, ft/s" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="c" dataKey="dragC" name="drag coefficient" stroke="#fbbf24" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The dashed line is where the correlation stops being evaluated. Measured, the drag coefficient stops moving at
        {' '}{twelve(d.dragCap)} and the Reynolds number just inside that cap is {twelve(d.dragCapReynolds)}. Below there
        the fit would keep climbing and the cap holds it, which is why the two smallest droplets on the sweep share one
        coefficient.
      </Note>
      <Tbl
        head={['droplet micron, stated', 'dropout velocity ft/s', 'drag coefficient', 'Reynolds', 'passes', 'converged']}
        rows={d.rows.map((r) => [six(r.dropletMicron), six(r.udFtS), six(r.dragC), six(r.reynolds), r.iterations, r.converged ? 'yes' : 'no'])}
      />
      <p className="text-xs text-slate-400 mt-3 mb-0">
        THREE COURSES IN THIS ACADEMY ANSWER THE SAME QUESTION BY DIFFERENT ROUTES. Gas well loading owns drag against
        weight with the Turner and Coleman criteria, and Separation owns the Souders-Brown allowable and the critique of
        using it as a settling velocity. This is the third answer, the API 521 drag-coefficient method, and this course
        does not re-derive either of the other two. What the group above measures is the packaging: the same group at
        {' '}{twelve(d.settleGroupAt100Micron)} at one droplet size and {twelve(d.settleGroupAt200Micron)} at twice it
        says the group does not carry the size, and {twelve(d.settleGroupAtDoubleViscosity)} at twice the viscosity says
        it does not carry the viscosity either. Divided by standard gravity it leaves
        {' '}{twelve(d.coefficientSquaredTimesFootPerMicron)}.
      </p>
      <Held>
        The sphere-drag correlation and its low Reynolds cap. They are an empirical fit no route in this package can
        derive, and the validation oracle shares them with the engine deliberately, so moving one in both files leaves
        every published case green. The FC5-0 battery reports that sharing as its own finding rather than as a pass.
        Taught as a limit and never as an answer, and nothing graded in this course reads it. Whether the standard prints
        the coefficient as 1.15 or as the exact four thirds is held for the same reason: no copy of it is in this
        repository, so the engine evaluates the BALANCE and the coefficient above is measured out of the returned pair.
      </Held>
    </>
  );
};

export const DrumMode = ({ k }) => {
  if (!k) return <Empty />;
  const diameterChart = k.diameterRows.map((r) => ({
    d: r.diameterFt, length: r.requiredLengthFt, ld: r.ld, velocity: r.vVaporFtS,
  }));
  const holdupChart = k.holdupRows.map((r) => ({
    f: r.liquidFraction, length: r.requiredLengthFt, velocity: r.vVaporFtS, fall: r.fallFt,
  }));
  const turn = k.holdupRows.reduce((lo, r) => (r.requiredLengthFt < lo.requiredLengthFt ? r : lo), k.holdupRows[0]);
  return (
    <>
      <TileGrid>
        <Tile label="ODIDI vapour velocity" value={six(k.statedDrum.vVaporFtS)} unit="ft/s" />
        <Tile label="Required length" value={six(k.statedDrum.requiredLengthFt)} unit="ft" />
        <Tile label="L over D" value={six(k.statedDrum.ld)} />
        <Tile label="Diameters walked" value={k.diameterRows.length} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={diameterChart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="d" type="number" domain={[5, 14]} tick={AXIS} label={{ value: 'candidate drum diameter, ft', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="l" tick={AXIS} />
            <YAxis yAxisId="ld" orientation="right" tick={AXIS} domain={[0, 7]} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea yAxisId="ld" y1={k.noteBand.smallerDrumLd} y2={k.noteBand.goWiderLd} fill="#BFFF00" fillOpacity={0.07} />
            <ReferenceLine yAxisId="ld" y={k.noteBand.goWiderLd} stroke="#f87171" strokeDasharray="4 3" label={{ value: `go wider above L over D ${six(k.noteBand.goWiderLd)}`, fill: '#f87171', fontSize: 10 }} />
            <ReferenceLine yAxisId="ld" y={k.noteBand.smallerDrumLd} stroke="#fbbf24" strokeDasharray="4 3" label={{ value: `a smaller drum may do below ${six(k.noteBand.smallerDrumLd)}`, fill: '#fbbf24', fontSize: 10 }} />
            <Line yAxisId="l" dataKey="length" name="required length, ft" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="ld" dataKey="ld" name="L over D" stroke="#BFFF00" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="l" dataKey="velocity" name="vapour velocity, ft/s" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Both edges of the note band are drawn because both are measured out of the engine rather than typed: the go wider
        note starts at an L over D of {twelve(k.noteBand.goWiderLd)} and the smaller drum note ends at
        {' '}{twelve(k.noteBand.smallerDrumLd)}. Between them the engine says nothing, and that silence is the band it
        treats as reasonable.
      </Note>
      <Tbl
        head={['diameter ft, stated', 'vapour velocity ft/s', 'required length ft', 'L over D', 'note']}
        rows={k.diameterRows.map((r) => [six(r.diameterFt), six(r.vVaporFtS), six(r.requiredLengthFt), six(r.ld), r.note === null ? 'none' : r.note])}
      />
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={holdupChart} margin={{ top: 10, right: 20, bottom: 14, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="f" type="number" domain={[0, 1]} tick={AXIS} label={{ value: 'holdup, the liquid level as a fraction of the diameter', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -8 }} />
            <YAxis yAxisId="l" tick={AXIS} />
            <YAxis yAxisId="v" orientation="right" scale="log" domain={['dataMin', 'dataMax']} tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceDot yAxisId="l" x={turn.liquidFraction} y={turn.requiredLengthFt} r={5} fill="#BFFF00" stroke="none" label={{ value: 'the turn', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <Line yAxisId="l" dataKey="length" name="required length, ft" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="l" dataKey="fall" name="the distance a droplet falls, ft" stroke="#fbbf24" dot={false} isAnimationActive={false} />
            <Line yAxisId="v" dataKey="velocity" name="vapour velocity, ft/s" stroke="#f472b6" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The required length is NOT monotonic in the holdup, and the marked turn is where it changes direction. Two effects
        move against each other: filling the drum shrinks the vapour space and speeds the gas up, which needs more
        length, and it also shortens the distance a droplet has to fall, which needs less. Across the whole range the
        length runs from {six(k.lengthSpread.minFt)} ft to {six(k.lengthSpread.maxFt)} ft, a spread of
        {' '}{six(k.lengthSpread.spreadFtDerived)} ft, while the vapour velocity runs from
        {' '}{six(k.lengthSpread.minVapourFtS)} ft/s to {six(k.lengthSpread.maxVapourFtS)} ft/s.
      </Note>
      <Tbl
        head={['holdup, stated', 'liquid depth ft', 'liquid area fraction', 'vapour area ft2', 'vapour velocity ft/s', 'fall distance ft', 'required length ft', 'L over D', 'note']}
        rows={k.holdupRows.map((r) => [
          six(r.liquidFraction), six(r.liquidDepthFt), six(r.liquidAreaFraction), six(r.areaVaporFt2),
          six(r.vVaporFtS), six(r.fallFt), six(r.requiredLengthFt), six(r.ld), r.note === null ? 'none' : r.note,
        ])}
      />
      <EngineNote label="What the engine says about the stated ODIDI drum" message={k.statedDrum.note} />
      <Note>
        A spread of {six(k.lengthSpread.spreadFtDerived)} ft is what a holdup input that MOVES its answer looks like. An
        input walked across its whole declared range with the spread of the answer printed beside it is the arithmetic
        test for an input that changes nothing, and it is worth running on any input rather than only on this one.
      </Note>
    </>
  );
};

const FireDrumExplorer = ({ initialMode = 'wetted' }) => {
  const [mode, setMode] = useState(initialMode);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const w = useMemo(() => (ready && mode === 'wetted' ? safe(wettedGeometry) : null), [ready, mode]);
  const f = useMemo(() => (ready && mode === 'duty' ? safe(fireDuty) : null), [ready, mode]);
  const c = useMemo(() => (ready && mode === 'duty' ? safe(fireCase) : null), [ready, mode]);
  const d = useMemo(() => (ready && mode === 'settling' ? safe(dropletSettling) : null), [ready, mode]);
  const k = useMemo(() => (ready && (mode === 'segment' || mode === 'drum') ? safe(knockoutDrum) : null), [ready, mode]);

  return (
    <PanelShell
      title="Fire and drum explorer"
      subtitle="Where the load comes from and where the liquid goes, on BENISEDE and ODIDI. The wetted area of a vessel in a pool fire in both orientations, the duty and the load with the two answers that move them, the circular segment that decides both the vapour space and the fall distance, droplet settling with its low Reynolds cap, and the drum length and the L over D against diameter."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'wetted' && <WettedMode w={w} />}
        {mode === 'duty' && <DutyMode f={f} c={c} />}
        {mode === 'segment' && <SegmentMode k={k} />}
        {mode === 'settling' && <SettlingMode d={d} />}
        {mode === 'drum' && <DrumMode k={k} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored pressure relief engine on the teaching streams,
        printed to the precision the lessons use. Wetted areas are in ft2, duties in Btu/hr, loads in lb/hr,
        velocities in ft/s, lengths in ft and droplets in micron. The vessel in a fire and the drum behind the valve do
        not share a number: the drum takes a rate at drum conditions, which this engine is handed rather than deriving
        from a relief case.
      </Note>
    </PanelShell>
  );
};

export default FireDrumExplorer;
