import React, { useMemo, useState } from 'react';
import {
  computeSynthetic, computeIntermediate, PLANTED_LAG_MS, DT_MS, NS,
} from '@/lib/seismolordTeaching';
import { suggestBulkShift } from '@petrolord/engines/engines/seismolord/synthetics.js';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Shift explorer: the bulk-shift correlation scan, plus the frequency
// switch the capstone requires. The scan curve is drawn rather than
// tabulated because its shape carries the lesson: symmetric about the
// true lag, and already respectable at zero lag where the tie is wrong.
const FREQS = [15, 25, 40];
const W = 560;
const H = 240;
const PAD = { left: 44, top: 24, right: 16, bottom: 34 };

const fmt = (v, d = 6) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const I = computeIntermediate();

const ShiftExplorer = () => {
  const [freq, setFreq] = useState(25);

  const model = useMemo(() => {
    const s = computeSynthetic(freq);
    // The observed trace is always the 25 Hz synthetic arriving late,
    // exactly as the capstone sets it up.
    const s25 = computeSynthetic(25);
    const lagSamples = PLANTED_LAG_MS / DT_MS;
    const seis = new Float32Array(NS).fill(NaN);
    for (let i = 0; i < NS - lagSamples; i++) seis[i + lagSamples] = s25.syn.synthetic[i];
    const scan = suggestBulkShift(s25.syn.synthetic, seis, DT_MS, 40);
    return {
      peakAbs: s.summary.synPeakAbs,
      peakTwt: s.summary.synPeakTwt,
      rcAbs: s.summary.rcPeakAbs,
      rcTwt: s.summary.rcPeakTwt,
      scan,
    };
  }, [freq]);

  const { scan } = model;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const lags = scan.series.map((e) => e.lagMs);
  const lagMin = Math.min(...lags);
  const lagMax = Math.max(...lags);
  const sx = (l) => PAD.left + ((l - lagMin) / (lagMax - lagMin)) * plotW;
  const sy = (c) => PAD.top + ((1 - c) / 1.5) * plotH;
  const pts = scan.series.map((e) => `${sx(e.lagMs)},${sy(e.corr)}`).join(' ');
  const zero = scan.series.find((e) => e.lagMs === 0);

  return (
    <PanelShell title="Shift explorer"
      subtitle={`The observed trace is the 25 Hz synthetic arriving ${PLANTED_LAG_MS} ms late. The scan tests ${scan.series.length} lags from ${lagMin} to ${lagMax} ms at a ${DT_MS} ms sample rate.`}>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400">wavelet frequency</span>
        {FREQS.map((f) => (
          <button key={f} type="button" onClick={() => setFreq(f)}
            className={`px-3 py-1.5 rounded-md border text-sm ${freq === f
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {f} Hz
          </button>
        ))}
        <span className="text-xs text-gray-500">the capstone reads 15 and 40 Hz</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="Correlation against bulk shift lag">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={sy(0)} x2={W - PAD.right} y2={sy(0)} stroke="#334155" strokeWidth="1" />
          <line x1={sx(0)} y1={PAD.top} x2={sx(0)} y2={H - PAD.bottom} stroke="#334155" strokeWidth="1" strokeDasharray="3 4" />
          <polyline points={pts} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <circle cx={sx(scan.lagMs)} cy={sy(scan.corr)} r="4" fill="#BFFF00" stroke="#fff" strokeWidth="1" />
          <text x={sx(scan.lagMs)} y={sy(scan.corr) - 10} fill="#BFFF00" fontSize="10" textAnchor="middle">
            best {scan.lagMs} ms, corr {fmt(scan.corr, 3)}
          </text>
          <circle cx={sx(0)} cy={sy(zero.corr)} r="3.5" fill="#f472b6" />
          <text x={sx(0) + 6} y={sy(zero.corr) + 4} fill="#f472b6" fontSize="9">
            zero lag {fmt(zero.corr, 4)}
          </text>
          <text x="8" y={sy(1) + 3} fill="#64748b" fontSize="9">1.0</text>
          <text x="8" y={sy(0) + 3} fill="#64748b" fontSize="9">0.0</text>
          <text x={PAD.left} y={H - 12} fill="#64748b" fontSize="9">{lagMin} ms</text>
          <text x={W - PAD.right} y={H - 12} fill="#64748b" fontSize="9" textAnchor="end">{lagMax} ms</text>
          <text x={W / 2} y={H - 12} fill="#64748b" fontSize="9" textAnchor="middle">lag applied to the synthetic</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Suggested bulk shift" value={String(scan.lagMs)} unit="ms" />
        <Tile label="Correlation at that shift" value={fmt(scan.corr, 6)} unit="dimensionless" />
        <Tile label="Correlation at zero lag" value={fmt(zero.corr, 6)} unit="if you never shifted" />
        <Tile label="Lags tested" value={String(scan.series.length)} unit={`${lagMin} to ${lagMax} ms`} />
        <Tile label={`Strongest amplitude at ${freq} Hz`} value={fmt(model.peakAbs, 10)} unit="dimensionless" />
        <Tile label={`TWT of that peak at ${freq} Hz`} value={String(model.peakTwt)} unit="ms" />
        <Tile label="Strongest reflection coefficient" value={fmt(model.rcAbs, 10)} unit="dimensionless" />
        <Tile label="TWT of that coefficient" value={String(model.rcTwt)} unit="ms, frequency independent" />
        <Tile label="Peak minus coefficient time" value={String(model.peakTwt - model.rcTwt)} unit="ms" />
      </TileGrid>

      <Note>
        Two things to work here. The scan curve is symmetric about its answer because the observed
        trace is this synthetic shifted, which makes it an autocorrelation and is why the
        correlation reaches exactly 1. At zero lag it still reads {fmt(zero.corr, 4)}, which is
        respectable enough to accept while the tie is a full {PLANTED_LAG_MS} ms wrong. Then change
        the frequency: the bottom four tiles move while the reflection coefficient and its time
        stay put, because reflectivity belongs to the rock and the peak belongs to the pairing of
        rock and wavelet.
      </Note>
    </PanelShell>
  );
};

export default ShiftExplorer;
