import React from 'react';
import { Label } from '@/components/ui/label';

// Small shared pieces for the three H4 panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const nine = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(9));
export const twelve = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(12));

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

/** A free-text box: one row per line. */
export const TextRows = ({ label, value, onChange, rows = 3 }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-pl-border-strong bg-pl-surface text-pl-text text-xs p-2 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
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

export const Warning = ({ text }) => (text ? (
  <div className="mt-3 rounded-md border border-pl-warning/30 bg-pl-warning-bg p-3">
    <p className="text-pl-warning-text text-xs font-medium mb-1">THE ENGINE WARNED, AND STILL ANSWERED</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{text}</p>
  </div>
) : null);

/** The basis block a result carries: the model, and its source. */
export const Basis = ({ r }) => (r && r.basis ? (
  <Declared title="THE MODEL AND ITS SOURCE, IN THE ENGINE'S WORDS">
    {r.basis.model}
    {' '}
    ({r.basis.source})
  </Declared>
) : null);

export const safe = (fn) => { try { return fn(); } catch { return null; } };
