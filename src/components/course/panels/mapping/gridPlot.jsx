import React from 'react';
import { isNull } from '@petrolord/engines/lib/gridding/gridmath.js';

// Shared map canvas for the two deep mapping panels. Draws the live
// nodes of a grid, its contours and a set of posted markers in world
// coordinates. Dead nodes are left blank on purpose: the blank margin
// is a reading, not a rendering gap.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

// Depth: shallow lime to deep slate. Thickness: thin slate-blue to thick amber.
const RAMPS = {
  depth: [[191, 255, 0], [56, 89, 189]],
  thickness: [[56, 189, 248], [251, 191, 36]],
};

function shade(v, min, max, ramp) {
  if (!Number.isFinite(v) || max === min) return 'transparent';
  const [a, b] = RAMPS[ramp] || RAMPS.depth;
  const t = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return `rgb(${lerp(a[0], b[0], t)},${lerp(a[1], b[1], t)},${lerp(a[2], b[2], t)})`;
}

export const GridMap = ({ spec, z, contours, zMin, zMax, ramp = 'depth', markers = [], label }) => {
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
          fill={shade(v, zMin, zMax, ramp)} fillOpacity="0.55" />,
      );
    }
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img" aria-label={label}>
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

        {markers.map((m) => {
          const cx = sx(m.x);
          const cy = sy(m.y);
          if (m.kind === 'target') {
            return (
              <g key={m.key || m.text}>
                <path d={`M ${cx} ${cy - 6} L ${cx + 6} ${cy} L ${cx} ${cy + 6} L ${cx - 6} ${cy} Z`}
                  fill="#f472b6" stroke="#fff" strokeWidth="1" />
                <text x={cx + 9} y={cy + 12} fill="#f472b6" fontSize="9">{m.text}</text>
              </g>
            );
          }
          const open = m.kind === 'withheld';
          return (
            <g key={m.key || m.text}>
              <circle cx={cx} cy={cy} r="4"
                fill={open ? 'none' : '#0F172A'}
                stroke={open ? '#fbbf24' : '#fff'} strokeWidth={open ? 2 : 1.5} />
              <text x={cx + 7} y={cy - 4} fill={open ? '#fbbf24' : '#e2e8f0'} fontSize="9">{m.text}</text>
            </g>
          );
        })}

        <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x {xMin} to {xMax} m</text>
        <text x={PAD.left} y={12} fill="#64748b" fontSize="9">y {yMin} to {yMax} m (north up)</text>
      </svg>
    </div>
  );
};

export default GridMap;
