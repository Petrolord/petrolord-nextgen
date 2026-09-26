import React from 'react';
import { Label } from '@/components/ui/label';
import { setStated, getAt, pick } from './joaLab';

// Small shared pieces for the three EC9 calculator panels. Nothing here computes a number.

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

/** A short text box for a word or a list of years. */
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

/** The engine's own refusal, verbatim. */
export const Refusal = ({ text }) => (
  <div className="mt-3 rounded-md border border-red-800/60 bg-red-950/20 p-3">
    <p className="text-red-300 text-xs font-medium mb-1">THE ENGINE REFUSED, IN ITS OWN WORDS</p>
    <p className="text-xs text-slate-300 mb-0 font-mono">{text}</p>
  </div>
);

/** An engine reason or basis line, verbatim. */
export const EngineNote = ({ text }) => (
  <div className="mt-3 rounded-md border border-amber-800/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">THE ENGINE SAYS</p>
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

/** Pretty JSON for a text box a learner edits. */
export const pretty = (v) => JSON.stringify(v, null, 1);

/** A boolean choice as a select. */
export const YES_NO = [['false', 'off'], ['true', 'on']];

/** A value that may be null: the engine's null prints as none. */
export const orNone = (v) => (v === null || v === undefined ? 'none' : String(v));

/** A very small magnitude, in exponent form. */
export const eX = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : (Number(v) === 0 ? '0' : Number(v).toExponential(2)));

/**
 * A JSON box a learner edits, started from a teaching case, or from text as a
 * learner pastes it (initialText, used verbatim: the whole case file copied from
 * the capstone card is the case the tests render). Returns the text, its setter
 * and the parsed { value } or { error }.
 */
export const useJsonBox = (start, initialText = null) => {
  const [text, setText] = React.useState(typeof initialText === 'string' ? initialText : pretty(start));
  let parsed;
  try {
    parsed = text.trim() === '' ? { error: 'the box is empty' } : { value: JSON.parse(text) };
  } catch (e) {
    parsed = { error: `the box does not hold valid JSON (${e.message})` };
  }
  return { text, setText, parsed };
};

/** The source the engine names for the rule it applied (its basis.source), verbatim. */
export const Source = ({ text }) => (text ? (
  <div className="mt-3 rounded-md border border-slate-600/60 bg-slate-900/40 p-3">
    <p className="text-slate-300 text-xs font-medium mb-1">Source, as the engine names it</p>
    <p className="text-xs text-slate-300 mb-0 font-mono">{text}</p>
  </div>
) : null);

/** The engine's reasons, each verbatim. */
export const Reasons = ({ items }) => (items && items.length ? (
  <div className="mt-3 rounded-md border border-amber-800/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">THE ENGINE&apos;S REASONS, VERBATIM</p>
    {items.map((r, i) => <p key={i} className="text-xs text-slate-300 mb-0 font-mono">{r}</p>)}
  </div>
) : null);

const NUMERIC = /^-?\d+(?:\.\d+)?$/;

/** The value a box states for one input of a view's block, or undefined. */
export const statedIn = (box, viewKey, path) => (box.parsed.error ? undefined : getAt(pick(box.parsed.value, viewKey), path));

/**
 * A VISIBLE CONTROL FOR ONE STATED INPUT. It shows what the box states (or
 * "not stated") and writes a choice INTO the box through setStated; "not
 * stated" removes the key, so the engine refuses by name. The control never
 * supplies a value the box does not show: there is no hidden default.
 *   options  [[value, label], ...] for a choice; omitted for a number
 *   cast     turns a chosen option string into the stated value (numbers)
 */
export const StatedControl = ({ box, viewKey, path, label, options = null, cast = (v) => v }) => {
  const current = statedIn(box, viewKey, path);
  const write = (v) => {
    const r = setStated(box.text, viewKey, path, v);
    if (!r.error) box.setText(r.text);
  };
  if (options) {
    const opts = [['', 'not stated'], ...options];
    return (
      <div>
        <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
        <select value={current === undefined ? '' : String(current)} onChange={(e) => write(e.target.value === '' ? undefined : cast(e.target.value))}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2">
          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    );
  }
  return <NumberControl key={String(current)} label={label} current={current} write={write} />;
};

const NumberControl = ({ label, current, write }) => {
  const [text, setText] = React.useState(current === undefined ? '' : String(current));
  const change = (v) => {
    setText(v);
    if (v.trim() === '') write(undefined);
    else if (NUMERIC.test(v.trim())) write(Number(v.trim()));
  };
  return (
    <div>
      <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
      <input type="text" value={text} placeholder="not stated" onChange={(e) => change(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md text-xs h-8 px-2 font-mono" />
    </div>
  );
};

/** One note for every REQUIRED stated input the box leaves out: the engine will refuse it by name. */
export const MissingStated = ({ box, viewKey, required }) => {
  if (box.parsed.error) return null;
  const missing = required.filter(([path]) => statedIn(box, viewKey, path) === undefined);
  return missing.map(([path, name]) => (
    <p key={path} className="text-xs text-gray-500 mt-1 mb-0">The box does not state {name}, so the engine refuses: choose it above, or type it.</p>
  ));
};
