import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ReferenceDot, Cell,
} from 'recharts';
import {
  CONTINGENCY_FRAC, NPT_FRAC, MC_ANALYTIC, RISK_DOC, RISK_UNCERTAINTIES, MC_UNCERTAINTIES,
  publishedCostCurve, publishedCostCurveCheckpoint, unlinkedLumpCurve,
  curveEndpointCheck, endpointIdentitySweep, mcBaseAtModes, triangularMean,
  riskedRun, riskHistogram, costPercentile, contingencySweep,
} from './wellCostLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Risk explorer, the Expert tier. The cost-time curve and its checkpoint, the
// identity the curve rests on, the declared ranges and what they do to a base
// case, and the percentiles of a seeded run with the convention attached to
// every one of them.
//
// The engine is deterministic and stays that way: the run below draws the
// declared distributions and calls the same evaluators once per realization.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
  : '-');

const cents = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

// A disagreement smaller than a cent still has to be readable, because
// rounding it to 0.00 would claim an exactness the number may not have.
const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.005 ? v.toExponential(2) : cents(v);
};

const MODES = [
  ['curve', 'The cost-time curve'],
  ['identity', 'Where the curve ends'],
  ['uncertainty', 'The declared ranges'],
  ['risked', 'The percentiles, with their conventions'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const Curve = () => {
  const [lump, setLump] = useState('');
  const points = useMemo(() => {
    try {
      const v = Number(lump);
      return Number.isFinite(v) && v > 0 ? unlinkedLumpCurve(v) : publishedCostCurve();
    } catch { return null; }
  }, [lump]);
  const checkpoint = useMemo(() => {
    try { return publishedCostCurveCheckpoint(); } catch { return null; }
  }, []);
  if (!points || points.length < 2 || !checkpoint) {
    return <Note>There is no curve to draw. A lump item that links an activity the programme does not contain is refused by the engine, because money attached to nothing has no moment at which it lands.</Note>;
  }
  const last = points[points.length - 1];
  const nonDecreasing = points.every((p, i) => i === 0 || p.usd >= points[i - 1].usd);
  return (
    <>
      <FieldGrid>
        <NumField label="Add an UNLINKED lump, USD" value={lump} onChange={setLump} placeholder="123456" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Points on the curve" value={fmt(points.length, 0)} />
          <Tile label="Spend at spud" value={usd(points[0].usd)} unit="USD" />
          <Tile label="Elapsed hours at the end" value={fmt(last.tHr, 3)} unit="h" />
          <Tile label="Spend at the end" value={usd(last.usd)} unit="USD" />
          <Tile label="Checkpoint at" value={fmt(checkpoint.tHr, 3)} unit="h" />
          <Tile label="Cumulative there" value={usd(checkpoint.usd)} unit="USD" />
          <Tile label="Share of the run spent by then" value={pct(checkpoint.usd / last.usd, 2)} />
          <Tile label="Does the curve ever fall" value={nonDecreasing ? 'no' : 'yes'} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 20, bottom: 18, left: 20 }}>
            {GRID}
            <XAxis dataKey="tHr" type="number" tick={AXIS}
              label={{ value: 'elapsed hours', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={(v) => usd(v)}
              label={{ value: 'cumulative USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={checkpoint.tHr} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'checkpoint', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <ReferenceDot x={checkpoint.tHr} y={checkpoint.usd} r={5} fill="#f472b6" stroke="none" />
            <Line type="linear" dataKey="usd" name="cumulative base cost"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">elapsed, h</th>
              <th className="text-left pr-3">cumulative, USD</th>
              <th className="text-left">step from the point before, USD</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={p.tHr} className={Math.abs(p.tHr - checkpoint.tHr) < 1e-9 ? 'text-[#f472b6]' : ''}>
                <td className="pr-3">{fmt(p.tHr, 4)}</td>
                <td className="pr-3">{usd(p.usd)}</td>
                <td>{i === 0 ? '-' : usd(p.usd - points[i - 1].usd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The curve accrues day-rate money smoothly with the clock, per-meter money with the hole,
        and lump money as a STEP at the end of the activity it is linked to. That is why the steps
        are uneven: the big ones are the casing, the wellhead and the completion landing all at
        once. At the checkpoint, {fmt(checkpoint.tHr, 3)} h, the well has spent
        {' '}{usd(checkpoint.usd)} USD, which is {pct(checkpoint.usd / last.usd, 2)} of the run.
      </div>
      <Note>
        Type an unlinked lump above and watch where it lands. Every published lump names the
        activity it belongs to, which is why this curve starts at nought. Leave the link off and the
        money does not go away, it steps in at SPUD, before a metre of hole exists. A cost curve
        that starts above zero is telling you something about your item list rather than about your
        well.
      </Note>
    </>
  );
};

const Identity = () => {
  const check = useMemo(() => {
    try { return curveEndpointCheck(); } catch { return null; }
  }, []);
  const sweep = useMemo(() => {
    try { return endpointIdentitySweep(); } catch { return null; }
  }, []);
  if (!check || !sweep || !sweep.length) {
    return <Note>The identity cannot be checked without both halves of it: a curve the engine has drawn and an AFE it has rolled up from the same programme. One without the other is not a comparison.</Note>;
  }
  const exact = check.endUsd === check.baseUsd;
  const gap = check.totalUsd - check.endUsd;
  const gapMatchesContingency = gap === check.contingencyUsd;
  const worst = sweep.reduce((a, b) => (b.absErrorUsd > a.absErrorUsd ? b : a));
  const overACent = sweep.filter((r) => r.absErrorUsd > 0.01).length;
  return (
    <>
      <div className={`rounded-md border p-4 ${exact ? 'border-emerald-600 bg-emerald-900/20' : 'border-rose-700 bg-rose-900/20'}`}>
        <p className="text-xs text-gray-400 mb-1">The last point on the curve, against the AFE base subtotal</p>
        <p className="text-2xl font-bold text-white mb-1">
          {cents(check.endUsd)} <span className="text-[#BFFF00]">=</span> {cents(check.baseUsd)} USD
        </p>
        <p className="text-sm mb-0 text-emerald-300">
          {exact ? 'Identical, to every digit a double can hold.' : 'These two do not agree, and one of them is wrong.'}
          {' '}The difference is {cents(check.absErrorUsd)} USD, and the strict equality test returns
          {' '}{String(exact)}.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Curve ends at" value={cents(check.endUsd)} unit="USD" />
          <Tile label="AFE base subtotal" value={cents(check.baseUsd)} unit="USD" />
          <Tile label="Absolute difference" value={cents(check.absErrorUsd)} unit="USD" />
          <Tile label="Relative difference" value={tiny(check.relError)} />
          <Tile label="AFE total for approval" value={cents(check.totalUsd)} unit="USD" />
          <Tile label="Total minus the curve end" value={cents(gap)} unit="USD" />
          <Tile label="Contingency on that AFE" value={cents(check.contingencyUsd)} unit="USD" />
          <Tile label="Is that gap the contingency" value={gapMatchesContingency ? 'yes, exactly' : 'no'} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'curve, last point', v: check.endUsd },
            { name: 'AFE base subtotal', v: check.baseUsd },
            { name: 'AFE total', v: check.totalUsd },
          ]} margin={{ top: 10, right: 16, bottom: 5, left: 20 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={(v) => usd(v)} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => cents(v)} />
            <ReferenceLine y={check.baseUsd} stroke="#BFFF00" strokeDasharray="5 3"
              label={{ value: 'the base subtotal, where the curve lands', fill: '#BFFF00', fontSize: 10, position: 'insideBottomRight' }} />
            <Bar dataKey="v" name="USD" isAnimationActive={false}>
              <Cell fill="#BFFF00" />
              <Cell fill="#BFFF00" />
              <Cell fill="#f472b6" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">allowance on the schedule</th>
              <th className="text-left pr-3">curve ends at, USD</th>
              <th className="text-left pr-3">base subtotal, USD</th>
              <th className="text-left pr-3">difference, USD</th>
              <th className="text-left">relative</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.nptFrac} className={r.nptFrac === NPT_FRAC ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.nptFrac, 6)}</td>
                <td className="pr-3">{cents(r.endUsd)}</td>
                <td className="pr-3">{cents(r.baseUsd)}</td>
                <td className="pr-3 text-[#BFFF00]">{tiny(r.absErrorUsd)}</td>
                <td>{tiny(r.relError)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The identity is not a coincidence of one fixture's round numbers. Across
        {' '}{fmt(sweep.length, 0)} different schedules, from no allowance at all to double the
        work, the worst disagreement anywhere is {tiny(worst.absErrorUsd)} USD on a
        {' '}{usd(worst.baseUsd)} USD subtotal, and {fmt(overACent, 0)} of those rows differ by as
        much as a cent. The two sides are literally the same products summed in a different order,
        so the only thing separating them is the last bit of a double.
      </div>
      <Note>
        Read the third bar carefully. The curve does NOT end on the total, and it must not: the gap
        of {cents(gap)} USD is exactly the contingency, and contingency is a provision rather than
        an accrual. A curve drawn to the total would be showing money that nobody has spent and
        that may never be spent, which flatters every progress comparison made against it. When a
        cost curve on a real well ends above the base subtotal, the provision has been quietly
        moved into the plan.
      </Note>
    </>
  );
};

const Uncertainty = () => {
  const [source, setSource] = useState('published');
  const list = source === 'published' ? RISK_UNCERTAINTIES : MC_UNCERTAINTIES;
  const rows = useMemo(() => {
    try {
      return (list || []).map((u) => ({
        key: `${u.target}-${u.id}-${u.field}`,
        target: u.target,
        id: u.id,
        field: u.field,
        min: u.dist.min,
        mode: u.dist.mode,
        max: u.dist.max,
        mean: triangularMean(u.dist),
        lean: triangularMean(u.dist) - u.dist.mode,
      }));
    } catch { return null; }
  }, [list]);
  const fixture = useMemo(() => {
    try { return mcBaseAtModes(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !fixture) {
    return <Note>No uncertainty ranges are declared on this case, so there is nothing to sample. A deterministic estimate with no declared ranges is not a low-risk well, it is an unmeasured one.</Note>;
  }
  const up = rows.filter((r) => r.lean > 0);
  const down = rows.filter((r) => r.lean < 0);
  const gapUsd = MC_ANALYTIC.meanUsd - fixture.totalUsd;
  return (
    <>
      <SelectField label="Which declared set" value={source} onChange={setSource}
        options={[['published', 'The published well: two rates and two prices'], ['fixture', 'The linear fixture, whose mean is published analytically']]} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Ranges declared" value={fmt(rows.length, 0)} />
          <Tile label="Leaning up, mean above mode" value={fmt(up.length, 0)} />
          <Tile label="Leaning down, mean below mode" value={fmt(down.length, 0)} />
          <Tile label="Iterations the case asks for" value={fmt(RISK_DOC.iterations, 0)} />
          <Tile label="Seed it records" value={fmt(RISK_DOC.seed, 0)} />
          <Tile label="Fixture base at the modes" value={usd(fixture.totalUsd)} unit="USD" />
          <Tile label="Its analytic mean" value={usd(MC_ANALYTIC.meanUsd)} unit="USD" />
          <Tile label="The gap between them" value={usd(gapUsd)} unit="USD" />
        </TileGrid>
      </div>
      <div className="h-60 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 16, bottom: 30, left: 10 }}>
            {GRID}
            <XAxis dataKey="id" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'mean minus mode, in the field units', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="lean" name="how far the mean sits from the mode" isAnimationActive={false}>
              {rows.map((r) => <Cell key={r.key} fill={r.lean >= 0 ? '#BFFF00' : '#38bdf8'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">what varies</th>
              <th className="text-left pr-3">field</th>
              <th className="text-left pr-3">min</th>
              <th className="text-left pr-3">mode</th>
              <th className="text-left pr-3">max</th>
              <th className="text-left pr-3">mean</th>
              <th className="text-left">mean minus mode</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="pr-3">{r.target} {r.id}</td>
                <td className="pr-3">{r.field}</td>
                <td className="pr-3">{fmt(r.min, 4)}</td>
                <td className="pr-3">{fmt(r.mode, 4)}</td>
                <td className="pr-3">{fmt(r.max, 4)}</td>
                <td className="pr-3">{fmt(r.mean, 4)}</td>
                <td className={r.lean >= 0 ? 'text-[#BFFF00]' : 'text-[#38bdf8]'}>{fmt(r.lean, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A triangular mean is the average of its three corners and not its mode, so a base case
        built at the modes is a mode-of-modes and lands wherever the corners put it. On the linear
        fixture that is {usd(fixture.totalUsd)} USD against an analytic mean of
        {' '}{usd(MC_ANALYTIC.meanUsd)}, a gap of {usd(gapUsd)}, with a standard deviation of
        {' '}{fmt(MC_ANALYTIC.sdUsd, 6)} USD. Of the {fmt(rows.length, 0)} ranges in this set,
        {' '}{fmt(up.length, 0)} lean up and {fmt(down.length, 0)} lean down.
        {down.length > 0
          ? ' The blue bars are the ones pulling the other way, and the aggregate leans up only because the rest lean up harder.'
          : ' Nothing here pulls downward, which is the usual shape and not a rule: switch to the fixture and one of its four ranges has a mean below its mode.'}
      </div>
      <Note>
        The published set is harder than the fixture and in one specific way. Two of its four
        ranges are RATES, and a time goes as one over a rate, so a symmetric range on a rate is an
        asymmetric range on the hours it buys: the slow tail is longer than the fast tail is short.
        That convexity is on top of the leaning shown above, and it is the reason an estimate built
        at the modes cannot be assumed to sit in the middle of its own distribution.
      </Note>
    </>
  );
};

const CONVENTION = {
  p10: {
    petroleum: 'the optimistic case, the value exceeded only one time in ten',
    cost: 'P90 in the cost convention: the cost NOT exceeded nine times in ten, the conservative one',
    read: 'read nine tenths of the way up the sorted list',
  },
  p50: {
    petroleum: 'the median, the even money outcome',
    cost: 'P50 in the cost convention as well: the only label that means the same in both',
    read: 'read halfway up the sorted list',
  },
  p90: {
    petroleum: 'the conservative case for a VOLUME, the value exceeded nine times in ten',
    cost: 'P10 in the cost convention: the cheap case, the cost exceeded nine times in ten',
    read: 'read one tenth of the way up the sorted list',
  },
};

const Risked = () => {
  const [iters, setIters] = useState(String(RISK_DOC.iterations));
  const [seed, setSeed] = useState(String(RISK_DOC.seed));
  const [frac, setFrac] = useState(String(CONTINGENCY_FRAC));
  const iterations = Number(iters);
  const seedNum = Number(seed);
  const contingencyFrac = Number(frac);
  const run = useMemo(() => {
    try {
      if (!Number.isFinite(iterations) || iterations < 10 || iterations > 20000) return null;
      if (!Number.isFinite(seedNum)) return null;
      if (!Number.isFinite(contingencyFrac) || contingencyFrac < 0) return null;
      return riskedRun({ iterations, seed: seedNum, contingencyFrac });
    } catch { return null; }
  }, [iterations, seedNum, contingencyFrac]);
  const bins = useMemo(() => {
    try { return riskHistogram(run, 24); } catch { return []; }
  }, [run]);
  const deterministic = useMemo(() => {
    try {
      if (!Number.isFinite(contingencyFrac) || contingencyFrac < 0) return null;
      return contingencySweep([contingencyFrac])[0];
    } catch { return null; }
  }, [contingencyFrac]);
  if (!run || !deterministic) {
    return <Note>That is not a run the sampler will make. Iterations have to be a whole number between 10 and 20,000 so the run finishes in the page, the seed has to be a number so the result can be reproduced, and the contingency fraction has to be nought or more.</Note>;
  }
  const basePctile = costPercentile(run, run.base.totalUsd);
  const chosenPctile = costPercentile(run, deterministic.totalUsd);
  const rows = ['p10', 'p50', 'p90'].map((k) => ({
    key: k,
    valueUsd: run.sampler[k],
    ...CONVENTION[k],
  }));
  return (
    <>
      <FieldGrid>
        <NumField label="Iterations" value={iters} onChange={setIters} placeholder="2000" />
        <NumField label="Seed" value={seed} onChange={setSeed} placeholder="42" />
        <NumField label="Contingency fraction" value={frac} onChange={setFrac} placeholder="0.1" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Realizations" value={fmt(run.iterations, 0)} />
          <Tile label="Mean" value={usd(run.meanUsd)} unit="USD" />
          <Tile label="Median" value={usd(run.medianUsd)} unit="USD" />
          <Tile label="Mean minus median" value={usd(run.meanUsd - run.medianUsd)} unit="USD" />
          <Tile label="Standard deviation" value={usd(run.sdUsd)} unit="USD" />
          <Tile label="Coefficient of variation" value={fmt(run.covUsd, 6)} />
          <Tile label="Cheapest realization" value={usd(run.minUsd)} unit="USD" />
          <Tile label="Dearest realization" value={usd(run.maxUsd)} unit="USD" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 20, bottom: 18, left: 20 }}>
            {GRID}
            <XAxis dataKey="midUsd" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              tickFormatter={(v) => usd(v)}
              label={{ value: 'total cost of a realization, USD', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'realizations', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 0)} labelFormatter={(v) => `${usd(v)} USD`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={run.base.totalUsd} stroke="#f472b6"
              label={{ value: 'the deterministic base', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={run.sampler.p90} stroke="#38bdf8" strokeDasharray="4 3"
              label={{ value: 'sampler p90, the cheap tail', fill: '#38bdf8', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine x={run.sampler.p10} stroke="#38bdf8" strokeDasharray="4 3"
              label={{ value: 'sampler p10, the dear tail', fill: '#38bdf8', fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="count" name="realizations in the bin" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">the sampler calls it</th>
              <th className="text-left pr-3">USD</th>
              <th className="text-left pr-3">where it is read</th>
              <th className="text-left pr-3">petroleum convention, which is what it returns</th>
              <th className="text-left">the same number in the COST convention</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="pr-3 text-[#BFFF00]">{r.key}</td>
                <td className="pr-3">{usd(r.valueUsd)}</td>
                <td className="pr-3 text-slate-400">{r.read}</td>
                <td className="pr-3 text-slate-400">{r.petroleum}</td>
                <td className="text-[#f472b6]">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Deterministic total at this fraction" value={usd(deterministic.totalUsd)} unit="USD" />
          <Tile label="Its cost-convention percentile" value={pct(chosenPctile, 1)} />
          <Tile label="Base case at the modes" value={usd(run.base.totalUsd)} unit="USD" />
          <Tile label="Its cost-convention percentile" value={pct(basePctile, 1)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Every percentile above is labelled twice on purpose. The suite's canonical sampler was
        written for reserves, where higher confidence points DOWNWARD, so it crosses its own labels
        over: its p10 field is read nine tenths of the way up the sorted list and its p90 field one
        tenth of the way up. Push cost through it and the field named p90,
        {' '}{usd(run.sampler.p90)} USD here, is the CHEAP outcome. Print that beside a caption
        saying conservative case and the estimate is not slightly wrong, it is backwards by the
        width of the distribution.
      </div>
      <Note>
        The last two tiles are the sentence worth taking to an approver. A contingency fraction is
        an input and the confidence it buys is an output: at {fmt(contingencyFrac, 5)} the total is
        {' '}{usd(deterministic.totalUsd)} USD, and in the cost convention that covers
        {' '}{pct(chosenPctile, 1)} of the realizations in this run. Change the fraction and read
        the percentile again, because two wells with the same base and the same fraction can sit at
        completely different percentiles. And the run itself is only as honest as the ranges: this
        seed and these {fmt(run.iterations, 0)} iterations reproduce exactly, which says nothing at
        all about whether the distributions were right.
      </Note>
    </>
  );
};

const RiskExplorer = () => {
  const [mode, setMode] = useState('curve');
  return (
    <PanelShell
      title="Risk explorer"
      subtitle="The cost-time curve and the identity it rests on, the declared ranges, and the percentiles of a seeded run with the convention attached to every one"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'curve' && <Curve />}
        {mode === 'identity' && <Identity />}
        {mode === 'uncertainty' && <Uncertainty />}
        {mode === 'risked' && <Risked />}
      </div>
    </PanelShell>
  );
};

export default RiskExplorer;
