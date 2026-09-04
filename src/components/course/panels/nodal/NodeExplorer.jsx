import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  TEACHING_WELLS, ESCRAVOS_9, SCAN_GRIDS, DEFAULT_NGRID, SCAN_REVERSAL_PWH_PSIA,
  wellCrossings, wellWindow, wellResidualSweep, wellResidualMinimum, wellResidualTable,
  wellOutflowReadings, wellPwhSweepDetail, wellScanStudy,
  scanReversalStudy, scanReversalTruth, goldenPinchedScanStudy,
} from './nodalLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Node explorer, the Expert tier. Where the two curves meet, how many times,
// whether the meeting holds, whether the solver can see it at all, and what a
// decision looks like when it is swept instead of reported as a point.
//
// Every figure on this page is a return value from nodalLab, which is a return
// value from the vendored nodal engine. Nothing here computes a rate, a
// pressure or a residual.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['crossings', 'Both curves, and every place they meet'],
  ['residual', 'The residual, and the zero it touches twice'],
  ['resolution', 'What the scan can and cannot see'],
  ['sweep', 'Sweeping a decision instead of reporting a point'],
];

const WELLS = TEACHING_WELLS.map((W) => [W.label, `${W.label}: ${W.note}`]);

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const wellOf = (label) => TEACHING_WELLS.find((W) => W.label === label) || ESCRAVOS_9;

const STATUS_WORDS = {
  flowing: 'flowing',
  dead: 'DEAD',
  'no-stable-solution': 'no stable solution',
};

// A user-supplied wellhead pressure joins the well's own published sweep rather
// than replacing it, so the shape of the decision stays visible while the
// learner's own case sits on it.
const withCustom = (defaults, raw) => {
  const v = Number(raw);
  const set = Number.isFinite(v) && v > 0 ? defaults.concat(v) : defaults;
  return [...new Set(set)].sort((a, b) => a - b);
};

