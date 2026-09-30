import React from 'react';
import { GRID_STYLE, TOOLTIP_STYLE } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
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

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = GRID_STYLE.stroke;
// The six slots the panels index, on the family series colours: blue, violet,
// green, amber, the ink note for the fifth slot, red.
export const SERIES = [seriesColor(0), seriesColor(4), seriesColor(1), seriesColor(2), SVG_CHART.note, seriesColor(3)];

/** A figure to four decimals, or the word for a figure the engine did not form. */
export const f4 = (v, word) => fx(v, word);

/** True when a reader handed back something a mode can draw. */
export const usable = (v) => Boolean(v) && typeof v === 'object' && !v.error;

export const Tbl = ({ head, rows, highlight }) => (
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
          <tr key={i} className={`align-top ${highlight && highlight(i) ? 'text-pl-accent-text font-semibold' : ''}`}>
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
  <span className="text-pl-info-text font-mono">{children}</span>
);

/** A reading the engine does not use, labelled as such. */
export const Shortcut = ({ children }) => (
  <span className="text-pl-muted">{children}</span>
);

/** A refusal, with the engine's own sentence beside it, verbatim. */
export const Refused = ({ label, reason }) => (
  <div className="mt-2 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-2">
    <p className="text-pl-danger-text text-xs font-medium mb-1">REFUSED: {label}</p>
    <p className="text-xs text-pl-text font-mono mb-0">{reason || 'the engine gave no sentence'}</p>
  </div>
);

/**
 * The engine's three-valued stable flag. true, false and null are three
 * different states, and null is drawn as its own state: no verdict. A dashboard
 * that turns null into green has turned "we do not know" into "safe".
 */
export const StableBadge = ({ stable }) => {
  if (stable === true) return <span className="px-2 py-0.5 rounded border border-pl-success/40 bg-pl-success-bg text-pl-success-text text-xs">Screens stable</span>;
  if (stable === false) return <span className="px-2 py-0.5 rounded border border-pl-danger/40 bg-pl-danger-bg text-pl-danger-text text-xs">Screens unstable</span>;
  return <span className="px-2 py-0.5 rounded border border-pl-warning/40 bg-pl-warning-bg text-pl-warning-text text-xs">No verdict</span>;
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
    aria-pressed={active === undefined ? undefined : Boolean(active)}
    className={`px-2 py-1 text-xs rounded border ${active ? 'border-pl-primary bg-pl-primary text-pl-primary-fg font-semibold' : 'border-pl-border-strong bg-pl-surface text-pl-text hover:bg-pl-sunken'}`}
  >
    {children}
  </button>
);

/** A labelled switch for a teaching toggle. */
export const Toggle = ({ label, on, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-pl-text">
    <input type="checkbox" checked={Boolean(on)} onChange={(e) => onChange && onChange(e.target.checked)} className="accent-pl-primary" />
    {label}
  </label>
);
