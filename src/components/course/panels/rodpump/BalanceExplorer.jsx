import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, ComposedChart, Line, Scatter, ScatterChart,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  balanceExplorer, ODUMA, NODE_LADDER, NODE_LADDER_QUICK,
  CONVERGENCE_CASE_IDS, DIP_SPM, NODE_NOISE_SPMS,
} from './rodPumpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Balance explorer, the Expert tier. What the card hides: the tension envelope
// against the decimated subsample the loads are actually read off, what
// converges on a finer grid and what does not, the counterbalance and the two
// numbers inside one return that disagree about it, three inputs the design
// accepts and never reads, and the stress line and the diagnostic re-reading of
// the card the march produced.
//
// Five modes. Two of them march the wave equation on grids up to sixteen times
// the shipped one, so the node ladder is a CHOICE on this panel: the short
// ladder opens in about a second and the full one, which is the ladder the
// lessons quote, takes several. Only the selected mode computes.
//
// Every figure on this page is a return value from rodPumpLab, which is a return
// value from the vendored rod pump engines. Nothing here accumulates an
// envelope, balances a unit or propagates a harmonic.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.0005 ? v.toExponential(3) : fmt(v, 9);
};

const MODES = [
  { value: 'envelope', label: 'The envelope against the subsample' },
  { value: 'convergence', label: 'What converges, and what is only noise' },
  { value: 'balance', label: 'The counterbalance' },
  { value: 'ignored', label: 'Three inputs accepted and never read' },
  { value: 'stress', label: 'Stress, and the diagnostic against the design' },
];

