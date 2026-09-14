import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceArea,
} from 'recharts';
import {
  COMPARISON_IDS, COMPARISON_LABELS, PRICE_POINT_MEANINGS,
  comparison, priceSweep, capexSweep, etrBothWays,
  insights, goldenInsightsIds, tieEvidence, shareCurveRegimes, paybackTieEvidence,
  publishedPriceSweep, publishedCapexSweep, sweepCaseRegime,
} from './fiscalLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Comparison explorer, the Expert tier. WHAT runFiscalComparison RETURNS AND
// WHAT IT DOES NOT SAY: the summary sorted by contractor NPV with both
// effective tax rates side by side, the price sweep with a warning under every
// point whose lifetime contractor net cash flow is not positive, the capex
// sweep and the eighth point the loop never reaches, and the derived verdicts
// beside the quantities they claim to rank.
//
// THE PRICE CHART READS THE ENGINE'S STATE ON EVERY POINT (EC2-1). A `share`
// point is drawn on the line. An `undefined` point has no value: the line
// breaks there and the price band is shaded as uneconomic. An `exceeds` point
// is drawn as an open marker pinned to the top of the axis, its true value in
// the tooltip, and it never sets the scale.
//
// runFiscalComparison is declared ASYNC by the engine, so every reader here is
// awaited rather than called inline. Nothing on this page computes anything.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const ratio = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const pc = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');
const yr = (v) => (v === null || v === undefined ? 'never' : String(v));

