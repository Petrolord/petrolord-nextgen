import React, { useMemo, useState } from 'react';
import { TIE_WELL_NAMES, computeTieDetail } from '@/lib/earthmodelTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Tie explorer: one well's trajectory drawn through the clamped surface
// stack in an east-west section at the well's y, with every pick landed in
// 3D and its residual drawn as a bar from the pick to the surface. The
// exposed assumption is the survey itself: switching to "straight vertical
// hole" shows what every tie silently assumes until a trajectory is built.
const W = 560;
const H = 320;
const PAD = { left: 56, top: 18, right: 16, bottom: 34 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');
const SURF_COLORS = { topA: '#38BDF8', topB: '#BFFF00', baseB: '#F472B6' };

const TieExplorer = () => {
  const [well, setWell] = useState('W2');
  const [survey, setSurvey] = useState('survey');

  const m = useMemo(() => computeTieDetail(well, survey === 'vertical'), [well, survey]);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xs = m.section.map((s) => s.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const zAll = [];
  for (const s of m.section) for (const k of ['topA', 'topB', 'baseB']) if (s[k] != null) zAll.push(s[k]);
  for (const p of m.path) zAll.push(p.tvdss);
  for (const r of m.rows) { zAll.push(r.tvdss); if (r.surfaceZ != null) zAll.push(r.surfaceZ); }
  const zMin = Math.min(...zAll) - 8;
  const zMax = Math.max(...zAll) + 8;
  const sx = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sz = (z) => PAD.top + ((z - zMin) / (zMax - zMin)) * plotH;
  const surfPath = (key) => m.section
    .filter((s) => s[key] != null)
    .map((s, i) => `${i ? 'L' : 'M'}${sx(s.x).toFixed(1)},${sz(s[key]).toFixed(1)}`)
    .join(' ');
  const visible = m.path.filter((p) => p.tvdss >= zMin && p.tvdss <= zMax);
  const trajPath = visible.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sz(p.tvdss).toFixed(1)}`).join(' ');

  return (
    <PanelShell title="Tie explorer"
      subtitle={`${m.well.name} (head ${m.well.x}, ${m.well.y}, KB ${m.well.kb_m} m) against the clamped stack in an east-west section at y = ${m.well.y}. Residual = pick TVDSS minus the surface there; positive means the pick sits deeper than the surface.`}>
      <div className="grid gap-3 grid-cols-2 items-end">
        <SelectField label="Well" value={well} onChange={setWell}
          options={TIE_WELL_NAMES.map((n) => [n, n === 'W2' ? 'W2 (45 degree build)' : `${n} (vertical)`])} />
        <SelectField label="Trajectory" value={survey} onChange={setSurvey}
          options={[['survey', 'From the survey (minimum curvature)'], ['vertical', 'Assume a straight vertical hole']]} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label="Well trajectory and surfaces in cross-section">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          {['topA', 'topB', 'baseB'].map((k) => (
            <path key={k} d={surfPath(k)} fill="none" stroke={SURF_COLORS[k]} strokeWidth="1.5" opacity="0.9" />
          ))}
          <path d={trajPath} fill="none" stroke="#fff" strokeWidth="2" />
          {m.rows.map((r) => (
            <g key={r.top}>
              {r.surfaceZ != null && (
                <line x1={sx(r.x)} y1={sz(r.tvdss)} x2={sx(r.x)} y2={sz(r.surfaceZ)}
                  stroke="#F97316" strokeWidth="2" strokeDasharray="3 2" />
              )}
              <circle cx={sx(r.x)} cy={sz(r.tvdss)} r="4" fill="#F97316" />
              <text x={sx(r.x) + 6} y={sz(r.tvdss) - 4} fill="#fff" fontSize="9">
                {r.top} {r.residualM != null ? (r.residualM >= 0 ? '+' : '') + fmt(r.residualM, 1) : 'null'}
              </text>
            </g>
          ))}
          <text x={PAD.left + 4} y={PAD.top + 10} fill="#38BDF8" fontSize="9">TopA</text>
          <text x={PAD.left + 44} y={PAD.top + 10} fill="#BFFF00" fontSize="9">TopB</text>
          <text x={PAD.left + 84} y={PAD.top + 10} fill="#F472B6" fontSize="9">BaseB</text>
          <text x={PAD.left} y={H - 12} fill="#64748b" fontSize="9">x {fmt(xMin, 0)} m</text>
          <text x={W - PAD.right - 70} y={H - 12} fill="#64748b" fontSize="9">x {fmt(xMax, 0)} m</text>
          <text x={6} y={PAD.top + 10} fill="#64748b" fontSize="9">{fmt(zMin, 0)}</text>
          <text x={6} y={H - PAD.bottom} fill="#64748b" fontSize="9">{fmt(zMax, 0)}</text>
        </svg>
      </div>

      <TileGrid>
        {m.rows.map((r) => (
          <Tile key={r.top} label={`${r.top}: pick vs surface`}
            value={`${fmt(r.tvdss, 2)} / ${r.surfaceZ != null ? fmt(r.surfaceZ, 2) : 'null'}`} unit="m TVDSS" />
        ))}
        {m.rows.map((r) => (
          <Tile key={`${r.top}-res`} label={`${r.top} residual`}
            value={r.residualM != null ? (r.residualM >= 0 ? '+' : '') + fmt(r.residualM, 3) : 'null'} unit="m" />
        ))}
        <Tile label="Lateral reach at deepest pick" value={fmt(m.rows[m.rows.length - 1].lateralM, 2)} unit="m from the head" />
        <Tile label="Zone A control point" value={m.cp ? `${fmt(m.cp.x, 2)}, ${fmt(m.cp.y, 0)}` : '-'} unit={`x, y (weight ${m.cp ? m.cp.w : '-'} m MD)`} />
        <Tile label="Worst residual in the well set" value={`${m.worstAll.well} ${m.worstAll.top} ${fmt(m.worstAll.residualM, 3)}`} unit="m (true surveys)" />
      </TileGrid>

      <Note>
        The three vertical wells tie with hand-reachable numbers: TVDSS is MD minus KB and the
        surface is read at the wellhead. W2 is the reason this tier exists. Switch it to the
        straight-hole assumption and watch its TopA residual flip sign entirely: the assumed
        hole is too deep AND in the wrong place, and the two errors do not cancel. Note also the
        BaseB residuals on W3 and W4, vertical wells both: those come from the pinched zone B in
        the model, not from any trajectory. A residual is a disagreement, and reading WHICH
        disagreement takes both this tier and the clamp lesson below it.
      </Note>
    </PanelShell>
  );
};

export default TieExplorer;
