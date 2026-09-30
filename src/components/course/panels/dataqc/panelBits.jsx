import React from 'react';
import { Label } from '@/components/ui/label';

// Small shared pieces for the three D1 panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const list = (a) => (a && a.length ? a.join(', ') : 'none');

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
        <tr>{head.map((h, i) => <th key={`${i}-${h}`} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
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

/** A free-text list box: one value after another; null or a dash is a missing value. */
export const SeriesField = ({ label, value, onChange, rows = 2 }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus text-xs p-2 font-mono"
    />
  </div>
);

/** The engine's own refusal, verbatim, naming the field. */
export const Refusal = ({ r }) => (
  <div className="mt-3 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-3">
    <p className="text-pl-danger-text text-xs font-medium mb-1">THE ENGINE REFUSED, NAMING {String(r.field)}</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{r.error}</p>
  </div>
);

export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-pl-info/30 bg-pl-info-bg p-3">
    <p className="text-pl-info-text text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-pl-text mb-0">{children}</p>
  </div>
);

/** Every flag the engine returned, with the rule that fired and its reason. */
export const Flags = ({ flags, offset = 0, label = 'entry' }) => (
  flags && flags.length
    ? <Tbl head={[label, 'rule', 'the engine reason']} rows={flags.map((f) => [f.index === null ? 'none' : String(f.index + offset), f.rule, f.reason])} />
    : <p className="mt-2 mb-0 text-xs text-pl-muted">No flags.</p>
);

export const Series = (a) => a.map((v) => (v === null ? 'null' : String(v))).join(', ');

export const safe = (fn) => { try { return fn(); } catch { return null; } };