const MODES = [
  ['summary', 'Summary: the ranking, and one rate with two values'],
  ['price', 'Price: the sweep, and the state each point carries'],
  ['capex', 'Capex: seven swept points, an eighth called directly, two losses'],
  ['insights', 'Insights: the verdicts beside the quantities they rank'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : Number(v).toFixed(0));
const SERIES_COLOURS = ['#BFFF00', '#38bdf8', '#f472b6', '#fbbf24', '#a78bfa', '#34d399'];

/**
 * The engine's comparison is async, so a mode that needs it renders a plain
 * sentence until the promise settles and a plain sentence if it rejects. It
 * never renders a half-filled table.
 */
const useEngine = (run, deps) => {
  const [state, setState] = useState({ status: 'running', value: null });
  useEffect(() => {
    let live = true;
    setState({ status: 'running', value: null });
    Promise.resolve()
      .then(run)
      .then((value) => { if (live) setState({ status: 'done', value }); })
      .catch(() => { if (live) setState({ status: 'failed', value: null }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
};

const Tbl = ({ head, rows, mark = () => false }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={mark(i) ? 'text-[#BFFF00] font-semibold' : ''}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Waiting = ({ what }) => <Note>Running {what} in the engine. This is a real comparison, not a cached table: it re-runs the whole ledger once per regime and again at nine prices and seven capex multipliers.</Note>;
const Failed = ({ what }) => <Note>The engine returned nothing for {what}. A comparison needs a project carrying production, prices and costs and at least one regime carrying all four instruments; without them there is no summary to sort and no sweep to plot.</Note>;

const CASE_OPTIONS = COMPARISON_IDS.map((id) => [id, COMPARISON_LABELS[id] || id]);

/**
 * Every published sweep case id contains "pia" and not one of them runs the
 * "Nigeria - PIA (2021)" TEMPLATE. They run the Designer's own default regime.
 * A panel that puts the two tables on one screen has to say so, or it invites
 * the mis-keying the ids invite.
 */
const SweepRegimeCaution = () => {
  const s = useMemo(() => { try { return sweepCaseRegime(); } catch { return null; } }, []);
  if (!s) return null;
  return (
    <p className="text-xs text-amber-300 mt-2 mb-0">
      READ THE NAME ON THESE CASES CAREFULLY. Every id contains "pia" and not one of them runs the
      {' '}{s.template.name} TEMPLATE shown above. They run the Designer own default regime, id {s.id},
      {' '}{s.name}, which shares a country with the template and nothing else: cost recovery at
      {' '}{s.designerCostRecoveryLimit} percent against the template {s.templateCostRecoveryLimit}, and
      {' '}{s.designerTrancheCount} profit tranches against the template {s.templateTrancheCount}. On the same
      default project the template returns {mm(s.npvOfTheTemplate)} million USD of contractor net present value
      and the Designer regime {mm(s.npvOfTheDesignerRegime)}. Anything keyed to the template on these cases is
      mis-keyed.
    </p>
  );
};

const Summary = () => {
  const [caseId, setCaseId] = useState('cmp_all_templates_default_project');
  const c = useEngine(() => comparison(caseId), [caseId]);
  const e = useEngine(() => etrBothWays(caseId), [caseId]);
  const picker = (
    <FieldGrid>
      <SelectField label="Published comparison" value={caseId} onChange={setCaseId} options={CASE_OPTIONS} />
    </FieldGrid>
  );
  if (c.status !== 'done' || e.status !== 'done') {
    return <>{picker}{(c.status === 'failed' || e.status === 'failed') ? <Failed what="this comparison" /> : <Waiting what="the comparison" />}</>;
  }
  const bars = c.value.summary.map((s) => ({ name: s.name, summary: s.effectiveTaxRateSummary, sweep: s.effectiveTaxRateSweepAtBase }));
  return (
    <>
      {picker}
      <p className="text-xs text-slate-400 mt-2 mb-0">{c.value.note}</p>
      <p className="text-xs text-slate-500 mt-1 mb-0">
        Discount rate {c.value.discountRatePct} percent. The deck own first-year oil price is {c.value.basePrice} USD per
        bbl, which is the price sweep label at index {c.value.basePriceLabelIndex} and the one price at which both
        definitions of the rate describe the same run.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Best for the contractor" value={c.value.summary[0].name} />
          <Tile label="Its NPV" value={mm(c.value.summary[0].npv)} unit="million USD" />
          <Tile label="Regimes compared" value={String(c.value.summary.length)} />
          <Tile label="Verdicts derived" value={String(c.value.insights.length)} />
        </TileGrid>
      </div>
      <Tbl
        head={['rank', 'regime', 'npv', 'irr, percent', 'paybackPeriod', 'rFactorPayoutYear', 'govTake', 'effective tax rate, summary', 'effective tax rate, sweep at the deck price', 'difference, percentage points']}
        rows={c.value.summary.map((s) => [
          s.rank, s.name, mm(s.npv), pc(s.irrPct), yr(s.paybackPeriod), yr(s.rFactorPayoutYear), mm(s.govTake),
          pc(s.effectiveTaxRateSummary),
          s.effectiveTaxRateSweepAtBase === null ? 'null' : pc(s.effectiveTaxRateSweepAtBase),
          s.effectiveTaxRateDifferenceDerived === null ? 'null' : pc(s.effectiveTaxRateDifferenceDerived),
        ])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis tick={AXIS} label={{ value: 'percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => pc(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="summary" name="summary table, capex added back" fill="#BFFF00" isAnimationActive={false} />
            <Bar dataKey="sweep" name="price sweep at the same price, no add-back" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The summary is sorted by contractor NPV descending, so the first row is the best regime FOR THE CONTRACTOR and
        nothing else can be read off the position. Payback is the first year cumulative contractor net cash flow is
        above zero; payout is the first year the R factor passes 1.0. They answer different questions and they often
        differ here, because the R factor is gross revenue over cost while payback is cash after tax and after the
        government share.
      </div>
      <Note>
        ONE RATE, TWO VALUES, ONE RESULT OBJECT. The summary computes government take over government take plus
        contractor take WITH total capex added back, which makes it a rate on profit. The price sensitivity computes
        the same ratio on the same cash flows WITHOUT the add-back, which makes it a rate on cash. Both are returned
        by one call and one screen labels both of them "effective tax rate". Neither is wrong on its own terms; what
        is wrong is showing them within a centimetre of each other under one name. The difference column above is the
        two subtracted, and on this comparison it never falls below half a percentage point.
      </Note>
    </>
  );
};

const Price = () => {
  const [caseId, setCaseId] = useState('cmp_all_templates_default_project');
  const sw = useEngine(() => priceSweep(caseId), [caseId]);
  const published = useMemo(() => { try { return publishedPriceSweep(); } catch { return []; } }, []);
  const picker = (
    <FieldGrid>
      <SelectField label="Published comparison" value={caseId} onChange={setCaseId} options={CASE_OPTIONS} />
    </FieldGrid>
  );
  if (sw.status !== 'done') {
    return <>{picker}{sw.status === 'failed' ? <Failed what="this price sweep" /> : <Waiting what="the price sweep" />}</>;
  }
  const shareValues = sw.value.series.flatMap((d) => d.values.filter((_, i) => d.states[i] === 'share'));
  const top = shareValues.length ? Math.min(100, Math.max(10, Math.ceil(Math.max(...shareValues) / 10) * 10)) : 100;
  const chart = sw.value.labels.map((label, i) => {
    const row = { price: label };
    sw.value.series.forEach((d) => {
      row[d.id] = d.states[i] === 'share' ? d.values[i] : null;
      row[`${d.id}__pin`] = d.states[i] === 'exceeds' ? top : null;
      row[`${d.id}__true`] = d.values[i];
    });
    return row;
  });
  const step = sw.value.labels.length > 1 ? sw.value.labels[1] - sw.value.labels[0] : 10;
  const tooltipFormatter = (v, name, item) => {
    const key = String(item?.dataKey ?? '');
    if (key.endsWith('__pin')) {
      return [`${pc(item.payload[key.replace('__pin', '__true')])} percent, exceeds 100 and pinned to the top of the axis`, name];
    }
    return [pc(v), name];
  };
  return (
    <>
      {picker}
      <p className="text-xs text-slate-400 mt-2 mb-0">{sw.value.note}</p>
      <p className="text-xs text-slate-500 mt-1 mb-0">
        The sweep reaches each price by a MULTIPLIER, the price it wants over the FIRST deck point oil price, and that
        multiplier scales OIL ONLY. Gas and NGL prices are untouched, so this is an oil price sweep and a gas-weighted
        project moves less across it than it looks like it should.
      </p>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis
              dataKey="price" type="number" tick={AXIS} ticks={sw.value.labels}
              domain={[sw.value.labels[0] - step / 2, sw.value.labels[sw.value.labels.length - 1] + step / 2]}
              label={{ value: 'oil price, USD per bbl', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis tick={AXIS} domain={[0, top]} allowDataOverflow tickFormatter={compact} label={{ value: 'government share, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={tooltipFormatter} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {sw.value.undefinedPrices.map((price, k) => (
              <ReferenceArea
                key={`band-${price}`} x1={price - step / 2} x2={price + step / 2} fill="#f87171" fillOpacity={0.12} stroke="none"
                label={k === 0 ? { value: 'project uneconomic at this price', fill: '#f87171', fontSize: 10, position: 'insideTop' } : undefined}
              />
            ))}
            {sw.value.series.map((d, i) => (
              <Line key={d.id} type="linear" dataKey={d.id} name={d.name} stroke={SERIES_COLOURS[i % SERIES_COLOURS.length]} dot={false} connectNulls={false} isAnimationActive={false} />
            ))}
            {sw.value.series.map((d, i) => (
              <Line
                key={`${d.id}-pin`} type="linear" dataKey={`${d.id}__pin`} name={`${d.name}, above 100 percent`} stroke="none" legendType="none"
                dot={{ r: 4, stroke: SERIES_COLOURS[i % SERIES_COLOURS.length], strokeWidth: 2, fill: '#0f172a' }} activeDot={false} isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3">
        <p className="text-xs text-slate-500 mb-0 font-mono">price</p>
        <p className="text-xs text-slate-300 mt-1 mb-0">{sw.value.priceVerdict ? sw.value.priceVerdict.text : 'No price verdict: fewer than two regimes are compared.'}</p>
        <p className="text-xs text-slate-500 mt-1 mb-0">
          {sw.value.windowLabels
            ? `The verdict ranks climbs from ${sw.value.windowLabels[0]} to ${sw.value.windowLabels[1]} USD per bbl, the longest run of prices at which every regime's point is a share.`
            : 'No swept price gives a share for every regime, so there is no run of prices to rank a climb over.'}
        </p>
      </div>
      {sw.value.series.map((d) => (
        <div key={d.id} className="mt-4">
          <p className="text-xs text-slate-500 mb-1">{d.name}</p>
          <Tbl
            mark={(i) => d.points[i].warn}
            head={['oil price, USD/bbl', 'value the engine returns, percent', 'state', 'lifetime contractor NCF at that price', 'lifetime government take', 'profit, the two added', 'what this point is']}
            rows={d.points.map((q) => [
              q.price, pc(q.plotted), q.state, mm(q.lifetimeContractorNCF), mm(q.lifetimeGovernmentTake), mm(q.lifetimeDenominatorDerived),
              q.warn ? <span key={q.price} className="whitespace-normal text-amber-300">{q.meaning}</span> : 'a share',
            ])}
          />
          {d.warnPoints.length > 0 && (
            <p className="text-xs text-amber-300 mt-1 mb-0">
              Warning. At {d.warnPoints.join(', ')} USD per bbl the engine flags this series exceeds or undefined, so the
              point is not a government share. An exceeds point keeps its true value and a contractor losing money over
              the life; an undefined point has no value because lifetime profit is not positive.
            </p>
          )}
          {d.warnPoints.length === 0 && (
            <p className="text-xs text-slate-500 mt-1 mb-0">
              Every point on this series is a share at all nine prices. Climb across the range, last minus first,
              {' '}{pc(d.climbDerived)} percentage points.
            </p>
          )}
        </div>
      ))}
      <p className="text-xs text-slate-500 mt-4 mb-1">The nine published price-sweep cases, which pin the whole result at each price rather than only the share</p>
      <Tbl
        head={['case', 'regime it actually runs', 'npv', 'irr, percent', 'totalContractorNCF', 'totalGovTake', 'paybackYear', 'rFactorPayoutYear', 'finalUnrecoveredPool']}
        rows={published.map((x) => [x.id, x.regimeName, mm(x.npv), pc(x.irrPct), mm(x.totalContractorNCF), mm(x.totalGovTake), yr(x.paybackYear), yr(x.rFactorPayoutYear), mm(x.finalUnrecoveredPool)])}
      />
      <SweepRegimeCaution />
      <Note>
        THREE STATES LIVE ON ONE CURVE, AND EVERY POINT SAYS WHICH. A share is between 0 and 100. An exceeds point is
        above 100 percent because the contractor is losing money while the government still collects: the true value
        is kept in the tooltip and the point is pinned to the top of the axis, so it never sets the scale. An undefined
        point has no value because lifetime profit is not positive at that price, which is the same under every regime,
        so the line breaks and the band is shaded; an earlier build returned exactly 0 there. A regime whose share
        RISES with price is progressive; one whose share FALLS is regressive, and the flat-royalty concessions in this
        template set are exactly that.
      </Note>
    </>
  );
};

const Capex = () => {
  const [caseId, setCaseId] = useState('cmp_all_templates_default_project');
  const cs = useEngine(() => capexSweep(caseId), [caseId]);
  const published = useMemo(() => { try { return publishedCapexSweep(); } catch { return []; } }, []);
  const picker = (
    <FieldGrid>
      <SelectField label="Published comparison" value={caseId} onChange={setCaseId} options={CASE_OPTIONS} />
    </FieldGrid>
  );
  if (cs.status !== 'done') {
    return <>{picker}{cs.status === 'failed' ? <Failed what="this capex sweep" /> : <Waiting what="the capex sweep" />}</>;
  }
  const bars = cs.value.series.map((d) => ({ name: d.name, seven: d.lossOverSevenSweptPointsDerived, eight: d.lossOverEightPointsDerived }));
  return (
    <>
      {picker}
      <p className="text-xs text-slate-400 mt-2 mb-0">{cs.value.note}</p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Labels the engine returns" value={String(cs.value.labelCount)} />
          <Tile label="Last label" value={String(cs.value.lastLabel)} />
          <Tile label="Last label the axis promises" value="1.5" />
          <Tile label="The multiplier the loop actually reaches" value="1.5000000000000004" />
        </TileGrid>
      </div>
      <Tbl
        head={['regime', ...cs.value.labels.map((x) => `x${x}`), 'x1.5, called directly', 'loss over the SEVEN swept points', 'loss over EIGHT points', 'the label difference']}
        rows={cs.value.series.map((d) => [
          d.name, ...d.values.map((v) => mm(v)), mm(d.npvAtOneAndAHalfCalledDirectly),
          mm(d.lossOverSevenSweptPointsDerived), mm(d.lossOverEightPointsDerived), mm(d.labelDifferenceDerived),
        ])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'contractor NPV given up, million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="seven" name="loss the chart measures, 0.8 to 1.4" fill="#38bdf8" isAnimationActive={false}>
              {bars.map((b) => <Cell key={b.name} fill="#38bdf8" />)}
            </Bar>
            <Bar dataKey="eight" name="loss the axis promises, 0.8 to 1.5" fill="#f87171" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The seven published capex-sweep cases, at multipliers of 0.7 to 1.3</p>
      <Tbl
        head={['case', 'regime it actually runs', 'npv', 'irr, percent', 'totalContractorNCF', 'totalGovTake', 'paybackYear', 'rFactorPayoutYear']}
        rows={published.map((x) => [x.id, x.regimeName, mm(x.npv), pc(x.irrPct), mm(x.totalContractorNCF), mm(x.totalGovTake), yr(x.paybackYear), yr(x.rFactorPayoutYear)])}
      />
      <SweepRegimeCaution />
      <Note>
        THE EIGHTH POINT IS NEVER REACHED. The sweep is written as a loop from a multiplier of 0.8 to 1.5 in steps of
        0.1, and its axis is labelled 0.8 to 1.5. Adding a tenth to a binary floating point number does not land on
        1.5: the accumulated multiplier reaches 1.5000000000000004, which fails the test, so the sweep has SEVEN
        points and its last label reads 1.4. What "resilience to cost overrun" therefore measures is the NPV given up
        between a 20 percent underspend and a 40 percent overrun, not the 50 percent overrun the axis promises. The
        verdict sentence is not false; it is answering a narrower question than the label on the chart, and the label
        difference column above is how much narrower.
      </Note>
    </>
  );
};

const Insights = () => {
  const [caseId, setCaseId] = useState('insights_suite');
  const ids = useMemo(() => { try { return goldenInsightsIds(); } catch { return []; } }, []);
  const one = useMemo(() => { try { return insights(caseId); } catch { return null; } }, [caseId]);
  const tie = useEngine(() => tieEvidence(), []);
  const share = useEngine(() => shareCurveRegimes(), []);
  const payback = useEngine(() => paybackTieEvidence(), []);
  const picker = (
    <FieldGrid>
      <SelectField label="Published insights case" value={caseId} onChange={setCaseId} options={ids.map((id) => [id, id])} />
    </FieldGrid>
  );
  if (!one) return <>{picker}<Failed what="this insights case" /></>;
  return (
    <>
      {picker}
      <p className="text-xs text-slate-400 mt-2 mb-0">{one.note}</p>
      {one.empty ? (
        <p className="text-xs text-slate-300 mt-3 mb-0">
          The engine returns an EMPTY LIST here rather than a verdict about nothing. A summary with no regimes in it
          has nothing to rank, and the honest answer to that is silence.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {one.verdicts.map((v) => (
            <div key={v.key} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
              <p className="text-xs text-slate-500 mb-0 font-mono">{v.key}</p>
              <p className="text-white text-sm font-medium mb-0">{v.label}</p>
              <p className="text-xs text-slate-300 mt-1 mb-0">{v.text}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500 mt-2 mb-0">
        Keys returned: {one.keys.length ? one.keys.join(', ') : 'none'}. Regimes in the summary: {one.regimeCount}.
        {one.regimeCount === 1 ? ' With one regime the payback and government verdicts drop their comparison clause and the two sweep verdicts are omitted entirely, because a ranking of one is not a ranking.' : ''}
      </p>

      <p className="text-xs text-slate-500 mt-5 mb-1">
        THE TIE THE SENTENCE DOES NOT ADMIT. The capex verdict picks its winner with a strict less-than in a reduce,
        which returns the FIRST element when two are equal and therefore breaks a tie by list order. The price verdict
        declines to rank unless its lead is at least one percentage point over at least three share prices.
      </p>
      {tie.status !== 'done' ? (tie.status === 'failed' ? <Failed what="the tie evidence" /> : <Waiting what="the tie evidence" />) : (
        <>
          <Tbl
            head={['regime', 'npv', 'capex sweep first point', 'capex sweep last point', 'loss', 'loss printed to one decimal, as the sentence prints it']}
            rows={tie.value.ranked.map((d) => [d.name, mm(d.npv), ratio(d.capexFirstPoint), ratio(d.capexLastPoint), ratio(d.lossDerived), d.lossToOneDecimalDerived])}
          />
          <div className="mt-3 space-y-2">
            {tie.value.insights.map((v) => (
              <div key={v.key} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                <p className="text-xs text-slate-500 mb-0 font-mono">{v.key}</p>
                <p className="text-xs text-slate-300 mt-1 mb-0">{v.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 mb-1">
            AND THE TIE HERE IS EXACT, WHICH IS STRONGER THAN A NEAR TIE, but not for the reason it first looks. At
            BOTH ends of the swept range every regime recovers cost at its own limit, the pool being far larger than
            any allowance, so cost recovered, profit oil and tax are unchanged between a multiplier of 0.8 and one of
            1.4. Nothing below the capex line moves, so the whole capex difference reaches the contractor year 1 line
            undiluted and is discounted by the same single year.
          </p>
          <Tbl
            head={['regime', 'cost recovered at x0.8', 'at x1.4', 'profit oil at x0.8', 'at x1.4', 'tax at x0.8', 'at x1.4', 'capex loss']}
            rows={tie.value.ends.map((d) => [d.name, mm(d.costRecoveredAtLow), mm(d.costRecoveredAtHigh), mm(d.profitOilAtLow), mm(d.profitOilAtHigh), mm(d.taxAtLow), mm(d.taxAtHigh), ratio(d.lossDerived)])}
          />
          <p className="text-xs text-slate-300 mt-2 mb-0">
            READ THE PROFIT OIL COLUMN BEFORE BELIEVING ANY STORY ABOUT IT. It is nought for the three templates that
            recover cost at 100 percent and very much not nought for the other three, so a claim that no profit oil
            and no tax exist anywhere here is refuted by the government take the same comparison reports. What is
            true, and is the whole of it, is that none of those columns MOVES across the sweep. The arithmetic closes
            exactly: the capex difference is {mm(tie.value.capexDifference)} million USD, spent in year 1 and
            discounted one year at {tie.value.discountRatePct} percent, which is {ratio(tie.value.lossFromTheCapexLineAlone)},
            every one of the six losses. No tie-break rule could be right here: a rule that picks the first, the last,
            the alphabetically smallest or the largest is picking among six answers that are the same answer.
          </p>
          <p className="text-xs text-amber-300 mt-2 mb-0">
            {tie.value.separatedAtOneDecimal
              ? 'On this case the ranked quantities are separated at the precision the sentence prints.'
              : 'The ranked quantities are NOT separated at the precision the sentence prints. Every loss above rounds to the same figure, and the capex verdict names a least and a most and prints the same number for both. A verdict naming a winner is only a verdict when the quantities it ranks are separated by more than the precision they are printed to.'}
          </p>
        </>
      )}

      <p className="text-xs text-slate-500 mt-5 mb-1">
        AND THE SAME REDUCE ON AN INTEGER COLUMN. Payback is a whole year, and whole years tie far more often than a
        continuous quantity does. Where the column ties, the sentence names the first regime in summary order, and the
        summary is sorted by contractor NPV.
      </p>
      {payback.status !== 'done' ? (payback.status === 'failed' ? <Failed what="the payback evidence" /> : <Waiting what="the payback evidence" />) : (
        <Tbl
          head={['comparison', 'payback years down the summary', 'fastest year', 'regimes tied at it', 'the regime the verdict names', 'the top-NPV regime', 'is the verdict a ranking', 'the SECOND regime the sentence names', 'the actual runner-up']}
          rows={payback.value.map((e) => [
            e.caseId, e.paybackYears.map((y) => yr(y)).join(', '), yr(e.fastestPaybackYear), e.tiedAtFastest,
            e.namedRegime === null ? 'null' : e.namedRegime, e.topNpvRegime,
            e.tied ? <span key={e.caseId} className="text-amber-300">no, the column ties and the sentence is telling you about NPV</span> : 'yes, the column does not tie',
            e.secondNamed === null ? 'null' : e.secondNamed,
            e.runnerUp === null ? 'null' : e.runnerUp,
          ])}
        />
      )}
      {payback.status === 'done' && (
        <p className="text-xs text-amber-300 mt-2 mb-0">
          And notice the SECOND name in every one of those sentences. It is not the runner-up. The function picks the
          fastest, removes it, and then takes the MAXIMUM of what is left, so the second regime named is the SLOWEST
          of the rest. A sentence of the form "A pays back in year x, against year y for B" reads like a top two and
          is a top and a bottom, with everything else silently in between.
        </p>
      )}

      <p className="text-xs text-slate-500 mt-5 mb-1">
        NO VALUE WHERE PROFIT IS NOT POSITIVE. On the comparison built for it, every regime returns null and the state
        undefined across the whole price sweep, and each of them collected hundreds or thousands of millions of USD for
        the government.
      </p>
      {share.status !== 'done' ? (share.status === 'failed' ? <Failed what="the share curve evidence" /> : <Waiting what="the share curve evidence" />) : (
        <>
          <Tbl
            head={['regime', 'total government take', 'total contractor NCF', 'the two added', 'value and state at every one of the nine prices']}
            rows={share.value.rows.map((x) => [x.name, mm(x.totalGovernmentTake), mm(x.totalContractorNCF), mm(x.denominatorDerived), [...new Set(x.points.map((q) => `${pc(q.plotted)} ${q.state}`))].join(', ')])}
          />
          <p className="text-xs text-slate-500 mt-4 mb-1">
            And the other direction, reached by making one project progressively more expensive. The Angola template on
            the DEFAULT PROJECT with every capex line multiplied, so nothing but the capital cost changes.
          </p>
          <Tbl
            head={['capex multiple', ...share.value.angola[0].labels.map((x) => String(x)), 'states on this line']}
            rows={share.value.angola.map((a) => [
              `x${a.multiple}`, ...a.values.map((v) => pc(v)), [...new Set(a.states)].join(', '),
            ])}
          />
          <p className="text-xs text-amber-300 mt-2 mb-0">
            Read the x3 row along its length. It is null and undefined at 40 USD per bbl, exceeds at 50 with a number in
            the thousands and at 60 with one in the hundreds, and a share from
            {' '}{share.value.angola.find((a) => a.multiple === 3)?.firstSharePrice} USD per bbl onward. Three states on
            one line of one chart, each flagged by the engine. The series is healthy AT THE DECK, which is why the check
            has to be per point and not per series.
          </p>
        </>
      )}
      <Note>
        The rule a reader needs. Before believing a point on this curve, read its state and the two totals underneath
        it. If lifetime contractor net cash flow is negative, the point is above 100 percent and flagged exceeds. If it
        is negative enough to outweigh the government take, the point is null and flagged undefined. The price mode
        carries {Object.values(PRICE_POINT_MEANINGS).length} distinct sentences, one per state, and writes the right one
        under every point, so a reader is never left to guess which of the three a number is. Every verdict above is
        the engine own string printed verbatim, its own money formatting included, because paraphrasing what a
        function said is how a claim it never made gets attributed to it.
      </Note>
    </>
  );
};

const ComparisonExplorer = () => {
  const [mode, setMode] = useState('summary');
  return (
    <PanelShell
      title="Comparison explorer"
      subtitle="What runFiscalComparison returns and what it does not say: the ranking with one rate carrying two values, the price sweep with the state of every point named, the capex sweep and the eighth point the loop never reaches, and the derived verdicts beside the quantities they claim to rank"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'summary' && <Summary />}
        {mode === 'price' && <Price />}
        {mode === 'capex' && <Capex />}
        {mode === 'insights' && <Insights />}
      </div>
    </PanelShell>
  );
};

export default ComparisonExplorer;
