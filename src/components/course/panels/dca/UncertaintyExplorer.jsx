import React, { useMemo, useState } from 'react';
import {
  B_LEVERAGE_BASE, bLeverageRow, FIELD_TRIANGLE, triangularSummary,
} from './declineLab';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Uncertainty explorer (Expert): the b-lever on EUR at fixed qi/Di/limit,
// and the closed-form triangular distribution the risked booking uses.
// Everything here is deterministic: quantiles come from the inverse CDF,
// never from sampling, so every graded number is exactly reproducible.

const fmt = (v, d = 2) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }) : '-');

const B_STEPS = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2];

const CW = 620;
const CH = 220;
const PAD = { left: 64, top: 14, right: 14, bottom: 30 };

const UncertaintyExplorer = () => {
  const [bIdx, setBIdx] = useState(24); // default b = 1.2, the governance case
  const [triMin, setTriMin] = useState(String(FIELD_TRIANGLE.min));
  const [triMode, setTriMode] = useState(String(FIELD_TRIANGLE.mode));
  const [triMax, setTriMax] = useState(String(FIELD_TRIANGLE.max));

  const b = B_STEPS[bIdx];
  const row = useMemo(() => bLeverageRow(b), [b]);
  const curve = useMemo(() => B_STEPS.map((bb) => bLeverageRow(bb)), []);

  const tri = { min: Number(triMin), mode: Number(triMode), max: Number(triMax) };
  const triOk = Number.isFinite(tri.min) && Number.isFinite(tri.mode) && Number.isFinite(tri.max)
    && tri.min < tri.mode && tri.mode < tri.max;
  const summary = triOk ? triangularSummary(tri) : null;

  const eMax = curve[curve.length - 1].eur * 1.05;
  const xOf = (bb) => PAD.left + (bb / 1.2) * (CW - PAD.left - PAD.right);
  const yOf = (e) => PAD.top + (1 - e / eMax) * (CH - PAD.top - PAD.bottom);

  return (
    <PanelShell
      title="Uncertainty explorer"
      subtitle={`The b-lever at fixed qi ${B_LEVERAGE_BASE.qi} stb/d, Di ${B_LEVERAGE_BASE.Di}/d, limit ${B_LEVERAGE_BASE.qLimit} stb/d, and the closed-form field triangle.`}
    >
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={CH - PAD.bottom} stroke="#334155" />
        <line x1={PAD.left} y1={CH - PAD.bottom} x2={CW - PAD.right} y2={CH - PAD.bottom} stroke="#334155" />
        {[0, 0.25, 0.5, 0.75, 1, 1.2].map((bb) => (
          <text key={bb} x={xOf(bb)} y={CH - PAD.bottom + 14} fontSize="9" fill="#64748b" textAnchor="middle">b={bb}</text>
        ))}
        {[100000, 200000, 300000].map((e) => (
          <text key={e} x={PAD.left - 6} y={yOf(e) + 3} fontSize="9" fill="#64748b" textAnchor="end">{e / 1000}k</text>
        ))}
        <path
          d={`M${curve.map((r) => `${xOf(r.b).toFixed(1)},${yOf(r.eur).toFixed(1)}`).join(' L')}`}
          fill="none" stroke="#BFFF00" strokeWidth="1.8"
        />
        <circle cx={xOf(b)} cy={yOf(row.eur)} r="4" fill="#f97316" />
      </svg>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 shrink-0">Decline exponent b</span>
        <input type="range" min="0" max={B_STEPS.length - 1} step="1" value={bIdx}
          onChange={(e) => setBIdx(Number(e.target.value))} className="w-full" />
        <span className="text-sm text-white w-14 text-right">{b.toFixed(2)}</span>
      </div>
      <TileGrid>
        <Tile label="EUR at this b" value={fmt(row.eur, 1)} unit="stb" />
        <Tile label="Ratio to exponential (b=0)" value={row.ratioToExponential.toFixed(6)} />
        <Tile label="Exponential booking" value={fmt(curve[0].eur, 1)} unit="stb" />
        <Tile label="Harmonic booking (b=1)" value={fmt(curve[20].eur, 1)} unit="stb" />
      </TileGrid>

      <div className="pt-2 border-t border-gray-700 space-y-3">
        <p className="text-white text-sm font-medium mb-0">Field EUR triangle (closed-form quantiles)</p>
        <div className="grid gap-3 grid-cols-3">
          <NumField label="Minimum (stb)" value={triMin} onChange={setTriMin} />
          <NumField label="Mode (stb)" value={triMode} onChange={setTriMode} />
          <NumField label="Maximum (stb)" value={triMax} onChange={setTriMax} />
        </div>
        {summary ? (
          <TileGrid>
            <Tile label="P90 (low)" value={fmt(summary.p90, 1)} unit="stb" />
            <Tile label="P50" value={fmt(summary.p50, 1)} unit="stb" />
            <Tile label="P10 (high)" value={fmt(summary.p10, 1)} unit="stb" />
            <Tile label="Mean" value={fmt(summary.mean, 1)} unit="stb" />
            <Tile label="F at the mode" value={summary.fAtMode.toFixed(6)} />
          </TileGrid>
        ) : (
          <Note>Enter min &lt; mode &lt; max to evaluate the triangle.</Note>
        )}
        <Note>
          Quantiles come from the inverse CDF, not from sampling, so they are exactly reproducible.
          The mode sits at F below one half here, so the P50 is above the mode and the mean higher
          still: a right-skewed triangle books more in expectation than its most likely value.
        </Note>
      </div>
    </PanelShell>
  );
};

export default UncertaintyExplorer;
