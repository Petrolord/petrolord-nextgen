import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  BELIEF, SAMPLE_ORDER, PRICE_BRACKET_TOP,
  fits, beliefLabels, publishedInexactFit, samplingWalk, seedComparison,
  breakevenCurve, hurdles, taxKinks, solveCases,
  breakevenRun, tornado, publishedUnreachable, publishedBreakevenRuns,
} from './uncertaintyLab';
import { parameterPercentileLabel } from '@petrolord/engines/lib/conventions/percentile.js';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Breakeven explorer, the Professional tier. PERCENTILES DONE PROPERLY: three
// stated percentiles fitted to a triangular that passes through all three, the
// seeded draws and the inverse CDF, the breakeven price by bisection, and the
// sample read as three percentiles of a price with a two-sided tornado.
//
// Every figure on this page is a return value from uncertaintyLab, which is a
// return value from the vendored breakeven engine, the screening engine or
// lib/stats. Nothing here computes a dollar or a barrel. Every percentile word
// comes from lib/conventions/percentile.js. A breakeven price is a quantity
// where more is worse and every input is a parameter, so neither ever takes a
// P-label on this page: labels for a price carry data-plabel="price" and labels
// for an input carry data-plabel="input", and a gate reads both off the markup.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');
const ratio = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');

export const MODES = [
  ['fit', 'Fit: three beliefs, the fitted triangles and the band'],
  ['sample', 'Sample: the seeded draws and the inverse CDF'],
  ['solve', 'Solve: NPV against price, hurdles and the tax kinks'],
  ['distribution', 'Distribution: the percentiles, the S-curve and the tornado'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const PriceLabel = ({ children }) => <span data-plabel="price">{children}</span>;
const InputLabel = ({ children }) => <span data-plabel="input">{children}</span>;

/** The engine's tornado bar names, and which stated percentile each side comes from. */
const TORNADO_SIDES = {
  'Total CAPEX': ['capex', 'q10', 'q90'],
  'Annual OPEX': ['opex', 'q10', 'q90'],
  // A higher efficiency is a lower breakeven, so the low-price end is its 90th.
  'Prod. Efficiency': ['efficiency', 'q90', 'q10'],
};
const sideLabel = (variable, side) => {
  const s = TORNADO_SIDES[variable];
  return s ? parameterPercentileLabel(s[0], side === 'low' ? s[1] : s[2]) : variable;
};

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

const RunButton = ({ onClick, running, children }) => (
  <button type="button" onClick={onClick} disabled={running}
    className={`px-3 py-1.5 rounded-md border text-xs ${running ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'}`}>
    {running ? 'Running the engine...' : children}
  </button>
);

/**
 * Run an expensive reader on request. The state is set to running first and
 * the reader is called on the next tick, so the button can say so before the
 * engine holds the page.
 */
const useRun = () => {
  const [state, setState] = useState({ status: 'idle', value: null, error: null });
  const start = (fn) => {
    setState({ status: 'running', value: null, error: null });
    setTimeout(() => {
      try { setState({ status: 'done', value: fn(), error: null }); } catch (e) { setState({ status: 'error', value: null, error: e.message }); }
    }, 30);
  };
  return [state, start];
};

// ---------------------------------------------------------------------------

export const FitMode = ({ fit, inexact, onInexact, inexactRunning }) => {
  if (!fit) return <Note>The fit did not run. A triangular fit needs three stated percentiles with the 90th above the 10th.</Note>;
  const [q10, q50, q90] = beliefLabels(null);
  return (
    <>
      <Tbl
        head={['variable', <InputLabel key="a">{`stated ${q10}`}</InputLabel>, <InputLabel key="b">{`stated ${q50}`}</InputLabel>, <InputLabel key="c">{`stated ${q90}`}</InputLabel>, 'shape ratio (derived)', 'fitted min', 'fitted mode', 'fitted max', 'mode position m (derived)', 'passes through all three']}
        rows={fit.rows.map((x) => [
          <InputLabel key={x.key}>{x.name}</InputLabel>, String(x.stated[0]), String(x.stated[1]), String(x.stated[2]),
          ratio(x.shapeRatioDerived), four(x.min), four(x.mode), four(x.max),
          // A clamped fit's m is floating point noise where the ratio is flat; say where the mode sits instead.
          x.exact ? ratio(x.mDerived) : (x.shapeRatioDerived <= fit.band.modeAtMinimumDerived ? 'at the minimum, clamped' : 'at the maximum, clamped'),
          x.exact ? 'yes' : 'no, clamped',
        ])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Reachable shape ratio, mode at the minimum" value={ratio(fit.band.modeAtMinimumDerived)} />
          <Tile label="Reachable shape ratio, mode at the maximum" value={ratio(fit.band.modeAtMaximumDerived)} />
          <Tile label="Narrow opex belief, shape ratio" value={ratio(fit.rows[3].shapeRatioDerived)} />
          <Tile label="Narrow opex belief, exact" value={fit.rows[3].exact ? 'yes' : 'no'} />
        </TileGrid>
      </div>
      <Tbl
        head={['capex quantile read back', '0.1', '0.5', '0.9']}
        rows={[
          ['the fitted triangle', ...fit.capexCheck.fitted.map(four)],
          ['the beliefs used as minimum, mode and maximum (the old error)', ...fit.capexCheck.beliefsAsEndpoints.map(four)],
        ]}
      />
      <div className="mt-3 text-xs text-slate-300">
        The shape ratio is the stated median&apos;s distance above the {q10} over the whole stated spread. It depends
        only on where the mode sits, so one bisection on the mode position recovers the shape and the range and
        origin follow in closed form. A ratio outside the band cannot be honoured by any triangular. The engine says
        so rather than returning a shape that misses the belief: <span className="text-slate-400">{fit.narrowNote}</span>.
      </div>
      <div className="mt-3 flex items-center gap-3">
        <RunButton onClick={onInexact} running={inexactRunning}>Run the published case where both fits clamp (300 iterations)</RunButton>
      </div>
      {inexact && (
        <Tbl
          head={['published mc_inexact_fit_note', 'min', 'mode', 'max', 'exact', 'engine note']}
          rows={Object.entries(inexact.fits).map(([k, x]) => [<InputLabel key={k}>{k}</InputLabel>, four(x.min), four(x.mode), four(x.max), x.exact ? 'yes' : 'no', x.note ?? ''])}
        />
      )}
      <Note>
        Read the old error row against the stated beliefs of {BELIEF.capex.join(', ')}. Used as endpoints, the
        beliefs declare that nothing lies below the first or above the last, and the quantiles read back pull in
        toward the middle: the tails vanish and every downside case is understated. A fit is now bounded by physics
        (EC3-8): the fitted efficiency here tops out at {fit.rows[2] ? four(fit.rows[2].max) : 'null'} percent, and where a wider belief carries a
        fitted tail past 100 percent the draws are held at the limit and counted in clippedDraws, while a stated
        percentile below zero, or an efficiency above 100, is refused by name.
      </Note>
    </>
  );
};

export const SampleMode = ({ walk, seed, onSeed, comparison, onCompare, compareRunning }) => {
  if (!walk) return <Note>The generator did not run.</Note>;
  const medianLabel = parameterPercentileLabel('breakeven price', 'q50');
  return (
    <>
      {onSeed && (
        <FieldGrid>
          <SelectField label="Seed" value={String(seed)} onChange={(v) => onSeed(Number(v))} options={[['20260829', '20260829, the engine default'], ['7', '7, another seed']]} />
        </FieldGrid>
      )}
      <p className="text-xs text-slate-400 mt-2 mb-0">mulberry32({walk.seed}), the first six draws: {walk.draws.map(ratio).join(', ')}.</p>
      <Tbl
        head={['draw', 'u', 'variable', 'F(mode) (derived)', 'branch', 'sampled value']}
        rows={walk.iteration1.map((x) => [x.draw, ratio(x.u), <InputLabel key={x.variable}>{x.variable}</InputLabel>, ratio(x.fModeDerived), x.branch, four(x.sampled)])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Iteration 1 takes draws 1, 2 and 3 in the fixed order {SAMPLE_ORDER.join(', ')}. A draw at or below F(mode)
        takes the lower branch of the inverse CDF, min plus the root of u times the range times the distance to the
        mode; above it takes the upper branch from the maximum. Efficiency is sampled in percent and divided by 100
        before it reaches the ledger.
      </div>
      <div className="mt-3 flex items-center gap-3">
        <RunButton onClick={onCompare} running={compareRunning}>Run the seed comparison (three 5000 iteration runs, slow)</RunButton>
      </div>
      {comparison && (
        <div className="mt-3">
          <TileGrid>
            <Tile label={`Two runs at seed ${comparison.seed} give identical samples`} value={comparison.identicalSamples ? 'yes' : 'no'} />
            <Tile label={<PriceLabel>{`${medianLabel} at seed ${comparison.seed}`}</PriceLabel>} value={four(comparison.medianAtSeed)} unit="USD/bbl" />
            <Tile label={<PriceLabel>{`${medianLabel} at seed ${comparison.otherSeed}`}</PriceLabel>} value={four(comparison.medianAtOtherSeed)} unit="USD/bbl" />
          </TileGrid>
        </div>
      )}
      <Note>
        The seed fixes the sequence, so the same inputs and the same seed give the same sample to the last digit.
        Another seed gives another sample and another median. Neither is the right one.
      </Note>
    </>
  );
};

export const SolveMode = ({ curve, hurdle, kinks, solves }) => {
  if (!curve) return <Note>The bisection did not run.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label={<PriceLabel>Breakeven price to NPV 0, at the beliefs&apos; medians</PriceLabel>} value={four(curve.baseBreakeven)} unit="USD/bbl" />
        {hurdle && hurdle.rows.map((x) => (
          <Tile key={x.targetNpv} label={<PriceLabel>{`Breakeven price to NPV ${x.targetNpv} million USD`}</PriceLabel>} value={four(x.price)} unit="USD/bbl" />
        ))}
        {hurdle && <Tile label={`NPV at the ${hurdle.bracketTop} USD/bbl bracket top`} value={mm(hurdle.npvAtBracketTop)} unit="million USD" />}
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The base case: capex {curve.capexMM} million USD all in year 1, opex {curve.opexMM} million USD a year, efficiency {curve.efficiency}.
        {curve.allStated
          ? ' Every fit here is exact, so the base case runs at the stated medians (EC3-5).'
          : ' At least one fit clamps, so the base case runs at that fitted triangle\'s own median (EC3-5).'}
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve.points} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="price" tick={AXIS} label={{ value: 'oil price, USD/bbl', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} label={{ value: 'NPV, million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <ReferenceLine y={0} stroke="#64748b" />
            <ReferenceLine x={curve.baseBreakeven} stroke="#BFFF00" strokeDasharray="4 4" />
            <Line type="linear" dataKey="npv" name="NPV through the breakeven engine" stroke="#38bdf8" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['oil price, USD/bbl', 'NPV, million USD']} rows={curve.points.map((x) => [x.price, mm(x.npv)])} />
      {kinks && (
        <Tbl
          head={['year', 'price at which that year starts paying tax (derived), USD/bbl']}
          rows={kinks.map((x) => [x.year, four(x.kinkPriceDerived)])}
        />
      )}
      <div className="mt-3 text-xs text-slate-300">
        NPV rises with price: royalty and tax take only a fraction of each extra dollar. Bisection halves the 0 to
        {' '}{PRICE_BRACKET_TOP} USD/bbl bracket a hundred times. Each year&apos;s tax switches on at its own price,
        which puts a kink in the line, and every kink sits inside the bracket, so the line is still monotone and the
        bisection is safe. Year 1 carries all the capex, so its kink is far above the rest.
      </div>
      {solves && (
        <Tbl
          head={['published solve case', 'target NPV, million USD', <PriceLabel key="e">engine breakeven price</PriceLabel>, <PriceLabel key="g">golden closed-form price</PriceLabel>]}
          rows={solves.map((x) => [x.id, x.targetNpv, x.enginePrice === null ? 'null, unreachable' : four(x.enginePrice), x.goldenPrice === null ? 'null' : four(x.goldenPrice)])}
        />
      )}
      <Note>A target no price below the bracket top reaches returns null. That is an answer, and it says the profile has a problem no price fixes.</Note>
    </>
  );
};

export const DistributionMode = ({ run, torn, unreachable, published }) => {
  if (!run) {
    return <Note>Run the sample to read it. Five thousand iterations is five thousand bisections, each of them a hundred ledger runs.</Note>;
  }
  const rows = torn ? torn.rows : run.tornado;
  const bars = rows.map((x) => ({ name: x.variable, low: x.low, high: x.high }));
  return (
    <>
      <TileGrid>
        {run.percentiles.map((x) => (
          <Tile key={x.key} label={<PriceLabel>{x.label}</PriceLabel>} value={four(x.value)} unit="USD/bbl" />
        ))}
        <Tile label={<PriceLabel>Mean breakeven price</PriceLabel>} value={four(run.mean)} unit="USD/bbl" />
        <Tile label={<PriceLabel>Base case breakeven price at the beliefs&apos; medians</PriceLabel>} value={four(run.baseBreakeven)} unit="USD/bbl" />
        <Tile label="Iterations excluded, never broke even" value={`${run.excluded} of ${run.iterations}`} />
        <Tile label="Draws held at a physical limit (clippedDraws)" value={`${run.clippedDraws.capex} / ${run.clippedDraws.opex} / ${run.clippedDraws.efficiency}`} unit="capex / opex / efficiency" />
        <Tile label="Seed" value={String(run.seed)} />
        <Tile label="Mean minus median (derived)" value={four(run.meanMinusMedianDerived)} unit="USD/bbl" />
      </TileGrid>
      <Tbl
        head={['statistic', 'sorted index (derived)', 'engine key', <PriceLabel key="v">breakeven price, USD/bbl</PriceLabel>]}
        rows={run.percentiles.map((x) => [<PriceLabel key={x.key}>{x.label}</PriceLabel>, x.sortedIndexDerived, x.engineKey, four(x.value)])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">The engine keys its percentiles p10, p50 and p90. They are plain percentiles of a price, named here only as keys.</p>
      <Tbl
        head={[<InputLabel key="v">belief</InputLabel>, 'tenth percentile the base case and the tornado use', 'median they use', 'ninetieth they use', 'stated or fitted']}
        rows={Object.entries(run.beliefs).map(([k, b]) => [<InputLabel key={k}>{k}</InputLabel>, four(b.p10), four(b.p50), four(b.p90), b.source])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        EC3-5: the sample draws from the fitted triangle, so the base case and the tornado read that triangle&apos;s own
        percentiles wherever a fit clamps, and the stated ones wherever it is exact.
      </p>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={run.sCurve} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="price" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} tickFormatter={(v) => Number(v).toFixed(0)} label={{ value: 'breakeven price, USD/bbl', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={[0, 1]} label={{ value: 'share of iterations at or below', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => ratio(v)} labelFormatter={(v) => `${four(v)} USD/bbl`} />
            {run.percentiles.map((x) => <ReferenceLine key={x.key} x={x.value} stroke="#BFFF00" strokeDasharray="3 3" />)}
            <Line type="stepAfter" dataKey="y" name="S-curve" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-1 mb-0">
        One point every {run.sampleSize / run.sCurve.length} sorted prices, from the lowest {four(run.lowest)} to the highest {four(run.highest)}. At sorted index {run.medianIndex} the S-curve reads {ratio(run.sCurveYAtMedianIndex)}.
      </p>
      <p className="text-xs text-slate-300 mt-3 mb-0"><span className="text-slate-500">The engine&apos;s insight:</span> {run.insights}</p>
      <Tbl
        head={['rank', 'variable', 'low side, from the base', <InputLabel key="l">low side comes from</InputLabel>, 'high side, from the base', <InputLabel key="h">high side comes from</InputLabel>, 'swing (derived)', 'open end']}
        rows={rows.map((x) => [x.rank, x.variable,
          x.low === null ? 'no breakeven below the bracket' : four(x.low),
          <InputLabel key={`l${x.rank}`}>{sideLabel(x.variable, 'low')}</InputLabel>,
          x.high === null ? 'no breakeven below the bracket' : four(x.high),
          <InputLabel key={`h${x.rank}`}>{sideLabel(x.variable, 'high')}</InputLabel>,
          x.swingDerived === null ? 'none, one end is open' : four(x.swingDerived),
          x.unreachable ? 'yes, sorts first' : 'no'])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 30 }}>
            {GRID}
            <XAxis type="number" tick={AXIS} label={{ value: 'change in breakeven price from the base, USD/bbl', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={AXIS} width={100} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#64748b" />
            <Bar dataKey="low" name="low side" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="high" name="high side" fill="#f87171" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {unreachable && (
        <Tbl
          head={['published mc_with_unreachable', 'excluded', <PriceLabel key="a">10th percentile</PriceLabel>, <PriceLabel key="b">50th percentile</PriceLabel>, <PriceLabel key="c">90th percentile</PriceLabel>]}
          rows={[[unreachable.id, `${unreachable.excluded} of ${unreachable.iterations}`, four(unreachable.p10), four(unreachable.p50), four(unreachable.p90)]]}
        />
      )}
      {published && (
        <Tbl
          head={['published run', 'seed', 'iterations', <PriceLabel key="a">10th percentile</PriceLabel>, <PriceLabel key="b">50th percentile</PriceLabel>, <PriceLabel key="c">90th percentile</PriceLabel>, 'mean', 'base', 'excluded', 'beliefs, capex / opex / efficiency', 'clippedDraws']}
          rows={published.runs.map((x) => [x.id, x.seed, x.iterations, four(x.p10), four(x.p50), four(x.p90), four(x.mean), four(x.baseBreakeven), x.excluded,
            `${x.beliefSources.capex} / ${x.beliefSources.opex} / ${x.beliefSources.efficiency}`,
            `${x.clippedDraws.capex} / ${x.clippedDraws.opex} / ${x.clippedDraws.efficiency}`])}
        />
      )}
      {published && published.refused && (
        <Tbl
          head={['belief the engine refuses (EC3-8)', 'the engine&apos;s own message']}
          rows={published.refused.map((x) => [x.id, x.error])}
        />
      )}
      {published && <p className="text-xs text-slate-400 mt-2 mb-0">{published.allUnreachable.id}: the engine throws, &quot;{published.allUnreachable.error}&quot;</p>}
      <Note>
        A breakeven price is a quantity where more is worse, so it is read as three percentiles and never given a
        P-label. The mean sits above the median because the sample has a longer high tail. Efficiency runs backwards
        in the tornado: its low-price end comes from the {sideLabel('Prod. Efficiency', 'low')}. An end of a swing
        with no breakeven below the {PRICE_BRACKET_TOP} USD/bbl bracket is left open rather than drawn at the base,
        and an open bar sorts first (B1, fixed 2026-09-15), because a variable that can put the project out of reach
        is the one that matters most.
      </Note>
    </>
  );
};

const BreakevenExplorer = ({ initialMode = 'fit' }) => {
  const [mode, setMode] = useState(initialMode);
  const [seed, setSeed] = useState(20260829);
  const [inexact, runInexact] = useRun();
  const [comparison, runComparison] = useRun();
  const [dist, runDist] = useRun();
  const [pub, runPub] = useRun();
  const fit = useMemo(() => (mode === 'fit' ? (() => { try { return fits(); } catch { return null; } })() : null), [mode]);
  const walk = useMemo(() => (mode === 'sample' ? (() => { try { return samplingWalk(seed); } catch { return null; } })() : null), [mode, seed]);
  const solved = useMemo(() => (mode === 'solve' ? (() => {
    try { return { curve: breakevenCurve(), hurdle: hurdles(), kinks: taxKinks(), solves: solveCases() }; } catch { return null; }
  })() : null), [mode]);
  return (
    <PanelShell
      title="Breakeven explorer"
      subtitle="ISIALA through the Probabilistic Breakeven Analyzer: stated percentiles fitted to triangles that pass through them, a seeded sample, the breakeven price by bisection, and the sample read as three percentiles of a price."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fit' && (
          <FitMode fit={fit} inexact={inexact.value} inexactRunning={inexact.status === 'running'} onInexact={() => runInexact(publishedInexactFit)} />
        )}
        {mode === 'sample' && (
          <SampleMode walk={walk} seed={seed} onSeed={setSeed} comparison={comparison.value}
            compareRunning={comparison.status === 'running'} onCompare={() => runComparison(() => seedComparison())} />
        )}
        {mode === 'solve' && <SolveMode curve={solved?.curve} hurdle={solved?.hurdle} kinks={solved?.kinks} solves={solved?.solves} />}
        {mode === 'distribution' && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <RunButton onClick={() => runDist(() => { const run = breakevenRun(); return { run, torn: tornado(run), unreachable: publishedUnreachable() }; })} running={dist.status === 'running'}>
                Run ISIALA, 5000 iterations at seed 20260829
              </RunButton>
              <RunButton onClick={() => runPub(publishedBreakevenRuns)} running={pub.status === 'running'}>
                Run the published breakeven cases
              </RunButton>
            </div>
            {(dist.error || pub.error) && <Note>The engine stopped: {dist.error || pub.error}</Note>}
            <div className="mt-3">
              <DistributionMode run={dist.value?.run} torn={dist.value?.torn} unreachable={dist.value?.unreachable} published={pub.value} />
            </div>
          </>
        )}
      </div>
    </PanelShell>
  );
};

export default BreakevenExplorer;
