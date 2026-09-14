import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine,
} from 'recharts';
import {
  APP_MC, MC_SAMPLING_LINES, OKPOMA_FIRST_ROW_COLUMNS, SWAPPED_CARDS,
  pLabelWords, scenarioBuilderCases, breakevenRun, scenarioBuilderMonteCarlo, mcSeedComparison,
  publishedPriceOnly, twoRules, wobbleSteps, wobbleStep, wobbleCollect, edges, narrowBeliefRun, distrust,
} from './uncertaintyLab';
import { OUTCOME_LABELS, parameterPercentileLabel } from '@petrolord/engines/lib/conventions/percentile.js';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Risk explorer, the Expert tier. ONE CONVENTION AND WHAT TO DISTRUST: one
// meaning of a P-label, the Scenario Builder's Monte Carlo, two percentile
// rules in one module and how much a percentile wobbles, the repaired edges and
// the one still open (B1), and the numbers to distrust.
//
// Every figure on this page is a return value from uncertaintyLab, which is a
// return value from the vendored screening and breakeven engines. Nothing here
// computes a dollar or a barrel. EVERY P-label on this page is a string from
// lib/conventions/percentile.js or the quoted history the lab carries; this
// file types none. A label on an NPV case carries data-plabel="outcome", the
// quoted old card carries data-plabel="history", a label on a breakeven price
// carries data-plabel="price" and a label on an input data-plabel="input", and
// a gate reads the last two off the markup and finds no P-label in them.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');

