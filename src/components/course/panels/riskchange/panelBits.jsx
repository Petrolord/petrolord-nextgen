import React from 'react';
import { TOOLTIP_STYLE, GRID_STYLE, getStreamPalette } from '@/utils/chartTheme';
import { CHART_SERIES, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';

// The atoms the three AS-RC explorers share, so a table, a verdict, a note and an
// empty state look and read the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. Thirty panels in the
// Drilling series crashed until a render gate was added, and the shape that
// stops it is one guard at the top of every mode: a reader that returned nothing
// renders Empty, and nothing below it indexes into a value that could be a
// refusal object. riskchangeLab.test.js renders every mode of every panel with
// nothing at all and with a refusal-shaped object, and both must produce markup.
//
// NO REFUSAL SENTENCE IS A LITERAL HERE. Verdict prints the sentence the engine
// returned, through the lab. A panel that retypes a refusal has invented a
// sentence the engine may never produce, and the refusal gate asserts that none
// of these files does.
//
// THE CHART STYLE is the family chart kit (batch 1B, docs/scope/DesignSystem.md):
// every plot sits in ChartFrame on the white plate with the chart mark, with the
// kit's axis, grid and tooltip and the kit's series colours. The numbers here are
// pixels and font sizes, and none of them is a value the course grades.

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = GRID_STYLE.stroke;
export const DASH = GRID_STYLE.strokeDasharray;
export const MARGIN = {
  top: 14, right: 24, bottom: 0, left: 0,
};
// The kit's five series colours by name, destructured so this file prints no
// bare number the capstone guard would read as a graded value.
const [KIT_BLUE, KIT_GREEN, KIT_AMBER, KIT_RED, KIT_VIOLET] = CHART_SERIES;
export const GREEN = KIT_GREEN;
export const BLUE = KIT_BLUE;
export const VIOLET = KIT_VIOLET;
export const AMBER = KIT_AMBER;

/** Band tones on the status roles, keyed by the engine's own band names. */
export const BAND_TONE = {
  Critical: 'bg-pl-danger text-pl-danger-fg border-pl-danger',
  High: 'bg-pl-danger-bg text-pl-danger-text border-pl-danger/40',
  Medium: 'bg-pl-warning-bg text-pl-warning-text border-pl-warning/40',
  Low: 'bg-pl-success-bg text-pl-success-text border-pl-success/30',
  None: 'bg-pl-sunken text-pl-muted border-pl-border-strong',
};
/** Band bar colours on the white chart plate, darkest red for Critical. */
export const BAND_FILL = {
  Critical: getStreamPalette('oil').p90,
  High: KIT_RED,
  Medium: KIT_AMBER,
  Low: KIT_GREEN,
  None: SVG_CHART.reference,
};

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
        <tr>
          {head.map((h, i) => (
            <th key={`${i}-${h}`} className="text-left pr-3 last:pr-0 whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} className="pr-3 last:pr-0 whitespace-nowrap">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * One verdict, shown as the engine gave it: ALLOWED, or REFUSED with the
 * engine's own sentence. A verdict that is not there renders a quiet line
 * rather than indexing into nothing.
 */
export const Verdict = ({ v }) => {
  if (!v || typeof v.ok !== 'boolean') {
    return <p className="text-xs text-pl-muted mt-2 mb-0">No move has been asked yet.</p>;
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
      <p className="text-xs text-pl-text font-mono mb-0">{typeof v.reason === 'string' ? v.reason : 'The engine gave no sentence for this state.'}</p>
    </div>
  );
};

/** A band or status word, in the tone of its band where it has one. */
export const Chip = ({ children, band }) => (
  <span className={`inline-block rounded border px-1 text-xs ${BAND_TONE[band] || 'bg-pl-sunken text-pl-text border-pl-border-strong'}`}>
    {children}
  </span>
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
    {children || 'This reader has returned nothing yet, so there is no engine value to show.'}
  </p>
);

/** A slider over whole days, its reach handed in by the lab. */
export const DaySlider = ({
  label, value, min, max, onChange,
}) => (
  <label className="block text-xs text-pl-muted">
    {label}
    <input
      type="range"
      className="w-full mt-1 accent-pl-primary"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange && onChange(Number(e.target.value))}
    />
  </label>
);

/** A small button for a move a reader can ask the engine about. */
export const MoveButton = ({ children, onClick, tone }) => (
  <button
    type="button"
    onClick={onClick}
    className={`mr-1 mb-1 rounded border px-2 py-0.5 text-xs ${tone === 'legal'
      ? 'border-pl-primary/60 text-pl-primary-text hover:bg-pl-primary/10'
      : 'border-pl-border-strong text-pl-muted hover:bg-pl-sunken'}`}
  >
    {children}
  </button>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };
