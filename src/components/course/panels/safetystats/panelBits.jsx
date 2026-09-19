import React from 'react';
import { Label } from '@/components/ui/label';

// Small shared pieces for the three H1 panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const twelve = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(12));

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={h} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
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

/** A free-text list box: counts or hours, one period after another. */
export const SeriesField = ({ label, value, onChange }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={2}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-xs p-2 font-mono"
    />
  </div>
);

/** The engine's own refusal, verbatim, naming the field. */
export const Refusal = ({ r }) => (
  <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
    <p className="text-red-300 text-xs font-medium mb-1">THE ENGINE REFUSED, NAMING {String(r.field)}</p>
    <p className="text-xs text-slate-300 mb-0 font-mono">{r.error}</p>
  </div>
);

export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-sky-800/60 bg-sky-950/20 p-3">
    <p className="text-sky-300 text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

export const Derived = ({ children }) => (
  <p className="mt-2 mb-0 text-xs text-amber-300/90">DERIVED, and the engine does not compute it. {children}</p>
);

export const BASE_OPTIONS = [
  ['200000', '200,000 hours (OSHA/BLS)'],
  ['1000000', '1,000,000 hours (IOGP)'],
  ['100000000', '100,000,000 hours (FAR)'],
  ['', 'no base (see the refusal)'],
];

export const CONFIDENCE_OPTIONS = [['0.8', '0.80'], ['0.9', '0.90'], ['0.95', '0.95'], ['0.99', '0.99'], ['95', '95, as a percentage (see the refusal)']];

export const safe = (fn) => { try { return fn(); } catch { return null; } };
