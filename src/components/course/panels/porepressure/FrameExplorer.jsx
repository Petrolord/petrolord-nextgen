import React, { useMemo, useState } from 'react';
import {
  WELL, PARAMS, RAMP_TOP_M, TD_M, computeBasics, emwKgM3,
} from '@/lib/porepressureTeaching';
import { nctDt } from '@petrolord/engines/engines/porepressure/nct.js';
import { gardnerRho } from '@petrolord/engines/engines/porepressure/gardner.js';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Frame explorer: the Beginner pressure frame down the golden well.
// Depth runs downward, as a pressure plot always does. The log transit
// time is drawn against both compaction trends on purpose, because the
// fitted trend and the well's own label disagree, and seeing that is
// the point of module 4.
const W = 560;
const H = 420;
const PAD = { left: 54, top: 22, right: 16, bottom: 34 };
const MPA = 1e6;

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');
// Snap to the 10 m sample grid the golden well is defined on.
const snap = (z) => Math.min(TD_M, Math.max(0, Math.round(z / 10) * 10));

const BASICS = computeBasics();

const FrameExplorer = () => {
  const [depth, setDepth] = useState(String(TD_M));
  const [vel, setVel] = useState('1600');

  const zRaw = Number(depth);
  const vRaw = Number(vel);
  const zOk = Number.isFinite(zRaw) && zRaw >= 0 && zRaw <= TD_M;
  const vOk = Number.isFinite(vRaw) && vRaw >= 500 && vRaw <= 6000;

  const read = useMemo(() => {
    if (!zOk) return null;
    const z = snap(zRaw);
    const i = WELL.z_bml_m.indexOf(z);
    if (i < 0) return null;
    const { nct } = PARAMS;
    return {
      z,
      hydroPa: BASICS.prof.hydrostaticPa[i],
      obPa: BASICS.prof.overburdenPa[i],
      dtLog: WELL.dt_us_per_m[i],
      rho: WELL.rho_kg_m3[i],
      dtWell: nctDt(z, nct.dtMlUsPerM, nct.dtMaUsPerM, nct.cPerM),
      dtFit: nctDt(z, BASICS.fit.dtMl, nct.dtMaUsPerM, BASICS.fit.c),
    };
  }, [zRaw, zOk]);

  if (!read) {
    return (
      <PanelShell title="Frame explorer" subtitle={`Enter a depth between 0 and ${TD_M} m below mudline.`}>
        <NumField label="Depth (m below mudline)" value={depth} onChange={setDepth} />
        <Note>The depth must be a number in that range. It snaps to the well's 10 m sample grid.</Note>
      </PanelShell>
    );
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const obMaxMpa = BASICS.obTdPa / MPA;
  // Depth increases downward.
  const sy = (z) => PAD.top + (z / TD_M) * plotH;
  const sxP = (mpa) => PAD.left + (mpa / obMaxMpa) * plotW;
  const dtMin = 200;
  const dtMax = 680;
  const sxD = (dt) => PAD.left + ((dt - dtMin) / (dtMax - dtMin)) * plotW;

  const path = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const hydroPts = [];
  const obPts = [];
  const logPts = [];
  const wellPts = [];
  const fitPts = [];
  for (let i = 0; i < WELL.z_bml_m.length; i += 4) {
    const z = WELL.z_bml_m[i];
    hydroPts.push([sxP(BASICS.prof.hydrostaticPa[i] / MPA), sy(z)]);
    obPts.push([sxP(BASICS.prof.overburdenPa[i] / MPA), sy(z)]);
    logPts.push([sxD(WELL.dt_us_per_m[i]), sy(z)]);
    wellPts.push([sxD(nctDt(z, PARAMS.nct.dtMlUsPerM, PARAMS.nct.dtMaUsPerM, PARAMS.nct.cPerM)), sy(z)]);
    fitPts.push([sxD(nctDt(z, BASICS.fit.dtMl, PARAMS.nct.dtMaUsPerM, BASICS.fit.c)), sy(z)]);
  }

  return (
    <PanelShell title="Frame explorer"
      subtitle={`The golden well: ${WELL.z_bml_m.length} samples to ${TD_M} m below mudline in ${PARAMS.waterDepthM} m of water. Left panel is the pressure frame, right overlay is the sonic against both compaction trends.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Depth (m below mudline)" value={depth} onChange={setDepth} />
        <NumField label="Sonic velocity for Gardner (m/s)" value={vel} onChange={setVel} />
        <div className="text-xs text-gray-500 sm:col-span-2">
          The capstone reads the frame at TD ({TD_M} m) and Gardner at 1600 m/s. The overpressure
          ramp starts at {RAMP_TOP_M} m.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Pressure frame of the golden well read at ${read.z} m below mudline`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />

          {/* transit-time overlay, drawn faint behind the pressure curves */}
          <path d={path(logPts)} fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.55" />
          <path d={path(wellPts)} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.35" strokeDasharray="4 3" />
          <path d={path(fitPts)} fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.45" strokeDasharray="2 3" />

          {/* pressure curves */}
          <path d={path(hydroPts)} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <path d={path(obPts)} fill="none" stroke="#f87171" strokeWidth="1.8" />

          {/* ramp top and the read depth */}
          <line x1={PAD.left} y1={sy(RAMP_TOP_M)} x2={W - PAD.right} y2={sy(RAMP_TOP_M)}
            stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 4" />
          <text x={W - PAD.right} y={sy(RAMP_TOP_M) - 4} fill="#64748b" fontSize="9" textAnchor="end">
            ramp top {RAMP_TOP_M} m
          </text>
          <line x1={PAD.left} y1={sy(read.z)} x2={W - PAD.right} y2={sy(read.z)}
            stroke="#e2e8f0" strokeWidth="0.9" />
          <circle cx={sxP(read.hydroPa / MPA)} cy={sy(read.z)} r="3.5" fill="#38bdf8" stroke="#fff" strokeWidth="1" />
          <circle cx={sxP(read.obPa / MPA)} cy={sy(read.z)} r="3.5" fill="#f87171" stroke="#fff" strokeWidth="1" />

          <text x="12" y="14" fill="#38bdf8" fontSize="9">hydrostatic</text>
          <text x="92" y="14" fill="#f87171" fontSize="9">overburden</text>
          <text x="176" y="14" fill="#fbbf24" fontSize="9">sonic (solid) and well trend (dashed)</text>
          <text x="176" y="26" fill="#a78bfa" fontSize="9">fitted trend</text>
          <text x="12" y={H - 12} fill="#64748b" fontSize="9">0 to {fmt(obMaxMpa, 0)} MPa, and {dtMin} to {dtMax} us/m</text>
          <text x="12" y={PAD.top - 6} fill="#64748b" fontSize="9">0 m</text>
          <text x="12" y={H - PAD.bottom + 2} fill="#64748b" fontSize="9">{TD_M} m</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Depth read" value={String(read.z)} unit="m bml" />
        <Tile label="Hydrostatic" value={fmt(read.hydroPa / MPA, 6)} unit="MPa" />
        <Tile label="Overburden" value={fmt(read.obPa / MPA, 6)} unit="MPa" />
        <Tile label="Overburden minus hydrostatic" value={fmt((read.obPa - read.hydroPa) / MPA, 6)} unit="MPa" />
        <Tile label="Log transit time" value={fmt(read.dtLog, 6)} unit="us/m" />
        <Tile label="NCT, well trend" value={fmt(read.dtWell, 6)} unit="us/m" />
        <Tile label="NCT, fitted trend" value={fmt(read.dtFit, 6)} unit="us/m" />
        <Tile label="Log density" value={fmt(read.rho, 4)} unit="kg/m3" />
        <Tile label="Hydrostatic as EMW" value={fmt(emwKgM3(read.hydroPa, read.z), 4)} unit="kg/m3" />
        <Tile label="Overburden as EMW" value={fmt(emwKgM3(read.obPa, read.z), 4)} unit="kg/m3" />
        <Tile label={vOk ? `Gardner at ${vRaw} m/s` : 'Gardner (enter 500 to 6000)'}
          value={vOk ? fmt(gardnerRho(vRaw), 6) : '-'} unit="kg/m3" />
        <Tile label="Fitted trend" value={`${fmt(BASICS.fit.dtMl, 2)} us/m, ${fmt(BASICS.fit.c * 1000, 4)} per km`} />
      </TileGrid>

      <Note>
        At the mudline the hydrostatic and the overburden are the same number, because above the
        mudline both are only the seawater column. They separate with depth, and every possible
        pore pressure lives in the gap between them. Note that the fitted trend and the well's own
        trend are different curves. The fit describes the twelve shale picks it was given, and the
        picks were drawn on a trend of 650 us/m and 0.7 per km rather than the header's 656 and 0.6.
      </Note>
    </PanelShell>
  );
};

export default FrameExplorer;
