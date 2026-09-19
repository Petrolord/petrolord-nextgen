import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// The atoms the three gasvalue explorers share, so a table, a refusal, an empty
// state and a control look and read the same on all three pages.
//
// A BLANK BOX IS A MISSING INPUT. NumBox hands the lab the string the learner
// left in it, and an empty box arrives at the engine as '' which the engine
// reads as missing. Nothing here turns a blank into a zero or into a default.
//
// THE EMPTY STATE IS A COMPONENT. A reader that returned nothing renders Empty,
// and nothing below it indexes into a value that could be an error object.
// gasvalueLab.test.js renders every mode of every panel with nothing, with an
// error-shaped object and on real data.
//
// NO REFUSAL STRING IS A LITERAL HERE. Refusal prints the sentence the engine
// returned, through the lab.

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

/** True when a reader handed back something a panel can index into. */
export const usable = (v) => !!v && typeof v === 'object' && !('error' in v && Object.keys(v).length === 1);

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
        {(Array.isArray(rows) ? rows : []).map((r, i) => (
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

/** The engine's refusal, verbatim, in a box that reads as one. */
export const Refusal = ({ message, label }) => (
  <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
    <p className="text-red-300 text-xs font-medium mb-1">REFUSED{label ? `: ${label}` : ''}</p>
    <p className="text-xs text-slate-300 font-mono mb-0">{txt(message)}</p>
  </div>
);

/** The engine's own note, where it answered with less than it was asked for. */
export const EngineNote = ({ children }) => (
  <div className="mt-2 rounded-md border border-amber-800/60 bg-amber-950/20 p-2">
    <p className="text-xs text-amber-200 font-mono mb-0">{children}</p>
  </div>
);

export const Note = ({ children }) => (
  <p className="text-xs text-slate-500 mt-1 mb-0">{children}</p>
);

export const Lead = ({ children }) => (
  <p className="text-xs text-slate-400 mt-3 mb-0">{children}</p>
);

/** A box labelled as something the course invented, or as SYNTHETIC. */
export const Labelled = ({ tag, children }) => (
  <div className="mt-3 rounded-md border border-dashed border-amber-700/70 p-3">
    <p className="text-[10px] uppercase tracking-wide text-amber-300 mb-1">{tag}</p>
    {children}
  </div>
);

/** The empty state, rendered before any engine value exists. */
export const Empty = ({ children }) => (
  <p className="text-xs text-slate-400 mt-1 mb-0">
    {children || 'This reader has returned nothing yet, so there is no engine value to draw.'}
  </p>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };

/** A typed number box. It hands back the string, so a blank stays blank. */
export const NumBox = ({ label, value, onChange, tag }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">
      {label}
      {tag ? <span className="ml-1 text-amber-300">({tag})</span> : null}
    </Label>
    <Input
      type="number"
      step="any"
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white border-gray-600 h-8 text-sm"
    />
  </div>
);

/** A slider with its label and the value it holds. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => {
  const n = Number(value);
  return (
    <div>
      <label className="text-gray-400 text-xs mb-1 block">
        {label}: <span className="text-white">{shown === undefined ? txt(value) : shown}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(n) && value !== '' ? Math.max(min, Math.min(max, n)) : min}
        onChange={(e) => onChange(e.target.value)}
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

/**
 * A whole-number stepper that can still be typed into, so a fractional or a
 * zero entry reaches the engine and the engine's refusal is what the learner sees.
 */
export const Stepper = ({ label, value, onChange }) => {
  const n = Number(value);
  const whole = value !== '' && Number.isFinite(n) ? Math.round(n) : null;
  return (
    <div>
      <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
      <div className="flex gap-1 items-center">
        <Button onClick={() => onChange(String(whole === null ? 1 : Math.max(0, whole - 1)))}>minus one</Button>
        <Input
          type="number"
          step="any"
          value={value === null || value === undefined ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-700 text-white border-gray-600 h-8 text-sm w-24"
        />
        <Button onClick={() => onChange(String(whole === null ? 1 : whole + 1))}>plus one</Button>
      </div>
    </div>
  );
};

/**
 * A figure the engine returned as missing (null) is its own state, never a
 * zero and never a blank tile. It names the input the engine lacks when the
 * engine named one.
 */
export const Missing = ({ label, why }) => (
  <div className="rounded-md border border-dashed border-slate-600 bg-[#0F172A] p-3">
    <p className="text-gray-500 text-xs mb-0">{label}</p>
    <p className="text-slate-400 text-sm italic mb-0">missing{why ? `: ${why}` : ''}</p>
  </div>
);

/** A figure with the basis the engine names printed beside it. */
export const Basis = ({ children }) => (
  <span className="ml-1 text-[10px] uppercase tracking-wide text-sky-300">({children})</span>
);

/** A select with a first option that is no choice at all, for an input the engine will not default. */
export const RequiredSelect = ({ label, value, onChange, options, none }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <select
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2"
    >
      <option value="">{none}</option>
      {(options || []).map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
