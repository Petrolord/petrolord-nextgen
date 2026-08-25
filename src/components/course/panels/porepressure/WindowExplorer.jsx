import React, { useMemo, useState } from 'react';
import {
  TD_M, RAMP_TOP_M, CAPSTONE_EATON_N,
  computeWindowExplorer, computeBowersFacts,
} from '@/lib/porepressureTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Window explorer: the prognosis converted to the driller's unit. The two
// walls of the mud-weight window are drawn in equivalent mud weight against
// depth, inside the hydrostatic and overburden bracket the Associate tier
// established, with the Eaton exponent exposed because choosing it moves
// the floor. The Bowers tiles carry the tier's second method and the
// cross-check that closes the loop at TD.
const W = 560;
const H = 420;
const PAD = { left: 54, top: 22, right: 16, bottom: 34 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const BOWERS = computeBowersFacts();

const WindowExplorer = () => {
  const [n, setN] = useState(String(CAPSTONE_EATON_N));
  const m = useMemo(() => computeWindowExplorer(Number(n)), [n]);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const eMin = 950;
  const eMax = 2350;
  const sy = (z) => PAD.top + (z / TD_M) * plotH;
  const sx = (e) => PAD.left + ((e - eMin) / (eMax - eMin)) * plotW;
  const path = (key) => m.curve.map((p, i) => `${i ? 'L' : 'M'} ${sx(p[key]).toFixed(1)} ${sy(p.z).toFixed(1)}`).join(' ');
  const band = m.curve.map((p) => `${sx(p.ppEmw).toFixed(1)},${sy(p.z).toFixed(1)}`)
    .concat([...m.curve].reverse().map((p) => `${sx(p.fpEmw).toFixed(1)},${sy(p.z).toFixed(1)}`))
    .join(' ');

  return (
    <PanelShell title="Window explorer"
      subtitle="The mud-weight window down the golden well, referenced to sea level. The shaded band is where a mud weight may sit; the exponent moves its floor.">
      <div className="grid gap-3 grid-cols-2 items-end">
        <SelectField label="Eaton exponent n" value={n} onChange={setN}
          options={[['3', '3 (capstone)'], ['1.2', '1.2 (the low calibration)']]} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3" role="img"
        aria-label="Mud-weight window in equivalent mud weight against depth">
        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="none" stroke="#d4d4d8" />
        {[1000, 1250, 1500, 1750, 2000, 2250].map((e) => (
          <g key={e}>
            <line x1={sx(e)} y1={PAD.top} x2={sx(e)} y2={PAD.top + plotH} stroke="#f1f1f4" />
            <text x={sx(e)} y={H - 12} fontSize="10" textAnchor="middle" fill="#71717a">{e}</text>
          </g>
        ))}
        {[0, 1000, 2000, 3000, 4000].map((z) => (
          <text key={z} x={PAD.left - 6} y={sy(z) + 3} fontSize="10" textAnchor="end" fill="#71717a">{z}</text>
        ))}
        <polygon points={band} fill="#bbf7d0" opacity="0.5" />
        <line x1={PAD.left} y1={sy(RAMP_TOP_M)} x2={PAD.left + plotW} y2={sy(RAMP_TOP_M)} stroke="#f59e0b" strokeDasharray="3 3" />
        <text x={PAD.left + plotW - 4} y={sy(RAMP_TOP_M) - 4} fontSize="9" textAnchor="end" fill="#b45309">ramp top 2500 m</text>
        <path d={path('hydroEmw')} fill="none" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="5 3" />
        <path d={path('obEmw')} fill="none" stroke="#525252" strokeWidth="1.2" strokeDasharray="5 3" />
        <path d={path('ppEmw')} fill="none" stroke="#dc2626" strokeWidth="2" />
        <path d={path('fpEmw')} fill="none" stroke="#16a34a" strokeWidth="2" />
        <text x={PAD.left + 6} y={PAD.top + 12} fontSize="10" fill="#0369a1">hydrostatic EMW</text>
        <text x={PAD.left + plotW - 6} y={PAD.top + 12} fontSize="10" textAnchor="end" fill="#404040">overburden EMW</text>
        <text x={W / 2} y={H - 2} fontSize="10" textAnchor="middle" fill="#71717a">equivalent mud weight (kg/m3); floor red, ceiling green</text>
      </svg>

      <TileGrid>
        <Tile label="Floor at TD (pore pressure)" value={fmt(m.ppEmwTd)} unit="kg/m3" />
        <Tile label="Ceiling at TD (fracture)" value={fmt(m.fpEmwTd)} unit="kg/m3" />
        <Tile label="Window at TD" value={fmt(m.windowTd)} unit="kg/m3" />
        <Tile label="Hydrostatic EMW at TD" value={fmt(m.hydroEmwTd)} unit="kg/m3" />
        <Tile label="Overburden EMW at TD" value={fmt(m.obEmwTd)} unit="kg/m3" />
        <Tile label="PP at TD" value={fmt(m.ppTdMpa, 3)} unit="MPa" />
        <Tile label="Bowers loading v at 5 MPa" value={fmt(BOWERS.vLoad5MPa)} unit="m/s" />
        <Tile label="Bowers unloading stress at 3125.8 m/s" value={fmt(BOWERS.sigmaUnloadPa / 1e6, 3)} unit="MPa" />
        <Tile label="Loading read of that same velocity" value={fmt(BOWERS.sigmaLoadSameVPa / 1e6, 3)} unit="MPa" />
        <Tile label="Eaton vs Bowers PP at TD" value={fmt(Math.abs(BOWERS.agreementPa) / 1e6, 3)} unit="MPa apart" />
      </TileGrid>

      <Note>
        The Bowers tiles do not move with the exponent: they are the second
        method. At TD the loading curve turns the measured velocity into a
        pore pressure {fmt(Math.abs(BOWERS.agreementPa) / 1e6, 3)} MPa from
        the Eaton answer, which is the cross-check saying this well&apos;s
        overpressure sits on the loading curve.
      </Note>
    </PanelShell>
  );
};

export default WindowExplorer;
