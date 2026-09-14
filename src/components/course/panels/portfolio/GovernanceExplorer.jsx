import React, { useMemo, useState } from 'react';
import {
  RHO_SWEEP, setLabel,
  riskMethods, correlation, partnerShares, refusalsAndFlags, distrust,
} from './portfolioLab';
import { OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Governance explorer, the Expert tier. RISK, CORRELATION, SHARES AND WHAT TO
// DISTRUST: the risk summary by simulation beside the exact answer and the old
// normal approximation, the correlation sweep, joint venture splits, the
// engines' refusals and flags, and the numbers to distrust.
//
// Every figure on this page is a return value from portfolioLab, which is a
// return value from the vendored portfolio and AFE engines, a published golden
// field shown beside it and named golden, or arithmetic the digest itself
// labels derived (the old normal approximation rebuilt from the engine's own
// emv and stdDev, the spread formula, a standard error).
//
// P-LABELS. The only P-labels on this page are the low and high cases of a
// PORTFOLIO NPV OUTCOME (data-plabel="outcome"), every one a string from
// lib/conventions/percentile.js; this file types none. A chance of loss
// carries data-plabel="probability", a cost or a share data-plabel="cost", and
// a gate reads those back out of the rendered markup and finds no P-label.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const usd = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'null');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');
const two = (v) => (Number.isFinite(v) ? Number(v).toFixed(2) : 'null');

export const MODES = [
  ['simulation', 'Simulation: exact, the old normal approximation, the engine'],
  ['correlation', 'Correlation: the rho sweep and the spread formula'],
  ['shares', 'Shares: OFON-1 split and billed, the invalid splits'],
  ['refusals', 'Refusals: the engine messages and the overshoot flag'],
  ['distrust', 'Distrust: CPI before spend, the undated invoice, the short plan, the seed'],
];

const Outcome = ({ children }) => <span data-plabel="outcome" className="text-[#BFFF00] font-semibold">{children}</span>;
const ProbabilityLabel = ({ children }) => <span data-plabel="probability">{children}</span>;
const CostLabel = ({ children }) => <span data-plabel="cost">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const BudgetLabel = ({ children }) => <span data-plabel="budget">{children}</span>;

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

const safe = (fn) => { try { return fn(); } catch { return null; } };

const LOW = OUTCOME_LABELS.p90;
const HIGH = OUTCOME_LABELS.p10;

// ---------------------------------------------------------------------------

export const SimulationMode = ({ rm }) => {
  if (!rm) return <Note>The portfolio engine did not return the risk summaries.</Note>;
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The published method cases, each run by the engine at its stated seed and iterations, beside the exact answer and the
        normal approximation the engine used before EC5-0. Money in million USD.
      </p>
      <Tbl
        head={[
          'case', 'kind',
          <ProbabilityLabel key="e">exact chance of loss</ProbabilityLabel>,
          <ProbabilityLabel key="n">normal approximation chance of loss</ProbabilityLabel>,
          <ProbabilityLabel key="g">engine chance of loss</ProbabilityLabel>,
          'standard error (golden)', 'z (golden)',
          <React.Fragment key="x">exact <Outcome>{LOW}</Outcome> low case</React.Fragment>,
          <React.Fragment key="y">normal <Outcome>{LOW}</Outcome></React.Fragment>,
          <React.Fragment key="z">engine <Outcome>{LOW}</Outcome></React.Fragment>,
          'seed', 'iterations',
        ]}
        rows={rm.published.map((c) => [
          c.id, c.kind, six(c.goldenExactProbLoss), six(c.goldenNormalProbLoss), six(c.engineProbLoss),
          six(c.goldenStandardError), four(c.goldenZ),
          c.goldenExactP90Outcome !== null ? mm(c.goldenExactP90Outcome) : (c.goldenExactP90Continuous !== null ? `${mm(c.goldenExactP90Continuous)} (continuous)` : 'n/a'),
          mm(c.goldenNormalP90), mm(c.engineP90), c.seed, c.iterations,
        ])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">Exact, normal approximation, standard error and z are golden fields; the engine columns are this run.</p>
      <p className="text-xs text-slate-300 mt-3 mb-0">{rm.drawOrder}</p>
      <Tbl
        head={[
          'OKONO limit', 'funded set', 'emv', 'stdDev',
          <ProbabilityLabel key="p">engine chance of loss</ProbabilityLabel>,
          <React.Fragment key="l">engine <Outcome>{LOW}</Outcome> low case</React.Fragment>,
          <React.Fragment key="h">engine <Outcome>{HIGH}</Outcome> high case</React.Fragment>,
          'seed', 'iterations',
          <ProbabilityLabel key="n">normal approximation chance of loss (derived)</ProbabilityLabel>,
          <React.Fragment key="m">normal <Outcome>{LOW}</Outcome>, emv less 1.2816 x stdDev (derived)</React.Fragment>,
        ]}
        rows={rm.okono.map((x) => [
          mm(x.limit), setLabel(x.ids), mm(x.emv), mm(x.stdDev), six(x.probLoss), mm(x.p90), mm(x.p10),
          x.seed, x.iterations, six(x.normalProbLossDerived), mm(x.normalP90Derived),
        ])}
      />
      <Note>
        Correlation 0, the optimizer default. The simulation draws the actual success or failure of each project; a normal
        curve laid over a handful of risked projects puts a low case below the worst outcome that can happen.
      </Note>
    </>
  );
};

export const CorrelationMode = ({ c, rho, onRho }) => {
  if (!c) return <Note>The portfolio engine did not return the correlation sweep.</Note>;
  const row = c.rows.find((x) => x.rho === Number(rho)) ?? c.rows[0];
  return (
    <>
      {onRho && (
        <FieldGrid>
          <SelectField label="rho, the latent correlation" value={String(row.rho)} onChange={(v) => onRho(Number(v))}
            options={RHO_SWEEP.map((x) => [String(x), String(x)])} />
        </FieldGrid>
      )}
      <p className="text-xs text-slate-400 mt-2 mb-0">
        OKONO funded set at {mm(c.limit)} million USD ({setLabel(c.ids)}): project sds {c.projectSdsDerived.map(mm).join(' / ')};
        sum of variances {mm(c.varianceSumDerived)}; square of the summed sds {mm(c.sdSumSquaredDerived)} (derived).
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="stdDev, closed form" value={mm(row.stdDev)} unit="million USD" />
          <Tile label="independentStdDev" value={mm(row.independentStdDev)} unit="million USD" />
          <Tile label={`Spread formula ${c.formula} (derived)`} value={mm(row.formulaDerived)} unit="million USD" />
          <Tile label="emv" value={mm(row.emv)} unit="million USD" />
          <Tile label={<ProbabilityLabel>Chance of loss, simulated</ProbabilityLabel>} value={six(row.probLoss)} />
          <Tile label={<>Low case, <Outcome>{LOW}</Outcome></>} value={mm(row.p90)} unit="million USD" />
          <Tile label={<>High case, <Outcome>{HIGH}</Outcome></>} value={mm(row.p10)} unit="million USD" />
          <Tile label="Seed and iterations" value={`${row.seed}, ${row.iterations}`} />
        </TileGrid>
      </div>
      <Tbl
        head={['rho', 'stdDev', 'independentStdDev', 'spread formula (derived)', 'emv', <ProbabilityLabel key="p">chance of loss</ProbabilityLabel>, <Outcome key="l">{LOW}</Outcome>, <Outcome key="h">{HIGH}</Outcome>]}
        rows={c.rows.map((x) => [six(x.rho), mm(x.stdDev), mm(x.independentStdDev), mm(x.formulaDerived), mm(x.emv), six(x.probLoss), mm(x.p90), mm(x.p10)])}
      />
      <Tbl
        head={['published case', 'correlation used', 'stdDev', <ProbabilityLabel key="p">chance of loss</ProbabilityLabel>, 'golden stdDev']}
        rows={c.published.map((x) => [x.id, six(x.correlationUsed), mm(x.stdDev), six(x.probLoss), mm(x.goldenStdDev)])}
      />
      <Note>
        Correlation widens the spread and leaves the mean alone. Two models sit side by side: stdDev applies rho to the project
        outcomes in closed form, while the chance of loss and the low and high cases come from the simulation, where rho applies
        to the latent drivers. The simulated spread need not equal the stdDev beside it.
      </Note>
    </>
  );
};

export const SharesMode = ({ s }) => {
  if (!s) return <Note>The AFE engine did not return the partner split.</Note>;
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">OFON-1 budget {usd(s.budget.cost)} USD split by working interest:</p>
      <Tbl
        head={['party', 'working interest percent', <CostLabel key="s">share, USD</CostLabel>]}
        rows={[
          ...s.budget.partners.map((p) => [p.name, four(p.workingInterest), usd(p.shareAmount)]),
          ['operator', four(s.budget.operatorShare), usd(s.budget.operatorAmount)],
        ]}
      />
      <p className="text-xs text-slate-400 mt-1 mb-0">
        partnerTotal {four(s.budget.partnerTotal)}, valid {String(s.budget.valid)}, note {s.budget.note ?? 'none'}. Shares sum to {usd(s.budget.sharesSumDerived)} (derived).
      </p>
      <Tbl
        head={[`billing the actuals to date, ${usd(s.billed.cost)} USD`, <CostLabel key="b">billed, USD</CostLabel>]}
        rows={[...s.billed.partners.map((p) => [p.name, usd(p.shareAmount)]), ['operator', usd(s.billed.operatorAmount)]]}
      />
      <div className="mt-3 space-y-2">
        {s.published.map((x) => (
          <div key={x.name} className="rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
            <p className="text-slate-500 mb-1">{x.name}</p>
            <p className="mb-0">
              <CostLabel>cost {two(x.cost)}</CostLabel>, interests {JSON.stringify(x.interests)}; partner amounts {x.partnerAmounts.map(two).join(' / ') || 'none'};
              operator share {four(x.operatorShare)} percent, operator amount {two(x.operatorAmount)}; valid {String(x.valid)}.
            </p>
            {x.note && <p className="mb-0 mt-1 text-amber-300">{x.note}</p>}
          </div>
        ))}
      </div>
      <Note>
        The operator carries whatever the partners do not. An invalid split is still allocated so the numbers are visible, and
        the engine note says why it must not be billed.
      </Note>
    </>
  );
};

