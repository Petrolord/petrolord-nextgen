import React, { useMemo, useState } from 'react';
import {
  KRIGE_PARAMS, NUGGET_OPTIONS, RANGE_OPTIONS, POPULATION_METHODS, computePopulation,
} from '@/lib/earthmodelTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Population explorer: zone-A porosity populated per fault block, drawn
// along the model row through y = 2200 because that row crosses the fault
// AND carries W2's zone-A control point. The method and the variogram's two
// assumed numbers are the controls, because they are the assumptions; the
// discontinuity at the fault is the shape the tier is about.
const W = 560;
const H = 300;
const PAD = { left: 62, top: 18, right: 18, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const PopulationExplorer = () => {
  const [method, setMethod] = useState('krige');
  const [nugget, setNugget] = useState(String(KRIGE_PARAMS.nugget));
  const [range, setRange] = useState(String(KRIGE_PARAMS.range));

  const m = useMemo(
    () => computePopulation(method, Number(nugget), Number(range)),
    [method, nugget, range],
  );

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const phis = m.profile.map((p) => p.phi);
  const vMin = Math.min(...phis) - 0.004;
  const vMax = Math.max(...phis) + 0.004;
  const sx = (x) => PAD.left + ((x - 1000) / 1200) * plotW;
  const sy = (v) => PAD.top + (1 - (v - vMin) / (vMax - vMin)) * plotH;
  const seg = (block) => m.profile
    .filter((p) => p.block === block)
    .map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.phi).toFixed(1)}`)
    .join(' ');
  const faultX = sx(1575);
  const jump = m.profile[12].phi - m.profile[11].phi;

  return (
    <PanelShell title="Population explorer"
      subtitle={`Zone-A porosity along the model row at y = ${m.profileY}, populated per fault block from the zone-A control points (weight = MD interval). The fault crosses this row at x = 1575; block 1 lies west of it.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 items-end">
        <SelectField label="Method" value={method} onChange={setMethod}
          options={POPULATION_METHODS.map((k) => [k, k === 'krige' ? 'Simple kriging' : (k === 'trend' ? 'Plane trend' : 'Constant (weighted mean)')])} />
        <SelectField label="Nugget (assumed)" value={nugget} onChange={setNugget}
          options={NUGGET_OPTIONS.map((v) => [String(v), String(v)])} />
        <SelectField label="Range (assumed)" value={range} onChange={setRange}
          options={RANGE_OPTIONS.map((v) => [String(v), `${v} m`])} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label="Porosity along the row through y equals 2200">
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={faultX} y1={PAD.top} x2={faultX} y2={H - PAD.bottom} stroke="#F97316" strokeDasharray="4 3" />
          <text x={faultX + 4} y={PAD.top + 12} fill="#F97316" fontSize="9">fault (x 1575)</text>
          <path d={seg(1)} fill="none" stroke="#38BDF8" strokeWidth="2" />
          <path d={seg(0)} fill="none" stroke="#BFFF00" strokeWidth="2" />
          {m.byBlock[0].concat(m.byBlock[1]).filter((p) => Math.abs(p.y - m.profileY) < 1).map((p) => (
            <g key={p.well}>
              <circle cx={sx(p.x)} cy={sy(p.v)} r="5" fill="#fff" />
              <text x={sx(p.x) + 7} y={sy(p.v) - 5} fill="#fff" fontSize="9">{p.well} {fmt(p.v, 4)}</text>
            </g>
          ))}
          <text x={PAD.left + 4} y={H - PAD.bottom - 6} fill="#38BDF8" fontSize="9">block 1</text>
          <text x={W - PAD.right - 56} y={H - PAD.bottom - 6} fill="#BFFF00" fontSize="9">block 0</text>
          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x 1000</text>
          <text x={W - PAD.right - 44} y={H - 14} fill="#64748b" fontSize="9">x 2200</text>
          <text x={6} y={PAD.top + 10} fill="#64748b" fontSize="9">{fmt(vMax, 3)}</text>
          <text x={6} y={H - PAD.bottom} fill="#64748b" fontSize="9">{fmt(vMin, 3)}</text>
          <text x={6} y={H / 2} fill="#64748b" fontSize="9">phi</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Census (block 0 / block 1)" value={`${m.census['0']} / ${m.census['1']}`} unit="of 500 nodes" />
        <Tile label="Zone A phi, block 0 (weighted)" value={fmt(m.phiBlock0, 6)} unit="v/v" />
        <Tile label="Zone A phi, block 1" value={fmt(m.phiBlock1, 4)} unit="v/v (= W1 alone)" />
        <Tile label="Jump across the fault on this row" value={fmt(jump, 6)} unit="v/v" />
        <Tile label="Method used per block" value={m.provenance.map((p) => `b${p.block}:${p.methodUsed}${p.fellBack ? '*' : ''}`).join(' ')} unit="* = fell back" />
        <Tile label="Kriged at W1 (1100, 2100)" value={fmt(m.probes.krigeAtW1, 4)} unit="v/v (W1 is 0.3150)" />
        <Tile label="Kriged far from all wells" value={fmt(m.probes.far, 10)} unit="v/v" />
        <Tile label="Arithmetic vs weighted mean" value={`${fmt(m.arithmeticMean, 6)} / ${fmt(m.weightedConstant, 6)}`} unit="v/v" />
        <Tile label="Trend at (1250, 2250)" value={fmt(m.probes.trendProbe, 6)} unit="v/v (hand: 0.3075)" />
        <Tile label="Zone A bulk, block 0 / block 1" value={`${fmt(m.volsA['0'].bulk_m3 / 1e6, 5)} / ${fmt(m.volsA['1'].bulk_m3 / 1e6, 5)}`} unit="10^6 m3" />
        <Tile label="Closure check (blocks vs total)" value={fmt(m.volsA['0'].bulk_m3 + m.volsA['1'].bulk_m3 - m.volsA.total.bulk_m3, 6)} unit="m3 (must be 0)" />
        <Tile label="Cells closure" value={`${m.volsA['0'].cells} + ${m.volsA['1'].cells} = ${m.volsA.total.cells}`} unit="nodes" />
      </TileGrid>

      <Note>
        Block 1 is a flat line at 0.3150 whatever you choose, because deviation carried W2's
        control point across the fault and left W1 as the block's only data. On the block 0 side,
        watch the kriged curve pin itself to W2's point and relax toward the arithmetic mean away
        from it; drop the range to 300 m and the whole far field IS the mean. The nugget never
        moves the value at a well, only how fast the map jumps off it. The closure tile is the
        tier's quality control: the two block volumes must sum to the 45 million cubic metre
        anchor exactly, and they do, node for node.
      </Note>
    </PanelShell>
  );
};

export default PopulationExplorer;
