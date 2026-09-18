import React from 'react';

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
// THE CHART STYLE is the dark NextGen course-panel convention every course panel
// in this repository uses: slate axes and grid on the panel's own dark card, the
// lime accent for the series a reader is moving. The numbers here are pixels and
// font sizes, and none of them is a value the course grades.

export const AXIS = { fill: '#94a3b8', fontSize: 13 };
export const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 13 };
export const GRID = '#334155';
export const DASH = '14 15';
export const MARGIN = {
  top: 14, right: 24, bottom: 0, left: 0,
};
export const LIME = '#BFFF00';
export const SKY = '#38bdf8';
export const PINK = '#f472b6';
export const AMBER = '#fbbf24';

/** Band colours, keyed by the engine's own band names. */
export const BAND_TONE = {
  Critical: 'bg-red-900/60 text-red-200 border-red-700',
  High: 'bg-orange-900/50 text-orange-200 border-orange-700',
  Medium: 'bg-amber-900/40 text-amber-200 border-amber-700',
  Low: 'bg-emerald-900/40 text-emerald-200 border-emerald-700',
  None: 'bg-slate-800 text-slate-400 border-slate-600',
};
export const BAND_FILL = {
  Critical: '#b91c1c', High: '#ea580c', Medium: '#d97706', Low: '#059669', None: '#475569',
};

export const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>
          {head.map((h) => (
            <th key={h} className="text-left pr-3 last:pr-0 whitespace-nowrap">{h}</th>
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
    return <p className="text-xs text-slate-500 mt-2 mb-0">No move has been asked yet.</p>;
  }
  if (v.ok) {
    return (
      <div className="mt-2 rounded-md border border-emerald-800/60 bg-emerald-950/20 p-2">
        <p className="text-emerald-300 text-xs font-medium mb-0">ALLOWED: {v.label}</p>
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
      <p className="text-red-300 text-xs font-medium mb-1">REFUSED: {v.label}</p>
      <p className="text-xs text-slate-300 font-mono mb-0">{typeof v.reason === 'string' ? v.reason : 'The engine gave no sentence for this state.'}</p>
    </div>
  );
};

/** A band or status word, in the tone of its band where it has one. */
export const Chip = ({ children, band }) => (
  <span className={`inline-block rounded border px-1 text-xs ${BAND_TONE[band] || 'bg-slate-800 text-slate-300 border-slate-600'}`}>
    {children}
  </span>
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
    {children || 'This reader has returned nothing yet, so there is no engine value to show.'}
  </p>
);

/** A slider over whole days, its reach handed in by the lab. */
export const DaySlider = ({
  label, value, min, max, onChange,
}) => (
  <label className="block text-xs text-slate-400">
    {label}
    <input
      type="range"
      className="w-full mt-1 accent-lime-400"
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
      ? 'border-lime-500/60 text-lime-300 hover:bg-lime-900/30'
      : 'border-slate-600 text-slate-400 hover:bg-slate-800'}`}
  >
    {children}
  </button>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };
