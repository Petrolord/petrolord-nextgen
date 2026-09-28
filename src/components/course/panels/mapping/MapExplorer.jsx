import React, { useMemo, useState } from 'react';
import {
  TEACHING_WELLS, TOP_NAME, TEACHING_CELL_M, TARGET, computeMap,
} from '@/lib/mappingTeaching';
import { isNull } from '@petrolord/engines/lib/gridding/gridmath.js';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { useMappingCase } from '@/components/course/panels/mapping/caseInputs';
import { useThemeClass } from '@/design/themeClass';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, SVG_CHART } from '@/utils/chartSvg';

// Map explorer: grid the Ekene TOP_SAND surface at a cell size the
// learner chooses, then read the map. Control points are posted and the
// masked area is left blank on purpose, so the panel shows how much of
// the frame is data-supported and how much is algorithm.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

// Depth colour on the white chart plate: shallow (crest) pale blue through
// to deep blue, the same ramp as the shared map canvas (gridPlot.jsx).
function depthColor(z, zMin, zMax) {
  if (!Number.isFinite(z) || zMax === zMin) return 'transparent';
  const t = (z - zMin) / (zMax - zMin);
  const r = Math.round(191 + (30 - 191) * t);
  const g = Math.round(219 + (64 - 219) * t);
  const b = Math.round(254 + (175 - 254) * t);
  return `rgb(${r},${g},${b})`;
}

const MapExplorer = () => {
  const tc = useThemeClass();
  const [cell, setCell] = useState(String(TEACHING_CELL_M));
  const c = useMappingCase();

  const cellM = Number(cell);
  const valid = Number.isFinite(cellM) && cellM >= 25 && cellM <= 500 && c.ok;

  const map = useMemo(() => {
    if (!valid) return null;
    try {
      return computeMap(cellM, c.kase);
    } catch {
      return null;
    }
  }, [cellM, valid, c.kase]);

  if (!map) {
    return (
      <PanelShell title="Map explorer" subtitle="Enter a cell size between 25 and 500 m, and a well set.">
        {c.ui}
        <NumField label="Cell size (m)" value={cell} onChange={setCell} />
        <Note>The cell size must be a number in that range, and every typed well line must read name, x, y, top, base (at least three wells).</Note>
      </PanelShell>
    );
  }
  const WELLS = c.kase ? c.kase.wells : TEACHING_WELLS;
  const T = c.kase ? c.kase.target : TARGET;

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
      subtitle={`The ${c.typed ? 'typed' : 'Ekene'} ${TOP_NAME} surface gridded from ${s.nPoints} wells at a ${fmt(cellM, 0)} m cell. Blank areas are beyond the extrapolation limit and are left unmapped on purpose.`}>
      {c.ui}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Cell size (m)" value={cell} onChange={setCell} />
        <div className={tc('text-xs text-gray-500 sm:col-span-3', 'text-xs text-pl-muted sm:col-span-3')}>
          The Ekene map is read at {TEACHING_CELL_M} m. Try 50 and 200 m: the crest barely moves,
          but the node counts change completely.
        </div>
      </div>

      <SvgChartFrame width={W} height={H} label={`Depth map of the ${TOP_NAME} surface`} minWidth={420} maxWidth={720}>
        {cells}

        {contours.map((c) => (
          <g key={c.level}>
            {c.lines.map((pts, i) => (
              <polyline key={i} points={pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
                fill="none" stroke={SVG_CHART.note} strokeWidth="0.9" opacity="0.75" />
            ))}
          </g>
        ))}

        {/* control points, posted with their picks */}
        {WELLS.map((w) => {
          const top = w.tops.find((t) => t.name === TOP_NAME);
          return (
            <g key={w.name}>
              <circle cx={sx(w.surface_x)} cy={sy(w.surface_y)} r="4" fill={SVG_CHART.marker} stroke={SVG_CHART.label} strokeWidth="1.5" />
              <text x={sx(w.surface_x) + 7} y={sy(w.surface_y) - 4} fill={SVG_CHART.label} fontSize="9">
                {w.name} {top.md_m}
              </text>
            </g>
          );
        })}

        {/* prospect */}
        <g>
          <path d={`M ${sx(T.x)} ${sy(T.y) - 6} L ${sx(T.x) + 6} ${sy(T.y)} L ${sx(T.x)} ${sy(T.y) + 6} L ${sx(T.x) - 6} ${sy(T.y)} Z`}
            fill={seriesColor(4)} stroke={SVG_CHART.marker} strokeWidth="1" />
          <text x={sx(T.x) + 9} y={sy(T.y) + 12} fill={seriesColor(4)} fontSize="9">{T.label}</text>
        </g>

        <text x={PAD.left} y={H - 14} fill={SVG_CHART.tick} fontSize="9">x {xMin} to {xMax} m</text>
        <text x={PAD.left} y={12} fill={SVG_CHART.tick} fontSize="9">y {yMin} to {yMax} m (north up)</text>
      </SvgChartFrame>

      <TileGrid>
        <Tile label="Control points" value={String(s.nPoints)} unit="wells" />
        <Tile label="Grid width" value={String(s.nx)} unit="nodes" />
        <Tile label="Grid height" value={String(s.ny)} unit="nodes" />
        <Tile label="Mapped (live) nodes" value={`${s.liveNodes} of ${s.nx * s.ny}`} />
        <Tile label="Crest (shallowest mapped)" value={fmt(s.zMin, 4)} unit="m" />
        <Tile label="Deepest mapped" value={fmt(s.zMax, 2)} unit="m" />
        <Tile label="Mean mapped depth" value={fmt(s.zMean, 4)} unit="m" />
        <Tile label={`Depth at ${T.label}`} value={fmt(s.depthAtTarget, 4)} unit="m" />
        <Tile label="Contour interval" value={fmt(s.contourStep, 0)} unit="m" />
      </TileGrid>

      <Note>
        White circles are wells, labelled with their own picks; the violet diamond is prospect
        {' '}{T.label}, where there is no well. Every coloured node is an estimate; only the
        posted picks are measured. Compare the crest against the shallowest posted pick: a smooth
        interpolator can bow above every well, and that overshoot is a property of the method. It
        is no discovery.
      </Note>
    </PanelShell>
  );
};

export default MapExplorer;
