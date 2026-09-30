import React from 'react';
import { Label } from '@/components/ui/label';
import {
  setStated, getAt, pick, upliftFor, equalCarrierShares,
} from './joaLab';

// Small shared pieces for the three EC9 calculator panels. Nothing here computes a number.

export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));
export const list = (a) => (a && a.length ? a.join(', ') : 'none');

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
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
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md text-xs p-2 font-mono"
    />
  </div>
);

/** A short text box for a word or a list of years. */
export const WordField = ({ label, value, onChange }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md text-xs h-8 px-2 font-mono"
    />
  </div>
);

/** The engine's own refusal, verbatim. */
export const Refusal = ({ text }) => (
  <div className="mt-3 rounded-md border border-pl-danger/40 bg-pl-danger-bg p-3">
    <p className="text-pl-danger-text text-xs font-medium mb-1">THE ENGINE REFUSED, IN ITS OWN WORDS</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{text}</p>
  </div>
);

/** An engine reason or basis line, verbatim. */
export const EngineNote = ({ text }) => (
  <div className="mt-3 rounded-md border border-pl-warning/40 bg-pl-warning-bg p-3">
    <p className="text-pl-warning-text text-xs font-medium mb-1">THE ENGINE SAYS</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{text}</p>
  </div>
);

export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-pl-info/40 bg-pl-info-bg p-3">
    <p className="text-pl-info-text text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-pl-text mb-0">{children}</p>
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
  <div className="mt-3 rounded-md border border-pl-border bg-pl-sunken p-3">
    <p className="text-pl-text text-xs font-medium mb-1">Source, as the engine names it</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{text}</p>
  </div>
) : null);

/** The engine's reasons, each verbatim. */
export const Reasons = ({ items }) => (items && items.length ? (
  <div className="mt-3 rounded-md border border-pl-warning/40 bg-pl-warning-bg p-3">
    <p className="text-pl-warning-text text-xs font-medium mb-1">THE ENGINE&apos;S REASONS, VERBATIM</p>
    {items.map((r, i) => <p key={i} className="text-xs text-pl-text mb-0 font-mono">{r}</p>)}
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
        <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
        <select value={current === undefined ? '' : String(current)} onChange={(e) => write(e.target.value === '' ? undefined : cast(e.target.value))}
          className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md h-8 text-sm px-2">
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
      <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
      <input type="text" value={text} placeholder="not stated" onChange={(e) => change(e.target.value)}
        className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md text-xs h-8 px-2 font-mono" />
    </div>
  );
};

/** One note for every REQUIRED stated input the box leaves out: the engine will refuse it by name. */
export const MissingStated = ({ box, viewKey, required }) => {
  if (box.parsed.error) return null;
  const missing = required.filter(([path]) => statedIn(box, viewKey, path) === undefined);
  return missing.map(([path, name]) => (
    <p key={path} className="text-xs text-pl-muted mt-1 mb-0">The box does not state {name}, so the engine refuses: choose it above, or type it.</p>
  ));
};

/** Write one stated input (any JSON value, or undefined to remove it) into the box. */
export const writeStated = (box, viewKey, path, value) => {
  const r = setStated(box.text, viewKey, path, value);
  if (!r.error) box.setText(r.text);
};

/** A plain button that changes what the box states. */
export const ActionButton = ({ label, onClick }) => (
  <div className="flex items-end">
    <button type="button" onClick={onClick}
      className="h-8 px-2 text-xs rounded-md border border-pl-border-strong bg-pl-surface text-pl-text hover:bg-pl-sunken">{label}</button>
  </div>
);

const ChoiceControl = ({ label, value, options, onChange }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md h-8 text-sm px-2">
      {[['', 'not stated'], ...options].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

/**
 * THE UPLIFT TYPE OF A CARRY. Choosing a type rewrites the whole uplift for
 * that type (upliftFor), so no term of the old type stays behind; the rate or
 * the multiple the new type needs is then asked for beside it ("not stated"
 * until the learner states it).
 */
export const UpliftControl = ({ box, viewKey, label, options }) => {
  const old = statedIn(box, viewKey, 'uplift');
  const current = old && typeof old === 'object' && typeof old.type === 'string' ? old.type : '';
  return <ChoiceControl label={label} value={current} options={options} onChange={(v) => writeStated(box, viewKey, 'uplift', upliftFor(v === '' ? undefined : v, old))} />;
};

const CARRIER_RULES = [['pro-rata', 'pro rata to their participating interests (pro-rata)'], ['stated', 'in stated shares, each stated below']];

/**
 * THE CARRIERS OF ONE CARRY: "pro-rata", stated shares (written as placeholder
 * equal shares of the parties no carry names as carried, each then stated with
 * its own control), or not stated.
 */
export const CarriersControl = ({ box, viewKey, index, label }) => {
  const path = `carries.${index}.carriers`;
  const cur = statedIn(box, viewKey, path);
  const value = cur === 'pro-rata' ? 'pro-rata' : (cur && typeof cur === 'object' ? 'stated' : '');
  const block = box.parsed.error ? null : pick(box.parsed.value, viewKey);
  const choose = (v) => {
    if (v === '') writeStated(box, viewKey, path, undefined);
    else if (v === 'pro-rata') writeStated(box, viewKey, path, 'pro-rata');
    else writeStated(box, viewKey, path, equalCarrierShares(block && block.parties, block && block.carries));
  };
  return <ChoiceControl label={label} value={value} options={CARRIER_RULES} onChange={choose} />;
};