export const MODES = [
  ['labels', 'Labels: one meaning of a P-label, and the cards that were swapped'],
  ['montecarlo', 'Monte Carlo: the uniform rule, the histogram, the S-curve, the seed'],
  ['rules', 'Rules: two percentile rules, and the wobble'],
  ['edges', 'Edges: repaired edges, and one still open'],
  ['distrust', 'Distrust: the clamp, the payback, mid-year beside year-end'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const Outcome = ({ children }) => <span data-plabel="outcome" className="text-[#BFFF00] font-semibold">{children}</span>;
const History = ({ children }) => <span data-plabel="history" className="text-slate-400">{children}</span>;
const PriceLabel = ({ children }) => <span data-plabel="price">{children}</span>;
const InputLabel = ({ children }) => <span data-plabel="input">{children}</span>;

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

/** An async reader awaited once per mount. The engine's runMonteCarlo is async. */
const useAwait = (fn, active) => {
  const [state, setState] = useState({ status: 'idle', value: null });
  useEffect(() => {
    if (!active) return undefined;
    let live = true;
    setState({ status: 'running', value: null });
    fn().then((value) => { if (live) setState({ status: 'done', value }); })
      .catch(() => { if (live) setState({ status: 'error', value: null }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return state;
};

/** A slow reader on request, called on the next tick so the button can say so first. */
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

const BREAKEVEN_WORDS = ['q10', 'q50', 'q90'].map((q) => parameterPercentileLabel('breakeven price', q));

// ---------------------------------------------------------------------------

export const LabelsMode = ({ words, cases, run, onRun, running }) => {
  if (!words) return <Note>The convention module did not load.</Note>;
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">{words.definition}</p>
      <Tbl
        head={['case, low to high', 'P-label', 'engine key holding it', 'ISIALA NPV through the Scenario Builder, million USD']}
        rows={words.cases.map((c) => {
          const got = cases ? cases.rows.find((x) => x.caseKey === c.caseKey) : null;
          return [c.caseLabel, <Outcome key={c.caseKey}>{c.pLabel}</Outcome>, c.engineKey, got ? mm(got.npv) : 'running'];
        })}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        NPV is an outcome where more is better, so its low case takes its {words.npvLowCasePercentile}: {words.npvLowCaseLabel}. The engine
        keys p10, p50 and p90 are plain percentiles; {OUTCOME_LABELS.p90} is read off p10.
        {cases ? ` Seed ${cases.seed}, ${cases.iterations} iterations.` : ''}
      </p>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        <p className="text-slate-500 mb-1">What the results panel used to print, quoted as history</p>
        {SWAPPED_CARDS.map((s) => {
          const got = cases ? cases.swappedCards.find((x) => x.engineKey === s.engineKey) : null;
          return (
            <p key={s.engineKey} className="mb-0">
              the {s.engineKey} key under <History>&quot;{s.oldLabel}&quot;</History>{got ? `, which on ISIALA is ${mm(got.value)} million USD` : ''}.
            </p>
          );
        })}
        {cases && cases.conservativeCardHeldTheLargerNumber && (
          <p className="mb-0 mt-1">The card called conservative held the larger number. EC3-0 mapped the keys through the convention and fixed it.</p>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-1">A breakeven price is a quantity where more is worse. It takes no P-label at all:</p>
        <TileGrid>
          {BREAKEVEN_WORDS.map((w, i) => (
            <Tile key={w} label={<PriceLabel>{w}</PriceLabel>} value={run ? four(run.percentiles[i].value) : 'not run'} unit={run ? 'USD/bbl' : ''} />
          ))}
        </TileGrid>
        {onRun && (
          <div className="mt-2">
            <RunButton onClick={onRun} running={running}>Run ISIALA&apos;s breakeven, 5000 iterations</RunButton>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-1">Every parameter takes percentiles too:</p>
        <Tbl
          head={['parameter', 'stated low', 'stated middle', 'stated high']}
          rows={Object.entries(words.parameters).map(([k, labels]) => [k, ...labels.map((l) => <InputLabel key={l}>{l}</InputLabel>)])}
        />
      </div>
    </>
  );
};

export const MonteCarloMode = ({ mc, seeds, priceOnly }) => {
  if (!mc) return <Note>The Scenario Builder&apos;s Monte Carlo is running.</Note>;
  const bars = mc.histogram.counts.map((count, i) => ({ bin: i + 1, count }));
  return (
    <>
      <ul className="text-xs text-slate-300 list-none pl-0 space-y-1 mb-0">
        {MC_SAMPLING_LINES.map((l) => <li key={l}>{l.replace(/^- /, '')}</li>)}
      </ul>
      <Tbl
        head={['range', 'plus or minus', 'what it scales']}
        rows={[
          [<InputLabel key="p">price range</InputLabel>, mc.uncertainties.price, 'oil and gas prices, every year'],
          [<InputLabel key="c">capex range</InputLabel>, mc.uncertainties.capex, 'capex, every year'],
          [<InputLabel key="r">reserves range</InputLabel>, mc.uncertainties.reserves, 'oil and gas volumes, every year'],
        ]}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Iterations" value={String(mc.iterations)} />
          <Tile label="Seed" value={String(mc.seed)} />
          <Tile label="EMV, the mean NPV" value={mm(mc.emv)} unit="million USD" />
          <Tile label="Engine key p10, the 10th percentile of NPV" value={mm(mc.p10)} unit="million USD" />
          <Tile label="Engine key p50, the median NPV" value={mm(mc.p50)} unit="million USD" />
          <Tile label="Engine key p90, the 90th percentile of NPV" value={mm(mc.p90)} unit="million USD" />
          <Tile label="Lowest NPV" value={mm(mc.lowest)} unit="million USD" />
          <Tile label="Highest NPV" value={mm(mc.highest)} unit="million USD" />
        </TileGrid>
      </div>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="bin" tick={AXIS} label={{ value: `bin, lowest NPV to highest, width ${four(mc.histogram.widthDerived)} million USD`, position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="count" name="iterations" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mc.sCurve.points} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} tickFormatter={(v) => Number(v).toFixed(0)} label={{ value: 'NPV, million USD', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={[0, 100]} label={{ value: 'percent below', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <ReferenceLine x={mc.p10} stroke="#BFFF00" strokeDasharray="3 3" />
            <ReferenceLine x={mc.p90} stroke="#BFFF00" strokeDasharray="3 3" />
            <Line type="stepAfter" dataKey="probability" name="S-curve" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-1 mb-0">
        The S-curve keeps {mc.sCurve.pointCount} points, one every {mc.sCurve.stepDerived} sorted values, from {four(mc.sCurve.firstProbability)} and stopping at {four(mc.sCurve.lastProbability)} percent, never 100.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="S-curve point at 10 percent, one sorted NPV" value={mm(mc.sCurve.valueAtTenPercent)} unit="million USD" />
          <Tile label={<>Low case card, <Outcome>{OUTCOME_LABELS.p90}</Outcome>, the screening rule&apos;s average</>} value={mm(mc.p10)} unit="million USD" />
        </TileGrid>
        <p className="text-xs text-slate-500 mt-1 mb-0">
          The two disagree and both are what the engine returns (EC3-6): the S-curve reads sorted values, while the card averages two neighbours. The chart&apos;s dashed lines are the cards.
        </p>
      </div>
      {seeds && (
        <div className="mt-3">
          <TileGrid>
            <Tile label={`Seed ${seeds.seed} run twice repeats every value`} value={seeds.sameSeedRepeatsEveryValue ? 'yes' : 'no'} />
            <Tile label={`Median NPV at seed ${seeds.seed}`} value={mm(seeds.medianAtSeed)} unit="million USD" />
            <Tile label={`Median NPV at seed ${seeds.otherSeed}`} value={mm(seeds.medianAtOtherSeed)} unit="million USD" />
          </TileGrid>
        </div>
      )}
      {priceOnly && <p className="text-xs text-slate-400 mt-2 mb-0">{priceOnly.id}: {priceOnly.note}</p>}
      <Note>
        The seed guarantees the sample and nothing about its accuracy. Every year of every array takes its own
        independent draw, so one iteration can pair a high price in one year with a low price in the next, and opex,
        royalty and tax are never sampled (EC3-7). A range here is not the whole of the uncertainty in the case.
      </Note>
    </>
  );
};

export const RulesMode = ({ rules, wob, progress, onWobble, wobbleRunning }) => (
  <>
    {rules ? (
      <>
        <p className="text-xs text-slate-400 mb-0">
          ISIALA&apos;s {rules.n} Scenario Builder NPVs, sorted. n times 0.1 is {rules.nTimesTenthDerived}, n times 0.5 is {rules.nTimesHalfDerived} and n times 0.9 is {rules.nTimesNinetiethDerived}, all whole numbers on an even length, so the screening rule averages two neighbours at every row.
        </p>
        <Tbl
          head={['percentile of NPV', 'screening rule, averages two values', 'breakeven rule, sorted[min(n - 1, floor(q n))]', 'difference (derived)']}
          rows={rules.rows.map((x) => [x.label, mm(x.screeningRule), mm(x.floorRule), mm(x.differenceDerived)])}
        />
      </>
    ) : <Note>The two rules are running.</Note>}
    <div className="mt-3 flex items-center gap-3">
      {onWobble && <RunButton onClick={onWobble} running={wobbleRunning}>Run the wobble, fifteen breakeven runs (very slow)</RunButton>}
      {progress && <span className="text-xs text-slate-400">{progress}</span>}
    </div>
    {wob && (
      <>
        <Tbl
          head={['seed', <PriceLabel key="a">{wob.labels.p10}</PriceLabel>, <PriceLabel key="b">{wob.labels.p50}</PriceLabel>]}
          rows={[
            ...wob.bySeed.map((x) => [x.seed, four(x.p10), four(x.p50)]),
            ['range across the seeds (derived)', four(wob.p10RangeDerived), four(wob.p50RangeDerived)],
          ]}
        />
        <Tbl
          head={['iterations at the default seed', <PriceLabel key="a">{wob.labels.p10}</PriceLabel>, <PriceLabel key="b">{wob.labels.p50}</PriceLabel>, <PriceLabel key="c">{wob.labels.p90}</PriceLabel>]}
          rows={wob.byIterations.map((x) => [x.iterations, four(x.p10), four(x.p50), four(x.p90)])}
        />
        {wob.defaultSeedMedianOutsideSeedSpan !== null && (
          <p className="text-xs text-slate-300 mt-2 mb-0">
            The default seed&apos;s median at 5000 iterations {wob.defaultSeedMedianOutsideSeedSpan ? 'sits outside' : 'sits inside'} the span of the ten seeds&apos; medians.
          </p>
        )}
      </>
    )}
    <Note>
      Two rules in one package give two different 10th percentiles of the same sample. Neither is wrong; a number
      quoted without its rule, its seed and its iteration count cannot be checked, and more iterations do not settle
      which seed was right.
    </Note>
  </>
);

export const EdgesMode = ({ e, narrow, onNarrow, narrowRunning }) => (
  <>
    {e ? (
      <>
        <TileGrid>
          <Tile label={`Repaired, S4. Every range at zero, ${e.zeroRanges.iterations} iterations: median NPV`} value={mm(e.zeroRanges.p50)} unit="million USD" />
          <Tile label="Deterministic NPV beside it" value={mm(e.zeroRanges.deterministicNpv)} unit="million USD" />
          <Tile label="Repaired, S4. Iterations in bin 0" value={`${e.zeroRanges.binZeroCount} of ${e.zeroRanges.iterations}`} />
          <Tile label={`Repaired, S5. S-curve points at ${e.fortyIterations.iterations} iterations`} value={String(e.fortyIterations.sCurvePoints)} />
        </TileGrid>
        <Tbl
          head={['STILL OPEN, B1: published mc_with_unreachable tornado', 'low side, from the base', 'high side, from the base']}
          rows={e.oneSidedTornado.rows.map((x) => [x.variable, four(x.low), four(x.high)])}
        />
        <p className="text-xs text-slate-500 mt-1 mb-0">
          B1 is not repaired. Every high side prints as {e.oneSidedTornado.rows.length ? four(e.oneSidedTornado.rows[0].high) : 'null'}: the high end never broke even below the bracket, and the engine still prints the missing side as zero rather than saying it is missing. Read a zero side there as no price at all, never as no change.
        </p>
      </>
    ) : <Note>The edge runs are running.</Note>}
    <div className="mt-3 flex items-center gap-3">
      {onNarrow && <RunButton onClick={onNarrow} running={narrowRunning}>Run the narrow opex belief, 5000 iterations</RunButton>}
    </div>
    {narrow && (
      <>
        <Tbl
          head={[...narrow.statedLabels.map((l) => <InputLabel key={l}>{l}</InputLabel>), 'fitted min', 'fitted mode', 'fitted max', 'exact']}
          rows={[[...narrow.stated.map(String), four(narrow.opexFit.min), four(narrow.opexFit.mode), four(narrow.opexFit.max), narrow.opexFit.exact ? 'yes' : 'no, clamped']]}
        />
        <TileGrid>
          {narrow.percentiles.map((x) => <Tile key={x.key} label={<PriceLabel>{x.label}</PriceLabel>} value={four(x.value)} unit="USD/bbl" />)}
          <Tile label={<PriceLabel>Base case breakeven price</PriceLabel>} value={four(narrow.baseBreakeven)} unit="USD/bbl" />
        </TileGrid>
        <p className="text-xs text-slate-300 mt-2 mb-0"><span className="text-slate-500">The engine&apos;s insight, which now carries the fit note (repaired):</span> {narrow.insights}</p>
        <p className="text-xs text-slate-300 mt-2 mb-0">
          The sample draws opex from the clamped triangle, but the base breakeven and the tornado run at the stated <InputLabel>{narrow.statedLabels[1]}</InputLabel>, {narrow.stated[1]}, which that triangle does not pass through (EC3-5). The base and the sample describe two different opex beliefs.
        </p>
      </>
    )}
    <Note>
      Repaired in EC3-0: every range at zero no longer divides by a zero bin width and throws (S4), fewer than fifty
      iterations no longer leave an empty S-curve (S5), and a belief no triangle honours now puts its fit note into
      the insight. Still open: B1, the tornado bar with one side printed as zero.
    </Note>
  </>
);

export const DistrustMode = ({ d }) => {
  if (!d) return <Note>The engine returned nothing to distrust.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="NTEJE NPV" value={mm(d.nteje.npv)} unit="million USD" />
        <Tile label="NTEJE IRR, the Newton clamp" value={four(d.nteje.irr)} unit="percent" />
        <Tile label="NTEJE payback, the project life" value={four(d.nteje.payback)} unit="years" />
        <Tile label="NTEJE final cumulative" value={mm(d.nteje.finalCumulative)} unit="million USD" />
        <Tile label="OKPOMA NPV" value={mm(d.okpoma.npv)} unit="million USD" />
        <Tile label="OKPOMA IRR, the Newton clamp again" value={four(d.okpoma.irr)} unit="percent" />
        <Tile label="OKPOMA payback" value={four(d.okpoma.payback)} unit="years" />
        <Tile label="OKPOMA peak exposure" value={mm(d.okpoma.maxExposure)} unit="million USD" />
      </TileGrid>
      <Tbl head={OKPOMA_FIRST_ROW_COLUMNS} rows={d.okpoma.firstRows.map((x) => OKPOMA_FIRST_ROW_COLUMNS.map((k) => (k === 'year' ? x[k] : mm(x[k]))))} />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        Neither IRR is a root. OKPOMA&apos;s only root is negative and NTEJE has no root at all; where no positive root exists the engine reports its Newton clamp (FINDINGS S1).
      </p>
      <p className="text-xs text-slate-500 mt-1 mb-0">The cumulative is positive after year 1, so the payback reads 0; the second capex year takes it below zero and the payback is never revisited.</p>
      <Tbl
        head={['published IRR case', 'engine IRR, percent', 'every root the oracle found']}
        rows={[
          ...d.irrCases.map((x) => [x.id, four(x.engineIrr), x.goldenRoots.map((z) => four(z)).join(', ')]),
          [d.fdpNeverPaysBack.id, four(d.fdpNeverPaysBack.irr), `npv ${mm(d.fdpNeverPaysBack.npv)}, payback ${four(d.fdpNeverPaysBack.payback)}`],
        ]}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="ISIALA NPV, mid-year, the engine" value={mm(d.midYear.engineNpv)} unit="million USD" />
          <Tile label="The same rows at year end (derived)" value={mm(d.midYear.yearEndNpvDerived)} unit="million USD" />
          <Tile label="Ratio (derived)" value={Number(d.midYear.ratioDerived).toFixed(6)} />
          <Tile label="Root of one plus the rate (derived)" value={Number(d.midYear.rootOfOnePlusRateDerived).toFixed(6)} />
        </TileGrid>
      </div>
      <Note>
        Two breakevens for one field are two quantities. Petroleum Economics Studio discounts at year end on its own
        ledger; this engine discounts mid-year on a screening ledger with all capex in year 1. They are not converted
        into each other, and a distribution cannot tell you which inputs were left out of it.
      </Note>
    </>
  );
};

const RiskExplorer = ({ initialMode = 'labels' }) => {
  const [mode, setMode] = useState(initialMode);
  const words = useMemo(() => { try { return pLabelWords(); } catch { return null; } }, []);
  const cases = useAwait(() => scenarioBuilderCases(), mode === 'labels');
  const mc = useAwait(() => scenarioBuilderMonteCarlo(APP_MC), mode === 'montecarlo');
  const seeds = useAwait(() => mcSeedComparison(), mode === 'montecarlo');
  const rules = useAwait(() => twoRules(), mode === 'rules');
  const edge = useAwait(() => edges(), mode === 'edges');
  const priceOnly = useMemo(() => { try { return publishedPriceOnly(); } catch { return null; } }, []);
  const d = useMemo(() => (mode === 'distrust' ? (() => { try { return distrust(); } catch { return null; } })() : null), [mode]);
  const [run, startRun] = useRun();
  const [narrow, startNarrow] = useRun();
  const [wob, setWob] = useState({ status: 'idle', value: null, progress: null });

  // The wobble is fifteen runs; step through them one per tick so the page
  // can say how far it has got. The lab collects the results.
  const runWobble = () => {
    const steps = wobbleSteps();
    const done = [];
    setWob({ status: 'running', value: null, progress: `0 of ${steps.length} runs` });
    const next = (i) => {
      if (i >= steps.length) { setWob({ status: 'done', value: wobbleCollect(done), progress: null }); return; }
      setTimeout(() => {
        try {
          done.push(wobbleStep(steps[i]));
          setWob({ status: 'running', value: null, progress: `${i + 1} of ${steps.length} runs` });
          next(i + 1);
        } catch (e) {
          setWob({ status: 'error', value: null, progress: e.message });
        }
      }, 30);
    };
    next(0);
  };

  return (
    <PanelShell
      title="Risk explorer"
      subtitle="One meaning of a P-label, the Scenario Builder's Monte Carlo, two percentile rules and how much a percentile wobbles, the repaired edges and the one still open, and the numbers to distrust."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'labels' && (
          <LabelsMode words={words} cases={cases.value} run={run.value}
            onRun={() => startRun(() => breakevenRun())} running={run.status === 'running'} />
        )}
        {mode === 'montecarlo' && <MonteCarloMode mc={mc.value} seeds={seeds.value} priceOnly={priceOnly} />}
        {mode === 'rules' && (
          <RulesMode rules={rules.value} wob={wob.value} progress={wob.progress}
            onWobble={runWobble} wobbleRunning={wob.status === 'running'} />
        )}
        {mode === 'edges' && (
          <EdgesMode e={edge.value} narrow={narrow.value}
            onNarrow={() => startNarrow(() => narrowBeliefRun())} narrowRunning={narrow.status === 'running'} />
        )}
        {mode === 'distrust' && <DistrustMode d={d} />}
      </div>
    </PanelShell>
  );
};

export default RiskExplorer;
