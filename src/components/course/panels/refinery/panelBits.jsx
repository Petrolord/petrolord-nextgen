import React from 'react';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';

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

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = GRID_STYLE.stroke;
// The six slots the panels index, on the family series colours: blue, violet,
// green, amber, the ink note for the fifth slot, red.
export const SERIES = [seriesColor(0), seriesColor(4), seriesColor(1), seriesColor(2), SVG_CHART.note, seriesColor(3)];

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
  <div className="mt-2 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-2">
    <p className="text-pl-danger-text text-xs font-medium mb-1">The engine refused{label ? `: ${label}` : ''}</p>
    <p className="text-xs text-pl-text font-mono mb-0">{txt(sentence)}</p>
  </div>
);

/** The engine's own words shown as a quotation. */
export const EngineSays = ({ children }) => (
  <p className="text-xs text-pl-text font-mono mt-2 mb-0 border-l-2 border-pl-border-strong pl-2">{children}</p>
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

/** True when a reader handed back something a mode can read. */
export const usable = (v) => !!v && typeof v === 'object' && !v.error;

/** A slider with its label and value. */
export const Slider = ({
  label, value, min, max, step = 1, onChange, shown,
}) => (
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

/** A box that hands back exactly what was typed, blank included. */
export const BoxField = ({
  label, value, onChange, hint, width = 'w-full',
}) => (
  <div>
    {label ? <label className="text-pl-muted text-xs mb-1 block">{label}</label> : null}
    <input
      type="text"
      inputMode="decimal"
      value={value === null || value === undefined ? '' : String(value)}
      placeholder={hint || 'blank'}
      onChange={(e) => onChange(e.target.value)}
      className={`${width} bg-pl-surface text-pl-text border border-pl-border-strong rounded-md h-7 text-xs px-2 placeholder:text-pl-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus`}
    />
  </div>
);

export const Button = ({ onClick, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active === undefined ? undefined : Boolean(active)}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-pl-primary bg-pl-primary text-pl-primary-fg font-semibold' : 'border-pl-border-strong bg-pl-surface text-pl-text hover:bg-pl-sunken'}`}
  >
    {children}
  </button>
);

export const Check = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-pl-text">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="accent-pl-primary" />
    {label}
  </label>
);

/** A money figure coloured by what it did to margin: gained, lost or neither. */
export const toneOf = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) < 0.005) return 'text-pl-text';
  return v > 0 ? 'text-pl-success-text' : 'text-pl-danger-text';
};