const LADDERS = [
  { value: 'quick', label: '60 to 480 nodes, about a second' },
  { value: 'full', label: '60 to 1920 nodes, the ladder the lessons quote, several seconds' },
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const useSafe = (fn, deps = []) => useMemo(() => {
  try { return fn(); } catch { return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, deps);

const Envelope = () => {
  const d = useSafe(() => balanceExplorer.envelope());
  if (!d || !d.profile.length) {
    return <Note>A tension envelope needs a march to accumulate over, and a subsample needs a card to decimate. With no settled cycle there is neither, and the two readings this mode compares do not exist to disagree.</Note>;
  }
  const s = d.split;
  return (
    <>
      <TileGrid>
        <Tile label="Shallowest envelope node" value={fmt(s.shallowestNodeFt, 9)} unit="ft" />
        <Tile label="Envelope maximum there" value={fmt(s.envelopeMaxLb, 9)} unit="lb" />
        <Tile label="Buoyed rod above that node" value={fmt(s.buoyedRodAboveLb, 9)} unit="lb" />
        <Tile label="Peak IMPLIED BY THE ENVELOPE" value={fmt(s.impliedPeakLb, 9)} unit="lb" />
        <Tile label="Peak AS THE CARD REPORTS IT" value={fmt(s.reportedPeakLb, 9)} unit="lb" />
        <Tile label="The disagreement, in one object" value={fmt(s.disagreementLb, 9)} unit="lb" />
        <Tile label="Which is" value={fmt(s.disagreementPct, 6)} unit="%" />
        <Tile label="The fully sampled march gives" value={fmt(s.marchedPeakLb, 9)} unit="lb" />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        TWO ANSWERS FOR ONE PEAK LOAD, OUT OF ONE CALL. The reported peak is the maximum of the
        decimated surface card, {fmt(d.sampling.cardPoints, 0)} of the {fmt(d.sampling.samples, 0)}
        {' '}marched steps. The envelope top is accumulated over every one of those steps, plus the
        buoyed weight of the rod above the shallowest node, because that sample sits half a node down
        and not at the surface. Neither is the peak of a continuous cycle, because a march has no
        continuous cycle, but the envelope is the sampling that threw nothing away: it sits
        {' '}{fmt(s.envelopeFromMarchedLb, 9)} lb from the fully sampled peak while the reported one
        sits {fmt(s.reportedFromMarchedLb, 9)} lb from it. THE SMALLER, SEPARATE EFFECT: the top
        section is priced half a node light, {fmt(s.halfNodeLightPct, 6)} percent, which is a
        discretisation choice rather than a defect and must not be confused with the subsample.
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={d.profile} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="depthFt" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'depth, ft', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'tension, lb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line type="monotone" dataKey="maxLb" name="maximum tension over every marched step"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="minLb" name="minimum tension over every marched step"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.ladder} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="cardSamples" type="number" scale="log" domain={['auto', 'auto']} tick={AXIS}
              label={{ value: 'card samples requested', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'reported load, lb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={d.cost.marchedPeakLb} stroke="#BFFF00" strokeDasharray="4 3"
              label={{ value: 'the peak the march found', fill: '#BFFF00', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={d.cost.marchedMinLb} stroke="#38bdf8" strokeDasharray="4 3"
              label={{ value: 'the minimum the march found', fill: '#38bdf8', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="prlPeakLb" name="reported peak" stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="prlMinLb" name="reported minimum" stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">card samples</th>
              <th className="text-left pr-3">points kept</th>
              <th className="text-left pr-3">stride</th>
              <th className="text-left pr-3">reported peak, lb</th>
              <th className="text-left pr-3">reported minimum, lb</th>
              <th className="text-left pr-3">card area, in-lb</th>
              <th className="text-left">plunger stroke, in</th>
            </tr>
          </thead>
          <tbody>
            {d.ladder.map((r) => (
              <tr key={r.cardSamples}>
                <td className="pr-3">{fmt(r.cardSamples, 0)}</td>
                <td className="pr-3">{fmt(r.cardPoints, 0)}</td>
                <td className="pr-3">{fmt(r.stride, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.prlPeakLb, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.prlMinLb, 6)}</td>
                <td className="pr-3">{fmt(r.cardAreaInLb, 4)}</td>
                <td>{fmt(r.plungerStrokeIn, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONLY THE DECIMATION CHANGES DOWN THAT TABLE. The march is bit for bit identical at every row:
        same nodes, same time step, same cycles, and the plunger stroke does not move at all, because
        it is a peak to trough of the pump node over every marched step and is never decimated. What
        moves is which of the marched steps survive into the card the two loads are read off. Neither
        column is monotone: a coarse stride can happen to land near an extreme and then miss it
        again. What the shipped default costs is a peak {fmt(d.cost.peakLowByLb, 6)} lb LOW,
        {' '}{fmt(d.cost.peakLowByPct, 6)} percent, a minimum {fmt(d.cost.minHighByLb, 6)} lb HIGH,
        which is a reported over real ratio of {fmt(d.cost.reportedOverMarchedMin, 9)}, and a load
        range narrowed at both ends by {fmt(d.cost.rangeNarrowByPct, 6)} percent.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">speed, spm</th>
              <th className="text-left pr-3">reported minimum, lb</th>
              <th className="text-left pr-3">marched minimum, lb</th>
              <th className="text-left pr-3">peak reported low by, %</th>
              <th className="text-left">reported over marched</th>
            </tr>
          </thead>
          <tbody>
            {d.bySpeed.map((r) => (
              <tr key={r.spm} className={r.sameSign ? '' : 'text-[#f97316]'}>
                <td className="pr-3">{fmt(r.spm, 1)}</td>
                <td className="pr-3">{fmt(r.reportedMinLb, 6)}</td>
                <td className="pr-3">{fmt(r.marchedMinLb, 6)}</td>
                <td className="pr-3">{fmt(r.peakLowByPct, 6)}</td>
                <td>{r.sameSign ? fmt(r.reportedOverMarchedMin, 6) : 'the two minima have OPPOSITE SIGNS'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE MINIMUM IS THE ONE THAT MATTERS, because it is the number a designer uses to decide
        whether the rods go into compression, and reporting it high is not a rounding difference. On
        the rows above in orange the reported card says the polished rod load never goes negative
        and the march says it does, which is the opposite verdict from the same call. The emptier the
        barrel the sharper the load transfer, and the sharper the transfer the more a coarse card
        misses.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rating</th>
              <th className="text-left pr-3">structural capacity, lb</th>
              <th className="text-left pr-3">from the reported peak, %</th>
              <th className="text-left pr-3">from the marched peak, %</th>
              <th className="text-left pr-3">warnings</th>
              <th className="text-left">worst loading from the ENVELOPE, %</th>
            </tr>
          </thead>
          <tbody>
            {[d.rating, d.standardRating].map((r) => (
              <tr key={r.designation}>
                <td className="pr-3">{r.designation}</td>
                <td className="pr-3">{fmt(r.structuralCapacityLb, 0)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.structuralPctFromReported, 9)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.structuralPctFromMarched, 9)}</td>
                <td className="pr-3">{r.warnings}</td>
                <td>{fmt(r.worstLoadingPct, 9)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHICH CHECK READS WHICH. The section stresses and the modified Goodman line read the
        envelope. The structural rating percentage and its overload warning read the reported peak.
        So one design is checked against two different peak loads in one return, and the check that
        decides whether the unit is big enough is the one reading the smaller number. On the first
        rating above, chosen to sit between the two peaks, the two routes straddle 100 percent and
        the overload warning does not fire. The Goodman loading did not move when the rating changed,
        because the stress line never reads a rating at all.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Convergence = () => {
  const [ladderPick, setLadderPick] = useState('quick');
  const [casePick, setCasePick] = useState(CONVERGENCE_CASE_IDS[1]);
  const ladder = ladderPick === 'full' ? NODE_LADDER : NODE_LADDER_QUICK;
  const d = useSafe(() => balanceExplorer.convergence(ladder), [ladderPick]);
  if (!d || !d.cases.length) {
    return <Note>A convergence study needs the same design marched on several grids, and the design function exposes no node count at all. The rows below come from calling the card solver directly, which is the only way in, and with no card there is nothing to refine.</Note>;
  }
  const c = d.cases.find((x) => x.id === casePick) || d.cases[0];
  const noise = d.noise;
  const noiseRows = ladder.map((nodes) => {
    const row = { nodes };
    noise.forEach((n) => { row[`spm${n.spm}`] = (n.rows.find((r) => r.nodes === nodes) || {}).worstLoadingPct; });
    return row;
  });
  return (
    <>
      <FieldGrid>
        <SelectField label="Node ladder" value={ladderPick} onChange={setLadderPick} options={LADDERS} />
        <SelectField label="Case" value={casePick} onChange={setCasePick}
          options={CONVERGENCE_CASE_IDS.map((id) => ({ value: id, label: id }))} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Plunger stroke moves" value={fmt(c.spread.plungerStrokeSpreadIn, 9)} unit="in" />
          <Tile label="Which is" value={fmt(c.spread.plungerStrokeSpreadPct, 6)} unit="%" />
          <Tile label="The peak moves" value={fmt(c.spread.pprlSpreadLb, 6)} unit="lb" />
          <Tile label="Which is" value={fmt(c.spread.pprlSpreadPct, 6)} unit="% of the smallest" />
          <Tile label="The minimum moves" value={fmt(c.spread.mprlSpreadLb, 6)} unit="lb" />
          <Tile label="Which is" value={fmt(c.spread.mprlSpreadPct, 6)} unit="% of the smallest in size" />
          <Tile label="The worst loading moves" value={fmt(c.spread.loadingSpreadPoints, 9)} unit="points" />
          <Tile label="Rows raising notPeriodic" value={fmt(c.rows.filter((r) => r.notPeriodic).length, 0)} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nodes</th>
              <th className="text-left pr-3">marched steps</th>
              <th className="text-left pr-3">plunger stroke, in</th>
              <th className="text-left pr-3">PPRL, lb</th>
              <th className="text-left pr-3">MPRL, lb</th>
              <th className="text-left pr-3">cycles</th>
              <th className="text-left pr-3">converged</th>
              <th className="text-left pr-3">notPeriodic</th>
              <th className="text-left">worst loading, %</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.nodes} className={r.notPeriodic ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.nodes, 0)}</td>
                <td className="pr-3">{fmt(r.samples, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.plungerStrokeIn, 9)}</td>
                <td className="pr-3">{fmt(r.prlPeakLb, 6)}</td>
                <td className="pr-3">{fmt(r.prlMinLb, 6)}</td>
                <td className="pr-3">{fmt(r.cycles, 0)}</td>
                <td className="pr-3">{String(r.converged)}</td>
                <td className="pr-3">{String(r.notPeriodic)}</td>
                <td>{fmt(r.worstLoadingPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        ONLY THE NODE COUNT MOVES DOWN THAT TABLE. Same string, same speed, same fluid, same damping,
        and the time step follows the Courant condition so the marched steps rise with the grid. The
        plunger stroke settles: it is a peak to trough of one node POSITION over a whole cycle, and a
        position is an integral of the wave. The two load extremes are point values of a spatial
        derivative taken at whichever instant happened to be worst, and a derivative sampled on a
        coarser mesh is the first thing to move. So every reading built on the stroke, including the
        swept and produced rates, survives the grid, and every reading built on the load extremes has
        to clear the node spread first. The design reports all of them the same way, with no grid
        error attached and no node count to test them with.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE PERIODICITY FLAG IS NOT MONOTONE IN RESOLUTION. On the low damping case above a coarse
        grid converges, a finer one does not, a finer one still does, and the finest does not. So the
        message, which asks the reader to raise the damping or check the inputs, cannot be read as a
        resolution problem: nothing about the well changed between two of those rows. The engine
        prints: {d.flag.message || 'no periodicity warning was raised on this run'} Through the
        design function at that operating point the warnings read {d.flag.designWarnings}, and the
        cycle cap of {fmt(d.flag.maxCyclesDefault, 0)} is not exposed either, so a caller who sees
        the warning has nothing to turn.
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.speedSweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="spm" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'pumping speed, spm', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'worst section loading, %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceDot x={d.dip.dipSpm} y={d.dip.atPct} r={5} fill="#f472b6" stroke="none" isFront />
            <Line type="monotone" dataKey="worstLoadingPct" name="the speed sweep, at the shipped 120 node grid"
              stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nodes</th>
              {NODE_NOISE_SPMS.map((spm) => (
                <th key={spm} className="text-left pr-3">loading at {fmt(spm, 1)} spm, %</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {noiseRows.map((r) => (
              <tr key={r.nodes}>
                <td className="pr-3">{fmt(r.nodes, 0)}</td>
                {NODE_NOISE_SPMS.map((spm) => (
                  <td key={spm} className="pr-3">{fmt(r[`spm${spm}`], 6)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label={`The dip at ${fmt(d.dip.dipSpm, 1)} spm`} value={fmt(d.dip.dipPoints, 6)} unit="points" />
          <Tile label="The node spread at the row before it" value={fmt(d.dip.noiseBeforePoints, 6)} unit="points" />
          <Tile label="And at the row after it" value={fmt(d.dip.noiseAfterPoints, 6)} unit="points" />
          <Tile label="The dip over the spread before it" value={fmt(d.dip.dipOverNoiseBefore, 6)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A NUMBER SMALLER THAN THE SOLVER OWN NOISE IS NOT A RESULT. The loading dips at
        {' '}{fmt(DIP_SPM, 1)} spm, and read on its own that is a design result: run there and buy
        back a point and a half of rod loading for nothing. Now hold the speed and move only the node
        count. Nothing about the well changes down those rows, the loading is computed the same way
        in both sweeps, and it moves FURTHER. So the dip is not a result. It is not a small result,
        or a marginal one, or one that needs confirming: there is nothing in it to confirm. Note what
        the comparison is not. It does not claim the coarse answer is wrong and the fine one right.
        Both sweeps compute the same quantity, and one of them varies a parameter with no physical
        content and still moves it further.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE LOADING COLUMN IS RECOMPUTED STANDALONE from the same card, with the same stress and
        allowable functions the design uses, because the design exposes no node count. At the shipped
        grid the two routes agree to the last figure: {fmt(d.routes.designReturnPct, 12)} percent
        from the design return and {fmt(d.routes.standalonePct, 12)} percent recomputed, strictly
        equal {String(d.routes.strictlyEqual)}. That agreement is what licenses using the standalone
        route for the sweep.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Balance = () => {
  const d = useSafe(() => balanceExplorer.balance());
  if (!d || !d.torque.length) {
    return <Note>A counterbalance is struck against a card, so it needs the surface card the march returns and the torque factor the linkage gives. With either missing there is no net torque through a revolution and no scalar condition to close.</Note>;
  }
  const b = d.summary;
  return (
    <>
      <TileGrid>
        <Tile label="Balanced" value={String(b.balanced)} />
        <Tile label="Counterbalance moment" value={fmt(b.momentInLb, 6)} unit="in-lb" />
        <Tile label="Peak gearbox torque" value={fmt(b.peakTorqueInLb, 6)} unit="in-lb" />
        <Tile label="Counterbalance effect" value={fmt(b.counterbalanceEffectLb, 6)} unit="lb" />
        <Tile label="Upstroke peak" value={fmt(b.upstrokePeakInLb, 6)} unit="in-lb" />
        <Tile label="Downstroke peak" value={fmt(b.downstrokePeakInLb, 6)} unit="in-lb" />
        <Tile label="The two peaks differ by" value={tiny(b.peakDifferenceInLb)} unit="in-lb" />
        <Tile label="With no counterweight the gearbox sees" value={fmt(d.value.withNoCounterweightInLb, 6)} unit="in-lb" />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={d.torque} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="crankDeg" type="number" domain={[0, 360]} tick={AXIS}
              label={{ value: 'crank angle, deg', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'torque, in-lb', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line type="monotone" dataKey="rodTorqueInLb" name="the rod term, torque factor times polished rod load"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="counterbalanceTorqueInLb" name="the counterweight term, a sine anchored to the bottom"
              stroke="#f97316" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="netTorqueInLb" name="the net torque the gearbox sees"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A UNIT IS BALANCED WHEN THE TWO PEAKS ARE EQUAL, which is one scalar condition in one unknown,
        closed by bisection on the difference between them. The counterweight moment is anchored to
        the crank angle at the BOTTOM of the polished rod stroke rather than to whichever angle a
        maker calls zero, which is what makes the sign right by construction. The effect at the
        polished rod is read a quarter turn from the bottom, where the torque factor is
        {' '}{fmt(b.quarterTurnTorqueFactorIn, 9)} in. Dividing the moment by the FRONT ARM instead
        would give {fmt(b.momentOverFrontArmLb, 6)} lb and understate the effect by a factor of
        {' '}{fmt(b.frontArmUnderstatesBy, 6)}.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">moment, fraction of balanced</th>
              <th className="text-left pr-3">moment, in-lb</th>
              <th className="text-left pr-3">upstroke peak, in-lb</th>
              <th className="text-left pr-3">downstroke peak, in-lb</th>
              <th className="text-left">what the gearbox sees, in-lb</th>
            </tr>
          </thead>
          <tbody>
            {d.sweep.map((r) => (
              <tr key={r.fraction}>
                <td className="pr-3">{fmt(r.fraction, 4)}</td>
                <td className="pr-3">{fmt(r.momentInLb, 6)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.upstrokePeakInLb, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.downstrokePeakInLb, 6)}</td>
                <td>{fmt(r.largerInLb, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        MOVING THE MOMENT AWAY FROM BALANCE MOVES THE TWO PEAKS IN OPPOSITE DIRECTIONS, and the
        crossing IS the balance. The larger of the two is what the gearbox sees, so overweighting
        costs as surely as underweighting. Balancing this unit brings the peak down from
        {' '}{fmt(d.value.withNoCounterweightInLb, 6)} to {fmt(d.value.balancedInLb, 6)} in-lb, a
        reduction of {fmt(d.value.reductionPct, 6)} percent. And the condition looks only at two
        peaks: it does not care what the net torque does between them, so a balanced unit still
        carries the swing the valve transfer puts into the curve above.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SUBSAMPLE RUNS ONE LEVEL FURTHER THAN THE LOADS. The balance is struck against a card
        reader, and the only surface card the solver hands out is the decimated one. Balanced off the
        default {fmt(d.sampling.defaultCardPoints, 0)} point card the moment is
        {' '}{fmt(d.sampling.defaultMomentInLb, 6)} in-lb and the peak torque
        {' '}{fmt(d.sampling.defaultPeakTorqueInLb, 6)} in-lb; balanced off the full
        {' '}{fmt(d.sampling.fullCardPoints, 0)} point march card they are
        {' '}{fmt(d.sampling.fullMomentInLb, 6)} and {fmt(d.sampling.fullPeakTorqueInLb, 6)} in-lb.
        The decimation moves the moment by {fmt(d.sampling.momentDiffPct, 6)} percent and the peak
        gearbox torque by {fmt(d.sampling.peakTorqueDiffPct, 6)} percent, and the default card reads
        the torque LOW. So the gearbox rating percentage is a torque balanced against a subsampled
        card: {fmt(d.sampling.torquePctFromDefault, 9)} percent from the default card against
        {' '}{fmt(d.sampling.torquePctFromFull, 9)} percent from the full march.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">crank offset, deg</th>
              <th className="text-left pr-3">moment, in-lb</th>
              <th className="text-left pr-3">peak torque, in-lb</th>
              <th className="text-left pr-3">torque factor READ, in</th>
              <th className="text-left pr-3">torque factor where the moment PEAKS, in</th>
              <th className="text-left pr-3">effect reported, lb</th>
              <th className="text-left">error, %</th>
            </tr>
          </thead>
          <tbody>
            {d.offsets.map((r) => (
              <tr key={r.crankOffsetDeg} className={r.crankOffsetDeg === 0 ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{fmt(r.crankOffsetDeg, 1)}</td>
                <td className="pr-3">{fmt(r.momentInLb, 6)}</td>
                <td className="pr-3">{fmt(r.peakTorqueInLb, 6)}</td>
                <td className="pr-3">{fmt(r.readTorqueFactorIn, 9)}</td>
                <td className="pr-3">{fmt(r.trueTorqueFactorIn, 9)}</td>
                <td className="pr-3">{fmt(r.reportedEffectLb, 6)}</td>
                <td>{fmt(r.differencePct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        AND INSIDE ONE RETURN THE MOMENT KNOWS ABOUT THE CRANK OFFSET AND THE EFFECT DOES NOT. The
        effect is read a quarter turn from the bottom of the stroke, which is where the counterweight
        moment peaks ONLY when the offset is zero: with an offset the moment peaks a quarter turn
        less the offset, so the torque factor is read at the wrong crank angle. At a zero offset the
        two columns agree exactly, which is what says this is the offset and nothing else. A
        counterbalance effect is how a counterbalance is quoted and how it is measured in the field,
        so a wrong one is a wrong field target.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE BALANCE IS AN INPUT TO THE FUNCTION THAT COMPUTES THE CARD IT COMES FROM, so there is no
        way to call the design once and get a balanced answer: the card has to be solved separately,
        balanced, and the design then run, which solves the same card a second time. And the natural
        first call, with the balance omitted, FAILS OPEN. The torque group comes back
        {' '}{fmt(d.failsOpen.torqueGroupWithout, 9)} where the real value is
        {' '}{fmt(d.failsOpen.torqueGroupWithBalance, 9)}, and zero is a meaningful point on the RP
        11L torque chart, the no load axis, so it reads as a weightless gearbox rather than as an
        unanswered question. The rating percentage one field away returns
        {' '}{String(d.failsOpen.torquePctWithout)} in the same call, so the module already knows how
        to say not computed and does say it. Every other output is identical with and without the
        balance.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Ignored = () => {
  const d = useSafe(() => balanceExplorer.ignored());
  if (!d || !d.rows.length) {
    return <Note>An input that does nothing leaves no trace in the answer, so the test has to be built out of what the function does return. With no design to run twice there is nothing to compare, and an unread input cannot be distinguished from one that was read.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="Outputs compared" value={fmt(d.rows.length, 0)} />
        <Tile label="Count of differences" value={fmt(d.differences, 0)} />
        <Tile label="Mismatched unit stroke passed in" value={fmt(d.mismatched.otherStrokeIn, 6)} unit="in" />
        <Tile label="Against a surface motion of" value={fmt(d.mismatched.surfaceStrokeIn, 6)} unit="in" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">output</th>
              <th className="text-left pr-3">run A, both at zero</th>
              <th className="text-left pr-3">run B, 600 lb and 10 deg</th>
              <th className="text-left">strictly equal</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r) => (
              <tr key={r.key}>
                <td className="pr-3 text-[#BFFF00]">{r.key}</td>
                <td className="pr-3">{fmt(r.runA, 12)}</td>
                <td className="pr-3">{fmt(r.runB, 12)}</td>
                <td>{String(r.strictlyEqual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        EQUALITY RATHER THAN CLOSENESS, and the difference matters. A tolerance test asks whether the
        input mattered much, and two numbers can agree to six figures because it mattered a little.
        The claim under test is stronger: the input was never read at all, and that predicts agreement
        to the last bit, because a value that enters any expression on the way to an output almost
        always disturbs its final figure. The ten outputs above reach the pump, the march, the card,
        both load extremes, the power, the volumes and the stress check.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE SECOND PROOF IS DIFFERENT IN KIND. The kinematics argument is not merely unread, it is
        unchecked against the input it duplicates. Hand the design the kinematics of a generic
        {' '}{fmt(d.mismatched.otherStrokeIn, 6)} in unit alongside a surface motion whose stroke is
        {' '}{fmt(d.mismatched.surfaceStrokeIn, 6)} in and the plunger stroke comes back
        {' '}{fmt(d.mismatched.plungerStrokeIn, 12)} in, identical to run A, with warnings
        {' '}{d.mismatched.warnings}. A caller can describe one pumping unit in one argument and a
        different one in the next and nothing has an opinion about it.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the same two numbers, given to the balance</th>
              <th className="text-left pr-3">moment, in-lb</th>
              <th className="text-left pr-3">peak torque, in-lb</th>
              <th className="text-left">counterbalance effect, lb</th>
            </tr>
          </thead>
          <tbody>
            {d.sensitivity.map((r) => (
              <tr key={r.label}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.momentInLb, 6)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.peakTorqueInLb, 6)}</td>
                <td>{fmt(r.counterbalanceEffectLb, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE CONTRAST IS THE WHOLE POINT. Those two numbers move the counterbalance moment by
        {' '}{fmt(d.sensitivitySummary.momentDiffInLb, 6)} in-lb,
        {' '}{fmt(d.sensitivitySummary.momentDiffPct, 6)} percent, and the peak gearbox torque by
        {' '}{fmt(d.sensitivitySummary.peakTorqueDiffPct, 6)} percent, so they would have shown if the
        design had read them. A caller who types a structural unbalance and a crank offset into the
        design function and reads back a torque rating percentage has no way to know those two
        numbers went nowhere. That is what a fails-open looks like: not a wrong answer with an error
        beside it, but a plausible answer with nothing behind it. WHAT THE TEST DOES NOT PROVE: that
        the answer is right. Both runs can be equally wrong, and equality says only that they agree.
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const Stress = () => {
  const d = useSafe(() => balanceExplorer.stress());
  if (!d || !d.serviceFactors.length) {
    return <Note>The modified Goodman line needs a minimum tensile strength, a minimum stress and a service factor. The first is a material property and the last is a judgement with no defensible default, so the engine takes it as an input rather than inventing one.</Note>;
  }
  return (
    <>
      <TileGrid>
        <Tile label="The loading crosses 100 percent at" value={fmt(d.crossing.serviceFactor, 9)} unit="service factor" />
        <Tile label="Where the allowable is" value={fmt(d.crossing.allowablePsi, 6)} unit="psi" />
        <Tile label="Against a maximum stress of" value={fmt(d.crossing.maxStressPsi, 6)} unit="psi" />
        <Tile label="Section loading spread at SF 1.00" value={fmt(d.sections[0].spreadPoints, 6)} unit="points" />
      </TileGrid>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.serviceFactors} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="serviceFactor" type="number" tick={AXIS} domain={['auto', 'auto']} reversed
              label={{ value: 'service factor', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="a" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'stress, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="l" orientation="right" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'loading, %', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="l" y={100} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'the line', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <Line yAxisId="a" type="monotone" dataKey="maxStressPsi" name="the maximum stress, which does not move"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line yAxisId="a" type="monotone" dataKey="allowablePsi" name="the allowable, which does"
              stroke="#f97316" dot={false} isAnimationActive={false} />
            <Line yAxisId="l" type="monotone" dataKey="loadingPct" name="loading"
              stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">service factor</th>
              <th className="text-left pr-3">worst section</th>
              <th className="text-left pr-3">max stress, psi</th>
              <th className="text-left pr-3">min stress, psi</th>
              <th className="text-left pr-3">allowable, psi</th>
              <th className="text-left pr-3">loading, %</th>
              <th className="text-left">warnings</th>
            </tr>
          </thead>
          <tbody>
            {d.serviceFactors.map((r) => (
              <tr key={r.serviceFactor} className={r.rodOverstressed ? 'text-[#f97316]' : ''}>
                <td className="pr-3">{fmt(r.serviceFactor, 4)}</td>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.maxStressPsi, 6)}</td>
                <td className="pr-3">{fmt(r.minStressPsi, 6)}</td>
                <td className="pr-3">{fmt(r.allowablePsi, 6)}</td>
                <td className="pr-3">{fmt(r.loadingPct, 6)}</td>
                <td>{r.warnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Sa = ( T/4 + 0.5625 Smin ) SF, from API RP 11BR. T is the grade minimum tensile strength, a
        material minimum. SF is NOT a property of the rod: it stands for the fluid, the corrosion and
        the operator own practice, so it is an input with no default that pretends otherwise. The
        allowable RISES with the minimum stress, which is why a string that never unloads is allowed
        more than one that swings to nothing. THE DESIGN DOES NOT CHANGE DOWN THIS COLUMN: the same
        card, the same stresses, the same envelope. What changes is the line they are judged against,
        and a design is acceptable above the crossing and overstressed below it without anything
        about the well having moved. The warning text now carries one decimal place, so a loading
        just over 100 no longer prints the words 100 percent, the threshold it had just failed.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">service factor</th>
              <th className="text-left pr-3">true loading, %</th>
              <th className="text-left pr-3">raised</th>
              <th className="text-left">message</th>
            </tr>
          </thead>
          <tbody>
            {d.warningText.map((r) => (
              <tr key={r.serviceFactor}>
                <td className="pr-3">{fmt(r.serviceFactor, 4)}</td>
                <td className="pr-3">{fmt(r.loadingPct, 6)}</td>
                <td className="pr-3">{String(r.raised)}</td>
                <td>{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        EACH SECTION AGAINST ITS OWN LINE. A taper is designed so every section carries the same peak
        stress, so the spread of the loading column is the check on whether this one does. At a
        service factor of {fmt(d.sections[0].serviceFactor, 2)} the three sections spread
        {' '}{fmt(d.sections[0].spreadPoints, 6)} percentage points, and at
        {' '}{fmt(d.sections[1].serviceFactor, 2)} they spread {fmt(d.sections[1].spreadPoints, 6)}:
        this taper is not stress balanced.
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d.roundTripHarmonics} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="requested" type="number" tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'harmonics requested', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={['auto', 'auto']}
              label={{ value: 'stroke difference from the march, in', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 9)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line type="monotone" dataKey="differenceFromMarchIn" name="the diagnostic, less the march"
              stroke="#BFFF00" dot={{ r: 2 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Plunger stroke from the MARCH" value={fmt(d.roundTrip.marchPlungerStrokeIn, 9)} unit="in" />
          <Tile label="From the DIAGNOSTIC" value={fmt(d.roundTrip.diagnosticPlungerStrokeIn, 9)} unit="in" />
          <Tile label="They differ by" value={fmt(d.roundTrip.differenceIn, 9)} unit="in" />
          <Tile label="Which is" value={fmt(d.roundTrip.differencePct, 6)} unit="%" />
          <Tile label="Diagnostic maximum pump load" value={fmt(d.roundTrip.diagnosticPumpLoadMaxLb, 9)} unit="lb" />
          <Tile label="Against the fluid load the march applied" value={fmt(d.roundTrip.marchFluidLoadLb, 9)} unit="lb" />
          <Tile label="Diagnostic minimum pump load" value={fmt(d.roundTrip.diagnosticPumpLoadMinLb, 9)} unit="lb" />
          <Tile label="Harmonics used, of a cap of" value={`${fmt(d.roundTrip.harmonicsUsed, 0)} of ${fmt(d.roundTrip.harmonicsCap, 0)}`} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE ROUND TRIP IS A REAL CHECK, because the two solvers share no code path: one marches a
        damped wave in time and the other propagates Fourier harmonics of a measured card in closed
        form. On the published measured card the diagnostic reproduces the oracle to
        {' '}{tiny(d.diagnosis.plungerStrokeDiffIn)} in. Handed the surface half of a predicted card
        it returns a plunger stroke {fmt(d.roundTrip.differencePct, 6)} percent from the marched one,
        which is the strongest single piece of evidence in this course that the march does what it
        claims. It OVERSHOOTS at both ends, and the reason is structural rather than numerical: a
        truncated harmonic sum cannot reproduce the two vertical valve transfers, the sharpest
        feature of any pump card, and overshoot beside a discontinuity is what a Fourier sum does.
        MORE HARMONICS IS NOT THE REPAIR, as the curve above shows: the difference does not descend,
        and past sixteen it settles into a band instead of shrinking. Refining until the answer stops
        moving is not available here, because it does not stop moving. And the card it reads was
        already sampled: the diagnostic sees the decimated card and nothing else, so every number it
        returns inherits that subsample as well as its own truncation.
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">damping ratio read back at</th>
              <th className="text-left pr-3">plunger stroke, in</th>
              <th className="text-left pr-3">maximum pump load, lb</th>
              <th className="text-left">minimum pump load, lb</th>
            </tr>
          </thead>
          <tbody>
            {d.diagnosticDamping.map((r) => (
              <tr key={r.dampingRatio}>
                <td className="pr-3">{fmt(r.dampingRatio, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.plungerStrokeIn, 9)}</td>
                <td className="pr-3">{fmt(r.pumpLoadMaxLb, 6)}</td>
                <td>{fmt(r.pumpLoadMinLb, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT A DIAGNOSIS CANNOT TELL YOU. It returns the pump card. It does not return why the card
        has that shape: gas interference, a worn plunger, a stuck valve and a partly filled barrel
        are read off the SHAPE by a person, and the engine names none of them. It also carries the
        damping ratio it is GIVEN, and a damping ratio is not measurable from a card either, so the
        stroke it reads back moves {fmt(d.diagnosticDampingSpread.plungerStrokeSpreadIn, 9)} in
        across the sweep above on an input nobody measured. What the agreement licenses is the
        plunger stroke, confidently, and not the pump load extremes, which overshoot by construction:
        treat those as bounds the true card lies within. And a card it cannot read is REFUSED:
        {' '}{d.diagnosisRefusal.message}
      </div>
      <Note>{d.verdict.note}</Note>
    </>
  );
};

const BalanceExplorer = ({ initialMode = 'balance' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Balance explorer"
      subtitle="What the card hides: the tension envelope against the subsample the loads are read off, what converges on a finer grid and what is only the solver's own noise, the counterbalance, three inputs the design accepts and never reads, and the stress line and the diagnostic re-reading of the card"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'envelope' && <Envelope />}
        {mode === 'convergence' && <Convergence />}
        {mode === 'balance' && <Balance />}
        {mode === 'ignored' && <Ignored />}
        {mode === 'stress' && <Stress />}
      </div>
    </PanelShell>
  );
};

export default BalanceExplorer;
