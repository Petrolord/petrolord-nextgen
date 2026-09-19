import React from 'react';
import { fx } from './crudeLab';

// The atoms the three crude explorers share, so a table, a basis tag, a refusal,
// an empty state and a slider look and read the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. A reader that returned
// nothing renders Empty, and nothing below it indexes into a value that could be
// an error object. crudeLab.test.js renders every mode of every panel with
// nothing and with an error-shaped object, and both must produce markup.
//
// NO REFUSAL STRING IS A LITERAL HERE. Refused prints the sentence the engine
// returned, through the lab. A panel that retypes a refusal has invented a
// sentence the engine may not produce, and the lab test asserts none of these
// files does.
//
// NO ARITHMETIC. Every figure a panel prints is a lab value, printed by the
// lab's own fx to four decimals, the digest's precision.

export const AXIS = { fill: '#94a3b8', fontSize: 11 };
export const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
export const GRID = '#334155';
export const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa', '#f87171'];

/** A figure to four decimals, or the word for a figure the engine did not form. */
export const f4 = (v, word) => fx(v, word);

/** True when a reader handed back something a mode can draw. */
export const usable = (v) => Boolean(v) && typeof v === 'object' && !v.error;

export const Tbl = ({ head, rows, highlight }) => (
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
          <tr key={i} className={`align-top ${highlight && highlight(i) ? 'text-[#BFFF00]' : ''}`}>
            {r.map((c, j) => (
              <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} ${typeof c === 'string' && c.length > 60 ? '' : 'whitespace-nowrap'}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** The basis the engine named, printed beside a figure in the engine's own words. */
export const Basis = ({ children }) => (
  <span className="text-sky-300 font-mono">{children}</span>
);

/** A reading the engine does not use, labelled as such. */
export const Shortcut = ({ children }) => (
  <span className="text-slate-500">{children}</span>
);

/** A refusal, with the engine's own sentence beside it, verbatim. */
export const Refused = ({ label, reason }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">REFUSED: {label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{reason || 'the engine gave no sentence'}</p>
  </div>
);

/**
 * The engine's three-valued stable flag. true, false and null are three
 * different states, and null is drawn as its own state: no verdict. A dashboard
 * that turns null into green has turned "we do not know" into "safe".
 */
export const StableBadge = ({ stable }) => {
  if (stable === true) return <span className="px-2 py-0.5 rounded border border-emerald-700 text-emerald-300 text-xs">Screens stable</span>;
  if (stable === false) return <span className="px-2 py-0.5 rounded border border-red-700 text-red-300 text-xs">Screens unstable</span>;
  return <span className="px-2 py-0.5 rounded border border-amber-600 text-amber-300 text-xs">No verdict</span>;
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

/** A slider with its label and value. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => {
  const v = typeof value === 'number' && Number.isFinite(value) ? value : min;
  return (
  <div>
    <label className="text-gray-400 text-xs mb-1 block">
      {label}: <span className="text-white">{typeof shown === 'string' ? shown : v}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onChange && onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00]"
    />
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

/** A labelled switch for a teaching toggle. */
export const Toggle = ({ label, on, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-slate-300">
    <input type="checkbox" checked={Boolean(on)} onChange={(e) => onChange && onChange(e.target.checked)} className="accent-[#BFFF00]" />
    {label}
  </label>
);
