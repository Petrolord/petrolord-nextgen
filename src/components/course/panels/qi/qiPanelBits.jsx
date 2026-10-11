import React from 'react';
import { Label } from '@/components/ui/label';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { SVG_CHART as CH } from '@/components/course/panels/readerChart';

// Small shared pieces for the four QI explorer panels. Nothing here computes
// an engine figure: every number a panel prints comes from the teaching lab.

/** Six decimals, the precision the teaching digest prints every figure at. */
export const six = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? 'none' : Number(v).toFixed(6));

/** A typed control's text as a number, or NaN. */
export const num = (s) => (String(s).trim() === '' ? NaN : Number(s));

export const Tbl = ({ head, rows, max = null }) => (
  <div className={`mt-3 overflow-x-auto ${max ? 'max-h-72 overflow-y-auto' : ''}`}>
    <table className="text-xs text-pl-text w-full">
      <thead className="text-pl-muted">
        <tr>{head.map((h, i) => <th key={`${i}-${h}`} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
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

/** The engine's own refusal, verbatim. */
export const Refusal = ({ text }) => (
  <div className="mt-3 rounded-md border border-pl-danger/40 bg-pl-danger-bg p-3">
    <p className="text-pl-danger-text text-xs font-medium mb-1">THE ENGINE REFUSED, IN ITS OWN WORDS</p>
    <p className="text-xs text-pl-text mb-0 font-mono">{text}</p>
  </div>
);

/** A note on a stated choice or a teaching case. */
export const Declared = ({ title, children }) => (
  <div className="mt-3 rounded-md border border-pl-info/40 bg-pl-info-bg p-3">
    <p className="text-pl-info-text text-xs font-medium mb-1">{title}</p>
    <p className="text-xs text-pl-text mb-0">{children}</p>
  </div>
);

/** A JSON box a learner pastes a case file into. */
export const CaseBox = ({ value, onChange }) => (
  <div className="col-span-2 sm:col-span-3 lg:col-span-5">
    <Label className="text-pl-muted text-xs mb-1 block">Case file (paste the whole JSON file)</Label>
    <textarea
      value={value}
      rows={5}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-pl-surface text-pl-text border border-pl-border-strong rounded-md text-xs p-2 font-mono"
    />
  </div>
);

/** Parse a pasted case. Returns { value } or { error }. */
export const parseCase = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'The case box is empty: paste a case file.' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `The case box does not hold valid JSON (${e.message}).` };
  }
};

/**
 * A plain SVG chart on the course chart plate: lines (with optional dash) and
 * points, scaled to fit. Every coordinate it draws is passed in.
 */
export const XYChart = ({ label, lines = [], points = [], xTitle, yTitle, width = 560, height = 300, xRange = null, yRange = null }) => {
  const PAD = { left: 62, top: 16, right: 16, bottom: 40 };
  const xs = [...lines.flatMap((l) => l.pts.map((p) => p[0])), ...points.flatMap((s) => s.pts.map((p) => p[0]))].filter(Number.isFinite);
  const ys = [...lines.flatMap((l) => l.pts.map((p) => p[1])), ...points.flatMap((s) => s.pts.map((p) => p[1]))].filter(Number.isFinite);
  if (!xs.length || !ys.length) return null;
  const [x0, x1] = xRange || [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = yRange || [Math.min(...ys), Math.max(...ys)];
  const pw = width - PAD.left - PAD.right;
  const ph = height - PAD.top - PAD.bottom;
  const sx = (x) => PAD.left + ((x - x0) / Math.max(1e-12, x1 - x0)) * pw;
  const sy = (y) => PAD.top + (1 - (y - y0) / Math.max(1e-12, y1 - y0)) * ph;
  const inside = (p) => Number.isFinite(p[0]) && Number.isFinite(p[1]) && p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
  return (
    <SvgChartFrame width={width} height={height} minWidth={420} label={label}>
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={height - PAD.bottom} stroke={CH.axis} />
      <line x1={PAD.left} y1={height - PAD.bottom} x2={width - PAD.right} y2={height - PAD.bottom} stroke={CH.axis} />
      {y0 < 0 && y1 > 0 && <line x1={PAD.left} y1={sy(0)} x2={width - PAD.right} y2={sy(0)} stroke={CH.grid} strokeDasharray="3 3" />}
      {x0 < 0 && x1 > 0 && <line x1={sx(0)} y1={PAD.top} x2={sx(0)} y2={height - PAD.bottom} stroke={CH.grid} strokeDasharray="3 3" />}
      {lines.map((l, i) => {
        const d = l.pts.filter(inside).map((p, k) => `${k ? 'L' : 'M'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');
        return <path key={`l${i}`} d={d} fill="none" stroke={l.color || CH.blue} strokeWidth="1.8" strokeDasharray={l.dash || undefined} />;
      })}
      {points.map((s, i) => s.pts.filter(inside).map((p, k) => (
        <circle key={`p${i}-${k}`} cx={sx(p[0])} cy={sy(p[1])} r={s.r || 2.5} fill={s.color || CH.amber} stroke={CH.casing} strokeWidth="0.4" />
      )))}
      <text x={PAD.left} y={height - 12} fill={CH.text} fontSize="9">{six(x0)}</text>
      <text x={width - PAD.right - 70} y={height - 12} fill={CH.text} fontSize="9">{six(x1)}</text>
      <text x={width / 2 - 40} y={height - 12} fill={CH.text} fontSize="9">{xTitle}</text>
      <text x={4} y={PAD.top + 8} fill={CH.text} fontSize="9">{six(y1)}</text>
      <text x={4} y={height - PAD.bottom} fill={CH.text} fontSize="9">{six(y0)}</text>
      <text x={4} y={PAD.top + ph / 2} fill={CH.text} fontSize="9">{yTitle}</text>
    </SvgChartFrame>
  );
};

export { CH };
