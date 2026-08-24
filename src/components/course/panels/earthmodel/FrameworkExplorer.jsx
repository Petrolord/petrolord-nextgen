import React, { useMemo, useState } from 'react';
import { MODEL_SPEC, SURF_NAMES, computeFramework } from '@/lib/earthmodelTeaching';
import { isNull } from '@petrolord/engines/engines/earthmodeling/framework.js';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Framework explorer: the three clamped surfaces and the two zone
// thickness grids on the model frame. Zone B is drawn with its pinched
// nodes called out on purpose, because the whole course turns on the
// difference between a mean over the frame and a mean over the zone.
const W = 560;
const H = 300;
const PAD = { left: 40, top: 24, right: 16, bottom: 28 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const VIEWS = [
  { key: 'TopA', label: 'TopA (surface)', kind: 'surface', i: 0 },
  { key: 'TopB', label: 'TopB (surface)', kind: 'surface', i: 1 },
  { key: 'BaseB', label: 'BaseB (surface)', kind: 'surface', i: 2 },
  { key: 'tkA', label: 'Zone A thickness', kind: 'thickness', i: 0 },
  { key: 'tkB', label: 'Zone B thickness', kind: 'thickness', i: 1 },
];

// Depth ramps deep-to-shallow; thickness ramps thin-to-thick.
function ramp(t, kind) {
  const f = Math.max(0, Math.min(1, t));
  if (kind === 'surface') {
    return `rgb(${Math.round(191 + (56 - 191) * f)},${Math.round(255 + (89 - 255) * f)},${Math.round(0 + (189 - 0) * f)})`;
  }
  return `rgb(${Math.round(226 + (22 - 226) * f)},${Math.round(232 + (128 - 232) * f)},${Math.round(170 + (61 - 170) * f)})`;
}

const R = computeFramework();

const FrameworkExplorer = () => {
  const [view, setView] = useState('tkB');
  const v = VIEWS.find((x) => x.key === view) || VIEWS[4];

  const grid = v.kind === 'surface' ? R.fw.clamped[v.i] : R.fw.thickness[v.i];

  const stats = useMemo(() => {
    let mn = Infinity; let mx = -Infinity; let sum = 0; let n = 0; let zero = 0;
    for (const value of grid) {
      if (isNull(value)) continue;
      sum += value; n += 1;
      if (value < mn) mn = value;
      if (value > mx) mx = value;
      if (v.kind === 'thickness' && value <= 0) zero += 1;
    }
    return { mn, mx, mean: sum / n, n, zero, positive: n - zero };
  }, [grid, v.kind]);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const cw = plotW / MODEL_SPEC.nx;
  const ch = plotH / MODEL_SPEC.ny;

  const cells = [];
  for (let r = 0; r < MODEL_SPEC.ny; r++) {
    for (let c = 0; c < MODEL_SPEC.nx; c++) {
      const value = grid[r * MODEL_SPEC.nx + c];
      if (isNull(value)) continue;
      const pinched = v.kind === 'thickness' && value <= 0;
      const t = stats.mx === stats.mn ? 0.5 : (value - stats.mn) / (stats.mx - stats.mn);
      cells.push(
        <rect key={`${r}-${c}`}
          x={PAD.left + c * cw} y={PAD.top + (MODEL_SPEC.ny - 1 - r) * ch}
          width={cw + 0.5} height={ch + 0.5}
          fill={pinched ? '#0F172A' : ramp(t, v.kind)}
          stroke={pinched ? '#f472b6' : 'none'} strokeWidth={pinched ? 0.4 : 0} />,
      );
    }
  }

  return (
    <PanelShell title="Framework explorer"
      subtitle={`The golden model on its ${MODEL_SPEC.nx} by ${MODEL_SPEC.ny} frame at ${MODEL_SPEC.dx} m cells, ${MODEL_SPEC.nx * MODEL_SPEC.ny} nodes in all. Three source surfaces resampled from three different grids, then clamped depth-down.`}>
      <div className="flex flex-wrap gap-2">
        {VIEWS.map((x) => (
          <button key={x.key} type="button" onClick={() => setView(x.key)}
            className={`px-3 py-1.5 rounded-md border text-sm ${view === x.key
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {x.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`${v.label} on the model frame`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {cells}
          <text x="12" y="16" fill="#e2e8f0" fontSize="10">{v.label}</text>
          <text x={W - 12} y="16" fill="#64748b" fontSize="9" textAnchor="end">
            {v.kind === 'surface' ? 'pale is shallow, dark is deep' : 'pale is thin, dark is thick'}
          </text>
          {v.kind === 'thickness' && stats.zero > 0 && (
            <text x="12" y={H - 10} fill="#f472b6" fontSize="9">
              {stats.zero} pinched nodes outlined in pink carry zero thickness
            </text>
          )}
          <text x={W - 12} y={H - 10} fill="#64748b" fontSize="9" textAnchor="end">
            origin ({MODEL_SPEC.x0}, {MODEL_SPEC.y0}), north up
          </text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Frame" value={`${MODEL_SPEC.nx} x ${MODEL_SPEC.ny}`} unit={`= ${MODEL_SPEC.nx * MODEL_SPEC.ny} nodes`} />
        <Tile label="Cell area" value={String(MODEL_SPEC.dx * MODEL_SPEC.dy)} unit="m2" />
        <Tile label="Clamp fixed on TopA" value={String(R.clampCounts[0])} unit="nodes" />
        <Tile label="Clamp fixed on TopB" value={String(R.clampCounts[1])} unit="nodes" />
        <Tile label="Clamp fixed on BaseB" value={String(R.clampCounts[2])} unit="nodes" />
        <Tile label={`${v.label}: mean`} value={fmt(stats.mean, 4)} unit={v.kind === 'surface' ? 'm' : 'm over the frame'} />
        <Tile label={`${v.label}: min`} value={fmt(stats.mn, 2)} unit="m" />
        <Tile label={`${v.label}: max`} value={fmt(stats.mx, 2)} unit="m" />
        <Tile label="Mean TopB depth" value={fmt(R.s2Stats.mean, 2)} unit="m" />
        <Tile label="Zone A mean thickness" value={fmt(R.tkA.mean, 2)} unit="m (all 500 nodes)" />
        <Tile label="Zone A max thickness" value={fmt(R.tkA.max, 2)} unit="m" />
        <Tile label="Zone B mean thickness" value={fmt(R.tkB.mean, 2)} unit="m (all 500 nodes)" />
        <Tile label="Zone B mean where present" value={fmt((R.tkB.mean * 500) / 320, 2)} unit="m (320 nodes)" />
        <Tile label="Zone A bulk volume" value={fmt(R.bulkA / 1e6, 4)} unit="10^6 m3" />
        <Tile label="Zone B bulk volume" value={fmt(R.bulkB / 1e6, 4)} unit="10^6 m3" />
      </TileGrid>

      <Note>
        Two of those tiles are the same rock. Zone B averages 10.24 m over all 500 nodes of the
        frame and 16 m over only the 320 nodes where the zone actually exists, and the bulk volume
        is 12.8 million cubic metres either way, because the mean and the denominator move
        together. The graded figure is the one over the whole frame. Whenever you quote a mean
        thickness, say what you averaged over.
      </Note>
    </PanelShell>
  );
};

export default FrameworkExplorer;
