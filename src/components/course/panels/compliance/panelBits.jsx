import React from 'react';
import { AS_OF_YMD, asOfAt, ymd } from './complianceLab';

// The atoms the three compliance explorers share, so a table, a verdict, an
// empty state and the as-of control look and read the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. A reader that returned
// nothing renders Empty, and nothing below it indexes into a value that could be
// an error object. complianceLab.test.js renders every mode of every panel with
// nothing and with an error-shaped object, and both must produce markup.
//
// NO REFUSAL STRING IS A LITERAL HERE. Verdict prints the reason the engine
// returned, through the lab. A panel that retypes a refusal has invented a
// sentence the engine may not produce, and the lab test asserts none of these
// files does.
//
// THE AS-OF CONTROL MOVES A DATE THE LAB BUILDS. It hands the lab a whole number
// of days, and the lab builds the date at local midnight from three numbers. No
// file in this directory other than the lab constructs a date.

export const AXIS = { fill: '#94a3b8', fontSize: 11 };
export const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
export const GRID = '#334155';
export const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa', '#f87171'];

/** A colour per status word, so the same word reads the same on every page. */
const STATUS_TONE = {
  Expired: 'text-red-300', Overdue: 'text-red-300', 'Due soon': 'text-amber-300',
  'On track': 'text-sky-300', Compliant: 'text-emerald-300', 'No date set': 'text-slate-400',
  'Review overdue': 'text-red-300', 'Review due soon': 'text-amber-300', 'Review scheduled': 'text-sky-300',
  Failed: 'text-red-300', Passed: 'text-emerald-300', Waived: 'text-amber-300',
  blocking: 'text-red-300', serious: 'text-amber-300', watch: 'text-sky-300',
};
export const Status = ({ word }) => (
  <span className={STATUS_TONE[word] || 'text-slate-300'}>{word === null || word === undefined ? 'none' : String(word)}</span>
);

/** A value as the digest prints it: a missing value is none. */
export const txt = (v) => {
  if (v === null || v === undefined || v === '') return 'none';
  if (Array.isArray(v)) return v.length ? v.join(', ') : 'none';
  return String(v);
};

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>
          {head.map((h, i) => (
            <th key={h} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="align-top">
            {r.map((c, j) => (
              <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} ${typeof c === 'string' && c.length > 60 ? '' : 'whitespace-nowrap'}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * A verdict as the engine returned it. ALLOWED, or REFUSED with the engine's own
 * reason beside it, verbatim.
 */
export const Verdict = ({ v }) => {
  if (!v || typeof v !== 'object') {
    return <p className="text-xs text-slate-400 mt-1 mb-0">This request has no verdict to show yet.</p>;
  }
  if (v.ok) {
    return (
      <div className="mt-2 rounded-md border border-emerald-800/60 bg-emerald-950/20 p-2">
        <p className="text-emerald-300 text-xs font-medium mb-0">ALLOWED: {v.label}</p>
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
      <p className="text-red-300 text-xs font-medium mb-1">REFUSED: {v.label}</p>
      <p className="text-xs text-slate-300 font-mono mb-0">{txt(v.reason)}</p>
    </div>
  );
};

export const Note = ({ children }) => (
  <p className="text-xs text-slate-500 mt-1 mb-0">{children}</p>
);

export const Lead = ({ children }) => (
  <p className="text-xs text-slate-400 mt-3 mb-0">{children}</p>
);

/** The empty state, rendered before any engine value exists. */
export const Empty = ({ children }) => (
  <p className="text-xs text-slate-400 mt-1 mb-0">
    {children || 'This reader has returned nothing yet, so there is no engine value to draw.'}
  </p>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };

/** A slider with its label and value, for a whole number the lab reads. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => (
  <div>
    <label className="text-gray-400 text-xs mb-1 block">
      {label}: <span className="text-white">{shown === undefined ? value : shown}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00]"
    />
  </div>
);

/**
 * The as-of control. The learner moves a whole number of days from the wave's
 * own as-of date, and the lab builds the date.
 */
export const AsOfSlider = ({ offset, onChange, min = -60, max = 240 }) => {
  const shown = safe(() => ymd(asOfAt(offset))) || AS_OF_YMD;
  return (
    <Slider
      label={`As-of date (the course reads everything at ${AS_OF_YMD})`}
      value={offset}
      min={min}
      max={max}
      onChange={onChange}
      shown={offset === 0 ? `${shown}, the digest's own date` : shown}
    />
  );
};

/** A walk shown one requirement at a time, with the verdict at each step. */
export const Stepper = ({ steps, at, onAt, title }) => {
  if (!Array.isArray(steps) || !steps.length) return <Empty>This walk has no steps to show.</Empty>;
  const i = Math.max(0, Math.min(at, steps.length - 1));
  return (
    <div className="mt-3 rounded-md border border-slate-700 p-3">
      <p className="text-xs text-slate-300 mb-2">{title}: step {i + 1} of {steps.length}</p>
      <div className="flex gap-2 mb-2">
        <button type="button" className="px-2 py-1 text-xs rounded border border-slate-600 text-slate-300" onClick={() => onAt(Math.max(0, i - 1))}>Back</button>
        <button type="button" className="px-2 py-1 text-xs rounded border border-slate-600 text-slate-300" onClick={() => onAt(Math.min(steps.length - 1, i + 1))}>Meet the next requirement</button>
      </div>
      {steps.slice(0, i + 1).map((s) => <Verdict key={s.label} v={s} />)}
    </div>
  );
};

export const Button = ({ onClick, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-[#BFFF00] text-[#BFFF00]' : 'border-slate-600 text-slate-300'}`}
  >
    {children}
  </button>
);
