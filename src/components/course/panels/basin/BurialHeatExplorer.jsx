import React, { useMemo, useState } from 'react';
import { HEAT_FIXTURE, computeBurialHeat } from '@/lib/basinTeaching';
import { BurialCompactionEngine } from '@petrolord/engines/engines/basin/BurialCompactionEngine.js';
import { getCompactionParams } from '@petrolord/engines/engines/basin/CompactionModelLibrary.js';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Burial and heat explorer: the compaction curve for a lithology the
// learner picks, the decompaction of a 100 m layer from a depth they
// pick, and the golden steady heat column. The two gradients are
// labelled on purpose, because the course turns on the gradient being
// Q over k rather than a property of the earth.
const LITHS = ['shale', 'sandstone', 'limestone', 'dolomite'];
const W = 560;
const H = 300;
const PAD = { left: 46, top: 22, right: 16, bottom: 30 };
const MAX_Z = 4000;

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const BASE = computeBurialHeat();

const BurialHeatExplorer = () => {
  const [lith, setLith] = useState('shale');
  const [depth, setDepth] = useState('2000');
  const [burial, setBurial] = useState('1000');

  const zRaw = Number(depth);
  const bRaw = Number(burial);
  const zOk = Number.isFinite(zRaw) && zRaw >= 0 && zRaw <= MAX_Z;
  const bOk = Number.isFinite(bRaw) && bRaw >= 0 && bRaw <= MAX_Z;
  const p = getCompactionParams(lith);

  const read = useMemo(() => {
    if (!zOk) return null;
    const phi = BurialCompactionEngine.porosity(zRaw, p.phi0, p.c);
    const solid100 = BurialCompactionEngine.solidThickness(0, 100, p.phi0, p.c);
    let solidAtB = null;
    let restored = null;
    if (bOk) {
      solidAtB = BurialCompactionEngine.solidThickness(bRaw, 100, p.phi0, p.c);
      restored = BurialCompactionEngine.calculateLayerProperties(
        { lithology: lith, solidThickness: solidAtB }, 0,
      ).thickness;
    }
    return { phi, solid100, solidAtB, restored };
  }, [zRaw, bRaw, zOk, bOk, lith, p.phi0, p.c]);

  if (!read) {
    return (
      <PanelShell title="Burial and heat explorer" subtitle={`Enter a depth between 0 and ${MAX_Z} m.`}>
        <NumField label="Depth (m)" value={depth} onChange={setDepth} />
        <Note>The depth must be a number in that range.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  // Left half: porosity against depth. Right half: the heat column.
  const halfW = plotW / 2 - 12;
  const syZ = (z) => PAD.top + (z / MAX_Z) * plotH;
  const sxPhi = (phi) => PAD.left + (phi / 0.7) * halfW;
  const zHeatMax = 2000;
  const syH = (z) => PAD.top + (z / zHeatMax) * plotH;
  const tMax = 65;
  const sxT = (t) => PAD.left + halfW + 24 + (t / tMax) * halfW;

  const phiPts = [];
  for (let z = 0; z <= MAX_Z; z += 50) {
    phiPts.push(`${sxPhi(BurialCompactionEngine.porosity(z, p.phi0, p.c))},${syZ(z)}`);
  }
  const heatPts = HEAT_FIXTURE.profile.map((e) => `${sxT(e.t_c)},${syH(e.z_m)}`);
  const gradTop = (HEAT_FIXTURE.basal_q_w_m2 * 1000) / HEAT_FIXTURE.layers[0].k;
  const gradBot = (HEAT_FIXTURE.basal_q_w_m2 * 1000) / HEAT_FIXTURE.layers[1].k;

  return (
    <PanelShell title="Burial and heat explorer"
      subtitle={`Left: the Sclater-Christie curve for the lithology you pick. Right: the golden steady heat column, ${HEAT_FIXTURE.surface_t_c} degC at surface with ${HEAT_FIXTURE.basal_q_w_m2 * 1000} mW/m2 through k ${HEAT_FIXTURE.layers[0].k} over k ${HEAT_FIXTURE.layers[1].k}.`}>
      <div className="flex flex-wrap gap-2">
        {LITHS.map((l) => (
          <button key={l} type="button" onClick={() => setLith(l)}
            className={`px-3 py-1.5 rounded-md border text-sm ${lith === l
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Depth for porosity (m)" value={depth} onChange={setDepth} />
        <NumField label="Burial depth of a 100 m layer (m)" value={burial} onChange={setBurial} />
        <div className="text-xs text-gray-500 sm:col-span-2">
          The capstone reads shale porosity at 2000 m and restores a 100 m shale from 1000 m.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label={`Compaction curve for ${lith} and the golden steady heat column`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />

          <polyline points={phiPts.join(' ')} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1={sxPhi(read.phi)} y1={syZ(zRaw)} x2={PAD.left} y2={syZ(zRaw)}
            stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx={sxPhi(read.phi)} cy={syZ(zRaw)} r="3.5" fill="#38bdf8" stroke="#fff" strokeWidth="1" />
          <text x={PAD.left} y="14" fill="#38bdf8" fontSize="9">porosity of {lith} (0 to 0.7)</text>
          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">0 to {MAX_Z} m depth</text>

          <polyline points={heatPts.join(' ')} fill="none" stroke="#f87171" strokeWidth="1.8" />
          <line x1={sxT(0)} y1={syH(1000)} x2={sxT(tMax)} y2={syH(1000)}
            stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 4" />
          <text x={sxT(0)} y="14" fill="#f87171" fontSize="9">steady temperature (0 to {tMax} degC)</text>
          <text x={sxT(0) + 4} y={syH(500)} fill="#94a3b8" fontSize="9">{fmt(gradTop, 1)} degC/km</text>
          <text x={sxT(0) + 4} y={syH(1500)} fill="#94a3b8" fontSize="9">{fmt(gradBot, 1)} degC/km</text>
          <text x={sxT(tMax)} y={syH(1000) - 4} fill="#64748b" fontSize="9" textAnchor="end">k changes at 1000 m</text>
          <text x={sxT(0)} y={H - 14} fill="#64748b" fontSize="9">0 to {zHeatMax} m</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label={`${lith} phi0`} value={fmt(p.phi0, 2)} unit="v/v" />
        <Tile label={`${lith} c`} value={String(p.c)} unit="per m" />
        <Tile label={`Porosity at ${zOk ? zRaw : '-'} m`} value={fmt(read.phi, 8)} unit="v/v" />
        <Tile label="Solid thickness in 100 m at surface" value={fmt(read.solid100, 8)} unit="m" />
        <Tile label={`Solid thickness in 100 m at ${bOk ? bRaw : '-'} m`} value={bOk ? fmt(read.solidAtB, 8) : '-'} unit="m" />
        <Tile label="Restored to surface" value={bOk ? fmt(read.restored, 8) : '-'} unit="m" />
        <Tile label="Thickness gained on restoration" value={bOk ? fmt(read.restored - 100, 4) : '-'} unit="m" />
        <Tile label="Temperature at 50 m" value={fmt(BASE.tFirstNode, 6)} unit="degC" />
        <Tile label="Temperature at 950 m" value={fmt(BASE.tLayer1Bottom, 6)} unit="degC" />
        <Tile label="Temperature at 1950 m" value={fmt(BASE.tDeepest, 6)} unit="degC" />
        <Tile label="Gradient, upper layer" value={fmt(gradTop, 6)} unit="degC/km" />
        <Tile label="Gradient, lower layer" value={fmt(gradBot, 6)} unit="degC/km" />
      </TileGrid>

      <Note>
        The same {HEAT_FIXTURE.basal_q_w_m2 * 1000} mW/m2 flows through both layers of the column,
        and the gradient still changes by nearly a factor of two at 1000 m, because the gradient is
        the heat flow divided by the conductivity. Temperature itself stays continuous across that
        boundary; it is the slope that kinks. On the left, switch lithology and watch which rock is
        most porous at the surface and which is most porous at 2000 m. They are not the same rock.
      </Note>
    </PanelShell>
  );
};

export default BurialHeatExplorer;