export const RefusalsMode = ({ rf }) => {
  if (!rf) return <Note>The engines did not return their refusals.</Note>;
  const go = rf.overshoot;
  return (
    <>
      <Tbl
        head={['portfolio case', 'error', 'engine message, verbatim']}
        rows={rf.portfolio.map((a) => [a.id, a.name, a.error])}
      />
      <Tbl
        head={['AFE case', 'as of', 'error', 'engine message, verbatim']}
        rows={rf.afe.map((a) => [a.name, a.asOf, a.ok ? 'accepted' : a.errorName, a.ok ? '' : a.error])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Published gridOvershoot, overLimit" value={String(go.overLimit)} />
          <Tile label="overLimitBy" value={four(go.overLimitBy)} unit="million USD" />
          <Tile label={<CapexLabel>Capex chosen</CapexLabel>} value={four(go.totalCapex)} unit="million USD" />
          <Tile label={<BudgetLabel>Against a limit of</BudgetLabel>} value={four(go.capexLimit)} unit="million USD" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-300 mt-3 mb-0">{rf.repaired}</p>
      <p className="text-xs text-slate-400 mt-2 mb-0">{rf.notRepaired}</p>
      <Note>A refusal is the engine declining to compute; a flag is the engine computing and saying what went wrong. Read both.</Note>
    </>
  );
};

export const DistrustMode = ({ d }) => {
  if (!d) return <Note>The engines returned nothing to distrust.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="CPI with every actual set to 0" value={six(d.cpiBeforeSpend.cpi)} unit={`on earned value ${usd(d.cpiBeforeSpend.earnedValue)} USD`} />
        <Tile label="First S-curve Actual with a null-dated invoice" value={String(d.nullDated.firstActual)} />
        <Tile label={<CostLabel>Last Planned point</CostLabel>} value={usd(d.shortPlan.lastPlanned)} unit={`USD, ${usd(d.shortPlan.shortDerived)} short of the budget (derived)`} />
        <Tile label={<CostLabel>Last Forecast point</CostLabel>} value={usd(d.underrunPicture.lastForecast)} unit={`USD against an EAC of ${usd(d.underrunPicture.eac)}`} />
      </TileGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The engine returns CPI 1 whenever actuals are 0. In the published case &quot;{d.nullDated.name}&quot; (invoices {JSON.stringify(d.nullDated.invoices)}) the
        null-dated amount counts from 1970 in every bucket and the missing date never counts. OFON-1&apos;s last Forecast point sits below the budget of
        {' '}{usd(d.underrunPicture.totalBudget)} while its variance at completion is {usd(d.underrunPicture.variance)}: an overrun drawn as an underrun.
      </p>
      <Tbl
        head={['seed', 'iterations', <ProbabilityLabel key="p">chance of loss</ProbabilityLabel>, 'standard error sqrt(p(1 - p) / n) (derived)', <Outcome key="l">{LOW}</Outcome>]}
        rows={d.seedTable.rows.map((x) => [x.seed, x.iterations, six(x.probLoss), six(x.standardErrorDerived), mm(x.p90)])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        OKONO funded set at {mm(d.seedTable.limit)} million USD ({setLabel(d.seedTable.ids)}), correlation 0. A seed buys a reproducible number;
        iterations buy a smaller standard error. Neither buys a correct model of the projects.
      </p>
      <Note>{d.modelLimits}</Note>
    </>
  );
};

const GovernanceExplorer = ({ initialMode = 'simulation' }) => {
  const [mode, setMode] = useState(initialMode);
  const [rho, setRho] = useState(0.3);
  const rm = useMemo(() => (mode === 'simulation' ? safe(riskMethods) : null), [mode]);
  const c = useMemo(() => (mode === 'correlation' ? safe(correlation) : null), [mode]);
  const s = useMemo(() => (mode === 'shares' ? safe(partnerShares) : null), [mode]);
  const rf = useMemo(() => (mode === 'refusals' ? safe(refusalsAndFlags) : null), [mode]);
  const d = useMemo(() => (mode === 'distrust' ? safe(distrust) : null), [mode]);

  return (
    <PanelShell
      title="Governance explorer"
      subtitle="Portfolio risk by simulation, correlation, joint venture shares, the engines' refusals and flags, and the numbers to distrust."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'simulation' && <SimulationMode rm={rm} />}
        {mode === 'correlation' && <CorrelationMode c={c} rho={rho} onRho={setRho} />}
        {mode === 'shares' && <SharesMode s={s} />}
        {mode === 'refusals' && <RefusalsMode rf={rf} />}
        {mode === 'distrust' && <DistrustMode d={d} />}
      </div>
    </PanelShell>
  );
};

export default GovernanceExplorer;
