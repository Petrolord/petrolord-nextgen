import React from 'react';
import { HELD_MARKER } from './heattransferLab';

// The four atoms the three FC6 explorers share, so a table, a refusal, a held
// marker and an empty state look and read the same on all three pages.
//
// THE EMPTY STATE IS A COMPONENT RATHER THAN A CONVENTION. Thirty panels in the
// Drilling series crashed until a render gate was added, and the shape that
// stops it is one guard at the top of every mode: a reader that returned nothing
// renders Empty, and nothing below it indexes into a value that could be an
// error object. heattransferLab.test.js renders every mode of every panel with
// nothing at all and with an error-shaped object, and both must produce markup.
//
// NO REFUSAL STRING IS A LITERAL HERE. Refusal prints the message the engine
// returned, through the lab, with whatever evidence that same return carried.
// A panel that retypes a refusal has invented a message the engine may no
// longer produce, and the refusal gate asserts that none of these files does.

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
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** A held quantity, marked with the wording that says it is unverified. */
export const Held = ({ children }) => (
  <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
    <p className="text-amber-300 text-xs font-medium mb-1">{HELD_MARKER}</p>
    <p className="text-xs text-slate-300 mb-0">{children}</p>
  </div>
);

/**
 * A refusal shown as a refusal. The message is the engine's own, through the
 * lab, and the evidence is whatever the same return carried beside it. A frame
 * is printed above the message when the engine's own words carry history, which
 * four of this module's refusals do.
 */
export const Refusal = ({ probe, frame }) => {
  if (!probe || typeof probe.message !== 'string') {
    return (
      <div className="mt-2 rounded-md border border-slate-700 bg-slate-900/40 p-2">
        <p className="text-xs text-slate-400 mb-0">
          This state has no refusal to show, so the engine answered it.
        </p>
      </div>
    );
  }
  const evidence = probe.evidence && typeof probe.evidence === 'object' ? Object.keys(probe.evidence) : [];
  return (
    <div className="mt-2 rounded-md border border-red-800/60 bg-red-950/20 p-2">
      {frame && <p className="text-amber-300 text-xs mb-1">{frame}</p>}
      <p className="text-red-300 text-xs font-medium mb-1">REFUSED: {probe.label}</p>
      <p className="text-xs text-slate-300 font-mono mb-0">{probe.message}</p>
      {evidence.length > 0 && (
        <p className="text-xs text-slate-400 mt-1 mb-0">
          Evidence the same return carried:
          {' '}
          {evidence.map((k) => `${k} ${String(probe.evidence[k])}`).join(', ')}
        </p>
      )}
    </div>
  );
};

export const Note = ({ children }) => (
  <p className="text-xs text-slate-500 mt-1 mb-0">{children}</p>
);

/** The empty state, rendered before any engine value exists. */
export const Empty = ({ children }) => (
  <p className="text-xs text-slate-400 mt-1 mb-0">
    {children || 'This reader has returned nothing yet, so there is no engine value to draw.'}
  </p>
);

/** A reader call that cannot take a page down with it. */
export const safe = (fn) => { try { return fn(); } catch { return null; } };
