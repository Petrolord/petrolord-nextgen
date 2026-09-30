import React from 'react';
import { CHART_COLORS, TOOLTIP_STYLE, LEGEND_PROPS, XAXIS_LABEL_HEIGHT } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK, SVG_CHART } from '@/utils/chartSvg';
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

export const AXIS = AXIS_TICK;
export const TOOLTIP = TOOLTIP_STYLE;
export const GRID = CHART_COLORS.grid;
// The old dark-plate hues in their old slots (sky, pink, lime, amber, violet,
// red), now the chart kit's colours for the white plate.
export const SERIES = [seriesColor(1), seriesColor(4), seriesColor(0), seriesColor(2), seriesColor(4), seriesColor(3)];
export const AXIS_NOTE = SVG_CHART.note;
export const GUIDE = SVG_CHART.reference;
export { LEGEND_PROPS, XAXIS_LABEL_HEIGHT };

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
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
        <tr>
          {head.map((h, i) => (
            <th key={`${i}-${h}`} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>
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
  <div className="mt-2 rounded-md border border-pl-danger/30 bg-pl-danger-bg p-2">
    <p className="text-pl-danger-text text-xs font-medium mb-1">REFUSED{label ? `: ${label}` : ''}</p>
    <p className="text-xs text-pl-text font-mono mb-0">{txt(message)}</p>
  </div>
);

/** The engine's own note, where it answered with less than it was asked for. */
export const EngineNote = ({ children }) => (
  <div className="mt-2 rounded-md border border-pl-warning/30 bg-pl-warning-bg p-2">
    <p className="text-xs text-pl-warning-text font-mono mb-0">{children}</p>
  </div>
);

export const Note = ({ children }) => (
  <p className="text-xs text-pl-muted mt-1 mb-0">{children}</p>
);

export const Lead = ({ children }) => (
  <p className="text-xs text-pl-muted mt-3 mb-0">{children}</p>
);

/** A box labelled as something the course invented, or as SYNTHETIC. */
export const Labelled = ({ tag, children }) => (
  <div className="mt-3 rounded-md border border-dashed border-pl-warning/50 p-3">
    <p className="text-[10px] uppercase tracking-wide text-pl-warning-text mb-1">{tag}</p>
    {children}
  </div>
);

/** The empty state, rendered before any engine value exists. */
export const Empty = ({ children }) => (
  <p className="text-xs text-pl-muted mt-1 mb-0">
    {children || 'This reader has returned nothing yet, so there is no engine value to draw.'}
  </p>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };

/** A typed number box. It hands back the string, so a blank stays blank. */
export const NumBox = ({ label, value, onChange, tag }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">
      {label}
      {tag ? <span className="ml-1 text-pl-warning-text">({tag})</span> : null}
    </Label>
    <Input
      type="number"
      step="any"
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-sm"
    />
  </div>
);

/** A slider with its label and the value it holds. */
export const Slider = ({ label, value, min, max, step = 1, onChange, shown }) => {
  const n = Number(value);
  return (
    <div>
      <label className="text-pl-muted text-xs mb-1 block">
        {label}: <span className="text-pl-text">{shown === undefined ? txt(value) : shown}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(n) && value !== '' ? Math.max(min, Math.min(max, n)) : min}
        onChange={(e) => onChange(e.target.value)}
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

/**
 * A whole-number stepper that can still be typed into, so a fractional or a
 * zero entry reaches the engine and the engine's refusal is what the learner sees.
 */
export const Stepper = ({ label, value, onChange }) => {
  const n = Number(value);
  const whole = value !== '' && Number.isFinite(n) ? Math.round(n) : null;
  return (
    <div>
      <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
      <div className="flex gap-1 items-center">
        <Button onClick={() => onChange(String(whole === null ? 1 : Math.max(0, whole - 1)))}>minus one</Button>
        <Input
          type="number"
          step="any"
          value={value === null || value === undefined ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm w-24"
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
  <div className="rounded-md border border-dashed border-pl-border-strong bg-pl-sunken p-3">
    <p className="text-pl-muted text-xs mb-0">{label}</p>
    <p className="text-pl-muted text-sm italic mb-0">missing{why ? `: ${why}` : ''}</p>
  </div>
);

/** A figure with the basis the engine names printed beside it. */
export const Basis = ({ children }) => (
  <span className="ml-1 text-[10px] uppercase tracking-wide text-pl-info-text">({children})</span>
);

/** A select with a first option that is no choice at all, for an input the engine will not default. */
export const RequiredSelect = ({ label, value, onChange, options, none }) => (
  <div>
    <Label className="text-pl-muted text-xs mb-1 block">{label}</Label>
    <select
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-pl-border-strong bg-pl-surface text-pl-text h-8 text-sm px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
    >
      <option value="">{none}</option>
      {(options || []).map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
