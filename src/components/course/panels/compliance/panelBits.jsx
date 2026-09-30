import React from 'react';
import { AS_OF_YMD, asOfAt, ymd } from './complianceLab';
import { TOOLTIP_STYLE, GRID_STYLE } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';

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

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = GRID_STYLE.stroke;
// Old dark-plate order sky, pink, lime, amber, violet, red, on the kit colours:
// the covered and filed-inside marks are green and the stale and outside ones red,
// as the panel text reads them.
export const SERIES = [seriesColor(0), seriesColor(4), seriesColor(1), seriesColor(2), SVG_CHART.reference, seriesColor(3)];

/** A colour per status word, so the same word reads the same on every page. */
const STATUS_TONE = {
  Expired: 'text-pl-danger-text', Overdue: 'text-pl-danger-text', 'Due soon': 'text-pl-warning-text',
  'On track': 'text-pl-info-text', Compliant: 'text-pl-success-text', 'No date set': 'text-pl-muted',
  'Review overdue': 'text-pl-danger-text', 'Review due soon': 'text-pl-warning-text', 'Review scheduled': 'text-pl-info-text',
  Failed: 'text-pl-danger-text', Passed: 'text-pl-success-text', Waived: 'text-pl-warning-text',
  blocking: 'text-pl-danger-text', serious: 'text-pl-warning-text', watch: 'text-pl-info-text',
};
export const Status = ({ word }) => (
  <span className={STATUS_TONE[word] || 'text-pl-text'}>{word === null || word === undefined ? 'none' : String(word)}</span>
);

/** A value as the digest prints it: a missing value is none. */
export const txt = (v) => {
  if (v === null || v === undefined || v === '') return 'none';
  if (Array.isArray(v)) return v.length ? v.join(', ') : 'none';
  return String(v);
};

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
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
    return <p className="text-xs text-pl-muted mt-1 mb-0">This request has no verdict to show yet.</p>;
  }
  if (v.ok) {
    return (
      <div className="mt-2 rounded-md border border-pl-success/30 bg-pl-success-bg p-2">
        <p className="text-pl-success-text text-xs font-medium mb-0">ALLOWED: {v.label}</p>
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-2">
      <p className="text-pl-danger-text text-xs font-medium mb-1">REFUSED: {v.label}</p>
      <p className="text-xs text-pl-text font-mono mb-0">{txt(v.reason)}</p>
    </div>
  );
};

export const Note = ({ children }) => (
  <p className="text-xs text-pl-muted mt-1 mb-0">{children}</p>
);

export const Lead = ({ children }) => (
  <p className="text-xs text-pl-muted mt-3 mb-0">{children}</p>
);

/** The empty state, rendered before any engine value exists. */
export const Empty = ({ children }) => (
  <p className="text-xs text-pl-muted mt-1 mb-0">
    {children || 'This reader has returned nothing yet, so there is no engine value to draw.'}
  </p>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };

/** A slider with its label and value, for a whole number the lab reads. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => (
  <div>
    <label className="text-pl-muted text-xs mb-1 block">
      {label}: <span className="text-pl-text">{shown === undefined ? value : shown}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-pl-primary"
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
      shown={offset === 0 ? `${shown}, the date the lessons use` : shown}
    />
  );
};

/** A walk shown one requirement at a time, with the verdict at each step. */
export const Stepper = ({ steps, at, onAt, title }) => {
  if (!Array.isArray(steps) || !steps.length) return <Empty>This walk has no steps to show.</Empty>;
  const i = Math.max(0, Math.min(at, steps.length - 1));
  return (
    <div className="mt-3 rounded-md border border-pl-border p-3">
      <p className="text-xs text-pl-text mb-2">{title}: step {i + 1} of {steps.length}</p>
      <div className="flex gap-2 mb-2">
        <button type="button" className="px-2 py-1 text-xs rounded border border-pl-border-strong text-pl-text" onClick={() => onAt(Math.max(0, i - 1))}>Back</button>
        <button type="button" className="px-2 py-1 text-xs rounded border border-pl-border-strong text-pl-text" onClick={() => onAt(Math.min(steps.length - 1, i + 1))}>Meet the next requirement</button>
      </div>
      {steps.slice(0, i + 1).map((s) => <Verdict key={s.label} v={s} />)}
    </div>
  );
};

export const Button = ({ onClick, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-pl-primary text-pl-primary-text' : 'border-pl-border-strong text-pl-text'}`}
  >
    {children}
  </button>
);
