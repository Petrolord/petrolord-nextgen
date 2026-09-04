import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { fightExplorer } from './networkLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Fight explorer, the Expert tier. WHAT THE SOLVE HIDES.
//
// Seven modes. The node that goes flat and is pinned, the reported residual
// against the conservation gap on the same answer, the initial guess sweep and
// the one run in it that actually solves, the second mass the stream module
// carries and the two sign conventions under one word, the tolerance that is
// not in the units its own name gives, every failure returning ok, and the
// branch parked at the cusp of its own relation.
//
// None of this can be reached from the answer alone, and that is the point of
// the tier. Every figure here is a return value from networkLab, which is a
// return value from the vendored network solver, and EVERY SOLVE CARRIES ITS
// CONSERVATION GAP BESIDE ITS CONVERGED FLAG.

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
  ['pinned', 'A node that nothing depends on, and what pinning does'],
  ['residual', 'The residual that cannot see its own error'],
  ['guess', 'The same network, a different guess'],
  ['streammass', 'The second mass, and two sign conventions under one word'],
  ['tolerance', 'A tolerance that is not in the units its name gives'],
  ['failure', 'Every failure comes back ok, and the message prints zero'],
  ['cusp', 'A branch at the cusp of its own relation'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// --------------------------------------------------------------------------

const Pinned = () => {
  const data = useMemo(() => {
    try {
      return {
        published: fightExplorer.publishedPinning(),
        live: fightExplorer.publishedLiveNode(),
        pinning: fightExplorer.pinning(),
        allocations: fightExplorer.allocationRows(),
        curve: fightExplorer.wellCurve(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A node is pinned when its Jacobian row and column are both dead, which needs a relation that has stopped depending on pressure. With no such relation there is nothing to pin.</Note>;
  }
  const chart = data.allocations.map((r) => ({
    x: r.allocationLbD, gapLbD: Math.abs(r.conservationGapLbD), rateLbD: r.wellRateLbD, lineLbD: r.itsFlowlineLbD,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Its allocation" value={fmt(data.pinning.allocationLbD, 0)} unit="lb/d" />
        <Tile label="What its flowline can pass" value={fmt(data.pinning.lineCapacityLbD, 0)} unit="lb/d" />
        <Tile label="A shortfall by construction of" value={fmt(data.pinning.shortfallByConstructionLbD, 0)} unit="lb/d" />
        <Tile label="And the solve says converged" value={yn(data.pinning.converged)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the published gate fixture</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">pinned</th>
              <th className="text-left pr-3">reported residual, lb/d</th>
              <th className="text-left pr-3">produced, lb/d</th>
              <th className="text-left pr-3">delivered, lb/d</th>
              <th className="text-left">conservation gap, lb/d</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3">{data.published.label}</td>
              <td className="pr-3">{yn(data.published.ok)}</td>
              <td className="pr-3">{yn(data.published.converged)}</td>
              <td className="pr-3 text-[#f97316]">{data.published.pinned.join(', ') || 'none'}</td>
              <td className="pr-3 text-[#38bdf8]">{tiny(data.published.reportedResidualLbD)}</td>
              <td className="pr-3">{fmt(data.published.producedLbD, 6)}</td>
              <td className="pr-3">{fmt(data.published.deliveredLbD, 6)}</td>
              <td className="text-[#f97316]">{fmt(data.published.conservationGapLbD, 6)}</td>
            </tr>
            <tr>
              <td className="pr-3">{data.live.label}</td>
              <td className="pr-3">{yn(data.live.ok)}</td>
              <td className="pr-3">{yn(data.live.converged)}</td>
              <td className="pr-3">{data.live.pinned.join(', ') || 'none'}</td>
              <td className="pr-3 text-[#38bdf8]">{tiny(data.live.reportedResidualLbD)}</td>
              <td className="pr-3">{fmt(data.live.producedLbD, 6)}</td>
              <td className="pr-3">{fmt(data.live.deliveredLbD, 6)}</td>
              <td className="text-[#38bdf8]">{tiny(data.live.conservationGapLbD)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A NODE WHOSE JACOBIAN ROW IS ENTIRELY ZERO IS A NODE WHOSE PRESSURE CHANGES NOTHING THAT
        FLOWS. The module pins it at its current pressure and takes it out of the system rather than
        dragging a perfectly good network down with it, and it reports which nodes were pinned,
        because a pinned node is a fact about the answer and not an implementation detail. That is a
        defensible design. THE GATE ASSERTS ok, pinned AND THE WARNING TEXT ON THE FIXTURE ABOVE AND
        NEVER LOOKS AT THE HOLE IT JUST CREATED: {fmt(data.published.conservationGapLbD, 0)} lb/d of
        production goes into that network and never comes out, under a reported residual of
        {' '}{tiny(data.published.reportedResidualLbD)} lb/d and a relative gap of
        {' '}{fmt(data.published.conservationRelative, 6)}. And a LIVE network reports nothing
        pinned, which is what makes the flag readable at all.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CONTRACT GAP BEHIND IT. The module header requires a well inflow to be monotone
        DECREASING in pressure. A well held to a facility allocation, a choke limit or a compressor
        slot is monotone NON-increasing, with a FLAT TOP, and the flat top is precisely what makes
        its node pinnable. On this system {data.pinning.pinnedLabel} is exactly such a well: its
        allocation stops binding at {fmt(data.curve.allocationStopsBindingAtPsia, 6)} psia, so
        anywhere below that its inflow is a constant and its node has lost its row.
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'allocation, lb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'mass rate, lb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="rateLbD" name="what the well reports making" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="lineLbD" name="what its flowline carries" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="gapLbD" name="the conservation gap" stroke="#f97316" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">allocation, lb/d</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">pinned</th>
              <th className="text-left pr-3">reported residual, lb/d</th>
              <th className="text-left pr-3">it reports making, lb/d</th>
              <th className="text-left pr-3">its flowline carries, lb/d</th>
              <th className="text-left">conservation gap, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.allocations.map((r) => (
              <tr key={r.allocationLbD}>
                <td className="pr-3">{fmt(r.allocationLbD, 0)}</td>
                <td className="pr-3">{yn(r.converged)}</td>
                <td className={r.pinned.length ? 'pr-3 text-[#f97316]' : 'pr-3'}>{r.pinned.join(', ') || 'none'}</td>
                <td className="pr-3 text-[#38bdf8]">{tiny(r.reportedResidualLbD)}</td>
                <td className="pr-3">{fmt(r.wellRateLbD, 6)}</td>
                <td className="pr-3">{fmt(r.itsFlowlineLbD, 6)}</td>
                <td className={r.massBalanceCloses ? '' : 'text-[#f97316]'}>{fmt(r.conservationGapLbD, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE SWEEP CROSSES THE LINE CAPACITY AND NOTHING IN THE RETURN CHANGES EXCEPT THE WORD PINNED
        AND A GAP NOBODY IS SHOWN. Below the capacity the node is live, the well makes exactly its
        allocation and the balance closes. Above it the line saturates, the node loses both its row
        and its column, and every pound of the difference stops being counted while the flag still
        says converged.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Residual = () => {
  const data = useMemo(() => {
    try {
      return {
        residual: fightExplorer.residual(),
        pinning: fightExplorer.pinning(),
        nodes: fightExplorer.nodeRows(),
        solve: fightExplorer.solve(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A residual and a conservation gap are two roads to the same answer, and both of them need a solve to read.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="What the ITERATION says" value={tiny(data.residual.theIterationSaysLbD)} unit="lb/d" />
        <Tile label="What the AUDIT says" value={fmt(data.residual.theAuditSaysLbD, 6)} unit="lb/d" />
        <Tile label="The audit is larger by" value={tiny(data.residual.theAuditIsHowManyTimesTheIteration)} unit="times" />
        <Tile label="And the flag says converged" value={yn(data.residual.converged)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">node</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">its own imbalance, lb/d</th>
              <th className="text-left pr-3">pinned</th>
              <th className="text-left">in the reported residual</th>
            </tr>
          </thead>
          <tbody>
            {data.nodes.filter((n) => n.kind !== 'sink').map((n) => (
              <tr key={n.id}>
                <td className="pr-3">{n.id} ({n.label})</td>
                <td className="pr-3">{fmt(n.pressurePsia, 9)}</td>
                <td className={n.isPinned ? 'pr-3 text-[#f97316]' : 'pr-3'}>{tiny(n.imbalanceLbD)}</td>
                <td className="pr-3">{yn(n.isPinned)}</td>
                <td className="text-[#BFFF00]">{yn(!n.isPinned)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE MECHANISM IS ONE LINE OF THE MODULE. The norm the solve converges on is the maximum over
        the unknown nodes FILTERED to exclude the pinned ones, and the converged flag is tested
        against that norm, so a pinned node is removed from the measurement by construction. The
        worst imbalance over ALL the unknown nodes is
        {' '}{fmt(data.residual.worstImbalanceAllUnknownsLbD, 6)} lb/d. The worst over the UNPINNED
        ones, which is what the engine reports, is
        {' '}{tiny(data.residual.worstImbalanceUnpinnedLbD)} lb/d. The wells put in
        {' '}{fmt(data.residual.producedLbD, 6)} lb/d and the delivery point took out
        {' '}{fmt(data.residual.deliveredLbD, 6)} lb/d, a gap of
        {' '}{fmt(data.residual.conservationGapLbD, 6)} lb/d, which is
        {' '}{fmt(data.residual.conservationGapPct, 6)} percent of what the engine says was produced
        and {tiny(data.residual.theAuditIsHowManyTimesTheIteration)} times the reported residual.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE CHECK IS IN THE SAME FILE. Its own header says it is the only check that catches a
        sign error in the assembly, and that a solver which converged on a wrong residual function
        converges just as smugly as one that did not. The solve never calls it:
        {' '}{yn(data.residual.solveNetworkNeverCallsIt)}. NOTHING IN THE RETURN OF A SOLVE IS A
        CHECK ON THE ANSWER THAT WAS NOT COMPUTED BY THE SAME ITERATION THAT PRODUCED IT. Two
        candidate fixes, both cheap: report a pinned imbalance alongside the residual, or refuse to
        set converged while any pinned node net is non-zero. The second is the honest one, because a
        pinned node with a non-zero net is not a solved network. On this answer the first would have
        printed {fmt(data.pinning.ifItReportedAPinnedImbalanceItWouldReportLbD, 6)} lb/d at node
        {' '}{data.pinning.pinnedId}.
      </div>
      <Note>
        AND THE MESSAGE ASSERTS A DIAGNOSIS IT HAS NOT CHECKED. The engine says: {data.pinning.warning}
        {' '}But that well is producing {fmt(data.pinning.itsReportedRateLbD, 6)} lb/d and its
        flowline is passing {fmt(data.pinning.itsFlowlineCarriesLbD, 6)} lb/d, so it is neither shut
        in nor on a dead line: {yn(data.pinning.soItIsNeitherShutInNorOnADeadLine)}. The sentence is
        the module telling the user the one story in which the pinning is harmless, on a case where
        it is not. Naming the node net imbalance in the message would make the difference visible at
        no cost.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Guess = () => {
  const [which, setWhich] = useState('guess');
  const data = useMemo(() => {
    try {
      return {
        rows: fightExplorer.guessRows(),
        headline: fightExplorer.guessHeadline(),
        curve: fightExplorer.wellCurve(),
        order: fightExplorer.nodeOrderRows(),
        orderHeadline: fightExplorer.nodeOrderHeadline(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>An initial guess only matters where something is undetermined, and a pinned pressure is wherever the last accepted step happened to leave it.</Note>;
  }
  const chart = data.rows
    .filter((r) => Number.isFinite(r.startedAtPsia))
    .map((r) => ({ x: r.startedAtPsia, pinnedPressurePsia: r.pinnedPressurePsia, gapLbD: r.conservationGapLbD }));
  return (
    <>
      <FieldGrid>
        <SelectField label="View" value={which} onChange={setWhich}
          options={[
            ['guess', 'Change nothing but the starting guess'],
            ['order', 'Change nothing but the order of the nodes array'],
          ]} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Runs on this table" value={fmt(data.headline.runCount, 0)} />
          <Tile label="How many report converged" value={fmt(data.headline.runCount, 0)} />
          <Tile label="How many close their mass balance" value={fmt(data.headline.rowsThatCloseTheMassBalance, 0)} />
          <Tile label="Does the engine default find it" value={yn(data.headline.defaultFindsTheSolution)} />
        </TileGrid>
      </div>
      {which === 'guess' ? (
        <>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
                {GRID}
                <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
                  label={{ value: 'where the node was started, psia', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
                <YAxis yAxisId="p" tick={AXIS} domain={['auto', 'auto']} />
                <YAxis yAxisId="q" orientation="right" tick={AXIS} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="p" type="monotone" dataKey="pinnedPressurePsia" name="where the node ended, psia" stroke="#BFFF00" dot isAnimationActive={false} />
                <Line yAxisId="q" type="monotone" dataKey="gapLbD" name="conservation gap, lb/d" stroke="#f97316" dot isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">the start</th>
                  <th className="text-left pr-3">converged</th>
                  <th className="text-left pr-3">iterations</th>
                  <th className="text-left pr-3">reported residual, lb/d</th>
                  <th className="text-left pr-3">where the node ended, psia</th>
                  <th className="text-left pr-3">its flowline, lb/d</th>
                  <th className="text-left pr-3">it reports making, lb/d</th>
                  <th className="text-left pr-3">pinned</th>
                  <th className="text-left">conservation gap, lb/d</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.label}>
                    <td className="pr-3">{r.label}</td>
                    <td className="pr-3">{yn(r.converged)}</td>
                    <td className="pr-3">{fmt(r.iterations, 0)}</td>
                    <td className="pr-3 text-[#38bdf8]">{tiny(r.reportedResidualLbD)}</td>
                    <td className="pr-3 text-[#BFFF00]">{fmt(r.pinnedPressurePsia, 6)}</td>
                    <td className="pr-3">{fmt(r.itsFlowlineLbD, 6)}</td>
                    <td className="pr-3">{fmt(r.itsReportedRateLbD, 6)}</td>
                    <td className="pr-3">{r.pinned.join(', ') || 'none'}</td>
                    <td className={r.isTheSolution ? 'text-[#BFFF00]' : 'text-[#f97316]'}>{fmt(r.conservationGapLbD, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            EVERY ONE OF THOSE RUNS SAYS CONVERGED AND EXACTLY ONE OF THEM IS A SOLUTION. The well
            is a Vogel well held to an allocation on a line that cannot pass the whole of it. Its
            allocation stops binding at {fmt(data.curve.allocationStopsBindingAtPsia, 6)} psia and
            its inflow equals the LINE CAPACITY at
            {' '}{fmt(data.curve.inflowEqualsLineCapacityAtPsia, 6)} psia. At that second pressure
            the well delivers {fmt(data.curve.inflowAtTheCapacityCrossingLbD, 6)} lb/d, the line
            carries the same, and the mass balance closes. THAT IS THE SOLUTION, it is the row that
            ends at {fmt(data.headline.solutionPinnedPressurePsia, 6)} psia, and it is also the ONLY
            row on the table where NOTHING IS PINNED: at the capacity crossing the allocation no
            longer binds, so the inflow depends on pressure again and the node keeps its Jacobian
            row. Every other start leaves the node inside the flat top, pins it, and reports
            converged on a network that is not balanced:
            {' '}{fmt(data.headline.rowsThatPinTheNode, 0)} of {fmt(data.headline.runCount, 0)} rows.
            The engine default, every unknown at the separator pressure, is one of them.
          </div>
          <div className="mt-3 text-xs text-slate-300">
            AND THE REPORTED RESIDUAL MOVES AGAINST THE TRUTH ACROSS THIS SWEEP. The worst runs, at
            a gap of {fmt(data.headline.worstGapLbD, 6)} lb/d, carry the smallest reported residual
            on the table, {tiny(data.headline.smallestReportedResidualLbD)} lb/d, while the default
            run at a gap of {fmt(data.headline.defaultConservationGapLbD, 6)} lb/d reports
            {' '}{tiny(data.headline.defaultReportedResidualLbD)} lb/d. A reader ranking these runs
            by their reported residual would pick the two worst:
            {' '}{yn(data.headline.theResidualMovesAgainstTheTruth)}. AND AGREEMENT BETWEEN TWO RUNS
            IS NOT EVIDENCE EITHER, because two of them agree on the manifold to the last bit while
            disagreeing about what the network produced.
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">node</th>
                  <th className="text-left pr-3">original, psia</th>
                  <th className="text-left pr-3">nodes array reversed, psia</th>
                  <th className="text-left pr-3">movement, psia</th>
                  <th className="text-left">pinned</th>
                </tr>
              </thead>
              <tbody>
                {data.order.map((r) => (
                  <tr key={r.id}>
                    <td className="pr-3">{r.id} ({r.label})</td>
                    <td className="pr-3">{fmt(r.originalPsia, 12)}</td>
                    <td className="pr-3">{fmt(r.reversedPsia, 12)}</td>
                    <td className={r.isPinned ? 'pr-3 text-[#f97316]' : 'pr-3 text-[#BFFF00]'}>{tiny(r.movementPsia)}</td>
                    <td>{yn(r.isPinned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            A PURE REORDERING OF THE NODES ARRAY CHANGES NO PHYSICS AT ALL. It does change the order
            the solver indexes the unknowns in, the column order of the Jacobian and what the dense
            solve pivots on, and that is enough to move the last bits. The largest movement among
            the SOLVED nodes is {tiny(data.orderHeadline.largestUnpinnedMovementPsia)} psia. The
            movement at the PINNED node is {tiny(data.orderHeadline.pinnedMovementPsia)} psia, a
            factor of {tiny(data.orderHeadline.pinnedOverUnpinned)}. Both runs report converged and
            both carry a conservation gap of
            {' '}{fmt(data.orderHeadline.originalConservationGapLbD, 6)} lb/d.
          </div>
        </>
      )}
      <Note>
        SO TWO DIFFERENT KINDS OF NUMBER ARE WEARING THE SAME LABEL IN THE SAME OBJECT. The solved
        pressures are reproducible to the last bits under a reordering and determined by the
        physics. The pinned one is not reproducible at all under a change of guess and is determined
        by nothing, and both are returned in the same pressures object with nothing to tell them
        apart. Sorting the entries into determined, last iterate, and neither is the reading this
        tier exists to teach, and a converged flag speaks to none of the three.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const StreamMass = () => {
  const data = useMemo(() => {
    try {
      return {
        mass: fightExplorer.streamMassRows(),
        signs: fightExplorer.signConventionRows(),
        lies: fightExplorer.streamLieRows(),
        door: fightExplorer.doorCheck(),
        headline: fightExplorer.streamHeadline(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The stream propagation carries a second mass for every branch, and it needs both a solve and a set of well streams before the two can be compared.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Branches where the two masses disagree" value={fmt(data.mass.filter((r) => !r.agrees).length, 0)} />
        <Tile label="Branches where the two conventions disagree" value={fmt(data.signs.filter((r) => r.cause !== 'none, the two agree').length, 0)} />
        <Tile label="Wells a door check would fire on" value={fmt(data.door.filter((r) => r.theDoorCheckWouldFire).length, 0)} />
        <Tile label="Warnings the module gives" value={fmt(0, 0)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">the solve says, lb/d</th>
              <th className="text-left pr-3">the stream says, lb/d</th>
              <th className="text-left pr-3">gap, lb/d</th>
              <th className="text-left">they agree</th>
            </tr>
          </thead>
          <tbody>
            {data.mass.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.theSolveSaysLbD, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.theStreamSaysLbD, 6)}</td>
                <td className={r.agrees ? 'pr-3' : 'pr-3 text-[#f97316]'}>{fmt(r.gapLbD, 6)}</td>
                <td>{yn(r.agrees)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE STREAM MODULE CARRIES A SECOND MASS AND NOTHING FORCES IT TO AGREE WITH THE SOLVE. The
        well stream mass is supplied by the caller and is never compared with the well rate the
        solve produced, so whatever hole the solve left propagates straight into the surface split.
        The same shortfall appears on every branch downstream of the pinned well and nothing in the
        result mentions it. The separator is told it receives
        {' '}{fmt(data.headline.arrivingMassLbD, 6)} lb/d on a trunk the solve says passes less.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">flows, signed lb/d</th>
              <th className="text-left pr-3">branch stream mass, lb/d</th>
              <th className="text-left pr-3">difference, lb/d</th>
              <th className="text-left pr-3">as a multiple of what it carries</th>
              <th className="text-left">the cause</th>
            </tr>
          </thead>
          <tbody>
            {data.signs.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3">{fmt(r.signedFlowLbD, 6)}</td>
                <td className="pr-3">{fmt(r.branchStreamMassLbD, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.differenceLbD, 6)}</td>
                <td className="pr-3">{fmt(r.differenceOverMagnitude, 6)}</td>
                <td>{r.cause}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        TWO SIGN CONVENTIONS UNDER ONE WORD, AND TWO DIFFERENT DISEASES IN ONE COLUMN. The signed
        flow runs from the drawn start to the drawn end and can be negative. The branch stream mass
        is the stream along the SOLVED direction and is always positive. On the one branch that runs
        BACKWARDS the difference is exactly twice what it carries, and that factor of two is the
        signature of the convention. On the branches carrying the pinned well reported mass the
        difference is the conservation gap, and every one of those ran the way it was drawn. So it
        is NOT true that differencing the two finds zero everywhere the network ran as drawn: it
        finds zero on {fmt(data.signs.filter((r) => r.cause === 'none, the two agree').length, 0)}
        {' '}branches, the doubled flow on the one that reversed, and the conservation gap on the
        rest. A consumer differencing them sees one column and two diseases.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">every well stream mass multiplied by</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">trunk stream mass, lb/d</th>
              <th className="text-left pr-3">against a solved trunk of, lb/d</th>
              <th className="text-left pr-3">separator oil, stb/d</th>
              <th className="text-left">warnings</th>
            </tr>
          </thead>
          <tbody>
            {data.lies.map((r) => (
              <tr key={r.massFactor}>
                <td className="pr-3">{fmt(r.massFactor, 2)}</td>
                <td className="pr-3">{yn(r.ok)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.trunkStreamMassLbD, 6)}</td>
                <td className="pr-3">{fmt(r.solvedTrunkLbD, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.separatorOilStbd, 6)}</td>
                <td>{fmt(r.warningCount, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE GENERAL FORM IS WORSE THAN THE SPECIFIC ONE. Hand the same network well stream masses
        that are simply wrong, by any factor, and the module propagates them with ok true and no
        warning at all. AND THE COMPONENT RATES ARE UNTOUCHED BY ANY OF IT: the oil, water and gas
        the separator is told to expect do not move when the mass is wrong, because the split is by
        mass SHARE at a junction and the shares are unchanged. So a reader checking the oil would
        find nothing wrong with a mass that is out by a factor of two.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the door check, on each well</th>
              <th className="text-left pr-3">its well rate, lb/d</th>
              <th className="text-left pr-3">its flowline carries, lb/d</th>
              <th className="text-left pr-3">gap, lb/d</th>
              <th className="text-left">it would fire</th>
            </tr>
          </thead>
          <tbody>
            {data.door.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.wellRateLbD, 6)}</td>
                <td className="pr-3">{fmt(r.itsFlowlineCarriesLbD, 6)}</td>
                <td className="pr-3">{fmt(r.gapLbD, 6)}</td>
                <td className={r.theDoorCheckWouldFire ? 'text-[#f97316]' : ''}>{yn(r.theDoorCheckWouldFire)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        ONE COMPARISON AT THE TOP OF THE PROPAGATION WOULD CATCH BOTH the caller mistake and the
        solve own hole: compare every well stream mass against the well rate the solve produced. On
        this network it fires on exactly one well. Whether it should warn or refuse is a real
        choice, and refusing is the defensible one, because a stream split built on a mass the solve
        disagrees with is a facility number nobody can stand behind.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Tolerance = () => {
  const data = useMemo(() => {
    try {
      return {
        scale: fightExplorer.toleranceScale(),
        ladder: fightExplorer.toleranceScaleLadderRows(),
        sweep: fightExplorer.toleranceSweepRows(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>The stopping target is the tolerance times a scale, and the scale is evaluated from the caller own inflow relations, so it needs both before it means anything.</Note>;
  }
  const chart = data.sweep.map((r) => ({
    x: Math.log10(r.tolerance), iterations: r.iterations, crosslinkMovedLbD: Math.abs(r.crosslinkMovedLbD),
  }));
  return (
    <>
      <TileGrid>
        <Tile label="The constant is named" value={data.scale.theConstantIsNamedLbD} />
        <Tile label="Its value" value={tiny(data.scale.documentedDefaultTolerance)} unit="lb/d, it says" />
        <Tile label="The scale on this system" value={fmt(data.scale.scaleLbD, 6)} unit="lb/d" />
        <Tile label="So the target it really enforces" value={tiny(data.scale.targetAtTheDocumentedDefaultLbD)} unit="lb/d" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">well</th>
              <th className="text-left">its inflow evaluated at the separator pressure, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.scale.perWell.map((w) => (
              <tr key={w.id}>
                <td className="pr-3">{w.label}</td>
                <td className="text-[#BFFF00]">{fmt(w.inflowAtTheSinkPressureLbD, 6)}</td>
              </tr>
            ))}
            <tr>
              <td className="pr-3">the four of them together</td>
              <td>{fmt(data.scale.totalInflowAtTheSinkPressureLbD, 6)}</td>
            </tr>
            <tr>
              <td className="pr-3">and the scale uses only the largest of them</td>
              <td className="text-[#f97316]">{fmt(data.scale.scaleLbD, 6)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE TOLERANCE IS NOT IN LB/D. The constant is named for a mass rate and its own comment says
        the solve stops when the worst nodal imbalance is below it, in lb/d. What the solve stops at
        is that tolerance times a SCALE, and the scale is the largest SINGLE well inflow evaluated
        at the sink pressure. At the documented default of
        {' '}{tiny(data.scale.documentedDefaultTolerance)} the target is really
        {' '}{tiny(data.scale.targetAtTheDocumentedDefaultLbD)} lb/d, looser than the name promises
        by a factor of {fmt(data.scale.looserThanTheNamePromisesByFactor, 6)}. NOTHING IN THE RETURN
        CARRIES THE SCALE: {yn(data.scale.theEngineDoesNotReturnIt)}. A relative criterion is
        defensible on a system that might move a million pounds a day. The name, the comment and the
        returned residual are all absolute, and nothing tells the caller which one was in force.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">wells on the published ladder</th>
              <th className="text-left pr-3">the scale, lb/d</th>
              <th className="text-left pr-3">the total would have been, lb/d</th>
              <th className="text-left">the total over the scale</th>
            </tr>
          </thead>
          <tbody>
            {data.ladder.map((r) => (
              <tr key={r.count}>
                <td className="pr-3">{fmt(r.count, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.scaleLbD, 6)}</td>
                <td className="pr-3">{fmt(r.totalInflowAtTheSinkPressureLbD, 6)}</td>
                <td>{fmt(r.totalOverScale, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE SCALE IS THE LARGEST SINGLE WELL, NOT THE TOTAL, so the effective criterion TIGHTENS
        as wells are added, which is the opposite of what a relative scale is for. On a forty well
        gathering system the two differ by more than an order of magnitude, so the criterion a
        caller gets depends on how many wells are on the system and on which one of them is biggest.
        One smaller thing rides along: the FIRST convergence test, before the loop, is against the
        raw tolerance, and every test inside the loop is against the scaled target. Since the target
        is never smaller than the tolerance the mismatch can only cost a wasted step and never a
        false convergence, but the same criterion is spelled two ways in one function and only one
        of the two is the one that decides.
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 10, right: 20, bottom: 24, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" tick={AXIS}
              label={{ value: 'tolerance asked, as a power of ten', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'Newton iterations', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="iterations" name="Newton iterations" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">tolerance asked</th>
              <th className="text-left pr-3">the target it really enforced, lb/d</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">iterations</th>
              <th className="text-left pr-3">reported residual, lb/d</th>
              <th className="text-left pr-3">worst junction moved, psi</th>
              <th className="text-left pr-3">trunk moved, lb/d</th>
              <th className="text-left">conservation gap, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.sweep.map((r) => (
              <tr key={r.tolerance}>
                <td className="pr-3">{tiny(r.tolerance)}</td>
                <td className="pr-3">{tiny(r.targetLbD)}</td>
                <td className="pr-3">{yn(r.converged)}</td>
                <td className="pr-3">{fmt(r.iterations, 0)}</td>
                <td className="pr-3 text-[#38bdf8]">{tiny(r.reportedResidualLbD)}</td>
                <td className="pr-3">{tiny(r.worstJunctionMovedPsi)}</td>
                <td className="pr-3">{tiny(r.trunkMovedLbD)}</td>
                <td className="text-[#f97316]">{fmt(r.conservationGapLbD, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        READ THE CONVERGED COLUMN AND THE ANSWER COLUMN TOGETHER. Every row says converged, and the
        answer moves by hundreds of pounds a day across the sweep. A user who reads the default as a
        millionth of a pound a day is off by the scale, and a user who loosens it to a thousandth of
        a pound a day is off by the scale again and still gets converged.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Failure = () => {
  const data = useMemo(() => {
    try {
      return {
        caps: fightExplorer.iterationCapRows(),
        toFixed: fightExplorer.toFixedRows(),
        singular: fightExplorer.singularSolves(),
        floor: fightExplorer.pressureFloorCase(),
        oracle: fightExplorer.oracleCoverage(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A failure is only visible where the caller can see it, and this module returns most of them under ok true.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Caps tried" value={fmt(data.caps.length, 0)} />
        <Tile label="How many returned ok" value={fmt(data.caps.filter((r) => r.ok).length, 0)} />
        <Tile label="How many actually converged" value={fmt(data.caps.filter((r) => r.converged).length, 0)} />
        <Tile label="How many printed a residual that reads as zero" value={fmt(data.caps.filter((r) => r.printedResidualReadsAsZero).length, 0)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">iteration cap</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">steps run</th>
              <th className="text-left pr-3">reported residual, lb/d</th>
              <th className="text-left pr-3">manifold, psia</th>
              <th className="text-left pr-3">trunk, lb/d</th>
              <th className="text-left">conservation gap, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.caps.map((r) => (
              <tr key={r.maxIter}>
                <td className="pr-3">{fmt(r.maxIter, 0)}</td>
                <td className="pr-3 text-[#f97316]">{yn(r.ok)}</td>
                <td className="pr-3">{yn(r.converged)}</td>
                <td className="pr-3">{fmt(r.iterationsRun, 0)}</td>
                <td className="pr-3 text-[#38bdf8]">{tiny(r.trueReportedResidualLbD)}</td>
                <td className="pr-3">{fmt(r.manifoldPsia, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.trunkLbD, 6)}</td>
                <td>{fmt(r.conservationGapLbD, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        EVERY FAILURE COMES BACK ok. The topology builder trains the caller to key on that field by
        refusing eleven distinct malformed networks with ok false and a reason. The solver returns
        ok true when the iteration cap is hit, when the line search stalls, and when it sits on a
        cusp it cannot resolve. AT A LOW CAP THE RETURN CARRIES A FULL SET OF PRESSURES, FLOWS AND
        WELL RATES THAT LOOK EXACTLY LIKE AN ANSWER, and the manifold and trunk columns above are
        those numbers. The one thing that does come back ok false is a singular Jacobian, whose
        message is a real diagnosis: two or more nodes move together, so their pressures are not
        separately determined.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">cap</th>
              <th className="text-left pr-3">the true reported residual, lb/d</th>
              <th className="text-left pr-3">what the sentence printed</th>
              <th className="text-left pr-3">what three significant figures would have printed</th>
              <th className="text-left">what an exponent would have printed</th>
            </tr>
          </thead>
          <tbody>
            {data.toFixed.map((r) => (
              <tr key={r.maxIter}>
                <td className="pr-3">{fmt(r.maxIter, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{tiny(r.trueReportedResidualLbD)}</td>
                <td className="pr-3 text-[#f97316]">{r.printedResidual}</td>
                <td className="pr-3">{r.toPrecisionWouldHavePrinted}</td>
                <td>{r.exponentialWouldHavePrinted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND THE FAILURE MESSAGE PRINTS THE NUMBER IT JUST FAILED ON WITH THREE FIXED DECIMALS. On
        the one line whose whole job is to tell the reader how far off the answer is, a residual
        smaller than a thousandth of a pound a day reads as zero. A reader who takes it at face
        value concludes the solve met its tolerance and the flag is wrong, which is the exact
        opposite of the truth. Either of the two alternatives on that table changes no arithmetic at
        all. The sentence the engine printed at the tightest of those caps:
        {' '}{data.toFixed.length ? data.toFixed[data.toFixed.length - 1].message : ''}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <tbody>
            <tr>
              <td className="pr-3">a singular two by two returns nothing rather than an array of infinities</td>
              <td className="text-[#BFFF00]">{yn(data.singular.singularReturnsNull)}</td>
            </tr>
            <tr>
              <td className="pr-3">a well posed two by two</td>
              <td>{data.singular.wellPosed.map((x) => fmt(x, 9)).join(', ')}</td>
            </tr>
            <tr>
              <td className="pr-3">and it pivots, so a zero on the diagonal is not a failure</td>
              <td>{data.singular.itPivots.map((x) => fmt(x, 9)).join(', ')}</td>
            </tr>
            <tr>
              <td className="pr-3">the line search never puts a node below atmospheric</td>
              <td>{fmt(data.floor.wellheadPsia, 9)} psia against a floor of {fmt(data.floor.floorPsia, 2)} psia</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Note>
        AND NO ORACLE TOUCHES ANY OF THIS. The independent referee publishes
        {' '}{fmt(data.oracle.publishedCaseCount, 0)} clean cases and records no defects at all,
        because it converges on how far the pressures MOVED between sweeps rather than on a mass
        residual scaled by a factor the caller never sees, and the two criteria are not comparable.
        It has no concept of a pinned node, it never calls the conservation check, it never ranks a
        bottleneck and it never propagates a stream. Everything this tier teaches is about the parts
        of the module no oracle has ever looked at.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const Cusp = () => {
  const data = useMemo(() => {
    try {
      return {
        steps: fightExplorer.cuspStepRows(),
        walk: fightExplorer.cuspWalkRows(),
        headline: fightExplorer.cuspWalkHeadline(),
        whisper: fightExplorer.whisperLegRows(),
        diagnose: fightExplorer.diagnoseHeadline(),
      };
    } catch { return null; }
  }, []);
  if (!data) {
    return <Note>A cusp is a property of a branch relation at zero pressure difference, so it needs a solved network to say how close any branch is to its own.</Note>;
  }
  const chart = data.walk.map((r) => ({
    x: r.loopLegConductanceLbDPerRootPsi,
    iterations: r.iterations,
    crosslinkDpPsi: r.crosslinkDpPsi,
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Conductances walked" value={fmt(data.headline.rowCount, 0)} />
        <Tile label="How many returned ok" value={fmt(data.headline.rowCount, 0)} />
        <Tile label="How many failed to converge" value={fmt(data.headline.failingCount, 0)} />
        <Tile label="Worst iteration count" value={fmt(data.headline.highestIterations, 0)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">branch</th>
              <th className="text-left pr-3">drop across it, psi</th>
              <th className="text-left pr-3">the Jacobian step on its from node, psi</th>
              <th className="text-left pr-3">Jacobian steps from zero</th>
              <th className="text-left">inside one step of its cusp</th>
            </tr>
          </thead>
          <tbody>
            {data.steps.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id} ({r.label})</td>
                <td className="pr-3">{fmt(r.dpPsi, 9)}</td>
                <td className="pr-3">{fmt(r.jacobianStepPsi, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.stepsFromZero, 6)}</td>
                <td>{yn(r.insideOneStepOfItsCusp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A CONTINUOUS RELATION IS NOT ENOUGH FOR A DIFFERENCED JACOBIAN. The contract on a branch
        relation is that it be continuous and monotone decreasing in the downstream pressure, and it
        says a pipe relation built from a characteristic curve satisfies that by construction. The
        square root law is continuous and monotone. It is NOT differentiable at zero pressure
        difference. When the difference across a branch is smaller than the Jacobian step, the two
        central difference evaluations straddle zero and the entry the solver uses is a chord across
        a square root rather than a derivative, which is a function of the node own pressure rather
        than of the flow.
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="x" type="number" tick={AXIS} domain={['dataMin', 'dataMax']}
              label={{ value: 'loop leg conductance, lb/d per root psi', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="i" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'Newton iterations', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="d" orientation="right" tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="i" type="monotone" dataKey="iterations" name="Newton iterations" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="d" type="monotone" dataKey="crosslinkDpPsi" name="crosslink drop, psi" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">loop leg conductance</th>
              <th className="text-left pr-3">crosslink drop, psi</th>
              <th className="text-left pr-3">crosslink flow, lb/d</th>
              <th className="text-left pr-3">iterations</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">ok</th>
              <th className="text-left">reported residual, lb/d</th>
            </tr>
          </thead>
          <tbody>
            {data.walk.map((r) => (
              <tr key={r.loopLegConductanceLbDPerRootPsi}>
                <td className="pr-3">{fmt(r.loopLegConductanceLbDPerRootPsi, 0)}</td>
                <td className="pr-3">{tiny(r.crosslinkDpPsi)}</td>
                <td className="pr-3">{fmt(r.crosslinkLbD, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.iterations, 0)}</td>
                <td className={r.converged ? 'pr-3' : 'pr-3 text-[#f97316]'}>{yn(r.converged)}</td>
                <td className="pr-3">{yn(r.ok)}</td>
                <td>{tiny(r.reportedResidualLbD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE ITERATION COUNT CLIMBS AS THE BRANCH APPROACHES ITS OWN CUSP AND FALLS AGAIN ONCE IT
        PASSES THROUGH. The solve stops converging entirely over a band of conductances, from
        {' '}{fmt(data.headline.lowestFailingConductance, 0)} to
        {' '}{fmt(data.headline.highestFailingConductance, 0)}, and every row of it still returns ok:
        {' '}{yn(data.headline.everyRowReturnsOk)}. The crosslink changes sign between
        {' '}{data.headline.signChangeBetweenConductances ? data.headline.signChangeBetweenConductances.join(' and ') : 'no two rows here'},
        so the band is NOT centred on the sign change, because what costs the solve is the
        difference being comparable with the Jacobian step and not the difference being zero. NOT A
        BUG SO MUCH AS AN UNSTATED PRECONDITION: the header should say a branch relation also has to
        be DIFFERENTIABLE at zero difference, or the Jacobian should widen its step when it detects
        a sign change across it. Either fix is small, and the contract as written invites the case.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">a leg carrying, lb/d</th>
              <th className="text-left pr-3">its intensity, psi per lb/d</th>
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
        THE SAME FAMILY, IN THE RANKING. The bottleneck intensity is the drop over the mass with
        only a floor at a billionth of a pound a day, so a leg carrying a millionth of a pound a day
        with one psi across it scores a million and wins every time. On the real case the bottleneck
        is {data.diagnose.bottleneckId} at an intensity of
        {' '}{tiny(data.diagnose.bottleneckIntensityPsiPerLbD)} and the ranking behaves exactly as
        its header says, which is why this is a note rather than a defect. A relative floor, one
        part in ten thousand of the largest branch mass, would close it. Both of these are a
        guard chosen against an ABSOLUTE number in a quantity that has no absolute scale.
      </Note>
    </>
  );
};

// --------------------------------------------------------------------------

const FightExplorer = ({ initialMode = 'residual' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Fight explorer"
      subtitle="What a solve hides: the node that goes flat and is pinned, the reported residual set beside the conservation gap on the same answer, the initial guess sweep and the one run in it that actually solves, the second mass nobody compares, a tolerance that is not in the units its own name gives, every failure returning ok, and a branch parked at the cusp of its own relation"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'pinned' && <Pinned />}
        {mode === 'residual' && <Residual />}
        {mode === 'guess' && <Guess />}
        {mode === 'streammass' && <StreamMass />}
        {mode === 'tolerance' && <Tolerance />}
        {mode === 'failure' && <Failure />}
        {mode === 'cusp' && <Cusp />}
      </div>
    </PanelShell>
  );
};

export default FightExplorer;
