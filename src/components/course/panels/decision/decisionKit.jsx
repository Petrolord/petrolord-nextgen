import React from 'react';
import { OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import { ANALYZER_CARDS } from './decisionLab';
import { Note } from '@/components/course/panels/petrophysics/panelKit';

// Shared atoms for the three EC4 decision panels. Formatting only: nothing
// here computes a decision quantity. Every value handed to these atoms is a
// return value from decisionLab.
//
// Two gates read what these atoms render:
//   - a KPI card value carries data-card="<engine key>" and the gross voi
//     carries data-gross="voi", so the withheld-rendering gate can read every
//     one back and prove a withheld (null) result reads "withheld";
//   - an outcome P-label carries data-plabel="outcome", so the P-label gate
//     can prove those are the ONLY P-labels a panel renders, in exceedance
//     order. Every P-label is built from lib/conventions/percentile.js.

export const mm = (v) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v).toFixed(4) : '-');
export const pr = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : '-');
export const sci = (v) => (Number.isFinite(v) ? Number(v).toExponential(6) : '-');

/** A KPI card as the Analyzer returns it: the engine's two-decimal string, or withheld for a null. */
export const cardText = (v) => (v === null || v === undefined ? 'withheld' : String(v));

const OUTCOME_SUFFIX = { p90: ' (low)', p50: '', p10: ' (high)' };
/** Outcome labels, low to high, built from the convention module. */
export const outcomeLabel = (key) => `${OUTCOME_LABELS[key]}${OUTCOME_SUFFIX[key]}`;

export const Outcome = ({ children }) => <span data-plabel="outcome" className="text-[#BFFF00] font-semibold">{children}</span>;

/** A value the Analyzer printed before the EC4-0 repair, shown as history only. */
export const History = ({ children }) => <span data-history="pre-repair" className="text-slate-400 italic">{children}</span>;

export const Tbl = ({ head, rows, strong = () => false }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={strong(i) ? 'text-white font-semibold' : ''}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Sub = ({ children }) => <p className="text-sm text-white font-medium mt-4 mb-0">{children}</p>;
export const Line = ({ children }) => <p className="text-xs text-slate-300 mt-2 mb-0">{children}</p>;

/** An engine answer: accepted with its EMV, or the refusal message verbatim. */
export const answerText = (a) => (a.ok ? `accepted, EMV ${mm(a.emv)} million USD` : `refused: ${a.error}`);

/** An annotated tree as rows: the node's own EMV BESIDE the branch value, the optimal path in bold. */
export const TreeRows = ({ tv }) => (
  <>
    <Tbl
      head={['path', 'branch', 'probability', 'cost, million USD', 'node the branch leads to', 'node EMV, million USD', 'branch value, million USD', 'optimal path']}
      strong={(i) => tv.rows[i].onOptimalPath}
      rows={tv.rows.map((x) => [
        x.path,
        <span key="label" style={{ paddingLeft: `${x.depth * 0.9}rem` }}>{x.label}</span>,
        x.probability === null ? '' : pr(x.probability),
        x.cost === null ? '' : mm(x.cost),
        `${x.childType} ${x.childLabel}${x.payoff && typeof x.payoff === 'object' ? ' (a linked summary, its mean)' : ''}`,
        mm(x.childEmv),
        mm(x.branchValue),
        x.onOptimalPath ? 'yes' : 'no',
      ])}
    />
    <Note>
      Root {tv.root.label}: EMV {mm(tv.root.emv)} million USD{tv.root.bestLabel ? `, first move ${tv.root.bestLabel}` : ', a chance root with no first move'}.
      Node EMV is the value of the node itself, before the cost on the branch leading into it; branch value is that EMV less the cost.
      Bold rows are on the optimal path.
    </Note>
  </>
);

/** The rollback of every chance node, term by term, as the engine weighted it. */
export const HandLines = ({ tv }) => (
  <ul className="mt-3 text-xs text-slate-300 list-none pl-0 space-y-1">
    {tv.chanceNodes.map((c) => (
      <li key={c.path || 'root'}>
        <span className="text-slate-500">{c.label}{c.path ? ` (path ${c.path})` : ' (the root)'}:</span>{' '}
        {c.terms.map((t) => `${pr(t.probability)} x ${mm(t.branchValue)}`).join(' + ')} = {mm(c.emv)} million USD
        {c.incomingBranchValue !== null ? `, less the cost ${mm(c.incomingCost)} on the ${c.incomingLabel} branch = ${mm(c.incomingBranchValue)}` : ''}.
      </li>
    ))}
  </ul>
);

/**
 * The four cards the Analyzer shows, then the gross voi on its own line: the
 * engine returns it, the Analyzer shows it only in its guidance sentence and
 * CSV export, and it is never a card.
 */
export const KpiCards = ({ result, format = cardText }) => {
  if (!result || !result.kpis) return null;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm mt-3">
        {ANALYZER_CARDS.map(([key, title]) => (
          <div key={key} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
            <p className="text-gray-500 text-xs mb-0">{title}</p>
            <p className="text-white mb-0">
              <span data-card={key}>{format(result.kpis[key])}</span>
              {result.kpis[key] === null ? null : <span className="text-gray-400 text-xs ml-1">million USD</span>}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Gross voi, shown only in the guidance sentence and the CSV export: <span data-gross="voi" className="text-white">{format(result.kpis.voi)}</span>
        {result.kpis.voi === null ? '' : ' million USD'}. Consistent {String(result.consistent)}; withheld {String(result.withheld)};
        {result.tree ? ` the tree is drawn, its root EMV ${mm(result.tree.emv)} million USD, first move ${result.tree.bestLabel}.` : ' no tree is drawn.'}
      </p>
    </>
  );
};
