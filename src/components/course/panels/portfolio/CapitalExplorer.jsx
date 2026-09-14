import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  OKONO_LIMITS, FRONTIER_LIMITS, GRID_CASE_IDS, SPREAD_DIVISOR, setLabel,
  engineRules, okonoInventory, okonoBudgets, okonoFrontiers, gridCases,
} from './portfolioLab';
import { OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Capital explorer, the Associate tier. CHOOSING WHAT TO FUND: the OKONO
// inventory risked one project at a time, the five budgets and what each funds,
// the efficient frontier at two of them, and the grid the optimizer works on.
//
// Every figure on this page is a return value from portfolioLab, which is a
// return value from the vendored portfolio engine, or arithmetic the teaching
// digest itself labels derived (unspent capex, frontier steps, the greedy
// fill). Nothing here computes a risked EMV, a funded set or a frontier.
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
  ['grid', 'Grid: the published grid cases, the overshoot and the undershoot'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const NpvInput = ({ children }) => <span data-plabel="npvinput" className="text-[#BFFF00]">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const BudgetLabel = ({ children }) => <span data-plabel="budget">{children}</span>;
const ProbabilityLabel = ({ children }) => <span data-plabel="probability">{children}</span>;

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

// ---------------------------------------------------------------------------

export const InventoryMode = ({ inv, rules }) => {
  if (!inv) return <Note>The portfolio engine did not return the inventory.</Note>;
  const h = inv.hand;
  return (
    <>
      {rules && (
        <ul className="text-xs text-slate-300 list-none pl-0 space-y-1 mb-0">
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
      <p className="text-xs text-slate-500 mt-1 mb-0">
        All money in million USD. The success spread is the engine&apos;s successStdDev: the entered high NPV less the entered low NPV,
        over {SPREAD_DIVISOR}. The mixture sd is the square root of the engine&apos;s projectMoments variance, success and failure together.
      </p>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-sm text-slate-200">
        <p className="text-slate-500 text-xs mb-1">{h.id} by hand</p>
        <p className="mb-0">
          {six(h.pos)} x {mm(h.npvP50)} less {six(h.failWeightDerived)} x {mm(h.failCost)} = <span className="text-[#BFFF00] font-semibold">{mm(h.emv)}</span> million USD (engine).
        </p>
        <p className="text-xs text-slate-400 mt-1 mb-0">
          Its success-case NPV of {mm(h.npvP50)} million USD is not its value: the risked EMV is {six(h.emvShareOfSuccessDerived)} of it (derived).
        </p>
      </div>
      {rules && (
        <>
          <Tbl
            head={['probe, NPV 80 and fail cost 30', 'risked EMV, million USD']}
            rows={rules.posProbes.map((x) => [x.label, mm(x.emv)])}
          />
          <p className="text-xs text-slate-500 mt-1 mb-0">
            A missing, null or non-numeric chance of success is read as 1, certain success. An empty one is the number 0, certain failure (finding EC5-6).
          </p>
          <p className="text-xs text-slate-400 mt-2 mb-0">
            A project with capex typed as text beside one with capex 40 at a limit of 100:{' '}
            {rules.textCapexProbe.ok
              ? `funded ${setLabel(rules.textCapexProbe.ids)}, total capex ${mm(rules.textCapexProbe.totalCapex)}, total EMV ${mm(rules.textCapexProbe.totalEmv)} million USD.`
              : rules.textCapexProbe.error}
            {' '}Text capex is neither refused nor flagged; it counts as 0 and weighs one grid cell (finding EC5-7).
          </p>
        </>
      )}
      <Tbl
        head={['published case', 'project', 'risked EMV, engine', 'golden']}
        rows={inv.publishedEmv.map((c) => [c.id, JSON.stringify(c.project), mm(c.emv), mm(c.goldenEmv)])}
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
          <Tile label="Grid resolution" value={mm(row.resolution)} unit="million USD per cell" />
          <Tile label="Over the limit" value={row.overLimit ? 'yes' : 'no'} />
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
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        <p className="mb-0">
          Filling a <BudgetLabel>{mm(g.limit)} million USD limit</BudgetLabel> greedily down that ranking funds {setLabel(g.ids)} at
          capex {mm(g.capexDerived)} and risked EMV {mm(g.emvDerived)} (derived). The optimizer funds {setLabel(g.optimalIds)} at {mm(g.optimalEmv)}.
        </p>
        <p className="mb-0 mt-1">
          At {mm(b.slack.limit)} the optimizer leaves {mm(b.slack.unspentDerived)} unspent (derived): no remaining project fits, and OK-6 alone costs {mm(b.slack.tieBackCapex)}.
        </p>
      </div>
      <Tbl
        head={['published case', <BudgetLabel key="l">limit</BudgetLabel>, 'engine set', <CapexLabel key="c">capex</CapexLabel>, 'EMV', 'golden optimal sets']}
        rows={b.published.map((c) => [c.id, mm(c.capexLimit), setLabel(c.ids), mm(c.totalCapex), mm(c.totalEmv), c.goldenOptimalSets.map((s) => setLabel(s)).join(' or ')])}
      />
      <Note>
        The optimizer keeps the first best set it builds and replaces it only with a strictly larger EMV, so on a tie the
        order the projects were entered decides, and the result reports one set with no alternatives.
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
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={front.points} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="capex" type="number" domain={[0, front.limit]} tick={AXIS} label={{ value: 'capex, million USD', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} label={{ value: 'best risked EMV', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <ReferenceLine x={front.limit} stroke="#BFFF00" strokeDasharray="3 3" />
            <Line type="stepAfter" dataKey="emv" name="best risked EMV" stroke="#38bdf8" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
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
      <p className="text-xs text-slate-500 mt-1 mb-0">
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
  if (!grid) return <Note>The optimizer did not return the grid cases.</Note>;
  const c = grid.find((x) => x.id === caseId) ?? grid[0];
  return (
    <>
      {onCase && (
        <FieldGrid>
          <SelectField label="Published grid case" value={c.id} onChange={onCase} options={GRID_CASE_IDS.map((id) => [id, id])} />
        </FieldGrid>
      )}
      <div className="mt-3">
        <TileGrid>
          <Tile label={<BudgetLabel>Limit</BudgetLabel>} value={Number(c.capexLimit).toFixed(4)} />
          <Tile label="Resolution per cell" value={Number(c.resolution).toFixed(6)} />
          <Tile label="Grid cells (derived)" value={String(c.gridCellsDerived)} />
          <Tile label="Engine set" value={setLabel(c.ids)} />
          <Tile label={<CapexLabel>Engine capex</CapexLabel>} value={Number(c.totalCapex).toFixed(4)} />
          <Tile label="Engine EMV" value={mm(c.totalEmv)} />
          <Tile label="Over the limit" value={c.overLimit ? 'yes, flagged' : 'no'} />
          <Tile label={<BudgetLabel>Over the limit by</BudgetLabel>} value={Number(c.overLimitBy).toFixed(4)} />
          <Tile label="Exact optimum EMV (golden)" value={mm(c.goldenExactEmv)} />
          <Tile label="Exact optimum sets (golden)" value={c.goldenExactSets.map((s) => setLabel(s)).join(' or ')} />
          <Tile label="Gap (golden)" value={mm(c.goldenGap)} />
          <Tile label={<BudgetLabel>Unspent (derived)</BudgetLabel>} value={Number(c.gridUnspentDerived).toFixed(4)} />
        </TileGrid>
      </div>
      <Tbl
        head={['project', <CapexLabel key="c">capex</CapexLabel>, 'risked EMV', 'cells it weighs (derived)']}
        rows={c.projects.map((p, i) => [p.id, Number(p.capex).toFixed(4), mm(p.emv), c.cellWeightsDerived[i].cells])}
      />
      <Tbl
        head={['published case', 'engine set', 'over the limit', <BudgetLabel key="b">over the limit by</BudgetLabel>, 'set changed by the grid (golden)']}
        rows={grid.map((x) => [x.id, setLabel(x.ids), x.overLimit ? 'yes' : 'no', Number(x.overLimitBy).toFixed(4), x.goldenSetChanged ? 'yes' : 'no'])}
      />
      <Note>
        The overshoot is now flagged and still happens. The undershoot and the one cell charged to a free project are
        unchanged (findings D2 and D4): read the resolution before trusting a funded set on a large or fractional limit.
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
      subtitle="The OKONO inventory risked project by project, the funded set at five budgets, the efficient frontier, and the grid under the answer. Money in million USD."
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
