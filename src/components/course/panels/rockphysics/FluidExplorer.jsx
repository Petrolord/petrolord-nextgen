import React, { useMemo, useState } from 'react';
import {
  CONDITIONS, OIL_RHO0, FRAME, CAPSTONE_SW, computeFluids,
} from '@/lib/rockphysicsTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Fluid explorer: mix the Ekene pore fluid at a water saturation the
// learner chooses. The compliance split is drawn on purpose, because
// the whole course turns on the gas doing most of the softening at
// saturations that look mostly wet.
const GPA = 1e9;
const MPA = 1e6;
const W = 560;
const H = 190;

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const FluidExplorer = () => {
  const [sw, setSw] = useState(String(CAPSTONE_SW));

  const swV = Number(sw);
  const valid = Number.isFinite(swV) && swV >= 0 && swV <= 1;

  const res = useMemo(() => {
    if (!valid) return null;
    try {
      return computeFluids(swV);
    } catch {
      return null;
    }
  }, [swV, valid]);

  if (!res) {
    return (
      <PanelShell title="Fluid explorer" subtitle="Enter a water saturation between 0 and 1.">
        <NumField label="Water saturation (fraction)" value={sw} onChange={setSw} />
        <Note>The saturation must be a number from 0 to 1.</Note>
      </PanelShell>
    );
  }

  const { brine: br, gas: gs, oil, frame, mixed } = res;
  // Wood mixes compliances, so the bar shows where the softness comes from.
  const cBrine = swV / br.k;
  const cGas = (1 - swV) / gs.k;
  const cTotal = cBrine + cGas;
  const gasShare = cTotal > 0 ? (cGas / cTotal) * 100 : 0;
  const brineShare = 100 - gasShare;
  const barW = W - 24;

  return (
    <PanelShell title="Fluid explorer"
      subtitle={`The Ekene pore fluid at ${CONDITIONS.tC} degC and ${CONDITIONS.pMPa} MPa, brine ${CONDITIONS.salinity * 1000} ppt, gas gravity ${CONDITIONS.gasGravity}, oil rho0 ${OIL_RHO0} at GOR ${CONDITIONS.gorLL} L/L. Frame ${FRAME[0].frac * 100} percent quartz and ${FRAME[1].frac * 100} percent clay.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Water saturation (fraction)" value={sw} onChange={setSw} />
        <div className="text-xs text-gray-500 sm:col-span-3">
          The capstone mixes at Sw {CAPSTONE_SW}. Try 0.99: one percent of gas still takes a third
          off the fluid modulus, and the density hardly moves.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Compliance split of the mixed pore fluid at water saturation ${fmt(swV, 2)}`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <text x="12" y="24" fill="#e2e8f0" fontSize="12">Where the softness comes from</text>
          <text x="12" y="44" fill="#64748b" fontSize="10">
            Wood mixes compliance (1/K), so the soft phase dominates.
          </text>

          {/* compliance bar */}
          <rect x="12" y="60" width={barW} height="34" fill="#1e293b" />
          <rect x="12" y="60" width={(barW * brineShare) / 100} height="34" fill="#38bdf8" />
          <rect x={12 + (barW * brineShare) / 100} y="60" width={(barW * gasShare) / 100} height="34" fill="#f472b6" />
          <text x="18" y="82" fill="#0F172A" fontSize="11">brine {fmt(brineShare, 1)}%</text>
          <text x={W - 12} y="82" fill="#e2e8f0" fontSize="11" textAnchor="end">
            gas {fmt(gasShare, 1)}%
          </text>

          {/* volume bar, for contrast */}
          <text x="12" y="122" fill="#64748b" fontSize="10">By volume, the same fluid is:</text>
          <rect x="12" y="132" width={barW} height="20" fill="#1e293b" />
          <rect x="12" y="132" width={barW * swV} height="20" fill="#38bdf8" opacity="0.55" />
          <rect x={12 + barW * swV} y="132" width={barW * (1 - swV)} height="20" fill="#f472b6" opacity="0.55" />
          <text x="18" y="147" fill="#e2e8f0" fontSize="10">brine {fmt(swV * 100, 1)}%</text>
          <text x={W - 12} y="147" fill="#e2e8f0" fontSize="10" textAnchor="end">
            gas {fmt((1 - swV) * 100, 1)}%
          </text>
          <text x="12" y="176" fill="#94a3b8" fontSize="10">
            A small gas volume buys a large share of the compliance.
          </text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Brine density" value={fmt(br.rho, 4)} unit="kg/m3" />
        <Tile label="Brine K" value={fmt(br.k / GPA, 6)} unit="GPa" />
        <Tile label="Gas density" value={fmt(gs.rho, 4)} unit="kg/m3" />
        <Tile label="Gas K" value={fmt(gs.k / MPA, 4)} unit="MPa" />
        <Tile label="Live-oil density" value={fmt(oil.rho, 4)} unit="kg/m3" />
        <Tile label="Live-oil K" value={fmt(oil.k / GPA, 6)} unit="GPa" />
        <Tile label="Frame K (VRH)" value={fmt(frame.k / GPA, 6)} unit="GPa" />
        <Tile label="Frame mu (VRH)" value={fmt(frame.mu / GPA, 6)} unit="GPa" />
        <Tile label="Frame density" value={fmt(frame.rho, 0)} unit="kg/m3" />
        <Tile label="Wood mixed K" value={fmt(mixed.k / MPA, 4)} unit="MPa" />
        <Tile label="Wood mixed density" value={fmt(mixed.rho, 4)} unit="kg/m3" />
      </TileGrid>

      <Note>
        Brine and oil moduli are shown in GPa, gas and the mixed fluid in MPa, because the gas is
        weaker by more than an order of magnitude. Watch the two bars as you move the saturation.
        The volume bar moves in a straight line and the compliance bar does not, which is the whole
        reason a little gas is a large seismic effect.
      </Note>
    </PanelShell>
  );
};

export default FluidExplorer;
