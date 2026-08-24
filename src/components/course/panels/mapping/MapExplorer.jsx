import React, { useMemo, useState } from 'react';
import {
  TEACHING_WELLS, TOP_NAME, CAPSTONE_CELL_M, TARGET, computeMap,
} from '@/lib/mappingTeaching';
import { isNull } from '@petrolord/engines/lib/gridding/gridmath.js';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Map explorer: grid the Ekene TOP_SAND surface at a cell size the
// learner chooses, then read the map. Control points are posted and the
// masked area is left blank on purpose, so the panel shows how much of
// the frame is data-supported and how much is algorithm.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

// Depth colour: shallow (crest) lime through to deep slate.
function depthColor(z, zMin, zMax) {
  if (!Number.isFinite(z) || zMax === zMin) return 'transparent';
  const t = (z - zMin) / (zMax - zMin);
  const r = Math.round(191 + (56 - 191) * t);
  const g = Math.round(255 + (89 - 255) * t);
  const b = Math.round(0 + (189 - 0) * t);
  return `rgb(${r},${g},${b})`;
}

const MapExplorer = () => {
  const [cell, setCell] = useState(String(CAPSTONE_CELL_M));

  const cellM = Number(cell);
  const valid = Number.isFinite(cellM) && cellM >= 25 && cellM <= 500;

  const map = useMemo(() => {
    if (!valid) return null;
    try {
      return computeMap(cellM);
    } catch {
      return null;
    }
  }, [cellM, valid]);

  if (!map) {
    return (
      <PanelShell title="Map explorer" subtitle="Enter a cell size between 25 and 500 m.">
        <NumField label="Cell size (m)" value={cell} onChange={setCell} />
        <Note>The cell size must be a number in that range.</Note>
      </PanelShell>
    );
  }

  const { spec, z, contours, summary: s } = map;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xMin = spec.x0;
  const xMax = spec.x0 + (spec.nx - 1) * spec.dx;
  const yMin = spec.y0;
  const yMax = spec.y0 + (spec.ny - 1) * spec.dy;
  const sx = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
  // y increases northward, so flip for screen coordinates.
  const sy = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * plotH;

  const cw = plotW / Math.max(1, spec.nx - 1);
  const ch = plotH / Math.max(1, spec.ny - 1);

  const cells = [];
  for (let r = 0; r < spec.ny; r++) {
    for (let c = 0; c < spec.nx; c++) {
      const v = z[r * spec.nx + c];
      if (isNull(v)) continue;
      cells.push(
        <rect key={`${r}-${c}`}
          x={sx(spec.x0 + c * spec.dx) - cw / 2}
          y={sy(spec.y0 + r * spec.dy) - ch / 2}
          width={cw} height={ch}
          fill={depthColor(v, s.zMin, s.zMax)} fillOpacity="0.55" />,
      );
    }
  }

  return (
    <PanelShell title="Map explorer"
      subtitle={`The Ekene ${TOP_NAME} surface gridded from ${s.nPoints} wells at a ${fmt(cellM, 0)} m cell. Blank areas are beyond the extrapolation limit and are left unmapped on purpose.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Cell size (m)" value={cell} onChange={setCell} />
        <div className="text-xs text-gray-500 sm:col-span-3">
          The capstone grids at {CAPSTONE_CELL_M} m. Try 50 and 200 m: the crest barely moves,
          but the node counts change completely.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Depth map of the Ekene ${TOP_NAME} surface`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {cells}

          {contours.map((c) => (
            <g key={c.level}>
              {c.lines.map((pts, i) => (
                <polyline key={i} points={pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
                  fill="none" stroke="#e2e8f0" strokeWidth="0.9" opacity="0.75" />
              ))}
            </g>
          ))}

          {/* control points, posted with their picks */}
          {TEACHING_WELLS.map((w) => {
            const top = w.tops.find((t) => t.name === TOP_NAME);
            return (
              <g key={w.name}>
                <circle cx={sx(w.surface_x)} cy={sy(w.surface_y)} r="4" fill="#0F172A" stroke="#fff" strokeWidth="1.5" />
                <text x={sx(w.surface_x) + 7} y={sy(w.surface_y) - 4} fill="#e2e8f0" fontSize="9">
                  {w.name} {top.md_m}
                </text>
              </g>
            );
          })}

          {/* prospect */}
          <g>
            <path d={`M ${sx(TARGET.x)} ${sy(TARGET.y) - 6} L ${sx(TARGET.x) + 6} ${sy(TARGET.y)} L ${sx(TARGET.x)} ${sy(TARGET.y) + 6} L ${sx(TARGET.x) - 6} ${sy(TARGET.y)} Z`}
              fill="#f472b6" stroke="#fff" strokeWidth="1" />
            <text x={sx(TARGET.x) + 9} y={sy(TARGET.y) + 12} fill="#f472b6" fontSize="9">{TARGET.label}</text>
          </g>

          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x {xMin} to {xMax} m</text>
          <text x={PAD.left} y={12} fill="#64748b" fontSize="9">y {yMin} to {yMax} m (north up)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Control points" value={String(s.nPoints)} unit="wells" />
        <Tile label="Grid width" value={String(s.nx)} unit="nodes" />
        <Tile label="Grid height" value={String(s.ny)} unit="nodes" />
        <Tile label="Mapped (live) nodes" value={`${s.liveNodes} of ${s.nx * s.ny}`} />
        <Tile label="Crest (shallowest mapped)" value={fmt(s.zMin, 4)} unit="m" />
        <Tile label="Deepest mapped" value={fmt(s.zMax, 2)} unit="m" />
        <Tile label={`Depth at ${TARGET.label}`} value={fmt(s.depthAtTarget, 4)} unit="m" />
        <Tile label="Contour interval" value={fmt(s.contourStep, 0)} unit="m" />
      </TileGrid>

      <Note>
        White circles are wells, labelled with their own picks; the pink diamond is prospect
        {' '}{TARGET.label}, where there is no well. Every coloured node is an estimate, not a
        measurement. Compare the crest against the shallowest posted pick: a smooth interpolator
        can bow above every well, and that overshoot is a property of the method rather than a
        discovery.
      </Note>
    </PanelShell>
  );
};

export default MapExplorer;
