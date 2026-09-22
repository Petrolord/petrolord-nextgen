import React, { useMemo, useState } from 'react';
import {
  SAND_IN_SITU, PHI, KMIN, CONDITIONS, FRAME,
  computeSubstitutionAt, computeShearEstimate,
} from '@/lib/rockphysicsTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Substitution explorer: run inverse-then-forward Gassmann on the logged
// Ekene sand with the pore fluid mixed at a saturation the learner chooses,
// and with the two ASSUMED inputs exposed, because the tier's argument is
// about what the answer is sensitive to. The saturation curve is drawn
// because its shape, not its endpoints, is the lesson.
const W = 560;
const H = 300;
const PAD = { left: 62, top: 18, right: 18, bottom: 40 };

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '-');

// The panel opens on the logged Ekene sand, the teaching case. The log
// point, the two assumptions and the fluid conditions are all typed inputs,
// so a case of your own (the capstone states one) is worked by typing it
// in; nothing here preloads it.
const DEFAULTS = {
  vp: String(SAND_IN_SITU.vp),
  vs: String(SAND_IN_SITU.vs),
  rho: String(SAND_IN_SITU.rho),
  phi: String(PHI),
  kminGpa: String(KMIN / 1e9),
  sw: '0',
  tC: String(CONDITIONS.tC),
  pMPa: String(CONDITIONS.pMPa),
  ppm: String(Math.round(CONDITIONS.salinity * 1e6)),
  gasGravity: String(CONDITIONS.gasGravity),
  gcVp: '3000',
  gcSand: String(FRAME[0].frac),
};

const SubstitutionExplorer = () => {
  const [inp, setInp] = useState(DEFAULTS);
  const set = (k) => (v) => setInp((o) => ({ ...o, [k]: v }));
  const n = Object.fromEntries(Object.entries(inp).map(([k, v]) => [k, Number(v)]));
  const valid = Object.values(n).every(Number.isFinite)
    && n.vp > 0 && n.vs > 0 && n.rho > 0 && n.phi > 0 && n.phi < 1 && n.kminGpa > 0
    && n.sw >= 0 && n.sw <= 1 && n.pMPa > 0 && n.ppm >= 0 && n.gasGravity > 0
    && n.gcVp > 0 && n.gcSand >= 0 && n.gcSand <= 1;

  const m = useMemo(() => {
    if (!valid) return null;
    try {
      const cond = { tC: n.tC, pMPa: n.pMPa, salinity: n.ppm / 1e6, gasGravity: n.gasGravity, gorLL: CONDITIONS.gorLL };
      const out = computeSubstitutionAt(n.sw, n.phi, n.kminGpa * 1e9, { vp: n.vp, vs: n.vs, rho: n.rho }, cond);
      if (!(out.kDry > 0) || ![out.result.vp, out.result.vs, out.result.rho].every(Number.isFinite)) return null;
      return { ...out, shear: computeShearEstimate(n.gcVp, n.gcSand, { vp: n.vp, vs: n.vs }) };
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, inp]);

  const inputs = (
    <div className="space-y-2">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 items-end">
        <NumField label="Logged vp (m/s)" value={inp.vp} onChange={set('vp')} />
        <NumField label="Logged vs (m/s)" value={inp.vs} onChange={set('vs')} />
        <NumField label="Logged density (kg/m3)" value={inp.rho} onChange={set('rho')} />
        <NumField label="Porosity (assumed)" value={inp.phi} onChange={set('phi')} />
        <NumField label="Mineral modulus (GPa, assumed)" value={inp.kminGpa} onChange={set('kminGpa')} />
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 items-end">
        <NumField label="New water saturation Sw" value={inp.sw} onChange={set('sw')} />
        <NumField label="Temperature (degC)" value={inp.tC} onChange={set('tC')} />
        <NumField label="Pore pressure (MPa)" value={inp.pMPa} onChange={set('pMPa')} />
        <NumField label="Brine salinity (ppm)" value={inp.ppm} onChange={set('ppm')} />
        <NumField label="Gas gravity" value={inp.gasGravity} onChange={set('gasGravity')} />
      </div>
    </div>
  );

  if (!m) {
    return (
      <PanelShell title="Substitution explorer" subtitle="Type a log point, a porosity, a mineral modulus, a saturation and the fluid conditions.">
        {inputs}
        <Note>Those inputs are inconsistent: every one must be a number, and inverse Gassmann must produce a positive dry frame.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const vps = [...m.curve.map((p) => p.vp), m.result.vp];
  const vMin = Math.min(...vps, m.logged.vp);
  const vMax = Math.max(...vps, m.logged.vp);
  const sx = (s) => PAD.left + (1 - s) * plotW;            // Sw 1 at the left
  const sy = (v) => PAD.top + (1 - (v - vMin) / Math.max(1e-9, vMax - vMin)) * plotH;
  const path = m.curve.map((p, i) => `${i ? 'L' : 'M'}${sx(p.sw).toFixed(1)},${sy(p.vp).toFixed(1)}`).join(' ');
  const here = { sw: m.sw, vp: m.result.vp };

  return (
    <PanelShell title="Substitution explorer"
      subtitle={`A logged brine sand (${inp.vp} m/s, ${inp.vs} m/s, ${inp.rho} kg/m3) with its brine replaced by a brine and gas mix. It opens on the Ekene sand. Porosity and the mineral modulus are assumptions rather than measurements, so both are exposed.`}>
      {inputs}

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
        <Tile label="vp" value={fmt(m.result.vp, 4)} unit={`m/s (log ${inp.vp})`} />
        <Tile label="vs" value={fmt(m.result.vs, 4)} unit={`m/s (log ${inp.vs})`} />
        <Tile label="Bulk density" value={fmt(m.result.rho, 4)} unit={`kg/m3 (log ${inp.rho})`} />
        <Tile label="Vp over Vs" value={fmt(m.vpvs, 4)} unit={`(log ${fmt(m.vpvsLogged, 4)})`} />
        <Tile label="Acoustic impedance" value={fmt(m.impedance / 1e6, 4)} unit="10^6 kg/m2s" />
        <Tile label="Round trip back to brine" value={`${fmt(m.roundTrip.vp, 4)} / ${fmt(m.roundTrip.vs, 4)}`} unit="m/s" />
      </TileGrid>

      <div className="space-y-2">
        <p className="text-sm text-white mb-0">Shear where the log has none (Greenberg-Castagna)</p>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
          <NumField label="Target vp (m/s)" value={inp.gcVp} onChange={set('gcVp')} />
          <NumField label="Sandstone fraction (rest shale)" value={inp.gcSand} onChange={set('gcSand')} />
        </div>
        <TileGrid>
          <Tile label="Sandstone line" value={fmt(m.shear.sand, 4)} unit="m/s" />
          <Tile label="Shale line" value={fmt(m.shear.shale, 4)} unit="m/s" />
          <Tile label="Greenberg-Castagna vs" value={fmt(m.shear.gc, 4)} unit="m/s" />
          <Tile label="Mudrock line vs" value={fmt(m.shear.mudrock, 4)} unit="m/s" />
        </TileGrid>
      </div>

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
