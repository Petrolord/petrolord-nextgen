import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { networkExplorer } from './networkLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Network explorer, the Professional tier. The SOLVE, and what it decides.
//
// Seven modes. The one case with a closed form, a tree of turbulent branches
// against a method with nothing in common, the teaching system solved with
// every node and every branch, the loop and the split it decides, the wells
// fighting each other for a header, the streams that add by rate, and the
// diagnosis.
//
// Every figure on this page is a return value from networkLab, which is a
// return value from the vendored network solver. Nothing here iterates,
// assembles a Jacobian or ranks a branch. AND EVERY SOLVE ON THIS PAGE CARRIES
// ITS CONSERVATION GAP BESIDE ITS CONVERGED FLAG, because a converged flag is
// what the iteration says about itself and the gap is what an audit says about
// the answer.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 8);
};

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['linear', 'The one case with a closed form'],
  ['tree', 'A tree of turbulent branches, against an independent method'],
  ['solve', 'A whole system solved at once'],
  ['loop', 'The loop, and the split it decides'],
  ['fight', 'Wells fighting each other for a header'],
  ['streams', 'What arrives at the separator'],
  ['diagnosis', 'The bottleneck against the biggest drop'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const Verdict = ({ v }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>
          <th className="text-left pr-3">ok</th>
          <th className="text-left pr-3">converged</th>
          <th className="text-left pr-3">iterations</th>
          <th className="text-left pr-3">pinned</th>
          <th className="text-left pr-3">reported residual, lb/d</th>
          <th className="text-left pr-3">produced, lb/d</th>
          <th className="text-left pr-3">delivered, lb/d</th>
          <th className="text-left">conservation gap, lb/d</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="pr-3">{yn(v.ok)}</td>
          <td className="pr-3">{yn(v.converged)}</td>
          <td className="pr-3">{fmt(v.iterations, 0)}</td>
          <td className="pr-3">{v.pinned.length ? v.pinned.join(', ') : 'none'}</td>
          <td className="pr-3 text-[#38bdf8]">{tiny(v.reportedResidualLbD)}</td>
          <td className="pr-3">{fmt(v.producedLbD, 6)}</td>
          <td className="pr-3">{fmt(v.deliveredLbD, 6)}</td>
          <td className={v.massBalanceCloses ? 'text-[#38bdf8]' : 'text-[#f97316]'}>{tiny(v.conservationGapLbD)}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// --------------------------------------------------------------------------

const Linear = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: networkExplorer.linearRows(),
        summary: networkExplorer.linearSummary(),
        reductions: networkExplorer.seriesParallel(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The closed form needs linear branch conductances and linear well slopes, because a weighted graph Laplacian is only a matrix when every relation in it is linear.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Newton iterations on a linear system" value={fmt(data.summary.iterations, 0)} />
        <Tile label="Nodes agreeing to the last BIT" value={fmt(data.summary.nodesAgreeingExactly, 0)} />
        <Tile label="Worst relative difference against the closed form" value={tiny(data.summary.worstRelDiffAgainstTheClosedForm)} />
        <Tile label="Conservation gap on the answer" value={tiny(data.summary.conservationGapLbD)} unit="lb/d" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">node</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">the matrix inverse, psia</th>
              <th className="text-left pr-3">Newton, psia</th>
              <th className="text-left pr-3">Newton less the closed form, psia</th>
              <th className="text-left pr-3">the bisection oracle, psia</th>
              <th className="text-left">exactly equal</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3">{r.kind}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.exactPressurePsia, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.newtonPressurePsia, 9)}</td>
                <td className="pr-3">{tiny(r.newtonMinusExactPsia)}</td>
                <td className="pr-3">{fmt(r.goldenPressurePsia, 9)}</td>
                <td>{yn(r.agreesExactly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THIS IS THE ONLY CHECK IN THE COURSE WITH NO TOLERANCE IN IT. Give the solver linear branch
        resistances and the whole network collapses to a weighted graph Laplacian, whose solution is
        a matrix inverse. Newton iteration and Gaussian elimination share no code and no reasoning,
        so agreement to machine precision is evidence about the assembly, the signs and the boundary
        handling rather than about either method. THREE ROADS ARE ON THAT TABLE and each has its own
        column: the matrix inverse, the Newton iterate, and the independent bisection oracle that
        took {fmt(data.summary.goldenSweeps, 0)} sweeps where the engine took
        {' '}{fmt(data.summary.iterations, 0)} steps. Newton is EXACT on a linear system, so needing
        many iterations here would mean the Jacobian is wrong rather than that the problem is hard.
        Every result after this one is an iterate.
      </div>
      <Verdict v={data.summary} />
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">and the topology reduces the way a network must</th>
              <th className="text-left pr-3">equivalent, lb/d per psi</th>
              <th className="text-left pr-3">many branches, psia</th>
              <th className="text-left pr-3">one branch, psia</th>
              <th className="text-left">difference</th>
            </tr>
          </thead>
          <tbody>
            {data.reductions.map((r) => (
              <tr key={r.rule}>
                <td className="pr-3">{r.rule}</td>
                <td className="pr-3">{fmt(r.equivalentLbDPerPsi, 6)}</td>
                <td className="pr-3">{fmt(r.manyBranchWellheadPsia, 9)}</td>
                <td className="pr-3">{fmt(r.oneBranchWellheadPsia, 9)}</td>
                <td className="text-[#BFFF00]">{tiny(r.differencePsia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Neither rule survives a turbulent branch, because a linear branch is a resistor and a
        turbulent one is not. Swap the trunk for a square root law and the closed form is gone, the
        iteration count rises, and every check after that has a tolerance in it.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Tree = () => {
  const data = useMemo(() => {
    try {
      return {
        rows: networkExplorer.goldenRows('turbulent_tree'),
        summary: networkExplorer.goldenSummary('turbulent_tree'),
        trunk: networkExplorer.treeTrunkRows(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A turbulent branch has no closed form, so this case exists only as two independent solves of the same physics.</Note>;
  }
  const chart = data.trunk.map((r) => ({
    x: r.trunkConductanceLbDPerRootPsi,
    header2Psia: r.header2Psia,
    totalLbD: r.totalLbD,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Newton iterations" value={fmt(data.summary.iterations, 0)} />
        <Tile label="Oracle sweeps for the same answer" value={fmt(data.summary.goldenSweeps, 0)} />
        <Tile label="Which is a ratio of" value={fmt(data.summary.sweepsOverIterations, 4)} />
        <Tile label="Conservation gap on the answer" value={tiny(data.summary.conservationGapLbD)} unit="lb/d" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what</th>
              <th className="text-left pr-3">which</th>
              <th className="text-left pr-3">the oracle</th>
              <th className="text-left pr-3">the engine</th>
              <th className="text-left pr-3">engine less oracle</th>
              <th className="text-left">unit</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={`${r.kind}-${r.id}`}>
                <td className="pr-3">{r.kind}</td>
                <td className="pr-3">{r.id}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenValue, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.engineValue, 9)}</td>
                <td className="pr-3">{tiny(r.engineMinusGolden)}</td>
                <td>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO METHODS WITH NOTHING IN COMMON, LANDING ON THE SAME PRESSURES. The engine solves this by
        Newton with a numerically differenced Jacobian and a backtracking line search. The oracle
        solved it by sweeping node by node and bisecting each node own mass balance, with no
        Jacobian and no linear algebra at all. That is evidence about the PHYSICS rather than about
        the code, which is the only kind of agreement worth anything.
      </div>
      <Verdict v={data.summary} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'trunk conductance, lb/d per root psi', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'header 2, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="q" orientation="right" tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="p" type="monotone" dataKey="header2Psia" name="header 2, psia" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="q" type="monotone" dataKey="totalLbD" name="total produced, lb/d" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">trunk conductance</th>
              <th className="text-left pr-3">header 2, psia</th>
              <th className="text-left pr-3">W-1, lb/d</th>
              <th className="text-left pr-3">W-2, lb/d</th>
              <th className="text-left pr-3">W-3, lb/d</th>
              <th className="text-left pr-3">total, lb/d</th>
              <th className="text-left">the published case</th>
            </tr>
          </thead>
          <tbody>
            {data.trunk.map((r) => (
              <tr key={r.trunkConductanceLbDPerRootPsi}>
                <td className="pr-3">{fmt(r.trunkConductanceLbDPerRootPsi, 0)}</td>
                <td className="pr-3">{fmt(r.header2Psia, 6)}</td>
                <td className="pr-3">{fmt(r.w1LbD, 6)}</td>
                <td className="pr-3">{fmt(r.w2LbD, 6)}</td>
                <td className="pr-3">{fmt(r.w3LbD, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.totalLbD, 6)}</td>
                <td>{yn(r.published)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Every row but one is a SWEEP POINT on published inputs, and a sweep point is not a published
        case. Opening the trunk lowers the second header and every well makes more, but not by the
        same amount: the well furthest from the trunk moves least, because most of what holds it
        back is its own flowline.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Solve = () => {
  const data = useMemo(() => {
    try {
      return {
        conditions: networkExplorer.conditions(),
        topology: networkExplorer.topology(),
        solve: networkExplorer.solve(),
        nodes: networkExplorer.nodeRows(),
        branches: networkExplorer.branchRows(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A whole system needs a valid topology first. Every node has to reach a delivery point or its pressure is not determined by anything.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Separator" value={fmt(data.conditions.separatorPsia, 0)} unit="psia" />
        <Tile label="Wells" value={fmt(data.conditions.wells.length, 0)} />
        <Tile label="Trunk carries" value={fmt(data.solve.trunkLbD, 6)} unit="lb/d" />
        <Tile label="Wells report making" value={fmt(data.solve.totalWellRatesLbD, 6)} unit="lb/d" />
      </TileGrid>
      <Verdict v={data.solve} />
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">node</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">well rate, lb/d</th>
              <th className="text-left pr-3">its own imbalance, lb/d</th>
              <th className="text-left">its pressure is</th>
            </tr>
          </thead>
          <tbody>
            {data.nodes.map((n) => (
              <tr key={n.id}>
                <td className="pr-3">{n.id} ({n.label})</td>
                <td className="pr-3">{n.kind}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(n.pressurePsia, 9)}</td>
                <td className="pr-3">{n.wellRateLbD === null ? '' : fmt(n.wellRateLbD, 6)}</td>
                <td className="pr-3">{n.imbalanceLbD === null ? '' : tiny(n.imbalanceLbD)}</td>
                <td className={n.pressureIsDetermined ? '' : 'text-[#f97316]'}>
                  {n.pressureIsDetermined ? 'determined' : 'the last iterate, and pinned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">drawn</th>
              <th className="text-left pr-3">signed flow, lb/d</th>
              <th className="text-left pr-3">it actually runs</th>
              <th className="text-left pr-3">drop in the drawn sense, psi</th>
              <th className="text-left">at its capacity</th>
            </tr>
          </thead>
          <tbody>
            {data.branches.map((b) => (
              <tr key={b.id}>
                <td className="pr-3">{b.id} ({b.label})</td>
                <td className="pr-3">{b.drawnFrom} to {b.drawnTo}</td>
                <td className={b.runsAsDrawn ? 'pr-3 text-[#BFFF00]' : 'pr-3 text-[#f97316]'}>{fmt(b.signedFlowLbD, 6)}</td>
                <td className="pr-3">{b.solvedFrom} to {b.solvedTo}</td>
                <td className="pr-3">{fmt(b.dpDrawnSensePsi, 6)}</td>
                <td>{yn(b.atItsCapacity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        EVERY UNKNOWN NODE IS AT ZERO IMBALANCE EXCEPT ONE, AND THE ONE THAT IS NOT IS THE ONE THE
        REPORTED RESIDUAL CANNOT SEE. The engine reports converged with a residual of
        {' '}{tiny(data.solve.reportedResidualLbD)} lb/d, and an audit of the same answer says the
        wells put in {fmt(data.solve.producedLbD, 6)} lb/d while the delivery point took out
        {' '}{fmt(data.solve.deliveredLbD, 6)} lb/d, a gap of
        {' '}{fmt(data.solve.conservationGapLbD, 6)} lb/d. The worst imbalance over ALL the unknown
        nodes is {fmt(data.solve.worstImbalanceAllUnknownsLbD, 6)} lb/d and the worst over the
        UNPINNED ones, which is what the engine reports, is
        {' '}{tiny(data.solve.worstImbalanceUnpinnedLbD)} lb/d. That is the whole finding, and it is
        the Expert tier.
      </div>
      <Note>
        WHAT NO SINGLE-WELL METHOD COULD HAVE PRODUCED: every pressure on that first table. The
        header pressure is whatever the trunk needs to carry the total, and the total is the sum of
        what the wells make at that header pressure. The wells set the pressure that holds the wells
        back, and a single-well study is run against a wellhead pressure somebody typed in.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Loop = () => {
  const [which, setWhich] = useState('published');
  const data = useMemo(() => {
    try {
      return {
        looped: networkExplorer.loopedSplit(),
        split: networkExplorer.loopSplitRows(),
        direction: networkExplorer.direction(),
        crosslink: networkExplorer.crosslinkSweepRows(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A loop is what makes a network a network, and it needs two paths from one node to the delivery point before there is a split to decide.</Note>;
  }
  const chart = which === 'published'
    ? data.split.map((r) => ({ x: r.midpointLegConductanceLbDPerRootPsi, sharePct: r.midpointSharePct, totalLbD: r.totalDeliveredLbD }))
    : data.crosslink.map((r) => ({ x: r.crosslinkConductanceLbDPerRootPsi, sharePct: r.crosslinkLbD, totalLbD: r.trunkLbD }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Case" value={which} onChange={setWhich}
          options={[
            ['published', 'The published loop, and the leg conductance walked'],
            ['crosslink', 'The crosslink that runs backwards, and its conductance walked'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Direct leg" value={fmt(data.looped.directLegLbD, 6)} unit="lb/d" />
          <Tile label="Midpoint leg" value={fmt(data.looped.midpointLegLbD, 6)} unit="lb/d" />
          <Tile label="Midpoint share" value={fmt(data.looped.midpointSharePct, 6)} unit="percent" />
          <Tile label="Neither leg is dead" value={yn(data.looped.neitherLegIsDead)} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'conductance, lb/d per root psi', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="a" tick={AXIS} domain={['auto', 'auto']} />
            <YAxis yAxisId="b" orientation="right" tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="a" type="monotone" dataKey="sharePct"
              name={which === 'published' ? 'midpoint share, percent' : 'crosslink flow, lb/d'}
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="b" type="monotone" dataKey="totalLbD"
              name={which === 'published' ? 'total delivered, lb/d' : 'trunk, lb/d'}
              stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {which === 'published' ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">midpoint leg conductance</th>
                <th className="text-left pr-3">header, psia</th>
                <th className="text-left pr-3">midpoint, psia</th>
                <th className="text-left pr-3">direct leg, lb/d</th>
                <th className="text-left pr-3">midpoint leg, lb/d</th>
                <th className="text-left pr-3">midpoint share, percent</th>
                <th className="text-left">the published case</th>
              </tr>
            </thead>
            <tbody>
              {data.split.map((r) => (
                <tr key={r.midpointLegConductanceLbDPerRootPsi}>
                  <td className="pr-3">{fmt(r.midpointLegConductanceLbDPerRootPsi, 0)}</td>
                  <td className="pr-3">{fmt(r.headerPsia, 6)}</td>
                  <td className="pr-3">{fmt(r.midpointPsia, 6)}</td>
                  <td className="pr-3">{fmt(r.directLegLbD, 6)}</td>
                  <td className="pr-3">{fmt(r.midpointLegLbD, 6)}</td>
                  <td className="pr-3 text-[#BFFF00]">{fmt(r.midpointSharePct, 6)}</td>
                  <td>{yn(r.published)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">crosslink conductance</th>
                <th className="text-left pr-3">manifold, psia</th>
                <th className="text-left pr-3">loop tee, psia</th>
                <th className="text-left pr-3">crosslink, lb/d</th>
                <th className="text-left pr-3">drop in the drawn sense, psi</th>
                <th className="text-left pr-3">runs backwards</th>
                <th className="text-left">conservation gap, lb/d</th>
              </tr>
            </thead>
            <tbody>
              {data.crosslink.map((r) => (
                <tr key={r.crosslinkConductanceLbDPerRootPsi}>
                  <td className="pr-3">{fmt(r.crosslinkConductanceLbDPerRootPsi, 0)}</td>
                  <td className="pr-3">{fmt(r.manifoldPsia, 6)}</td>
                  <td className="pr-3">{fmt(r.loopTeePsia, 6)}</td>
                  <td className="pr-3 text-[#f97316]">{fmt(r.crosslinkLbD, 6)}</td>
                  <td className="pr-3">{fmt(r.dpDrawnSensePsi, 6)}</td>
                  <td className="pr-3">{yn(r.runsBackwards)}</td>
                  <td>{fmt(r.conservationGapLbD, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 text-xs text-slate-300">
        A DRAWN ARROW IS NOT A FLOW DIRECTION. The crosslink is drawn from {data.direction.drawnFrom}
        {' '}to {data.direction.drawnTo} and the solve returns
        {' '}{fmt(data.direction.signedFlowLbD, 6)} lb/d, so it carries
        {' '}{fmt(data.direction.magnitudeLbD, 6)} lb/d from {data.direction.itActuallyRunsFrom} into
        {' '}{data.direction.itActuallyRunsTo}. The pressure across it in the drawn sense is
        {' '}{fmt(data.direction.dpDrawnSensePsi, 6)} psi, so the drawn downstream end is the HIGHER
        of the two: {yn(data.direction.theDrawnDownstreamEndIsTheHigher)}. The loop tee is fed by
        one well through a stiff flowline and the manifold by three through slacker ones, so at the
        solution the tee sits above the manifold and the crosslink drains toward it. The drawing was
        a guess made before anybody solved anything, and `diagnose` names the branch:
        {' '}{data.direction.backflowsNamedByDiagnose.join(', ') || 'none'}.
      </div>
      <Note>
        In a tree every branch flow is fixed by the flows downstream of it. In a loop it is not: the
        split between the two paths is decided by the pressures, and the pressures are decided by
        the split. A solver that quietly assumed a tree falls over here, and no amount of walking
        one leg tells you what the other one will do, because the two legs are one decision.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Fight = () => {
  const [which, setWhich] = useState('ladder');
  const data = useMemo(() => {
    try {
      return {
        ladder: networkExplorer.ladder(),
        headline: networkExplorer.ladderHeadline(),
        separator: networkExplorer.separatorSweepRows(),
        fight: networkExplorer.fight(),
        fightHeadline: networkExplorer.fightHeadline(),
        shutIn: networkExplorer.shutIn(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>Wells cannot fight until there is more than one of them on a header, which is exactly the case a single-well study cannot construct.</Note>;
  }
  const chart = data.fight.map((r) => ({
    name: r.label, aloneLbD: r.aloneLbD, onTheSystemLbD: r.onTheSystemLbD,
  }));
  return (
    <>
      <FieldGrid>
        <SelectField label="View" value={which} onChange={setWhich}
          options={[
            ['ladder', 'The published ladder: one well, then two, then three'],
            ['system', 'The whole system, and what it costs each well'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="W-0 alone on its header" value={fmt(data.headline.w0AloneLbD, 6)} unit="lb/d" />
          <Tile label="W-0 sharing it with two others" value={fmt(data.headline.w0WithTwoCompanionsLbD, 6)} unit="lb/d" />
          <Tile label="Which is a loss of" value={fmt(data.headline.w0LostPct, 6)} unit="percent" />
          <Tile label="The header rose by" value={fmt(data.headline.headerRosePsi, 6)} unit="psi" />
        </TileGrid>
      </div>
      {which === 'ladder' ? (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">wells on the header</th>
                  <th className="text-left pr-3">the oracle header, psia</th>
                  <th className="text-left pr-3">the engine header, psia</th>
                  <th className="text-left pr-3">W-0, lb/d</th>
                  <th className="text-left pr-3">W-1, lb/d</th>
                  <th className="text-left pr-3">W-2, lb/d</th>
                  <th className="text-left">delivered, lb/d</th>
                </tr>
              </thead>
              <tbody>
                {data.ladder.map((r) => (
                  <tr key={r.count}>
                    <td className="pr-3">{fmt(r.count, 0)}</td>
                    <td className="pr-3 text-[#38bdf8]">{fmt(r.goldenHeaderPsia, 9)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.engineHeaderPsia, 9)}</td>
                    <td className="pr-3">{fmt(r.engineWellRatesLbD.w0, 6)}</td>
                    <td className="pr-3">{r.engineWellRatesLbD.w1 === undefined ? '' : fmt(r.engineWellRatesLbD.w1, 6)}</td>
                    <td className="pr-3">{r.engineWellRatesLbD.w2 === undefined ? '' : fmt(r.engineWellRatesLbD.w2, 6)}</td>
                    <td>{fmt(r.totalDeliveredLbD, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE HEADER CLIMBS AS MORE IS PUSHED THROUGH THE SAME TRUNK, and every well already on it
            makes strictly less: {yn(data.headline.everyWellAlreadyOnItMakesStrictlyLess)}. Total
            delivered rose from {fmt(data.headline.deliveredAtOneWellLbD, 6)} lb/d to
            {' '}{fmt(data.headline.deliveredAtThreeWellsLbD, 6)} lb/d, so adding two wells bought
            {' '}{fmt(data.headline.addingTwoWellsBoughtLbD, 6)} lb/d against the
            {' '}{fmt(data.headline.theirSoloRatesWouldSuggestLbD, 6)} lb/d those two wells make
            each ALONE on the same header and the same trunk. Nothing about this is subtle once it
            is written down, and that is the point: it is invisible to any amount of single-well
            analysis.
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">separator, psia</th>
                  <th className="text-left pr-3">header, psia</th>
                  <th className="text-left pr-3">total, lb/d</th>
                  <th className="text-left pr-3">W-0, lb/d</th>
                  <th className="text-left pr-3">W-1, lb/d</th>
                  <th className="text-left pr-3">W-2, lb/d</th>
                  <th className="text-left">the published case</th>
                </tr>
              </thead>
              <tbody>
                {data.separator.map((r) => (
                  <tr key={r.separatorPsia}>
                    <td className="pr-3">{fmt(r.separatorPsia, 0)}</td>
                    <td className="pr-3">{fmt(r.headerPsia, 6)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.totalLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.w0LbD, 6)}</td>
                    <td className="pr-3">{fmt(r.w1LbD, 6)}</td>
                    <td className="pr-3">{fmt(r.w2LbD, 6)}</td>
                    <td>{yn(r.published)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>
            Backing the boundary off is the one lever that helps every well at once, and it is the
            lever a single-well study cannot price, because the boundary is the thing it was told.
          </Note>
        </>
      ) : (
        <>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
                {GRID}
                <XAxis dataKey="name" tick={AXIS} interval={0} angle={-12} textAnchor="end" height={44} />
                <YAxis tick={AXIS}
                  label={{ value: 'mass rate, lb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="aloneLbD" name="alone on its own line" fill="#38bdf8" isAnimationActive={false} />
                <Bar dataKey="onTheSystemLbD" name="on the system" fill="#BFFF00" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">well</th>
                  <th className="text-left pr-3">alone, lb/d</th>
                  <th className="text-left pr-3">on the system, lb/d</th>
                  <th className="text-left pr-3">lost, lb/d</th>
                  <th className="text-left pr-3">lost, percent</th>
                  <th className="text-left">its wellhead rose, psi</th>
                </tr>
              </thead>
              <tbody>
                {data.fight.map((r) => (
                  <tr key={r.id}>
                    <td className="pr-3">{r.label}</td>
                    <td className="pr-3">{fmt(r.aloneLbD, 6)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.onTheSystemLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.lostLbD, 6)}</td>
                    <td className="pr-3 text-[#f97316]">{fmt(r.lostPct, 6)}</td>
                    <td>{fmt(r.wellheadRosePsi, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            THE WEAK WELL LOSES MOST, AND THE TWO RANKINGS ARE NOT THE SAME RANKING. By percentage
            lost: {data.fightHeadline.rankedByPercentageLost.map((r) => `${r.label} at ${fmt(r.lostPct, 4)}`).join(', ')} percent.
            By rate on the system:
            {' '}{data.fightHeadline.rankedByRateOnTheSystem.map((r) => `${r.label} at ${fmt(r.rateLbD, 4)}`).join(', ')} lb/d.
            A well with a low reservoir pressure has the least margin over the header, so a header
            that rises takes a larger share of what it had. The four solo rates add to
            {' '}{fmt(data.fightHeadline.soloRatesAddToLbD, 6)} lb/d and the system produces
            {' '}{fmt(data.fightHeadline.theSystemProducesLbD, 6)} lb/d, so the network costs
            {' '}{fmt(data.fightHeadline.theNetworkCostsLbD, 6)} lb/d, which is
            {' '}{fmt(data.fightHeadline.theNetworkCostsPct, 6)} percent. Neither column can be got
            at from the other by any single-well method.
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">shut in</th>
                  <th className="text-left pr-3">the rest make, lb/d</th>
                  <th className="text-left pr-3">the survivors gained, lb/d</th>
                  <th className="text-left pr-3">it was reported making, lb/d</th>
                  <th className="text-left pr-3">its line delivered, lb/d</th>
                  <th className="text-left pr-3">deferment from the reported rate</th>
                  <th className="text-left">deferment from the delivered flow</th>
                </tr>
              </thead>
              <tbody>
                {data.shutIn.map((r) => (
                  <tr key={r.shutIn}>
                    <td className="pr-3">{r.label}</td>
                    <td className="pr-3">{fmt(r.totalFromTheRestLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.survivorsGainedLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.reportedRateLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.itsFlowlineDeliveredLbD, 6)}</td>
                    <td className="pr-3 text-[#f97316]">{fmt(r.defermentFromReportedRateLbD, 6)}</td>
                    <td className="text-[#BFFF00]">{fmt(r.defermentFromDeliveredFlowLbD, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>
            THE SURVIVORS GAIN IS NOT THE RATE THE SHUT WELL WAS MAKING, and reading it as though it
            were is the standard way a deferment number is overstated. And the last two columns are
            two different questions on the one row where they differ: a deferment measured from a
            REPORTED rate carries whatever hole the solve left, and a deferment measured from what
            the flowline actually DELIVERED does not.
          </Note>
        </>
      )}
    </>
  );
};

// --------------------------------------------------------------------------

const Streams = () => {
  const data = useMemo(() => {
    try {
      return {
        published: networkExplorer.publishedStreams(),
        split: networkExplorer.publishedStreamSplit(),
        refusal: networkExplorer.publishedStreamRefusal(),
        rows: networkExplorer.streamRows(),
        headline: networkExplorer.streamHeadline(),
        solve: networkExplorer.solve(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A stream propagation needs solved flow directions, because a branch carrying nothing has no direction and is skipped rather than guessed at.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Oil arriving" value={fmt(data.headline.arrivingOilStbd, 6)} unit="stb/d" />
        <Tile label="Water arriving" value={fmt(data.headline.arrivingWaterStbd, 6)} unit="stb/d" />
        <Tile label="Gas arriving" value={fmt(data.headline.arrivingGasMscfd, 6)} unit="Mscf/d" />
        <Tile label="Arriving water cut" value={fmt(data.headline.trunkWaterCutPct, 6)} unit="percent" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">oil, stb/d</th>
              <th className="text-left pr-3">water, stb/d</th>
              <th className="text-left pr-3">gas, Mscf/d</th>
              <th className="text-left pr-3">mass, lb/d</th>
              <th className="text-left">water cut, percent</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.oilStbd, 6)}</td>
                <td className="pr-3">{fmt(r.waterStbd, 6)}</td>
                <td className="pr-3">{fmt(r.gasMscfd, 6)}</td>
                <td className="pr-3">{fmt(r.massLbD, 6)}</td>
                <td>{fmt(r.waterCutPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        COMPONENT RATES ADD AND RATIOS NEVER DO. That is the entire algorithm and it is exact: a
        header carrying a dry well and a wet one carries the sum of both, and its water cut is a
        consequence rather than an input. On the published fixture the trunk cut is
        {' '}{fmt(data.published.trunkWaterCutPct, 6)} percent while the plain average of the two
        well cuts is {fmt(data.published.plainAverageOfTheCutsPct, 6)} percent, wrong by
        {' '}{fmt(data.published.averagingIsWrongByPoints, 6)} points and a factor of
        {' '}{fmt(data.published.averagingIsWrongByFactor, 6)} on the number a facility would be
        sized against. On this system the arriving cut is
        {' '}{fmt(data.headline.trunkWaterCutPct, 6)} percent and the plain average of the four well
        cuts is {fmt(data.headline.plainAverageOfTheCutsPct, 6)} percent, wrong by
        {' '}{fmt(data.headline.averagingIsWrongByPoints, 6)} points. The average over weights the
        wettest well, because an average has no idea which well is big.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left">its own water cut, percent</th>
            </tr>
          </thead>
          <tbody>
            {data.headline.wellWaterCuts.map((c) => (
              <tr key={c.id}>
                <td className="pr-3">{c.label}</td>
                <td className="text-[#BFFF00]">{fmt(c.waterCutPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A NODE WITH MORE THAN ONE WAY OUT SPLITS ITS STREAM BY MASS, which is the only split that
        conserves anything. On the published fixture a well of
        {' '}{fmt(data.split.arrivingOilStbd, 0)} stb/d oil on
        {' '}{fmt(data.split.legXMassLbD + data.split.legYMassLbD, 0)} lb/d splitting
        {' '}{fmt(data.split.legXMassLbD, 0)} and {fmt(data.split.legYMassLbD, 0)} lb/d puts
        {' '}{fmt(data.split.legXOilStbd, 6)} and {fmt(data.split.legYOilStbd, 6)} stb/d down the
        two legs, and they add back to {fmt(data.split.sumOfTheTwoLegsOilStbd, 6)}.
      </div>
      <Note>
        AND THE SEPARATOR IS TOLD IT RECEIVES ALL OF IT. The four wells were tested at
        {' '}{fmt(data.headline.testedOilStbd, 0)} stb/d oil, {fmt(data.headline.testedWaterStbd, 0)}
        {' '}stb/d water and {fmt(data.headline.testedGasMscfd, 0)} Mscf/d gas between them, and the
        arriving stream carries every bit of it, on a trunk the solve says passes
        {' '}{fmt(data.solve.trunkLbD, 6)} lb/d against a stream mass of
        {' '}{fmt(data.headline.arrivingMassLbD, 6)} lb/d. A recirculating set of directions is
        reported rather than iterated on: {data.refusal.error || ''}
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Diagnosis = () => {
  const data = useMemo(() => {
    try {
      return {
        published: networkExplorer.publishedDiagnoseCases(),
        rows: networkExplorer.diagnoseRows(),
        headline: networkExplorer.diagnoseHeadline(),
        population: networkExplorer.populationFixture(),
        whisper: networkExplorer.whisperLegRows(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A diagnosis reads a solved answer. It ranks, it names and it decides nothing, and with no solve there is nothing to rank.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Biggest drop" value={`${data.headline.biggestDropId} (${data.headline.biggestDropLabel})`} />
        <Tile label="Its drop" value={fmt(data.headline.biggestDropDpPsi, 6)} unit="psi" />
        <Tile label="Bottleneck" value={`${data.headline.bottleneckId} (${data.headline.bottleneckLabel})`} />
        <Tile label="Its intensity" value={tiny(data.headline.bottleneckIntensityPsiPerLbD)} unit="psi per lb/d" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">drop, psi</th>
              <th className="text-left pr-3">mass, lb/d</th>
              <th className="text-left pr-3">intensity, psi per lb/d</th>
              <th className="text-left pr-3">backflow</th>
              <th className="text-left">in the bottleneck population</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3">{fmt(r.dpPsi, 6)}</td>
                <td className="pr-3">{fmt(r.massLbD, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{tiny(r.intensityPsiPerLbD)}</td>
                <td className="pr-3">{yn(r.backflow)}</td>
                <td>{yn(r.carryingMass)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE BOTTLENECK IS NOT THE BIGGEST DROP. A trunk line carrying everything is SUPPOSED to have
        the biggest drop and pointing at it every time would be useless, so the bottleneck is the
        branch eating the most pressure per unit of what it carries. Here the biggest drop is
        {' '}{data.headline.biggestDropId} at {fmt(data.headline.biggestDropDpPsi, 6)} psi carrying
        {' '}{fmt(data.headline.biggestDropMassLbD, 6)} lb/d, and the bottleneck is
        {' '}{data.headline.bottleneckId} at {fmt(data.headline.bottleneckDpPsi, 6)} psi carrying
        {' '}{fmt(data.headline.bottleneckMassLbD, 6)} lb/d. BOTH RANKINGS ARE ON MAGNITUDE, so a
        branch running backwards is ranked on the SIZE of its drop and its mass and not on their
        sign. WHAT DIFFERS IS THE POPULATION: the biggest drop ranks over
        {' '}{fmt(data.headline.biggestDropPopulation, 0)} branches, every branch there is, while
        the bottleneck ranks over the {fmt(data.headline.bottleneckPopulation, 0)} carrying more
        than {tiny(data.headline.deadBranchThresholdLbD)} lb/d.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published fixture</th>
              <th className="text-left pr-3">biggest drop</th>
              <th className="text-left pr-3">bottleneck</th>
              <th className="text-left">the same branch</th>
            </tr>
          </thead>
          <tbody>
            {data.published.map((c) => (
              <tr key={c.caseName}>
                <td className="pr-3">{c.caseName}</td>
                <td className="pr-3">{c.biggestDropId}</td>
                <td className="pr-3 text-[#BFFF00]">{c.bottleneckId}</td>
                <td>{yn(c.theyAreTheSameBranch)}</td>
              </tr>
            ))}
            <tr>
              <td className="pr-3">a dead leg with a big drop across it</td>
              <td className="pr-3 text-[#f97316]">{data.population.biggestDropId}</td>
              <td className="pr-3 text-[#BFFF00]">{data.population.bottleneckId}</td>
              <td>{yn(data.population.biggestDropId === data.population.bottleneckId)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        SO A DEAD LEG CAN BE THE REPORTED BIGGEST DROP AND CAN NEVER BE THE BOTTLENECK. On the
        fixture above it ranks over {fmt(data.population.biggestDropPopulation, 0)} branches for the
        drop and over {fmt(data.population.bottleneckPopulation, 0)} for the bottleneck, because a
        branch carrying nothing scores an infinite intensity and is dropped out of the ranking
        rather than winning it: {yn(data.population.deadLegIntensityIsInfinite)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">a leg carrying, lb/d</th>
              <th className="text-left pr-3">its intensity</th>
              <th className="text-left pr-3">the bottleneck</th>
              <th className="text-left">the biggest drop</th>
            </tr>
          </thead>
          <tbody>
            {data.whisper.map((r) => (
              <tr key={r.whisperMassLbD}>
                <td className="pr-3">{tiny(r.whisperMassLbD)}</td>
                <td className="pr-3">{tiny(r.whisperIntensityPsiPerLbD)}</td>
                <td className="pr-3 text-[#f97316]">{r.bottleneckId}</td>
                <td>{r.biggestDropId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE RANKING FAILS OPEN JUST ABOVE THE GUARD. The intensity is the drop over the mass with
        only a floor at a billionth of a pound a day, so a leg carrying a millionth of a pound a day
        with one psi across it scores a million and wins every time, and it is the one leg nothing
        can be done about. On every real case here the ranking behaves exactly as its header says,
        which is why this is a note rather than a defect. A relative floor, one part in ten thousand
        of the largest branch mass, would close it. And a diagnosis DECIDES nothing: it ranks, it
        names the backflows and the dead legs, and it cannot tell you what a change would cost.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const NetworkExplorer = ({ initialMode = 'solve' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Network explorer"
      subtitle="A whole gathering system solved at once: the one case with a closed form, a tree of turbulent branches against an independent method, the loop and the split it decides, wells fighting each other for a header, the streams that add by rate, and the reading that ranks but decides nothing"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'linear' && <Linear />}
        {mode === 'tree' && <Tree />}
        {mode === 'solve' && <Solve />}
        {mode === 'loop' && <Loop />}
        {mode === 'fight' && <Fight />}
        {mode === 'streams' && <Streams />}
        {mode === 'diagnosis' && <Diagnosis />}
      </div>
    </PanelShell>
  );
};

export default NetworkExplorer;
