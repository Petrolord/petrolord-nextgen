import React, { useMemo, useState } from 'react';
import {
  KRIGE_PARAMS, POPULATION_METHODS, PROBE_DEFAULT, PROFILE_Y_DEFAULT, FAULT_POLYGON, MODEL_SPEC,
  computePopulation, parsePolygon, polygonText,
} from '@/lib/earthmodelTeaching';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Population explorer: zone-A porosity populated per fault block, drawn
// along the model row through y = 2200 because that row crosses the fault
// AND carries W2's zone-A control point. The method and the variogram's two
// assumed numbers are the controls, because they are the assumptions; the
// discontinuity at the fault is the shape the tier is about.
const W = 560;
const H = 300;
const PAD = { left: 62, top: 18, right: 18, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

// It opens on the golden fault polygon and variogram, the teaching case.
// The polygon, the variogram's two assumed numbers, the profile row and the
// probe point are all typed inputs, so a case of your own (the capstone
// states one) is worked by typing it in; nothing here preloads it.
const PopulationExplorer = () => {
  const [method, setMethod] = useState('krige');
  const [nugget, setNugget] = useState(String(KRIGE_PARAMS.nugget));
  const [range, setRange] = useState(String(KRIGE_PARAMS.range));
  const [probeX, setProbeX] = useState(String(PROBE_DEFAULT.x));
  const [probeY, setProbeY] = useState(String(PROBE_DEFAULT.y));
  const [poly, setPoly] = useState(polygonText(FAULT_POLYGON));
  const [rowY, setRowY] = useState(String(PROFILE_Y_DEFAULT));

  const m = useMemo(() => {
    const verts = parsePolygon(poly);
    const ng = Number(nugget);
    const rg = Number(range);
    const ry = Number(rowY);
    if (!verts || !Number.isFinite(ng) || ng < 0 || !(rg > 0) || !Number.isFinite(ry)) return null;
    try {
      return computePopulation(method, ng, rg, verts, ry);
    } catch {
      return null;
    }
  }, [method, nugget, range, poly, rowY]);

  const controls = (
    <div className="space-y-2">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <SelectField label="Method" value={method} onChange={setMethod}
          options={POPULATION_METHODS.map((k) => [k, k === 'krige' ? 'Simple kriging' : (k === 'trend' ? 'Plane trend' : 'Constant (weighted mean)')])} />
        <NumField label="Nugget (assumed)" value={nugget} onChange={setNugget} />
        <NumField label="Range, m (assumed)" value={range} onChange={setRange} />
        <NumField label="Profile row y (m)" value={rowY} onChange={setRowY} />
        <NumField label="Probe x (m)" value={probeX} onChange={setProbeX} />
        <NumField label="Probe y (m)" value={probeY} onChange={setProbeY} />
      </div>
      <div>
        <label className="text-gray-400 text-xs mb-1 block" htmlFor="em-fault-poly">Fault polygon, block 1 inside (x,y; x,y; ...)</label>
        <input id="em-fault-poly" type="text" value={poly} onChange={(e) => setPoly(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2" />
      </div>
    </div>
  );

  if (!m) {
    return (
      <PanelShell title="Population explorer" subtitle="Type a fault polygon, a variogram and a profile row.">
        {controls}
        <Note>The polygon needs at least three x,y vertices separated by semicolons; the nugget must be zero or more and the range positive.</Note>
      </PanelShell>
    );
  }

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
  const crossX = m.jump ? (m.jump.xBlock0 + m.jump.xBlock1) / 2 : null;
  const faultX = crossX != null ? sx(crossX) : null;
  const jump = m.jump ? m.jump.value : NaN;
  const px = Number(probeX);
  const py = Number(probeY);
  const probeOk = probeX.trim() !== '' && probeY.trim() !== '' && Number.isFinite(px) && Number.isFinite(py);
  const probe = probeOk && method === 'krige' ? m.krigeAt(px, py) : NaN;
  const trendProbe = probeOk ? m.trend.at(px, py) : NaN;

  return (
    <PanelShell title="Population explorer"
      subtitle={`Zone-A porosity along the model row at y = ${m.profileY}, populated per fault block from the zone-A control points (weight = MD interval). ${crossX != null ? `The fault crosses this row between x = ${m.jump.xBlock1} and x = ${m.jump.xBlock0}.` : 'The fault does not cross this row.'} It opens on the golden fault and variogram.`}>
      {controls}

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Porosity along the row through y equals ${m.profileY}`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
          {faultX != null && (
            <g>
              <line x1={faultX} y1={PAD.top} x2={faultX} y2={H - PAD.bottom} stroke="#F97316" strokeDasharray="4 3" />
              <text x={faultX + 4} y={PAD.top + 12} fill="#F97316" fontSize="9">fault</text>
            </g>
          )}
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
        <Tile label="Census (block 0 / block 1)" value={`${m.census['0'] || 0} / ${m.census['1'] || 0}`} unit={`of ${MODEL_SPEC.nx * MODEL_SPEC.ny} nodes`} />
        <Tile label="Zone A phi, block 0 (weighted)" value={fmt(m.phiBlock0, 6)} unit="v/v" />
        <Tile label="Zone A phi, block 1 (weighted)" value={fmt(m.phiBlock1, 6)} unit={`v/v (${m.byBlock[1].map((p) => p.well).join(', ') || 'no wells'})`} />
        <Tile label="Jump across the fault on this row" value={fmt(jump, 6)} unit="v/v (block 0 minus block 1)" />
        <Tile label="Method used per block" value={m.provenance.map((p) => `b${p.block}:${p.methodUsed}${p.fellBack ? '*' : ''}`).join(' ')} unit="* = fell back" />
        <Tile label="Kriged at W1 (1100, 2100)" value={fmt(m.probes.krigeAtW1, 4)} unit="v/v (W1 is 0.3150)" />
        <Tile label="Kriged far from all wells" value={fmt(m.probes.far, 10)} unit="v/v" />
        <Tile label={probeOk ? `Kriged at a probe point (${px}, ${py})` : 'Kriged at a probe point'}
          value={fmt(probe, 6)} unit={method === 'krige' ? 'v/v' : 'v/v (simple kriging only)'} />
        <Tile label="Arithmetic vs weighted mean" value={`${fmt(m.arithmeticMean, 6)} / ${fmt(m.weightedConstant, 6)}`} unit="v/v" />
        <Tile label="Trend at (1250, 2250)" value={fmt(m.probes.trendProbe, 6)} unit="v/v (hand: 0.3075)" />
        <Tile label={probeOk ? `Trend at the probe point (${px}, ${py})` : 'Trend at the probe point'} value={fmt(trendProbe, 6)} unit="v/v" />
        <Tile label="Zone A bulk, block 0 / block 1" value={`${fmt((m.volsA['0'] || { bulk_m3: 0 }).bulk_m3 / 1e6, 5)} / ${fmt((m.volsA['1'] || { bulk_m3: 0 }).bulk_m3 / 1e6, 5)}`} unit="10^6 m3" />
        <Tile label="Closure check (blocks vs total)" value={fmt((m.volsA['0'] || { bulk_m3: 0 }).bulk_m3 + (m.volsA['1'] || { bulk_m3: 0 }).bulk_m3 - m.volsA.total.bulk_m3, 6)} unit="m3 (must be 0)" />
        <Tile label="Cells closure" value={`${(m.volsA['0'] || { cells: 0 }).cells} + ${(m.volsA['1'] || { cells: 0 }).cells} = ${m.volsA.total.cells}`} unit="nodes" />
      </TileGrid>

      <Note>
        On the golden fault, block 1 is a flat line at 0.3150 whatever you choose, because deviation carried W2's
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
