import React from 'react';
import { F } from './carbonLab';

// The atoms the three carbon explorers share, so a table, a refusal, a verbatim
// engine sentence, a status line, an empty state and a control look and read
// the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. A reader that returned
// nothing renders Empty, and nothing below it indexes into a value that could be
// an error object. carbonLab.test.js renders every mode of every panel with
// nothing and with an error-shaped object, and both must produce markup.
//
// NO REFUSAL STRING IS A LITERAL HERE. Refused prints the sentence the engine
// returned, through the lab. A panel that retypes a refusal has invented a
// sentence the engine may not produce, and the lab test asserts none of these
// files does.
//
// NO ARITHMETIC. Every figure a panel prints is a lab value, printed by the
// lab's own F at the digest's precision for its class.

export const AXIS = { fill: '#94a3b8', fontSize: 11 };
export const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
export const GRID = '#334155';
export const SERIES = ['#38bdf8', '#f472b6', '#BFFF00', '#fbbf24', '#a78bfa', '#f87171'];

export { F };

/** True when a reader handed back something a mode can draw. */
export const usable = (v) => Boolean(v) && typeof v === 'object' && !v.error;

export const Tbl = ({ head, rows, highlight }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>
          {head.map((h, i) => (
            <th key={`${h}${i}`} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>
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

/** A refusal, with the engine's own sentence beside it, verbatim. */
export const Refused = ({ label, reason }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">REFUSED: {label}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{reason || 'the engine gave no sentence'}</p>
  </div>
);

/** An engine sentence quoted verbatim, with what it is. */
export const Verbatim = ({ label, children }) => (
  <p className="text-xs text-slate-400 mt-2 mb-0">
    <span className="text-slate-500">{label}, verbatim: </span>
    <span className="font-mono text-slate-300">&quot;{children}&quot;</span>
  </p>
);

/** A figure the digest prints as its own arithmetic on engine returns, labelled so. */
export const Here = ({ children }) => (
  <span className="text-slate-500">{children} <span className="italic">(computed here from the engine&apos;s figures)</span></span>
);

/** The reportable flag and its reasons, beside any total. A computed figure is never shown as reportable on its own. */
export const Status = ({ reportable, because }) => (
  <span className={`text-xs ${reportable === true ? 'text-emerald-300' : 'text-amber-300'}`}>
    reportable {reportable === true ? 'true' : reportable === false ? 'false' : 'none'}
    {Array.isArray(because) && because.length ? `; not reportable because: ${because.join('; ')}` : ''}
  </span>
);

/** An invented or SYNTHETIC tag beside a control. */
export const Invented = ({ synthetic }) => (
  <span className={`ml-1 text-[10px] uppercase ${synthetic ? 'text-amber-300' : 'text-slate-500'}`}>{synthetic ? 'SYNTHETIC' : 'invented'}</span>
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

/** A text box that hands its value on as typed, so a blank box reaches the engine blank. */
export const Box = ({ label, value, onChange, tag, synthetic }) => (
  <div>
    <label className="text-gray-400 text-xs mb-1 block">
      {label}{tag && <Invented synthetic={synthetic} />}
    </label>
    <input
      type="text"
      inputMode="decimal"
      value={value === null || value === undefined ? '' : String(value)}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2"
    />
  </div>
);

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

/** The engine's three-valued verdict as words. true, false and none are three states, and none is drawn as its own. */
export const Verdict = ({ value }) => {
  if (value === true) return <span className="px-2 py-0.5 rounded border border-emerald-700 text-emerald-300 text-xs">meetsTarget true</span>;
  if (value === false) return <span className="px-2 py-0.5 rounded border border-red-700 text-red-300 text-xs">meetsTarget false</span>;
  return <span className="px-2 py-0.5 rounded border border-amber-600 text-amber-300 text-xs">meetsTarget none (no verdict)</span>;
};
