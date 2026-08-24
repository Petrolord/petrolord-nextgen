import React, { useMemo, useState } from 'react';
import {
  TEACHING_WELLS, CAPSTONE_OWC_M, PROPS, computeVolumes,
} from '@/lib/reservoircalcTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Volume explorer: clip the Ekene SAND against an oil water contact the
// learner chooses, then read the volumetric chain. Dry wells are posted
// as dry on purpose, and the cells that carry no oil are left blank, so
// the panel shows how much of the mapped area is actually booked.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };
const MIN_OWC = 1500;
const MAX_OWC = 1620;

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

// Oil column colour: thin sliver pale, thick column deep green.
function columnColor(t, tMax) {
  if (!Number.isFinite(t) || !(tMax > 0)) return 'transparent';
  const f = Math.max(0, Math.min(1, t / tMax));
  const r = Math.round(226 + (22 - 226) * f);
  const g = Math.round(232 + (128 - 232) * f);
  const b = Math.round(170 + (61 - 170) * f);
  return `rgb(${r},${g},${b})`;
}

const VolumeExplorer = () => {
  const [owc, setOwc] = useState(String(CAPSTONE_OWC_M));

  const owcM = Number(owc);
  const valid = Number.isFinite(owcM) && owcM >= MIN_OWC && owcM <= MAX_OWC;

  const vol = useMemo(() => {
    if (!valid) return null;
    try {
      return computeVolumes(owcM);
    } catch {
      return null;
    }
  }, [owcM, valid]);

  if (!vol) {
    return (
      <PanelShell title="Volume explorer"
        subtitle={`Enter an oil water contact between ${MIN_OWC} and ${MAX_OWC} m.`}>
        <NumField label="Oil water contact (m)" value={owc} onChange={setOwc} />
        <Note>The contact must be a number in that range.</Note>
      </PanelShell>
    );
  }

  const { spec, oilNodes, maxCol, summary: s } = vol;
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

  const cells = oilNodes.map(({ j, t }) => {
    const c = j % spec.nx;
    const r = Math.floor(j / spec.nx);
    return (
      <rect key={j}
        x={sx(spec.x0 + c * spec.dx) - cw / 2}
        y={sy(spec.y0 + r * spec.dy) - ch / 2}
        width={cw} height={ch}
        fill={columnColor(t, maxCol)} fillOpacity="0.85" />
    );
  });

  const cellArea = spec.dx * spec.dy;
  const oilAreaKm2 = (s.oilCells * cellArea) / 1e6;
  const meanCol = s.oilCells > 0 ? (s.grvMm3 * 1e6) / (s.oilCells * cellArea) : 0;

  return (
    <PanelShell title="Volume explorer"
      subtitle={`The Ekene SAND accumulation above a ${fmt(owcM, 0)} m contact, on the same 201 node grid the Mapping course built. Blank ground either lies outside the mapped area or has its top below the contact.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Oil water contact (m)" value={owc} onChange={setOwc} />
        <div className="text-xs text-gray-500 sm:col-span-3">
          The capstone books at {CAPSTONE_OWC_M} m. Try 1550 and 1570 m: the properties never
          change, and the volume moves by a factor of five.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Oil column map of the Ekene SAND above a ${fmt(owcM, 0)} m contact`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {cells}

          {/* control wells, posted with their oil column at this contact */}
          {TEACHING_WELLS.map((w) => {
            const top = w.tops.find((t) => t.name === 'TOP_SAND').md_m;
            const base = w.tops.find((t) => t.name === 'BASE_SAND').md_m;
            const col = Math.min(base, owcM) - top;
            const dry = col <= 0;
            return (
              <g key={w.name}>
                <circle cx={sx(w.surface_x)} cy={sy(w.surface_y)} r="4"
                  fill={dry ? '#0F172A' : '#fff'} stroke={dry ? '#f87171' : '#fff'} strokeWidth="1.5" />
                <text x={sx(w.surface_x) + 7} y={sy(w.surface_y) - 4}
                  fill={dry ? '#f87171' : '#e2e8f0'} fontSize="9">
                  {w.name} {dry ? 'dry' : `${fmt(col, 0)} m`}
                </text>
              </g>
            );
          })}

          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x {xMin} to {xMax} m</text>
          <text x={PAD.left} y={12} fill="#64748b" fontSize="9">y {yMin} to {yMax} m (north up)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Oil-bearing cells" value={String(s.oilCells)} unit={`of ${spec.nx * spec.ny}`} />
        <Tile label="Oil area" value={fmt(oilAreaKm2, 2)} unit="km2" />
        <Tile label="Maximum oil column" value={fmt(s.maxOilColumn, 4)} unit="m" />
        <Tile label="Mean oil column" value={fmt(meanCol, 4)} unit="m" />
        <Tile label="Gross rock volume" value={fmt(s.grvMm3, 4)} unit="10^6 m3" />
        <Tile label={`Net volume (NTG ${PROPS.ntg})`} value={fmt(s.netMm3, 4)} unit="10^6 m3" />
        <Tile label={`Pore volume (phi ${PROPS.phi})`} value={fmt(s.poreMm3, 4)} unit="10^6 m3" />
        <Tile label={`HCPV (Sw ${PROPS.sw})`} value={fmt(s.hcpvMm3, 4)} unit="10^6 m3" />
        <Tile label={`STOIIP (Bo ${PROPS.bo})`} value={fmt(s.stoiipMmstb, 4)} unit="MMstb" />
      </TileGrid>

      <Note>
        White circles are wells with oil, labelled with their column at this contact; red circles
        are dry, because their top sits below the contact. Every coloured cell is an estimate built
        on an interpolated surface, so the thickest part of the accumulation is measured down from
        a mapped crest that no well produced. Move the contact and watch which number moves most.
      </Note>
    </PanelShell>
  );
};

export default VolumeExplorer;
