import React, { useMemo, useState } from 'react';
import { MODEL_SPEC, SOURCE_COVER, computeFramework } from '@/lib/earthmodelTeaching';
import { isNull } from '@petrolord/engines/engines/earthmodeling/framework.js';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

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

// The panel opens on the golden 25 by 20 frame, the teaching case. The frame
// itself is a typed input (origin, cell size, node counts), so a frame of
// your own over the same three source surfaces (the capstone states one) is
// worked by typing it in; nothing here preloads it.
const DEFAULT_FRAME = {
  x0: String(MODEL_SPEC.x0), y0: String(MODEL_SPEC.y0), cell: String(MODEL_SPEC.dx),
  nx: String(MODEL_SPEC.nx), ny: String(MODEL_SPEC.ny),
};

function frameFrom(inp) {
  const n = Object.fromEntries(Object.entries(inp).map(([k, v]) => [k, Number(v)]));
  if (!Object.values(n).every(Number.isFinite)) return null;
  if (!(n.cell > 0) || !Number.isInteger(n.nx) || !Number.isInteger(n.ny) || n.nx < 2 || n.ny < 2 || n.nx * n.ny > 5000) return null;
  const spec = { x0: n.x0, y0: n.y0, dx: n.cell, dy: n.cell, nx: n.nx, ny: n.ny };
  const inside = spec.x0 >= SOURCE_COVER.xMin && spec.y0 >= SOURCE_COVER.yMin
    && spec.x0 + (spec.nx - 1) * spec.dx <= SOURCE_COVER.xMax && spec.y0 + (spec.ny - 1) * spec.dy <= SOURCE_COVER.yMax;
  return inside ? spec : null;
}

const FrameworkExplorer = () => {
  const [view, setView] = useState('tkB');
  const [frame, setFrame] = useState(DEFAULT_FRAME);
  const set = (k) => (val) => setFrame((o) => ({ ...o, [k]: val }));
  const v = VIEWS.find((x) => x.key === view) || VIEWS[4];

  const spec = frameFrom(frame);
  const R = useMemo(() => {
    if (!spec) return null;
    try { return computeFramework(spec); } catch { return null; }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frame]);

  const inputs = (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 items-end">
      <NumField label="Frame origin x (m)" value={frame.x0} onChange={set('x0')} />
      <NumField label="Frame origin y (m)" value={frame.y0} onChange={set('y0')} />
      <NumField label="Cell size (m)" value={frame.cell} onChange={set('cell')} />
      <NumField label="Nodes east (nx)" value={frame.nx} onChange={set('nx')} />
      <NumField label="Nodes north (ny)" value={frame.ny} onChange={set('ny')} />
    </div>
  );

  if (!R) {
    return (
      <PanelShell title="Framework explorer" subtitle="Type a model frame: an origin, a square cell size and the node counts.">
        {inputs}
        <Note>
          The frame must lie inside the area all three source surfaces cover (x {SOURCE_COVER.xMin} to {SOURCE_COVER.xMax},
          y {SOURCE_COVER.yMin} to {SOURCE_COVER.yMax}), with whole node counts of at least 2.
        </Note>
      </PanelShell>
    );
  }

  const S = R.spec;
  const nodes = S.nx * S.ny;
  const grid = v.kind === 'surface' ? R.fw.clamped[v.i] : R.fw.thickness[v.i];
  const tkBPresent = (() => {
    let n = 0;
    for (const value of R.fw.thickness[1]) if (!isNull(value) && value > 0) n += 1;
    return n;
  })();

  // plain computation: this runs after the early return, so it is not a hook
  const stats = (() => {
    let mn = Infinity; let mx = -Infinity; let sum = 0; let n = 0; let zero = 0;
    for (const value of grid) {
      if (isNull(value)) continue;
      sum += value; n += 1;
      if (value < mn) mn = value;
      if (value > mx) mx = value;
      if (v.kind === 'thickness' && value <= 0) zero += 1;
    }
    return { mn, mx, mean: sum / n, n, zero, positive: n - zero };
  })();

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const cw = plotW / S.nx;
  const ch = plotH / S.ny;

  const cells = [];
  for (let r = 0; r < S.ny; r++) {
    for (let c = 0; c < S.nx; c++) {
      const value = grid[r * S.nx + c];
      if (isNull(value)) continue;
      const pinched = v.kind === 'thickness' && value <= 0;
      const t = stats.mx === stats.mn ? 0.5 : (value - stats.mn) / (stats.mx - stats.mn);
      cells.push(
        <rect key={`${r}-${c}`}
          x={PAD.left + c * cw} y={PAD.top + (S.ny - 1 - r) * ch}
          width={cw + 0.5} height={ch + 0.5}
          fill={pinched ? '#0F172A' : ramp(t, v.kind)}
          stroke={pinched ? '#f472b6' : 'none'} strokeWidth={pinched ? 0.4 : 0} />,
      );
    }
  }

  return (
    <PanelShell title="Framework explorer"
      subtitle={`The three source surfaces on a ${S.nx} by ${S.ny} frame at ${S.dx} m cells, ${nodes} nodes in all, resampled from three different grids, then clamped depth-down. It opens on the golden frame.`}>
      {inputs}
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
            origin ({S.x0}, {S.y0}), north up
          </text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Frame" value={`${S.nx} x ${S.ny}`} unit={`= ${S.nx * S.ny} nodes`} />
        <Tile label="Cell area" value={String(S.dx * S.dy)} unit="m2" />
        <Tile label="Clamp fixed on TopA" value={String(R.clampCounts[0])} unit="nodes" />
        <Tile label="Clamp fixed on TopB" value={String(R.clampCounts[1])} unit="nodes" />
        <Tile label="Clamp fixed on BaseB" value={String(R.clampCounts[2])} unit="nodes" />
        <Tile label={`${v.label}: mean`} value={fmt(stats.mean, 4)} unit={v.kind === 'surface' ? 'm' : 'm over the frame'} />
        <Tile label={`${v.label}: min`} value={fmt(stats.mn, 2)} unit="m" />
        <Tile label={`${v.label}: max`} value={fmt(stats.mx, 2)} unit="m" />
        <Tile label="Mean TopB depth" value={fmt(R.s2Stats.mean, 4)} unit="m" />
        <Tile label="Zone A mean thickness" value={fmt(R.tkA.mean, 4)} unit={`m (all ${nodes} nodes)`} />
        <Tile label="Zone A max thickness" value={fmt(R.tkA.max, 4)} unit="m" />
        <Tile label="Zone B mean thickness" value={fmt(R.tkB.mean, 4)} unit={`m (all ${nodes} nodes)`} />
        <Tile label="Zone B mean where present" value={fmt(tkBPresent ? (R.tkB.mean * nodes) / tkBPresent : NaN, 4)} unit={`m (${tkBPresent} nodes)`} />
        <Tile label="Zone A bulk volume" value={fmt(R.bulkA / 1e6, 4)} unit="10^6 m3" />
        <Tile label="Zone B bulk volume" value={fmt(R.bulkB / 1e6, 4)} unit="10^6 m3" />
      </TileGrid>

      <Note>
        Two of those tiles are the same rock. On the golden frame zone B averages 10.24 m over all
        500 nodes and 16 m over only the 320 nodes where the zone actually exists, and the bulk
        volume is 12.8 million cubic metres either way, because the mean and the denominator move
        together. The course reports the mean over the whole frame. Whenever you quote a mean
        thickness, say what you averaged over. Type another frame and the same surfaces give other
        numbers: a model is its surfaces AND its frame.
      </Note>
    </PanelShell>
  );
};

export default FrameworkExplorer;
