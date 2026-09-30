import React from 'react';
import { CHART_COLORS, TOOLTIP_STYLE, LEGEND_PROPS, XAXIS_LABEL_HEIGHT } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
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

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = CHART_COLORS.grid;
// The old dark-plate hues in their old slots (sky, pink, lime, amber, violet,
// red), now the chart kit's colours for the white plate.
export const SERIES = [seriesColor(1), seriesColor(4), seriesColor(0), seriesColor(2), seriesColor(4), seriesColor(3)];
export const AXIS_NOTE = SVG_CHART.note;
export const GUIDE = SVG_CHART.reference;
export { LEGEND_PROPS, XAXIS_LABEL_HEIGHT };

export { F };

/** True when a reader handed back something a mode can draw. */
export const usable = (v) => Boolean(v) && typeof v === 'object' && !v.error;

export const Tbl = ({ head, rows, highlight }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
        <tr>
          {head.map((h, i) => (
            <th key={`${h}${i}`} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={`align-top ${highlight && highlight(i) ? 'text-pl-accent-text font-medium' : ''}`}>
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
  <div className="mt-2 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-2">
    <p className="text-pl-danger-text text-xs font-medium mb-1">REFUSED: {label}</p>
    <p className="text-xs text-pl-text font-mono mb-0">{reason || 'the engine gave no sentence'}</p>
  </div>
);

/** An engine sentence quoted verbatim, with what it is. */
export const Verbatim = ({ label, children }) => (
  <p className="text-xs text-pl-muted mt-2 mb-0">
    <span className="text-pl-muted">{label}, verbatim: </span>
    <span className="font-mono text-pl-text">&quot;{children}&quot;</span>
  </p>
);

/** A figure the digest prints as its own arithmetic on engine returns, labelled so. */
export const Here = ({ children }) => (
  <span className="text-pl-muted">{children} <span className="italic">(computed here from the engine&apos;s figures)</span></span>
);

/** The reportable flag and its reasons, beside any total. A computed figure is never shown as reportable on its own. */
export const Status = ({ reportable, because }) => (
  <span className={`text-xs ${reportable === true ? 'text-pl-success-text' : 'text-pl-warning-text'}`}>
    reportable {reportable === true ? 'true' : reportable === false ? 'false' : 'none'}
    {Array.isArray(because) && because.length ? `; not reportable because: ${because.join('; ')}` : ''}
  </span>
);

/** An invented or SYNTHETIC tag beside a control. */
export const Invented = ({ synthetic }) => (
  <span className={`ml-1 text-[10px] uppercase ${synthetic ? 'text-pl-warning-text' : 'text-pl-muted'}`}>{synthetic ? 'SYNTHETIC' : 'invented'}</span>
);

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

/** A text box that hands its value on as typed, so a blank box reaches the engine blank. */
export const Box = ({ label, value, onChange, tag, synthetic }) => (
  <div>
    <label className="text-pl-muted text-xs mb-1 block">
      {label}{tag && <Invented synthetic={synthetic} />}
    </label>
    <input
      type="text"
      inputMode="decimal"
      value={value === null || value === undefined ? '' : String(value)}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full rounded-md border border-pl-border-strong bg-pl-surface text-pl-text h-8 text-sm px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
    />
  </div>
);

/** A slider with its label and value. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => {
  const v = typeof value === 'number' && Number.isFinite(value) ? value : min;
  return (
    <div>
      <label className="text-pl-muted text-xs mb-1 block">
        {label}: <span className="text-pl-text">{typeof shown === 'string' ? shown : v}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className="w-full accent-pl-primary"
      />
    </div>
  );
};

export const Button = ({ onClick, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-pl-primary bg-pl-primary text-pl-primary-fg' : 'border-pl-border-strong bg-pl-surface text-pl-text hover:bg-pl-sunken'}`}
  >
    {children}
  </button>
);

/** The engine's three-valued verdict as words. true, false and none are three states, and none is drawn as its own. */
export const Verdict = ({ value }) => {
  if (value === true) return <span className="px-2 py-0.5 rounded border border-pl-success/40 text-pl-success-text text-xs">meetsTarget true</span>;
  if (value === false) return <span className="px-2 py-0.5 rounded border border-pl-danger/40 text-pl-danger-text text-xs">meetsTarget false</span>;
  return <span className="px-2 py-0.5 rounded border border-pl-warning/40 text-pl-warning-text text-xs">meetsTarget none (no verdict)</span>;
};
