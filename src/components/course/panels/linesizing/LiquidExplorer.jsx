import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  frictionAndRegime, threeLosses, erosionalLimit, boreChoice, associateReading,
} from './linesizingLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Liquid explorer, the Associate tier. THE LINE THAT IS CLOSED FORM END TO END:
// bore to area to velocity, the Reynolds number and the two friction branches,
// the three losses kept apart, the erosional limit that is not a pressure drop
// at all, and the whole pipe schedule ranked two different ways.
//
// Every figure on this page is a return value from linesizingLab, which is a
// return value from the vendored Pipeline & Line Sizing Studio engines on the
// teaching line OGBIA. Nothing here computes a velocity, a friction factor, a
// pressure drop or a limit, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// appears anywhere on this page.

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const ten = (v) => (Number.isFinite(v) ? Number(v).toFixed(10) : 'none');

export const MODES = [
  ['regime', 'Regime: the Reynolds number, the two branches, and the band between them'],
  ['losses', 'Three losses: friction, fittings and elevation, kept apart'],
  ['erosional', 'The erosional limit: a criterion that is not a pressure drop'],
  ['bore', 'Choosing a bore: the whole schedule, ranked two different ways'],
  ['reading', 'The Associate reading: one line end to end'],
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

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const RegimeMode = ({ f }) => {
  if (!f) return <Note>The friction reader did not return the branches.</Note>;
  const chart = f.branch.map((r) => ({ re: four(r.re), f: r.f, regime: r.regime }));
  return (
    <>
      <Tbl
        head={['Reynolds number', 'relative roughness', 'engine f', 'golden f', 'regime the engine reports']}
        rows={f.published.map((c) => [four(c.re), six(c.relRough), ten(c.f), ten(c.goldenF), c.regime])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The published cases are synthetic, written by an independent oracle in SI where the engine works in field units.
        They catch an arithmetic or a unit error and cannot catch a method that is wrong in both files.
      </p>
      <Tbl
        head={['Reynolds number', 'f', 'regime']}
        rows={f.branch.map((r) => [four(r.re), ten(r.f), r.regime])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="re" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => ten(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="f" name="friction factor" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        At the line's own relative roughness of {ten(f.ogbiaRelRoughDerived)} the friction factor goes from
        {' '}{ten(f.jumpFromF)} to {ten(f.jumpToF)} across a single unit of Reynolds number, a jump of
        {' '}{six(f.jumpPercentDerived)} percent. The lower value is reported as {f.jumpFromRegime} and the upper as
        {' '}{f.jumpToRegime}, and the upper one is computed on the turbulent branch: the word and the arithmetic are
        saying different things. Nothing physical happens in that interval.
      </p>
      <Tbl
        head={['relative roughness', `f at Reynolds ${four(f.reLow)}`, `f at Reynolds ${four(f.reHigh)}`]}
        rows={f.roughnessRows.map((r) => [six(r.relRough), ten(r.fLow), ten(r.fHigh)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A rough pipe stops caring about the Reynolds number and a smooth one never does. Read the two columns against
        each other down the table: that is the vertical axis of the Moody chart.
      </p>
      <Tbl
        head={['viscosity cp', 'velocity ft/s', 'Reynolds number', 'f', 'regime', 'friction loss psi']}
        rows={f.viscosityRows.map((r) => [six(r.muCp), six(r.vFtS), four(r.re), ten(r.f), r.regime, six(r.dpFrictionPsi)])}
      />
      <Note>
        The velocity does not move down that table, because velocity is rate over area and neither of those is the
        viscosity. Everything downstream of the Reynolds number does.
      </Note>
    </>
  );
};

export const LossesMode = ({ t }) => {
  if (!t) return <Note>The losses reader did not return the line.</Note>;
  const chart = t.elevationRows.map((r) => ({
    elev: six(r.elevChangeFt), friction: r.dpFrictionPsi, elevation: r.dpElevationPsi, total: r.dpTotalPsi,
  }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Velocity" value={six(t.vFtS)} unit="ft/s" />
          <Tile label="Reynolds number" value={four(t.re)} unit={t.regime} />
          <Tile label="Friction factor" value={ten(t.f)} />
          <Tile label="Gradient" value={ten(t.gradientPsiPerFt)} unit="psi per ft" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The line as built: {six(t.qBpd)} bpd of {six(t.rhoLbFt3)} lb/ft3 crude at {six(t.muCp)} cp, through
        {' '}{six(t.idIn)} in of bore over {six(t.lengthFt)} ft. Friction {six(t.dpFrictionPsi)} psi, fittings
        {' '}{six(t.dpFittingsPsi)} psi, elevation {six(t.dpElevationPsi)} psi, total {six(t.dpTotalPsi)} psi. The three
        are returned SEPARATELY because they answer different questions. Friction is what a bigger pipe fixes.
        Elevation is what no pipe fixes.
      </p>
      <Tbl
        head={['fitting', 'count', 'K each', 'K total']}
        rows={t.fittings.map((x) => [x.id, String(x.count), six(x.kEach), six(x.kTotal)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The resistance sum for that list is {six(t.sumK)} velocity heads. On the whole {six(t.lengthFt)} ft line those
        fittings cost {six(t.withKFittingsPsi)} psi against {six(t.withKFrictionPsi)} psi of pipe, a share of
        {' '}{six(t.withKShareDerived)}. On a {six(t.manifoldLengthFt)} ft manifold run carrying the same duty and the
        same fittings, the share is {six(t.shortShareDerived)}. The fittings did not change; the pipe did.
      </p>
      <Tbl
        head={['elevation change ft', 'friction psi', 'elevation psi', 'total psi', 'gradient psi per ft']}
        rows={t.elevationRows.map((r) => [six(r.elevChangeFt), six(r.dpFrictionPsi), six(r.dpElevationPsi), six(r.dpTotalPsi), ten(r.gradientPsiPerFt)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="elev" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="friction" name="friction, psi" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="elevation" name="elevation, psi" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The friction term is identical in all three rows and the elevation term is symmetric about zero, so a hill is
        ADDED to a pressure drop rather than mixed into it. Downhill the total comes back negative, and that is an
        answer rather than an error.
      </p>
      <Tbl
        head={['catalogue id', 'roughness in', 'relative roughness', 'f', 'friction loss psi']}
        rows={t.roughnessRows.map((r) => [r.id, six(r.roughnessIn), ten(r.relRoughDerived), ten(r.f), six(r.dpFrictionPsi)])}
      />
      <Note>Roughness is the pipe and not the fluid. It moves the friction factor and nothing else on the line.</Note>
    </>
  );
};

export const ErosionalMode = ({ e }) => {
  if (!e) return <Note>The erosional reader did not return the limit.</Note>;
  const chart = e.densityRows.map((r) => ({
    rho: six(r.rhoLbFt3), c100: r.at100, c125: r.at125, c175: r.at175,
  }));
  return (
    <>
      <Tbl head={['id', 'label', 'c']} rows={e.rows.map((r) => [r.id, r.label, six(r.c)])} />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        An id the table does not carry does not refuse and does not return null. Asked for
        {' '}<span className="font-mono">{e.unknownId}</span> the catalogue answers with the FIRST ROW under its own
        label, which is the one thing in this chain that answers a question it was not asked.
      </p>
      <Tbl
        head={['c', 'erosional velocity ft/s', 'line velocity ft/s', 'ratio', 'exceeded', 'margin percent', 'largest rate bpd']}
        rows={e.byCFactor.map((r) => [six(r.cFactor), six(r.erosionalFtS), six(r.velocityFtS), six(r.ratio), String(r.exceeded), six(r.marginPct), four(r.largestRateBpd)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Flow area the engine reads" value={six(e.areaFt2)} unit="ft2" />
          <Tile label="Velocity the erosional check reads" value={six(e.checkVelocityFtS)} unit="ft/s" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        That is the same velocity the pressure drop read. The erosional limit is not a pressure drop and not a length:
        it is a ceiling on velocity, so it can rule out a bore that the pressure drop was perfectly happy with.
      </p>
      <Tbl
        head={['mixture density lb/ft3', 'erosional at c 100', 'at c 125', 'at c 175']}
        rows={e.densityRows.map((r) => [six(r.rhoLbFt3), six(r.at100), six(r.at125), six(r.at175)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="rho" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="c100" name="c 100" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="c125" name="c 125" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line dataKey="c175" name="c 175" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Density is the whole of the limit. A light gas is allowed to run several times faster than a dense liquid,
        which is why the limit bites hardest on wet gas and hardly at all on crude.
      </p>
      <Held note={e.held.note} />
    </>
  );
};

export const BoreMode = ({ b }) => {
  if (!b) return <Note>The bore reader did not return the schedule.</Note>;
  const chart = b.rows.map((r) => ({
    bore: six(r.idIn), velocity: r.vFtS, ratio: r.ratio,
  }));
  return (
    <>
      <Tbl
        head={['nominal', 'schedule', 'OD in', 'wall in', 'bore in', 'velocity ft/s', 'Reynolds', 'friction psi', 'total psi', 'erosional ft/s', 'ratio', 'inside the limit']}
        rows={b.rows.map((r) => [String(r.nps), r.schedule, six(r.odIn), six(r.wallIn), six(r.idIn), six(r.vFtS), four(r.re), six(r.dpFrictionPsi), six(r.dpTotalPsi), six(r.erosionalFtS), six(r.ratio), String(r.insideTheLimit)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="bore" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'the erosional limit', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="ratio" name="velocity over the erosional limit" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The erosional velocity is the same on every row, {six(b.erosionalFtS)} ft/s, because it depends on the density
        and the c factor and not on the bore. What changes down the table is the velocity that has to sit under it.
      </p>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Bores in table order: {b.boresInTableOrder.map((x) => six(x)).join(', ')}. That is NOT the order of the bores.
        A heavier schedule is a thicker wall and a smaller bore on the same outside diameter, and it sits after the
        lighter one, so reading down the table crosses back and forth over the bore a line actually needs.
      </p>
      <Tbl
        head={['nominal', 'OD in', 'wall light', 'wall heavy', 'bore light', 'bore heavy', 'velocity light', 'velocity heavy', 'total psi light', 'total psi heavy']}
        rows={b.schedulePairs.map((p) => [String(p.nps), six(p.odIn), six(p.wallLightIn), six(p.wallHeavyIn), six(p.boreLightIn), six(p.boreHeavyIn), six(p.vLightFtS), six(p.vHeavyFtS), six(p.totalLightPsi), six(p.totalHeavyPsi)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Bores that pass" value={`${b.passingCount} of ${b.boreCount}`} unit={`under ${six(b.maxVFtS)} ft/s and the erosional limit`} />
          <Tile label="First in TABLE order" value={`${b.firstInTableOrder.nps} in sch ${b.firstInTableOrder.schedule}`} unit={`bore ${six(b.firstInTableOrder.idIn)} in`} />
          <Tile label="Smallest passing BORE" value={`${b.smallestBore.nps} in sch ${b.smallestBore.schedule}`} unit={`bore ${six(b.smallestBore.idIn)} in`} />
          <Tile label="The same row" value={String(b.sameRow)} />
        </TileGrid>
      </div>
      <Note>
        Two defensible rules, two different pipes. A recommendation has to say which question it answered, and the
        studio's sweep was recommending the first passing row in table order until that was repaired.
      </Note>
    </>
  );
};

export const ReadingMode = ({ a }) => {
  if (!a) return <Note>The Associate reading did not return the chain.</Note>;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Velocity" value={six(a.vFtS)} unit="ft/s" />
          <Tile label="Reynolds number" value={four(a.re)} unit={a.regime} />
          <Tile label="Friction factor" value={ten(a.f)} />
          <Tile label="Pipe costs" value={six(a.dpFrictionPsi)} unit="psi" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-3 mb-0">
        End to end: {six(a.qBpd)} bpd of {six(a.rhoLbFt3)} lb/ft3 crude at {six(a.muCp)} cp through {six(a.idIn)} in of
        bore over {six(a.lengthFt)} ft gives a velocity of {six(a.vFtS)} ft/s and a Reynolds number of {four(a.re)},
        which is {a.regime}. At a relative roughness of {ten(a.relRoughDerived)} the friction factor is {ten(a.f)} and
        the pipe costs {six(a.dpFrictionPsi)} psi. The isometric's {six(a.sumK)} velocity heads add
        {' '}{six(a.dpFittingsPsi)} psi. The erosional limit at the continuous-service c factor is
        {' '}{six(a.erosionalFtS)} ft/s, which this line uses {six(a.usedFractionDerived)} of.
      </p>
      <Note>
        Everything in that sentence is closed form. Nothing in it iterated except the friction factor, and nothing in it
        compressed. Both of those change in the next tier, where the fluid is a gas.
      </Note>
    </>
  );
};

const LiquidExplorer = ({ initialMode = 'regime' }) => {
  const [mode, setMode] = useState(initialMode);
  const f = useMemo(() => (mode === 'regime' ? safe(frictionAndRegime) : null), [mode]);
  const t = useMemo(() => (mode === 'losses' ? safe(threeLosses) : null), [mode]);
  const e = useMemo(() => (mode === 'erosional' ? safe(erosionalLimit) : null), [mode]);
  const b = useMemo(() => (mode === 'bore' ? safe(boreChoice) : null), [mode]);
  const a = useMemo(() => (mode === 'reading' ? safe(associateReading) : null), [mode]);

  return (
    <PanelShell
      title="Liquid line explorer"
      subtitle="The crude export line in field units: the regime and the friction factor, the three losses kept apart, the erosional limit, and the whole pipe schedule ranked two different ways."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'regime' && <RegimeMode f={f} />}
        {mode === 'losses' && <LossesMode t={t} />}
        {mode === 'erosional' && <ErosionalMode e={e} />}
        {mode === 'bore' && <BoreMode b={b} />}
        {mode === 'reading' && <ReadingMode a={a} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored line-hydraulics engine on the teaching line, printed
        to the precision the teaching digest prints. Liquid work is in bpd, inches of bore and FEET of length; the gas
        tier works in miles, because that is the unit the published transmission forms are stated in.
      </Note>
    </PanelShell>
  );
};

export default LiquidExplorer;
