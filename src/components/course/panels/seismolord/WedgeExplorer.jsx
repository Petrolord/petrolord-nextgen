import React, { useMemo, useState } from 'react';
import {
  computeWedge, WEDGE_FREQS, WEDGE, TUNING_PRODUCT_HZ_MS,
} from '@/lib/seismolordTeaching';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Wedge explorer: the Expert-tier tuning panel. Two charts, because the
// tier needs both. The upper one is the tuning curve, a property of the
// whole panel, with the tuning point and the isolated level marked. The
// lower one is the single trace at the selected thickness, which is where
// the peak drift and the peak-to-trough separation are visible rather
// than merely tabulated.
const W = 560;
const H = 190;
const PAD = { left: 52, top: 18, right: 14, bottom: 30 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

const fmt = (v, d = 6) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const WedgeExplorer = () => {
  const [freq, setFreq] = useState(25);
  const [thickness, setThickness] = useState(16);

  const model = useMemo(() => computeWedge(freq), [freq]);
  const k = Math.min(Math.round(thickness / WEDGE.dtMs), model.rows.length - 1);
  const row = model.rows[k];

  // Tuning curve geometry.
  const maxAmp = Math.max(...model.amplitudes) * 1.12;
  const cx = (t) => PAD.left + (t / WEDGE.maxThicknessMs) * plotW;
  const cy = (a) => PAD.top + (1 - a / maxAmp) * plotH;
  const curve = model.thicknessesMs.map((t, i) => `${cx(t)},${cy(model.amplitudes[i])}`).join(' ');

  // Selected trace geometry.
  const trace = model.traces[k];
  const traceMs = (trace.length - 1) * WEDGE.dtMs;
  const tMax = Math.max(...Array.from(trace, Math.abs)) * 1.15 || 1;
  const tx = (ms) => PAD.left + (ms / traceMs) * plotW;
  const ty = (a) => PAD.top + (1 - a / tMax) * (plotH / 2);
  const tracePts = Array.from(trace, (a, i) => `${tx(i * WEDGE.dtMs)},${ty(a)}`).join(' ');
  const topMs = model.t0 * WEDGE.dtMs;

  return (
    <PanelShell title="Wedge explorer"
      subtitle={`An equal and opposite pair of ${WEDGE.rcTop} and ${WEDGE.rcBase} on a wedge from 0 to ${WEDGE.maxThicknessMs} ms, sampled at ${WEDGE.dtMs} ms. The capstone reads 25 Hz and 40 Hz.`}>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400">wavelet frequency</span>
        {WEDGE_FREQS.map((f) => (
          <button key={f} type="button" onClick={() => setFreq(f)}
            className={`px-3 py-1.5 rounded-md border text-sm ${freq === f
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {f} Hz
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 whitespace-nowrap">bed thickness</span>
        <input type="range" min={0} max={WEDGE.maxThicknessMs} step={WEDGE.dtMs}
          value={row.thicknessMs} onChange={(e) => setThickness(Number(e.target.value))}
          className="w-full accent-[#BFFF00]" aria-label="Bed thickness in milliseconds" />
        <span className="text-sm text-white whitespace-nowrap">{row.thicknessMs} ms</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="Tuning curve: amplitude against bed thickness">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={cy(0)} x2={W - PAD.right} y2={cy(0)} stroke="#334155" />
          <line x1={PAD.left} y1={cy(model.isoAmp)} x2={W - PAD.right} y2={cy(model.isoAmp)}
            stroke="#64748b" strokeDasharray="4 4" />
          <text x={W - PAD.right} y={cy(model.isoAmp) - 4} fill="#64748b" fontSize="9" textAnchor="end">
            isolated {fmt(model.isoAmp, 4)}
          </text>
          <polyline points={curve} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <circle cx={cx(model.tuneMs)} cy={cy(model.tuneAmp)} r="4.5" fill="#BFFF00" stroke="#fff" strokeWidth="1" />
          <text x={cx(model.tuneMs)} y={cy(model.tuneAmp) - 9} fill="#BFFF00" fontSize="10" textAnchor="middle">
            tuning {model.tuneMs} ms, {fmt(model.tuneAmp, 4)}
          </text>
          <circle cx={cx(row.thicknessMs)} cy={cy(row.amp)} r="3.5" fill="#f472b6" />
          <text x="6" y={cy(maxAmp / 1.12) + 3} fill="#64748b" fontSize="9">{fmt(maxAmp / 1.12, 3)}</text>
          <text x="6" y={cy(0) + 3} fill="#64748b" fontSize="9">0.000</text>
          <text x={PAD.left} y={H - 10} fill="#64748b" fontSize="9">0 ms</text>
          <text x={W - PAD.right} y={H - 10} fill="#64748b" fontSize="9" textAnchor="end">
            {WEDGE.maxThicknessMs} ms
          </text>
          <text x={W / 2} y={H - 10} fill="#64748b" fontSize="9" textAnchor="middle">bed thickness</text>
        </svg>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="The composite trace at the selected bed thickness">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={ty(0)} x2={W - PAD.right} y2={ty(0)} stroke="#334155" />
          <line x1={tx(topMs)} y1={PAD.top} x2={tx(topMs)} y2={H - PAD.bottom}
            stroke="#BFFF00" strokeDasharray="3 4" />
          <text x={tx(topMs) + 4} y={PAD.top + 9} fill="#BFFF00" fontSize="9">top</text>
          <line x1={tx(topMs + row.thicknessMs)} y1={PAD.top} x2={tx(topMs + row.thicknessMs)}
            y2={H - PAD.bottom} stroke="#f472b6" strokeDasharray="3 4" />
          <text x={tx(topMs + row.thicknessMs) + 4} y={PAD.top + 9} fill="#f472b6" fontSize="9">base</text>
          <polyline points={tracePts} fill="none" stroke="#e2e8f0" strokeWidth="1.6" />
          <text x={PAD.left} y={H - 10} fill="#64748b" fontSize="9">0 ms</text>
          <text x={W - PAD.right} y={H - 10} fill="#64748b" fontSize="9" textAnchor="end">{traceMs} ms</text>
          <text x={W / 2} y={H - 10} fill="#64748b" fontSize="9" textAnchor="middle">two way time</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Tuning thickness" value={String(model.tuneMs)} unit="ms, graded exactly" />
        <Tile label="Amplitude at tuning" value={fmt(model.tuneAmp, 10)} unit="dimensionless" />
        <Tile label="Theoretical tuning thickness" value={fmt(model.theoryMs, 6)} unit="ms, calculated" />
        <Tile label="Grid overshoot" value={fmt(model.overshootMs, 6)} unit="ms above theory" />
        <Tile label="Frequency times tuning thickness" value={String(model.productHzMs)}
          unit={`Hz ms, ideal ${TUNING_PRODUCT_HZ_MS.toFixed(4)}`} />
        <Tile label="Isolated reflector amplitude" value={fmt(model.isoAmp, 10)} unit="thick end" />
        <Tile label="Selected thickness" value={String(row.thicknessMs)} unit="ms" />
        <Tile label="Amplitude there" value={fmt(row.amp, 10)} unit="dimensionless" />
        <Tile label="Amplitude relative to isolated" value={fmt(row.amp / model.isoAmp, 4)} unit="ratio" />
        <Tile label="Peak time from the top interface" value={String(row.peakOffsetMs)}
          unit="ms, negative is early" />
        <Tile label="Apparent thickness" value={String(row.apparentMs)}
          unit={`ms, floor ${fmt(model.floorMs, 2)}`} />
        <Tile label="Wavelet frequency" value={String(model.freqHz)} unit="Hz" />
      </TileGrid>

      <Note>
        Three things to work here. Walk the thickness down from 60 ms and watch the amplitude
        RISE, which is the whole counterintuitive core of the tier. Then change the frequency
        and watch the tuning thickness move while the amplitude at tuning does not, and check
        the product tile: 20, 25, 40 and 50 Hz all land on 400 Hz ms and give the same peak,
        while 15 Hz lands on 390 and gives a slightly larger one because 390 is nearer the ideal
        {' '}{TUNING_PRODUCT_HZ_MS.toFixed(4)}. Finally take the thickness below tuning and read
        the last two selector tiles: the peak arrives early and the apparent thickness stops
        responding at its floor.
      </Note>
    </PanelShell>
  );
};

export default WedgeExplorer;
