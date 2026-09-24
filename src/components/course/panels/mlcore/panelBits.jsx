import React from 'react';
import { Label } from '@/components/ui/label';

// Small shared pieces for the three D2 panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const list = (a) => (a && a.length ? a.join(', ') : 'none');

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

/** A free-text box: a list of values, or a table whose first line names its columns. */
export const TextField = ({ label, value, onChange, rows = 3 }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-xs p-2 font-mono"
    />
  </div>
);

/** A short text box for names: features, a target, well names. */
export const WordField = ({ label, value, onChange }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-xs h-8 px-2 font-mono"
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

/** The engine's own warning on a result it returned. */
export const Warning = ({ text }) => (
  <div className="mt-3 rounded-md border border-amber-800/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">THE ENGINE WARNS</p>
    <p className="text-xs text-slate-300 mb-0 font-mono">{text}</p>
  </div>
);

export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-sky-800/60 bg-sky-950/20 p-3">
    <p className="text-sky-300 text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

export const names = (text) => (typeof text === 'string' ? text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

export const safe = (fn) => { try { return fn(); } catch { return null; } };
