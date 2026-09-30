import React from 'react';

// Small display atoms the three H2 panels share. Nothing here computes a
// number: every value arrives from hygieneLab, already a return value of the
// vendored engine, and is only formatted.

/** Six decimals, the precision the teaching digest prints every quantity at. */
export const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

/** A period the criterion does not integrate, printed as the digest prints it. */
export const cell = (v) => (Number.isFinite(v) ? six(v) : 'not integrated');

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

/** An engine message, printed as the engine's own words. */
export const Quote = ({ children }) => (
  <p className="mt-2 mb-0 border-l-2 border-pl-border-strong pl-3 text-xs text-pl-muted font-mono">{children}</p>
);

/** The evidence status of a figure built on a transcription-only constant. */
export const Evidence = ({ children }) => (
  <div className="mt-3 rounded-md border border-pl-warning/30 bg-pl-warning-bg p-3">
    <p className="text-pl-warning-text text-xs font-medium mb-1">TRANSCRIPTION ONLY, AND NEVER GRADED</p>
    <p className="text-xs text-pl-text mb-0">{children}</p>
  </div>
);

export const safe = (fn) => { try { return fn(); } catch { return null; } };
