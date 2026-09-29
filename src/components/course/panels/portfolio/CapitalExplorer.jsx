import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE, XAXIS_LABEL_HEIGHT } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
import {
  OKONO_LIMITS, FRONTIER_LIMITS, GRID_CASE_IDS, SPREAD_DIVISOR, EXACT_STATE_LIMIT, FALLBACK_GRID_CELLS, BINARY_SUM_DERIVED, setLabel,
  engineRules, okonoInventory, okonoBudgets, okonoFrontiers, gridCases,
} from './portfolioLab';
import { OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Capital explorer, the Associate tier. CHOOSING WHAT TO FUND: the OKONO
// inventory risked one project at a time, the five budgets and what each funds,
// the efficient frontier at two of them, and the published cases the knapsack
// solves exactly, beside the stated fallback grid.
//
// Every figure on this page is a return value from portfolioLab, which is a
// return value from the vendored portfolio engine, or arithmetic the teaching
// digest itself labels derived (unspent capex, frontier steps, the greedy
// fill, the fallback grid's rounded-up cell weights). Nothing here computes a risked EMV, a funded set or a frontier.
//
// P-LABELS. The only P-labels on this page are the entered NPV percentiles of
// a project (data-plabel="npvinput"), and every one is a string from
// lib/conventions/percentile.js; this file types none. A capex label carries
// data-plabel="capex", a budget or limit label data-plabel="budget" and a
// chance of success data-plabel="probability", and a gate reads those back out
// of the rendered markup and finds no P-label in them.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');

export const MODES = [
  ['inventory', 'Inventory: OKONO risked one project at a time'],
  ['budget', 'Budget: five limits, the funded sets, greedy against optimal'],
  ['frontier', 'Frontier: the best risked EMV at every spend'],
  ['grid', 'Exact solve: awkward capex solved exactly, and the stated fallback grid'],
];

const AXIS = AXIS_TICK;
const TOOLTIP = TOOLTIP_STYLE;

const NpvInput = ({ children }) => <span data-plabel="npvinput" className="text-pl-primary-text">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const BudgetLabel = ({ children }) => <span data-plabel="budget">{children}</span>;
const ProbabilityLabel = ({ children }) => <span data-plabel="probability">{children}</span>;

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
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

// ---------------------------------------------------------------------------

export const InventoryMode = ({ inv, rules }) => {
  if (!inv) return <Note>The portfolio engine did not return the inventory.</Note>;
  const h = inv.hand;
  return (
    <>
      {rules && (
        <ul className="text-xs text-pl-text list-none pl-0 space-y-1 mb-0">
          {rules.rules.map((l) => <li key={l}>{l}</li>)}
        </ul>
      )}
      <Tbl
        head={[
          'project', 'name', <CapexLabel key="c">capex, million USD</CapexLabel>,
          <NpvInput key="p90">NPV {OUTCOME_LABELS.p90} entered</NpvInput>,
          <NpvInput key="p50">NPV {OUTCOME_LABELS.p50} entered</NpvInput>,
          <NpvInput key="p10">NPV {OUTCOME_LABELS.p10} entered</NpvInput>,
          <ProbabilityLabel key="pos">chance of success</ProbabilityLabel>,
          'fail cost', 'risked EMV', 'success spread', 'mixture sd',
        ]}
        rows={inv.rows.map((p) => [
          p.id, p.name, mm(p.capex), mm(p.npv_p90), mm(p.npv_p50), mm(p.npv_p10), six(p.pos),
          mm(p.failCost), mm(p.emv), mm(p.successSpread), mm(p.mixtureSdDerived),
        ])}
      />
      <p className="text-xs text-pl-muted mt-1 mb-0">
        All money in million USD. The success spread is the engine&apos;s successStdDev: the entered high NPV less the entered low NPV,
        over {SPREAD_DIVISOR}. The mixture sd is the square root of the engine&apos;s projectMoments variance, success and failure together.
      </p>
      <div className="mt-3 rounded-md border border-pl-border bg-pl-sunken p-3 text-sm text-pl-text">
        <p className="text-pl-muted text-xs mb-1">{h.id} by hand</p>
        <p className="mb-0">
          {six(h.pos)} x {mm(h.npvP50)} less {six(h.failWeightDerived)} x {mm(h.failCost)} = <span className="text-pl-accent-text font-semibold">{mm(h.emv)}</span> million USD (engine).
        </p>
        <p className="text-xs text-pl-muted mt-1 mb-0">
          Its success-case NPV of {mm(h.npvP50)} million USD is not its value: the risked EMV is {six(h.emvShareOfSuccessDerived)} of it (derived).
        </p>
      </div>
      {rules && (
        <>
          <Tbl
            head={['probe "Probe", NPV 80 and fail cost 30', 'risked EMV, million USD, or the engine message']}
            rows={rules.posProbes.map((x) => [x.label, x.ok ? mm(x.emv) : x.error])}
          />
          <p className="text-xs text-pl-muted mt-1 mb-0">
            A missing or null chance of success is the documented default 1, certain success. A chance of success that is typed must be a number from 0 to 1;
            a blank, a word or a figure outside 0 to 1 is refused, naming the project.
          </p>
          <p className="text-xs text-pl-muted mt-2 mb-0">
            A project with capex typed as text beside one with capex 40 at a limit of 100:{' '}
            {rules.textCapexProbe.ok ? `funded ${setLabel(rules.textCapexProbe.ids)}.` : rules.textCapexProbe.error}
            {' '}Nothing is funded: the whole call is refused.
          </p>
          <Tbl
            head={['published case', 'chance of success typed', 'engine answer']}
            rows={rules.projectRefusals.map((x) => [x.id, JSON.stringify(x.pos), x.ok ? mm(x.emv) : x.error])}
          />
        </>
      )}
      <Tbl
        head={['published case', 'project', 'risked EMV, engine', 'golden']}
        rows={[...(rules ? rules.defaultCases : []), ...inv.publishedEmv].map((c) => [c.id, JSON.stringify(c.project), mm(c.emv), mm(c.goldenEmv)])}
      />
      <Note>
        A risked EMV is an expected value over success and failure. It is not the NPV if the project works, and a
        wildcat with a large success case can carry a small EMV.
      </Note>
    </>
  );
};

export const BudgetMode = ({ b, limit, onLimit }) => {
  if (!b) return <Note>The optimizer did not return the budgets.</Note>;
  const row = b.rows.find((x) => x.limit === Number(limit)) ?? b.rows[0];
  const g = b.greedy;
  return (
    <>
      {onLimit && (
        <FieldGrid>
          <SelectField label="Capex limit, million USD" value={String(row.limit)} onChange={(v) => onLimit(Number(v))}
            options={OKONO_LIMITS.map((l) => [String(l), `${l} million USD`])} />
        </FieldGrid>
      )}
      <div className="mt-3">
        <TileGrid>
          <Tile label={<BudgetLabel>Capex limit</BudgetLabel>} value={mm(row.limit)} unit="million USD" />
          <Tile label="Funded set" value={setLabel(row.ids)} />
          <Tile label={<CapexLabel>Total capex</CapexLabel>} value={mm(row.totalCapex)} unit="million USD" />
          <Tile label="Total risked EMV" value={mm(row.totalEmv)} unit="million USD" />
          <Tile label="Total success NPV" value={mm(row.totalNpvSuccess)} unit="million USD" />
          <Tile label={<BudgetLabel>Unspent (derived)</BudgetLabel>} value={mm(row.unspentDerived)} unit="million USD" />
          <Tile label="Solve method" value={row.solveMethod} />
          <Tile label="Optimality gap" value={mm(row.optimalityGap)} unit="million USD" />
        </TileGrid>
      </div>
      <Tbl
        head={[<BudgetLabel key="l">capex limit</BudgetLabel>, 'funded set', <CapexLabel key="c">total capex</CapexLabel>, 'total risked EMV', 'total success NPV', <BudgetLabel key="u">unspent (derived)</BudgetLabel>]}
        rows={b.rows.map((x) => [mm(x.limit), setLabel(x.ids), mm(x.totalCapex), mm(x.totalEmv), mm(x.totalNpvSuccess), mm(x.unspentDerived)])}
      />
      <Tbl
        head={['project', 'risked EMV per million USD of capex (derived)']}
        rows={b.ranking.map((x) => [x.id, six(x.emvPerCapexDerived)])}
      />
      <div className="mt-3 rounded-md border border-pl-border bg-pl-sunken p-3 text-xs text-pl-text">
        <p className="mb-0">
          Filling a <BudgetLabel>{mm(g.limit)} million USD limit</BudgetLabel> greedily down that ranking funds {setLabel(g.ids)} at
          capex {mm(g.capexDerived)} and risked EMV {mm(g.emvDerived)} (derived). The optimizer funds {setLabel(g.optimalIds)} at {mm(g.optimalEmv)}.
        </p>
        <p className="mb-0 mt-1">
          At {mm(b.slack.limit)} the optimizer leaves {mm(b.slack.unspentDerived)} unspent (derived): no remaining project fits, and OK-6 alone costs {mm(b.slack.tieBackCapex)}.
        </p>
      </div>
      <Tbl
        head={['published case', <BudgetLabel key="l">limit</BudgetLabel>, 'engine set', <CapexLabel key="c">capex</CapexLabel>, 'EMV', 'solve method', 'golden optimal sets']}
        rows={b.published.map((c) => [c.id, mm(c.capexLimit), setLabel(c.ids), mm(c.totalCapex), mm(c.totalEmv), c.solveMethod, c.goldenOptimalSets.map((s) => setLabel(s)).join(' or ')])}
      />
      <Note>
        When two sets tie on risked EMV the optimizer keeps the one with less capex; at equal capex and equal EMV it keeps the
        set built without the later project in the list. The result reports one set with no alternatives.
      </Note>
    </>
  );
};

export const FrontierMode = ({ fr, limit, onLimit }) => {
  if (!fr) return <Note>The optimizer did not return the frontier.</Note>;
  const idx = Math.max(0, FRONTIER_LIMITS.indexOf(Number(limit)));
  const front = fr.frontiers[idx];
  const isLarger = idx === fr.frontiers.length - 1;
  const last = front.points[front.points.length - 1];
  return (
    <>
      {onLimit && (
        <FieldGrid>
          <SelectField label="Frontier up to, million USD" value={String(front.limit)} onChange={(v) => onLimit(Number(v))}
            options={FRONTIER_LIMITS.map((l) => [String(l), `${l} million USD`])} />
        </FieldGrid>
      )}
      <ChartFrame height={224} className="mt-3">
        <LineChart data={front.points} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis height={XAXIS_LABEL_HEIGHT} dataKey="capex" type="number" domain={[0, front.limit]} tick={AXIS} label={{ value: 'capex, million USD', position: 'insideBottom', offset: -2, fill: SVG_CHART.note, fontSize: 10 }} />
          <YAxis tick={AXIS} label={{ value: 'best risked EMV', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
          <ReferenceLine x={front.limit} stroke={seriesColor(0)} strokeDasharray="3 3" />
          <Line type="stepAfter" dataKey="emv" name="best risked EMV" stroke={seriesColor(1)} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
      <Tbl
        head={['point', <CapexLabel key="c">capex</CapexLabel>, 'EMV', 'EMV gained', <CapexLabel key="a">capex added</CapexLabel>, 'EMV per extra million USD', ...(isLarger ? ['the set behind the point (derived)'] : [])]}
        rows={front.points.map((pt) => [
          pt.index, mm(pt.capex), mm(pt.emv),
          pt.emvGainedDerived === null ? 'none' : mm(pt.emvGainedDerived),
          pt.capexAddedDerived === null ? 'none' : mm(pt.capexAddedDerived),
          pt.emvPerExtraMillionDerived === null ? 'none' : six(pt.emvPerExtraMillionDerived),
          ...(isLarger ? [fr.setsBehindLargerFrontier[pt.index].setsDerived.map((s) => setLabel(s)).join(' or ')] : []),
        ])}
      />
      <p className="text-xs text-pl-muted mt-1 mb-0">
        The last three step columns are derived from consecutive rows. The last point, {mm(last.capex)} and {mm(last.emv)}, is the optimum: {setLabel(front.ids)}.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label={`Funded at ${fr.notNested.smaller.limit}`} value={setLabel(fr.notNested.smaller.ids)} />
          <Tile label={`Funded at ${fr.notNested.larger.limit}`} value={setLabel(fr.notNested.larger.ids)} />
          <Tile label="Funded at the smaller budget, dropped at the larger" value={fr.notNested.droppedAtLarger.join(', ') || 'none'} />
          <Tile label={`Gain from ${fr.gainSmallerToLarger.from} to ${fr.gainSmallerToLarger.to} (derived)`} value={mm(fr.gainSmallerToLarger.emvGainedDerived)} unit={`million USD for ${mm(fr.gainSmallerToLarger.capexAddedDerived)} more capex`} />
        </TileGrid>
      </div>
      <Note>
        The frontier is the best EMV at each spend, and the sets behind two budgets need not be nested: a larger budget
        can drop a project the smaller one funded.
      </Note>
    </>
  );
};

export const GridMode = ({ grid, caseId, onCase }) => {
  if (!grid) return <Note>The optimizer did not return the published cases.</Note>;
  const c = grid.find((x) => x.id === caseId) ?? grid[0];
  return (
    <>
      {onCase && (
        <FieldGrid>
          <SelectField label="Published case" value={c.id} onChange={onCase} options={GRID_CASE_IDS.map((id) => [id, id])} />
        </FieldGrid>
      )}
      <div className="mt-3">
        <TileGrid>
          <Tile label={<BudgetLabel>Limit</BudgetLabel>} value={Number(c.capexLimit).toFixed(4)} />
          <Tile label="Solve method" value={c.solveMethod} />
          <Tile label="exactStateLimit stated" value={c.exactStateLimit === null ? `none, default ${EXACT_STATE_LIMIT}` : String(c.exactStateLimit)} />
          <Tile label="Resolution per cell" value={c.resolution === null ? 'null, no grid' : Number(c.resolution).toFixed(6)} />
          <Tile label="Engine set" value={setLabel(c.ids)} />
          <Tile label={<CapexLabel>Engine capex</CapexLabel>} value={Number(c.totalCapex).toFixed(4)} />
          <Tile label="Engine EMV" value={mm(c.totalEmv)} />
          <Tile label="Optimality gap" value={mm(c.optimalityGap)} unit="million USD at most left out" />
          <Tile label="Over the limit" value={c.overLimit ? 'yes' : 'no'} />
          <Tile label={<BudgetLabel>Unspent (derived)</BudgetLabel>} value={Number(c.gridUnspentDerived).toFixed(4)} />
          <Tile label="Exact optimum EMV (golden)" value={mm(c.goldenExactEmv)} />
          <Tile label="Exact optimum sets (golden)" value={c.goldenExactSets.map((s) => setLabel(s)).join(' or ')} />
        </TileGrid>
      </div>
      <Tbl
        head={['project', <CapexLabel key="c">capex</CapexLabel>, 'risked EMV', ...(c.fallback ? [`cells it weighs, rounded up (derived), of ${c.cells}`] : [])]}
        rows={c.projects.map((p, i) => [p.id, Number(p.capex).toFixed(4), mm(p.emv), ...(c.fallback ? [c.cellWeightsDerived[i].cells] : [])])}
      />
      <Tbl
        head={['published case', 'solve method', 'engine set', 'EMV', 'optimality gap', 'exact optimum EMV (golden)']}
        rows={grid.map((x) => [x.id, x.solveMethod, setLabel(x.ids), mm(x.totalEmv), mm(x.optimalityGap), mm(x.goldenExactEmv)])}
      />
      <p className="text-xs text-pl-muted mt-1 mb-0">
        On decimalCapexExactSum the capex 0.1 and 0.2 add in binary to {BINARY_SUM_DERIVED} (derived); the engine reads them at their typed decimals, so they sum to exactly 0.3 and both are funded.
      </p>
      <Note>
        The knapsack is solved exactly on the capex as typed, so the funded set is optimal and never exceeds the limit. Only when a
        call states a small exactStateLimit (the default of {EXACT_STATE_LIMIT} is never reached by sixteen projects or fewer) does it fall back to a grid of{' '}
        {FALLBACK_GRID_CELLS} cells with every capex rounded up: that set still fits the limit, and optimalityGap says how much EMV it may leave out.
      </Note>
    </>
  );
};

const CapitalExplorer = ({ initialMode = 'inventory' }) => {
  const [mode, setMode] = useState(initialMode);
  const [limit, setLimit] = useState(450);
  const [frontierLimit, setFrontierLimit] = useState(FRONTIER_LIMITS[1]);
  const [caseId, setCaseId] = useState('gridOvershoot');
  const rules = useMemo(() => (mode === 'inventory' ? safe(engineRules) : null), [mode]);
  const inv = useMemo(() => (mode === 'inventory' ? safe(okonoInventory) : null), [mode]);
  const b = useMemo(() => (mode === 'budget' ? safe(okonoBudgets) : null), [mode]);
  const fr = useMemo(() => (mode === 'frontier' ? safe(okonoFrontiers) : null), [mode]);
  const grid = useMemo(() => (mode === 'grid' ? safe(gridCases) : null), [mode]);

  return (
    <PanelShell
      title="Capital explorer"
      subtitle="The OKONO inventory risked project by project, the funded set at five budgets, the efficient frontier, and the exact solve beside the stated fallback grid. Money in million USD."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'inventory' && <InventoryMode inv={inv} rules={rules} />}
        {mode === 'budget' && <BudgetMode b={b} limit={limit} onLimit={setLimit} />}
        {mode === 'frontier' && <FrontierMode fr={fr} limit={frontierLimit} onLimit={setFrontierLimit} />}
        {mode === 'grid' && <GridMode grid={grid} caseId={caseId} onCase={setCaseId} />}
      </div>
    </PanelShell>
  );
};

export default CapitalExplorer;
