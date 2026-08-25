import React, { useMemo, useState } from 'react';
import {
  SAND_IN_SITU, PHI, KMIN, SW_OPTIONS, PHI_OPTIONS, KMIN_OPTIONS,
  computeSubstitutionAt,
} from '@/lib/rockphysicsTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Substitution explorer: run inverse-then-forward Gassmann on the logged
// Ekene sand with the pore fluid mixed at a saturation the learner chooses,
// and with the two ASSUMED inputs exposed, because the tier's argument is
// about what the answer is sensitive to. The saturation curve is drawn
// because its shape, not its endpoints, is the lesson.
const W = 560;
const H = 300;
const PAD = { left: 62, top: 18, right: 18, bottom: 40 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const SubstitutionExplorer = () => {
  const [sw, setSw] = useState('0');
  const [phi, setPhi] = useState(String(PHI));
  const [kmin, setKmin] = useState(String(KMIN));

  const m = useMemo(() => {
    try {
      return computeSubstitutionAt(Number(sw), Number(phi), Number(kmin));
    } catch {
      return null;
    }
  }, [sw, phi, kmin]);

  if (!m) {
    return (
      <PanelShell title="Substitution explorer" subtitle="Choose a saturation, a porosity and a mineral modulus.">
        <Note>Those inputs are inconsistent: inverse Gassmann produced a non-positive dry frame.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const vps = m.curve.map((p) => p.vp);
  const vMin = Math.min(...vps, m.logged.vp);
  const vMax = Math.max(...vps, m.logged.vp);
  const sx = (s) => PAD.left + (1 - s) * plotW;            // Sw 1 at the left
  const sy = (v) => PAD.top + (1 - (v - vMin) / Math.max(1e-9, vMax - vMin)) * plotH;
  const path = m.curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p.sw).toFixed(1)},${sy(p.vp).toFixed(1)}`).join(' ');
  const here = m.curve.reduce((a, p) => (Math.abs(p.sw - m.sw) < Math.abs(a.sw - m.sw) ? p : a), m.curve[0]);

  return (
    <PanelShell title="Substitution explorer"
      subtitle={`The logged Ekene sand (${SAND_IN_SITU.vp} m/s, ${SAND_IN_SITU.vs} m/s, ${SAND_IN_SITU.rho} kg/m3) with its brine replaced by a brine and gas mix. Porosity and the mineral modulus are assumptions rather than measurements, so both are exposed.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 items-end">
        <SelectField label="Water saturation Sw" value={sw} onChange={setSw}
          options={SW_OPTIONS.map((v) => [String(v), v === 1 ? '1.00 (all brine)' : (v === 0 ? '0.00 (all gas)' : v.toFixed(2))])} />
        <SelectField label="Porosity (assumed)" value={phi} onChange={setPhi}
          options={PHI_OPTIONS.map((v) => [String(v), v.toFixed(2)])} />
        <SelectField label="Mineral modulus (assumed)" value={kmin} onChange={setKmin}
          options={KMIN_OPTIONS.map((v) => [String(v), `${v / 1e9} GPa`])} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label="Compressional velocity against water saturation">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          <path d={path} fill="none" stroke="#BFFF00" strokeWidth="2" />
          <circle cx={sx(here.sw)} cy={sy(here.vp)} r="5" fill="#fff" />
          <text x={sx(here.sw) + 8} y={sy(here.vp) - 6} fill="#fff" fontSize="10">
            Sw {fmt(here.sw, 2)}, {fmt(here.vp, 1)} m/s
          </text>
          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">Sw 1.0 (brine)</text>
          <text x={W - PAD.right - 66} y={H - 14} fill="#64748b" fontSize="9">Sw 0.0 (gas)</text>
          <text x={6} y={PAD.top + 10} fill="#64748b" fontSize="9">{fmt(vMax, 0)}</text>
          <text x={6} y={H - PAD.bottom} fill="#64748b" fontSize="9">{fmt(vMin, 0)}</text>
          <text x={6} y={H / 2} fill="#64748b" fontSize="9">vp m/s</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Shear modulus (fluid blind)" value={fmt(m.mu / 1e9, 4)} unit="GPa" />
        <Tile label="Saturated K, as logged" value={fmt(m.ksatInSitu / 1e9, 4)} unit="GPa" />
        <Tile label="Dry frame K (inverse Gassmann)" value={fmt(m.kDry / 1e9, 6)} unit="GPa" />
        <Tile label="Mineral frame K (VRH)" value={fmt(m.frame.k / 1e9, 4)} unit="GPa" />
        <Tile label="Pore fluid K at this Sw" value={fmt(m.fluid.k / 1e6, 4)} unit="MPa" />
        <Tile label="Pore fluid density" value={fmt(m.fluid.rho, 3)} unit="kg/m3" />
        <Tile label="vp" value={fmt(m.result.vp, 4)} unit={`m/s (log ${SAND_IN_SITU.vp})`} />
        <Tile label="vs" value={fmt(m.result.vs, 4)} unit={`m/s (log ${SAND_IN_SITU.vs})`} />
        <Tile label="Bulk density" value={fmt(m.result.rho, 4)} unit={`kg/m3 (log ${SAND_IN_SITU.rho})`} />
        <Tile label="Vp over Vs" value={fmt(m.vpvs, 4)} unit={`(log ${fmt(m.vpvsLogged, 4)})`} />
        <Tile label="Acoustic impedance" value={fmt(m.impedance / 1e6, 4)} unit="10^6 kg/m2s" />
        <Tile label="Round trip back to brine" value={`${fmt(m.roundTrip.vp, 4)} / ${fmt(m.roundTrip.vs, 4)}`} unit="m/s" />
      </TileGrid>

      <Note>
        The shear modulus tile never moves, whatever fluid you put in: fluids have no shear
        stiffness, and that is the hinge the whole substitution turns on. Because vs is the square
        root of that fixed modulus over a falling density, vs goes UP when the gas comes in. The
        round trip tile is the quality control: substitute the brine back and the log must return
        exactly. Follow the curve from Sw 1.0 leftward and notice how much of the drop the first
        few percent of gas delivers, and that the curve turns back up before it reaches pure gas.
      </Note>
    </PanelShell>
  );
};

export default SubstitutionExplorer;