const Crossings = ({ W }) => {
  const sweep = useMemo(() => {
    try { return wellResidualSweep(W, { nPoints: 601 }); } catch { return null; }
  }, [W]);
  const crossings = useMemo(() => {
    try { return wellCrossings(W); } catch { return null; }
  }, [W]);
  const win = useMemo(() => {
    try { return wellWindow(W); } catch { return null; }
  }, [W]);
  const readings = useMemo(() => {
    try { return wellOutflowReadings(W); } catch { return null; }
  }, [W]);
  if (!sweep || !sweep.length || !crossings || !win || !readings) {
    return <Note>There are no curves to cross. The node solve needs an inflow with a positive open flow to scan up to and an outflow it can evaluate at every rate in between, and with either one missing the engine returns an empty solve rather than an operating point.</Note>;
  }
  if (!crossings.length) {
    return (
      <>
        <Note>
          The engine returns {STATUS_WORDS[win.status] || win.status} on {W.label} at this
          setting: it found {fmt(win.crossings, 0)} crossings on its scan, so there is no
          operating point to mark and no stable window to measure. That is a verdict and not an
          error, and the residual view is where you check whether it is the right one.
        </Note>
        <div className="mt-3">
          <TileGrid>
            <Tile label="Status the engine returns" value={STATUS_WORDS[win.status] || win.status} />
            <Tile label="Crossings found" value={fmt(win.crossings, 0)} />
            <Tile label="Absolute open flow" value={fmt(readings.qMaxStbd, 4)} unit="stb/d" />
            <Tile label="The dead column" value={fmt(readings.deadColumnPsia, 0)} unit="psia" />
          </TileGrid>
        </div>
      </>
    );
  }
  // The frame is a display window, not a result: the friction limb of an
  // outflow curve runs to many thousands of psia at the open flow and would
  // flatten everything that matters into a line along the bottom. Both bounds
  // are engine values, the dead column and the reservoir pressure.
  const top = Math.max(readings.deadColumnPsia, W.prPsia);
  const stable = crossings.filter((x) => x.stable);
  const unstable = crossings.filter((x) => !x.stable);
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Status the engine returns" value={STATUS_WORDS[win.status] || win.status} />
          <Tile label="Crossings found" value={fmt(win.crossings, 0)} />
          <Tile label="Operating rate" value={fmt(win.opQStbd, 4)} unit="stb/d" />
          <Tile label="Operating pressure" value={fmt(win.opPwfPsia, 4)} unit="psia" />
          <Tile label="Unstable crossing, rate"
            value={win.unstableQStbd === null ? 'there is only one crossing' : fmt(win.unstableQStbd, 4)}
            unit={win.unstableQStbd === null ? '' : 'stb/d'} />
          <Tile label="Stable window"
            value={win.widthStbd === null ? 'there is only one crossing' : fmt(win.widthStbd, 4)}
            unit={win.widthStbd === null ? '' : 'stb/d'} />
          <Tile label="Operating point as a share of the open flow" value={pct(win.opAsFractionOfAof, 3)} />
          <Tile label="Operating point sits on the rising friction limb"
            value={yn(win.operatingPointIsOnTheFrictionLimb)} />
        </TileGrid>
      </div>
      <div className="h-80 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qStbd" type="number" domain={[0, readings.qMaxStbd]} tick={AXIS}
              label={{ value: 'rate, stb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[0, top]} allowDataOverflow tick={AXIS}
              label={{ value: 'pressure at the node, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={readings.deadColumnPsia} stroke="#64748b" strokeDasharray="2 4"
              label={{ value: 'the dead column', fill: '#64748b', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="monotone" dataKey="iprPwfPsia" name="inflow: what the reservoir will give"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="vlpBhpPsia" name="outflow: what the tubing will take"
              stroke="#f97316" dot={false} isAnimationActive={false} />
            {unstable.map((x) => (
              <ReferenceDot key={`u-${x.index}`} x={x.qStbd} y={x.pwfPsia} r={6} fill="#fb7185" stroke="#0f172a"
                label={{ value: 'unstable, the heading branch', fill: '#fb7185', fontSize: 10, position: 'top' }} />
            ))}
            {stable.map((x) => (
              <ReferenceDot key={`s-${x.index}`} x={x.qStbd} y={x.pwfPsia} r={6} fill="#34d399" stroke="#0f172a"
                label={{ value: 'stable, the operating point', fill: '#34d399', fontSize: 10, position: 'top' }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">crossing</th>
              <th className="text-left pr-3">rate, stb/d</th>
              <th className="text-left pr-3">pressure, psia</th>
              <th className="text-left pr-3">stable</th>
              <th className="text-left pr-3">branch</th>
              <th className="text-left">the engine reports this one</th>
            </tr>
          </thead>
          <tbody>
            {crossings.map((x) => (
              <tr key={x.index} className={x.stable ? 'text-emerald-300' : 'text-rose-300'}>
                <td className="pr-3">{fmt(x.index + 1, 0)}</td>
                <td className="pr-3">{fmt(x.qStbd, 6)}</td>
                <td className="pr-3">{fmt(x.pwfPsia, 6)}</td>
                <td className="pr-3">{yn(x.stable)}</td>
                <td className="pr-3">{x.branch}</td>
                <td>{x.isOperatingPoint ? 'yes, it is the operating point' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        This is the whole of nodal analysis in one frame. The green curve is what the reservoir will
        give at each rate and it falls, because pulling harder leaves less pressure at the sandface.
        The orange curve is what the tubing will take at each rate and it is a J. The well produces
        where the two statements agree, and on {W.label} they agree
        {' '}{fmt(crossings.length, 0)} time{crossings.length === 1 ? '' : 's'}.
      </div>
      {crossings.length > 1 && (
        <div className="mt-2 text-xs text-slate-300">
          Only one of those agreements holds. At {fmt(win.unstableQStbd, 4)} stb/d the outflow
          requirement is falling FASTER than the inflow is, so a well that slips a little below that
          rate needs more pressure than the reservoir can find and it keeps slipping: that is the
          heading branch, and it runs away in both directions. At {fmt(win.opQStbd, 4)} stb/d the
          residual is rising through zero and a perturbation is pushed back. The two sit
          {' '}{fmt(win.widthStbd, 4)} stb/d apart, which is {pct(win.widthAsFractionOfAof, 3)}
          {' '}of the open flow, and everything between them is a rate this well cannot hold.
          Reporting whichever intersection a solver hands back first gets the one that does not
          exist in practice.
        </div>
      )}
      <div className="mt-2 text-xs text-slate-300">
        The operating point sits {fmt(win.opRightOfTubingMinimumStbd, 4)} stb/d
        {' '}{win.operatingPointIsOnTheFrictionLimb ? 'to the RIGHT of' : 'to the LEFT of'} the
        bottom of its own tubing curve at {fmt(win.tubingMinimumQStbd, 4)} stb/d, and
        {' '}{fmt(win.opAboveTubingMinimumPsi, 4)} psi above it. Stability does not require it to
        be on the right. The criterion is a statement about the DIFFERENCE of the two slopes, and
        the inflow is always falling, so a crossing can hold on the falling limb of the outflow if
        the column is lightening more gently than the reservoir is giving up pressure. One of the
        three wells in this panel does exactly that.
      </div>
      <Note>
        What a crossing asserts is narrower than it looks. It says these two curves agree at this
        rate, on the conditions handed in. It does not say the well will reach that rate from
        standstill, it does not say the inflow curve is still the well's next year, and it does not
        say the tubing is the right size. It is one equation solved once.
      </Note>
    </>
  );
};

const Residual = ({ W }) => {
  const sweep = useMemo(() => {
    try { return wellResidualSweep(W, { nPoints: 1201 }); } catch { return null; }
  }, [W]);
  const dip = useMemo(() => {
    try { return wellResidualMinimum(W); } catch { return null; }
  }, [W]);
  const table = useMemo(() => {
    try { return wellResidualTable(W); } catch { return null; }
  }, [W]);
  const crossings = useMemo(() => {
    try { return wellCrossings(W); } catch { return null; }
  }, [W]);
  if (!sweep || !sweep.length || !dip || !table || !table.length || !crossings) {
    return <Note>There is no residual to plot. The residual is the outflow less the inflow at the same rate, so it needs both curves, and a well the engine cannot build an inflow for has neither.</Note>;
  }
  // A display frame again, and again from engine values: the dip is the deepest
  // the residual goes, and the friction limb takes it to tens of thousands of
  // psi at the open flow, which would hide the zero crossings entirely.
  // If the residual never goes below zero the well has no crossing at all, and
  // a symmetric frame about a positive dip would be upside down, so fall back
  // to letting recharts choose in that case.
  const floor = dip.residualPsi < 0 ? dip.residualPsi : null;
  const startsPositive = dip.residualAtLowestSampledRatePsi > 0;
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Residual at the bottom of the scan"
            value={fmt(dip.residualAtLowestSampledRatePsi, 4)} unit="psi" />
          <Tile label="The rate that was sampled at" value={fmt(dip.lowestSampledRateStbd, 4)} unit="stb/d" />
          <Tile label="It starts POSITIVE" value={yn(startsPositive)} />
          <Tile label="Bottom of the dip, rate" value={fmt(dip.qStbd, 4)} unit="stb/d" />
          <Tile label="Bottom of the dip, residual" value={fmt(dip.residualPsi, 4)} unit="psi" />
          <Tile label="Sign changes across a fine sweep" value={fmt(dip.signChanges, 0)} />
          <Tile label="Residual at the top of the scan"
            value={fmt(dip.residualAtHighestSampledRatePsi, 4)} unit="psi" />
          <Tile label="Crossings the engine reports" value={fmt(crossings.length, 0)} />
        </TileGrid>
      </div>
      <div className="h-80 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="qStbd" type="number" domain={[0, 'dataMax']} tick={AXIS}
              label={{ value: 'rate, stb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={floor === null ? ['auto', 'auto'] : [floor, -floor]}
              allowDataOverflow={floor !== null} tick={AXIS}
              label={{ value: 'residual, outflow less inflow, psi', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={2}
              label={{ value: 'zero: the two curves agree here', fill: '#e2e8f0', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceDot x={dip.qStbd} y={dip.residualPsi} r={5} fill="#f472b6" stroke="none"
              label={{ value: 'the bottom of the dip', fill: '#f472b6', fontSize: 10, position: 'bottom' }} />
            {crossings.map((x) => (
              <ReferenceDot key={x.index} x={x.qStbd} y={0} r={6}
                fill={x.stable ? '#34d399' : '#fb7185'} stroke="#0f172a" />
            ))}
            <Line type="monotone" dataKey="residualPsi" name="the residual"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rate, stb/d</th>
              <th className="text-left pr-3">inflow, psia</th>
              <th className="text-left pr-3">outflow, psia</th>
              <th className="text-left pr-3">residual, psi</th>
              <th className="text-left">what this row is</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={r.qStbd}
                className={r.isCrossing ? 'text-white font-semibold' : (r.isDip ? 'text-[#f472b6]' : '')}>
                <td className="pr-3">{fmt(r.qStbd, 4)}</td>
                <td className="pr-3">{fmt(r.iprPwfPsia, 4)}</td>
                <td className="pr-3">{fmt(r.vlpBhpPsia, 4)}</td>
                <td className="pr-3">{fmt(r.residualPsi, 6)}</td>
                <td className="text-slate-400">
                  {r.isCrossing ? 'a crossing: the residual is nought here' : ''}
                  {r.isDip ? 'the bottom of the dip' : ''}
                  {!r.isCrossing && !r.isDip ? (r.residualPsi > 0 ? 'the tubing wants more than the reservoir offers' : 'the reservoir offers more than the tubing wants') : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A crossing is a claim. The residual is a shape, and it either touches the zero line or it
        does not. On {W.label} a fine sweep counts {fmt(dip.signChanges, 0)} sign
        change{dip.signChanges === 1 ? '' : 's'}, which is exactly the number of crossings the
        engine reports, and the two numbers agreeing is the check worth running.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        {startsPositive
          ? `The residual starts POSITIVE, at ${fmt(dip.residualAtLowestSampledRatePsi, 4)} psi at ${fmt(dip.lowestSampledRateStbd, 4)} stb/d. That is the precondition for two crossings and it is the opposite of the textbook single crossing picture: at low rate the column outweighs what the reservoir can push, so the well cannot start itself. The curve then dips through zero, bottoms out at ${fmt(dip.residualPsi, 4)} psi and comes back up through zero, and those two zeros are the two crossings.`
          : `The residual starts NEGATIVE, at ${fmt(dip.residualAtLowestSampledRatePsi, 4)} psi at ${fmt(dip.lowestSampledRateStbd, 4)} stb/d, which means the reservoir already outpushes the column at the lowest rate on the scan. A residual that starts below zero and ends above it can only cross an odd number of times, and this well crosses once. Two crossings are not available to a well like this one, whatever the tubing does.`}
      </div>
      <Note>
        The depth of the dip is the margin the well has. Lift the whole outflow curve by more than
        {' '}{fmt(dip.residualPsi, 4)} psi, which a wellhead pressure does exactly and one for one,
        and the dip never reaches the zero line, the curves stop touching and the well is dead as
        physics rather than as a scanning artefact. That is a number a scan cannot give you, and it
        is why the residual is the honest check on a tight well.
      </Note>
    </>
  );
};

const Resolution = ({ W }) => {
  const rows = useMemo(() => {
    try { return scanReversalStudy(); } catch { return null; }
  }, []);
  const truth = useMemo(() => {
    try { return scanReversalTruth(); } catch { return null; }
  }, []);
  const pinched = useMemo(() => {
    try { return goldenPinchedScanStudy(); } catch { return null; }
  }, []);
  const own = useMemo(() => {
    try { return wellScanStudy(W, SCAN_GRIDS); } catch { return null; }
  }, [W]);
  if (!rows || !rows.length || !truth || !pinched || !own) {
    return <Note>There is no scan to study. A resolution study solves the same well at a list of grid counts, so it needs a well the engine will attempt at all, and a well with no inflow curve is refused at every resolution alike.</Note>;
  }
  const dead = rows.filter((r) => r.status === 'dead');
  const live = rows.filter((r) => r.status === 'flowing');
  const coarsest = rows[0];
  return (
    <>
      <div className="rounded-md border border-rose-700 bg-rose-900/20 p-4">
        <p className="text-xs text-gray-400 mb-1">
          The same well, the same curves, the same engine, at twelve scan resolutions
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {dead.map((r) => `nGrid ${fmt(r.nGrid, 0)}`).join(', ')}
          <span className="text-rose-300"> returns DEAD</span>
        </p>
        <p className="text-sm mb-0 text-rose-200">
          THE WELL IS ALIVE. Resolved at twenty thousand points the engine finds
          {' '}{fmt(truth.crossings, 0)} crossings, an operating rate of {fmt(truth.opQStbd, 6)}
          {' '}stb/d and a stable window {fmt(truth.windowStbd, 6)} stb/d wide, and the residual dips
          to {fmt(truth.minimumResidualPsi, 6)} psi, which is below zero and therefore a real
          crossing. Every one of the {fmt(live.length, 0)} resolutions that finds the well agrees on
          that rate. The dead verdict is not a wrong number, it is a wrong VERDICT, and it comes
          back with no warning attached because from the scanner's point of view nothing went wrong.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The engine's documented default" value={fmt(DEFAULT_NGRID, 0)} unit="points" />
          <Tile label="Wellhead pressure this study is run at" value={fmt(SCAN_REVERSAL_PWH_PSIA, 2)} unit="psia" />
          <Tile label="The TRUE stable window" value={fmt(truth.windowStbd, 6)} unit="stb/d" />
          <Tile label="Absolute open flow" value={fmt(truth.aofStbd, 4)} unit="stb/d" />
          <Tile label="Interval width at the default" value={fmt(coarsest.spacingStbd, 6)} unit="stb/d" />
          <Tile label="Resolutions tried" value={fmt(rows.length, 0)} />
          <Tile label="Resolutions that report DEAD" value={fmt(dead.length, 0)} />
          <Tile label="Deepest the residual goes" value={fmt(truth.minimumResidualPsi, 6)} unit="psi" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nGrid</th>
              <th className="text-left pr-3">interval, stb/d</th>
              <th className="text-left pr-3">the true window, stb/d</th>
              <th className="text-left pr-3">interval wider than the window</th>
              <th className="text-left pr-3">status returned</th>
              <th className="text-left pr-3">crossings found</th>
              <th className="text-left">operating rate, stb/d</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.nGrid}
                className={r.status === 'dead'
                  ? 'text-rose-200 font-bold bg-rose-900/40 border-y border-rose-600'
                  : 'text-slate-300'}>
                <td className="pr-3">
                  {fmt(r.nGrid, 0)}{r.nGrid === DEFAULT_NGRID ? ' (the default)' : ''}
                </td>
                <td className="pr-3">{fmt(r.spacingStbd, 6)}</td>
                <td className="pr-3 text-slate-500">{fmt(truth.windowStbd, 6)}</td>
                <td className="pr-3">{yn(r.spacingStbd > truth.windowStbd)}</td>
                <td className="pr-3">
                  {r.status === 'dead' ? 'DEAD, and the well is not' : STATUS_WORDS[r.status] || r.status}
                </td>
                <td className="pr-3">{fmt(r.crossings, 0)}</td>
                <td>{r.opQStbd === null ? 'none reported' : fmt(r.opQStbd, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="nGrid" tick={AXIS} interval={0}
              label={{ value: 'nGrid, the number of points the solver scans', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'interval width, stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={truth.windowStbd} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 3"
              label={{ value: `the stable window, ${fmt(truth.windowStbd, 3)} stb/d`, fill: '#e2e8f0', fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="spacingStbd" name="one scan interval" isAnimationActive={false}>
              {rows.map((r) => (
                <Cell key={r.nGrid} fill={r.status === 'dead' ? '#fb7185' : '#BFFF00'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THAT COMPARISON IS THE EXPLANATION. The solver finds crossings by walking a grid and looking
        for a SIGN CHANGE in the residual between neighbouring samples. When the whole dip below
        zero is narrower than one interval, both crossings fall inside a single step, the residual
        never changes sign anywhere on the grid, and the engine has nothing to report. The window
        here is {fmt(truth.windowStbd, 6)} stb/d against an interval of
        {' '}{fmt(coarsest.spacingStbd, 6)} stb/d at the default, on an open flow of
        {' '}{fmt(truth.aofStbd, 4)} stb/d.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        AND IT IS NOT MONOTONE IN RESOLUTION, WHICH IS THE PART THAT CATCHES PEOPLE. A sign change
        scan sees the dip only if one of its intervals STRADDLES it, so whether the well is found
        depends on where the samples LAND and not only on how many of them there are. The row that
        fails here has a FINER interval than the row above it that succeeds. Raising the resolution
        is not a monotone improvement in the verdict, and no single grid count can be trusted on a
        well this close to tangency. The check is the residual, not the scan.
      </div>
      <div className="mt-3 overflow-x-auto">
        <p className="text-xs text-slate-500 mb-1">
          The same finding on the published pinched instrument, whose crossings are the roots of a
          quadratic and are therefore known without any search at all
        </p>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nGrid</th>
              <th className="text-left pr-3">interval, stb/d</th>
              <th className="text-left pr-3">the known window, stb/d</th>
              <th className="text-left pr-3">status returned</th>
              <th className="text-left pr-3">crossings found</th>
              <th className="text-left">operating rate, stb/d</th>
            </tr>
          </thead>
          <tbody>
            {pinched.map((r) => (
              <tr key={r.nGrid}
                className={r.status === 'dead' ? 'text-rose-200 font-bold bg-rose-900/40' : ''}>
                <td className="pr-3">{fmt(r.nGrid, 0)}{r.nGrid === DEFAULT_NGRID ? ' (the default)' : ''}</td>
                <td className="pr-3">{fmt(r.spacingStbd, 6)}</td>
                <td className="pr-3 text-slate-500">{fmt(r.trueWindowStbd, 4)}</td>
                <td className="pr-3">{r.status === 'dead' ? 'DEAD, and the well is not' : STATUS_WORDS[r.status] || r.status}</td>
                <td className="pr-3">{fmt(r.crossings, 0)}</td>
                <td>{r.opQStbd === null ? 'none reported' : fmt(r.opQStbd, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <p className="text-xs text-slate-500 mb-1">
          {W.label} at its own conditions, for contrast: a well with room does not care what the
          scan does
        </p>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">nGrid</th>
              <th className="text-left pr-3">interval, stb/d</th>
              <th className="text-left pr-3">status returned</th>
              <th className="text-left pr-3">crossings found</th>
              <th className="text-left pr-3">window, stb/d</th>
              <th className="text-left">operating rate, stb/d</th>
            </tr>
          </thead>
          <tbody>
            {own.map((r) => (
              <tr key={r.nGrid} className={r.status === 'dead' ? 'text-rose-200 font-bold bg-rose-900/40' : ''}>
                <td className="pr-3">{fmt(r.nGrid, 0)}{r.nGrid === DEFAULT_NGRID ? ' (the default)' : ''}</td>
                <td className="pr-3">{fmt(r.spacingStbd, 6)}</td>
                <td className="pr-3">{STATUS_WORDS[r.status] || r.status}</td>
                <td className="pr-3">{fmt(r.crossings, 0)}</td>
                <td className="pr-3">{r.windowStbd === null ? 'one crossing only' : fmt(r.windowStbd, 4)}</td>
                <td>{r.opQStbd === null ? 'none reported' : fmt(r.opQStbd, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        THE SCAN FAILS LONG BEFORE THE STABILITY SLOPE TEST DOES, and that is the most useful
        sentence in this tier. The slope test is careful, it takes a central difference either side
        of a crossing and classifies it properly, and it never gets the chance to run because the
        scan handed it nothing to classify. A solver with a fixed resolution has a smallest feature
        it can see, and a well near tangency is smaller than that feature. Raise the grid, check the
        residual, and never take a dead verdict on a tight well at face value.
      </Note>
    </>
  );
};

const Sweep = ({ W }) => {
  const [extra, setExtra] = useState('');
  const rows = useMemo(() => {
    try { return wellPwhSweepDetail(W, withCustom(W.sweepPwhPsia, extra)); } catch { return null; }
  }, [W, extra]);
  const win = useMemo(() => {
    try { return wellWindow(W); } catch { return null; }
  }, [W]);
  if (!rows || !rows.length || !win) {
    return <Note>There is no decision to sweep. Every point on a sweep is a full node solve, so a well the engine will not solve at one wellhead pressure will not be solved at four either, and the sweep comes back empty rather than partly invented.</Note>;
  }
  // A dead point is not a rate of zero and must not be drawn as one. The
  // series carries null there, so the line breaks and the reader sees the gap
  // rather than a well that quietly produced nothing.
  const series = rows.map((r) => ({
    ...r,
    liveQStbd: r.status === 'flowing' ? r.qStbd : null,
    livePwfPsia: r.status === 'flowing' ? r.pwfPsia : null,
    liveWindowStbd: r.status === 'flowing' ? r.windowStbd : null,
  }));
  const dead = rows.filter((r) => r.status !== 'flowing');
  const live = rows.filter((r) => r.status === 'flowing');
  return (
    <>
      <FieldGrid>
        <NumField label="Add a wellhead pressure of your own, psia" value={extra} onChange={setExtra}
          placeholder={String(W.sweepPwhPsia[W.sweepPwhPsia.length - 1])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Pressures swept" value={fmt(rows.length, 0)} />
          <Tile label="Of those, the well is alive at" value={fmt(live.length, 0)} />
          <Tile label="And dead at" value={fmt(dead.length, 0)} />
          <Tile label="Stable window at the lowest live pressure"
            value={live.length ? fmt(live[0].windowStbd, 4) : 'the well is dead everywhere'}
            unit={live.length && live[0].windowStbd !== null ? 'stb/d' : ''} />
          <Tile label="Rate at the lowest live pressure"
            value={live.length ? fmt(live[0].qStbd, 4) : '-'} unit={live.length ? 'stb/d' : ''} />
          <Tile label="Rate at the highest live pressure"
            value={live.length ? fmt(live[live.length - 1].qStbd, 4) : '-'} unit={live.length ? 'stb/d' : ''} />
          <Tile label="Its wellhead pressure"
            value={live.length ? fmt(live[live.length - 1].pWhPsia, 2) : '-'} unit={live.length ? 'psia' : ''} />
          <Tile label="The lowest pressure that kills it"
            value={dead.length ? fmt(dead[0].pWhPsia, 2) : 'nothing on this sweep kills it'}
            unit={dead.length ? 'psia' : ''} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 30, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="pWhPsia" type="number" tick={AXIS}
              label={{ value: 'wellhead pressure, psia', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="q" tick={AXIS}
              label={{ value: 'operating rate, stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="w" orientation="right" tick={AXIS}
              label={{ value: 'stable window, stb/d', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {dead.map((r) => (
              <ReferenceLine key={r.pWhPsia} yAxisId="q" x={r.pWhPsia} stroke="#fb7185" strokeDasharray="4 3"
                label={{ value: 'DEAD', fill: '#fb7185', fontSize: 10, position: 'top' }} />
            ))}
            <Line yAxisId="q" type="monotone" dataKey="liveQStbd" name="operating rate, where there is one"
              stroke="#BFFF00" dot connectNulls={false} isAnimationActive={false} />
            <Line yAxisId="w" type="monotone" dataKey="liveWindowStbd" name="stable window, where there is one"
              stroke="#38bdf8" strokeDasharray="4 3" dot connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">wellhead pressure, psia</th>
              <th className="text-left pr-3">the dead column, psia</th>
              <th className="text-left pr-3">status</th>
              <th className="text-left pr-3">crossings</th>
              <th className="text-left pr-3">unstable crossing, stb/d</th>
              <th className="text-left pr-3">operating rate, stb/d</th>
              <th className="text-left pr-3">operating pressure, psia</th>
              <th className="text-left">stable window, stb/d</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pWhPsia}
                className={r.status === 'flowing' ? '' : 'text-rose-200 font-bold bg-rose-900/40'}>
                <td className="pr-3">{fmt(r.pWhPsia, 2)}</td>
                <td className="pr-3 text-slate-400">{fmt(r.deadColumnPsia, 0)}</td>
                <td className="pr-3">{STATUS_WORDS[r.status] || r.status}</td>
                <td className="pr-3">{fmt(r.crossings, 0)}</td>
                <td className="pr-3">{r.unstableQStbd === null ? 'none' : fmt(r.unstableQStbd, 4)}</td>
                <td className="pr-3">{r.status === 'flowing' ? fmt(r.qStbd, 4) : 'no rate at all'}</td>
                <td className="pr-3">{Number.isFinite(r.pwfPsia) ? fmt(r.pwfPsia, 4) : 'none'}</td>
                <td>{r.windowStbd === null ? 'none' : fmt(r.windowStbd, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        {dead.length
          ? `The green line stops. It does not fall to zero and it does not carry on flat, it BREAKS, at ${fmt(dead[0].pWhPsia, 2)} psia, because there is no operating rate there to draw. Choking a well back lifts the whole outflow curve by the amount you added, one for one, so the two crossings walk towards each other, the stable window narrows, and at some pressure the curves stop touching and the well has no solution at any rate. Reporting that as a rate of zero would be a lie of the worst kind, because zero is a number and the answer here is that there is no number.`
          : `Nothing on this sweep kills the well, and the sweep says so plainly rather than implying safety. Raise the wellhead pressure far enough with the field above and the green line will break: choking a well back lifts the whole outflow curve one for one, the crossings walk towards each other and at some pressure the curves stop touching altogether. Where that happens is the margin this well is operating on.`}
      </div>
      <div className="mt-2 text-xs text-slate-300">
        Read the window column beside the rate column, because they do not carry the same warning.
        The rate falls smoothly and gives no sign of what is coming. The window is the thing that
        collapses, and it collapses first. A well can be losing almost none of its rate while it
        loses most of the room it has to hold that rate in, and a report that quotes only the
        operating point has thrown away the half of the answer that was about to matter.
      </div>
      <Note>
        This is why a sweep is a stronger answer than a point. Near tangency the payoff and the
        penalty are not symmetric: a small reduction in wellhead pressure buys a large gain in rate
        and in room, and a small increase kills the well outright. That asymmetry is not a quirk of
        one well, it is what you always get when two curves are nearly tangent, and no single
        operating point on a page can show it.
      </Note>
    </>
  );
};

const NodeExplorer = () => {
  const [mode, setMode] = useState('crossings');
  const [wellLabel, setWellLabel] = useState(ESCRAVOS_9.label);
  const W = wellOf(wellLabel);
  return (
    <PanelShell
      title="Node explorer"
      subtitle="Both curves and every place they meet, the residual and the zero it can touch twice, the scan resolution that decides whether the solver sees the well at all, and a decision swept rather than reported as a point"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Teaching well" value={wellLabel} onChange={setWellLabel} options={WELLS} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'crossings' && <Crossings W={W} />}
        {mode === 'residual' && <Residual W={W} />}
        {mode === 'resolution' && <Resolution W={W} />}
        {mode === 'sweep' && <Sweep W={W} />}
      </div>
    </PanelShell>
  );
};

export default NodeExplorer;
