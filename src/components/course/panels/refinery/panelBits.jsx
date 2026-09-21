import React from 'react';

// The atoms the three refinery explorers share, so a table, a refusal, an empty
// state and a typed box look and read the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. A reader that returned
// nothing renders Empty, and nothing below it indexes into a value that could be
// an error object. refineryLab.test.js renders every mode of every panel with
// nothing and with an error-shaped object, and both must produce markup.
//
// NO REFUSAL STRING IS A LITERAL HERE. Refused prints the sentence the engine
// returned or threw, through the lab. A panel that retypes a refusal has invented
// a sentence the engine may not produce, and the lab test asserts none of these
// files does.
//
// A TYPED BOX KEEPS WHAT WAS TYPED. BoxField hands the lab the string in the box,
// blank included, so a blank box reaches the engine blank and a 90 typed as a
// utilisation reaches it as 90. Neither is tidied on the way.

export const AXIS = { fill: '#94a3b8', fontSize: 11 };
export const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
export const GRID = '#334155';
export const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa', '#f87171'];

/** A value as the digest prints it: a missing value is none. */
export const txt = (v) => {
  if (v === null || v === undefined || v === '') return 'none';
  if (Array.isArray(v)) return v.length ? v.join(', ') : 'none';
  return String(v);
};

/** A flag the engine returned, read as a word. */
export const yes = (v) => (v ? 'yes' : 'no');

export const Tbl = ({ head, rows, tone }) => (
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
          <tr key={i} className={`align-top ${tone ? tone(i) || '' : ''}`}>
            {r.map((c, j) => (
              <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} ${typeof c === 'string' && c.length > 60 ? '' : 'whitespace-nowrap'}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** What the engine said when it refused, verbatim, with what was asked of it. */
export const Refused = ({ label, sentence }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">The engine refused{label ? `: ${label}` : ''}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{txt(sentence)}</p>
  </div>
);

/** The engine's own words shown as a quotation. */
export const EngineSays = ({ children }) => (
  <p className="text-xs text-slate-300 font-mono mt-2 mb-0 border-l-2 border-slate-600 pl-2">{children}</p>
);

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

/** True when a reader handed back something a mode can read. */
export const usable = (v) => !!v && typeof v === 'object' && !v.error;

/** A slider with its label and value. */
export const Slider = ({
  label, value, min, max, step = 1, onChange, shown,
}) => (
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

/** A box that hands back exactly what was typed, blank included. */
export const BoxField = ({
  label, value, onChange, hint, width = 'w-full',
}) => (
  <div>
    {label ? <label className="text-gray-400 text-xs mb-1 block">{label}</label> : null}
    <input
      type="text"
      inputMode="decimal"
      value={value === null || value === undefined ? '' : String(value)}
      placeholder={hint || 'blank'}
      onChange={(e) => onChange(e.target.value)}
      className={`${width} bg-gray-700 text-white border border-gray-600 rounded-md h-7 text-xs px-2`}
    />
  </div>
);

export const Button = ({ onClick, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-[#BFFF00] text-[#BFFF00]' : 'border-slate-600 text-slate-300'}`}
  >
    {children}
  </button>
);

export const Check = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-slate-300">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="accent-[#BFFF00]" />
    {label}
  </label>
);

/** A money figure coloured by what it did to margin: gained, lost or neither. */
export const toneOf = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) < 0.005) return 'text-slate-300';
  return v > 0 ? 'text-emerald-300' : 'text-red-300';
};
