import React, { useMemo, useState } from 'react';
import {
  layerSweep, forecast, evAtFirstBreakthrough, LAYERS, LAYER_DESIGN, ELEMENT,
} from './floodLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Design explorer: the two Expert engines side by side. Layers mode runs the
// Dykstra-Parsons and Stiles stage tables on the planted column; forecast mode
// runs the five-spot rate-time march. The EV toggle is the link between them.

const W = 640;
const H = 300;
const PAD = { left: 52, top: 14, right: 46, bottom: 34 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const RangeField = ({ label, value, min, max, step, onChange }) => (
  <div>
    <p className="text-gray-400 text-xs mb-1">
      {label}: <span className="text-white">{value}</span>
    </p>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#BFFF00]"
    />
  </div>
);

const DesignExplorer = () => {
  const [mode, setMode] = useState('layers');
  const [M, setM] = useState(LAYER_DESIGN.mobility_ratio);
  const [iw, setIw] = useState(ELEMENT.iw_design_rb_d);
  const [useEv, setUseEv] = useState(true);
  const [sgi, setSgi] = useState(0);

  const out = useMemo(() => {
    try {
      const sweep = layerSweep({ M });
      const EV = useEv ? evAtFirstBreakthrough(M) : 1;
      const f = forecast({ iw, EV, Sgi: sgi });
      return { sweep, f, EV };
    } catch (e) {
      return { error: e.message };
    }
  }, [M, iw, useEv, sgi]);

  if (out.error) return <PanelShell title="Design explorer"><Note>Engine error: {out.error}</Note></PanelShell>;
  const { sweep, f, EV } = out;

  const maxK = Math.max(...LAYERS.map((l) => l.k_md));
  const totalH = LAYER_DESIGN.net_pay_ft;
  const layersView = (() => {
    let acc = 0;
    return LAYERS.map((l) => {
      const top = acc;
      acc += l.h_ft;
      return { ...l, top, bottom: acc };
    });
  })();

  const series = f.series;
  const tMax = series.length ? series[series.length - 1].t_days : 1;
  const qMax = Math.max(1, ...series.map((s) => Math.max(s.qo_stbd, s.qw_stbd)));
  const fx = (t) => PAD.left + (t / tMax) * (W - PAD.left - PAD.right);
  const fy = (q) => H - PAD.bottom - (q / qMax) * (H - PAD.top - PAD.bottom);
  const fline = (key) => series.map((s, i) => `${i ? 'L' : 'M'}${fx(s.t_days).toFixed(1)},${fy(s[key]).toFixed(1)}`).join(' ');

  return (
    <PanelShell
      title="Design explorer"
      subtitle="Vertical sweep from the layer column, areal sweep and rate-time from the five-spot forecast. The vertical sweep the forecast borrows is the coverage at the first layer breakthrough."
    >
      <div className="grid gap-4 sm:grid-cols-4 items-end">
        <div>
          <p className="text-gray-400 text-xs mb-1">Mode</p>
          <select
            value={mode} onChange={(e) => setMode(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md text-white text-xs px-2 py-1.5"
          >
            <option value="layers">Layered sweep</option>
            <option value="forecast">Pattern forecast</option>
          </select>
        </div>
        <RangeField label="Mobility ratio M" value={M} min={0.5} max={5} step={0.1} onChange={setM} />
        <RangeField label="Injection rate (rb/d)" value={iw} min={500} max={4000} step={100} onChange={setIw} />
        <RangeField label="Initial free gas Sgi" value={sgi} min={0} max={0.1} step={0.01} onChange={setSgi} />
      </div>

      <button
        type="button" onClick={() => setUseEv((v) => !v)}
        className={`mt-3 px-3 py-1.5 rounded-md border text-xs ${useEv ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
      >
        {useEv ? `EV from the layer column (${fmt(EV, 4)})` : 'EV = 1 (no vertical sweep penalty)'}
      </button>

      {mode === 'layers' ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700 mt-3">
          {layersView.map((l) => {
            const yTop = PAD.top + (l.top / totalH) * (H - PAD.top - PAD.bottom);
            const hgt = (l.h_ft / totalH) * (H - PAD.top - PAD.bottom);
            const wdt = (l.k_md / maxK) * (W - PAD.left - PAD.right);
            return (
              <g key={l.name}>
                <rect x={PAD.left} y={yTop} width={wdt} height={Math.max(1, hgt - 2)} fill="#38BDF8" opacity="0.55" />
                <text x={PAD.left - 6} y={yTop + hgt / 2 + 4} textAnchor="end" fill="#94A3B8" fontSize="10">{l.name}</text>
                <text x={PAD.left + wdt + 6} y={yTop + hgt / 2 + 4} fill="#E2E8F0" fontSize="10">
                  {fmt(l.k_md, 1)} md, {l.h_ft} ft
                </text>
              </g>
            );
          })}
          <text x={PAD.left} y={H - 10} fill="#94A3B8" fontSize="10">bar length is permeability, bar height is thickness, order is depth</text>
        </svg>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700 mt-3">
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <g key={frac}>
              <line x1={PAD.left} y1={fy(qMax * frac)} x2={W - PAD.right} y2={fy(qMax * frac)} stroke="#334155" strokeWidth="1" />
              <text x={PAD.left - 6} y={fy(qMax * frac) + 4} textAnchor="end" fill="#94A3B8" fontSize="10">{fmt(qMax * frac, 0)}</text>
            </g>
          ))}
          <path d={fline('qo_stbd')} fill="none" stroke="#BFFF00" strokeWidth="2" />
          <path d={fline('qw_stbd')} fill="none" stroke="#38BDF8" strokeWidth="2" />
          {f.summary.breakthrough_days != null && (
            <line
              x1={fx(f.summary.breakthrough_days)} y1={PAD.top}
              x2={fx(f.summary.breakthrough_days)} y2={H - PAD.bottom}
              stroke="#F472B6" strokeWidth="1.5" strokeDasharray="4 3"
            />
          )}
          <text x={PAD.left} y={H - 10} fill="#94A3B8" fontSize="10">0 d</text>
          <text x={W - PAD.right} y={H - 10} textAnchor="end" fill="#94A3B8" fontSize="10">{fmt(tMax, 0)} d</text>
          <text x={W - PAD.right + 4} y={PAD.top + 10} textAnchor="end" fill="#BFFF00" fontSize="10">oil</text>
          <text x={W - PAD.right + 4} y={PAD.top + 24} textAnchor="end" fill="#38BDF8" fontSize="10">water</text>
        </svg>
      )}

      {mode === 'layers' ? (
        <TileGrid>
          <Tile label="Permeability variation V" value={fmt(sweep.V.V, 6)} unit="-" />
          <Tile label="sigma of ln k" value={fmt(sweep.V.sigma, 6)} unit="-" />
          <Tile label="k50" value={fmt(sweep.V.k50, 4)} unit="md" />
          <Tile label="Stiles capacity ratio A" value={fmt(sweep.A, 6)} unit="-" />
          <Tile label="DP coverage at 1st BT" value={fmt(sweep.dykstraParsons[0].coverage, 6)} unit="fraction" />
          <Tile label="DP WOR at 1st BT" value={fmt(sweep.dykstraParsons[0].WOR, 4)} unit="rb/rb" />
          <Tile label="Stiles coverage at 1st BT" value={fmt(sweep.stiles[0].coverage, 6)} unit="fraction" />
          <Tile label="Stiles water cut at 1st BT" value={fmt(sweep.stiles[0].waterCut, 6)} unit="fraction" />
          <Tile label="Coverage at 3rd BT" value={fmt(sweep.dykstraParsons[2].coverage, 6)} unit="fraction" />
          <Tile label="Net pay" value={sweep.netPayFt} unit="ft" />
        </TileGrid>
      ) : (
        <TileGrid>
          <Tile label="Mobility ratio M" value={fmt(f.summary.M, 4)} unit="-" />
          <Tile label="Areal sweep at BT" value={fmt(f.summary.EAbt, 6)} unit="fraction" />
          <Tile label="Water to breakthrough" value={fmt(f.summary.WiBT_bbl, 0)} unit="rb" />
          <Tile label="Breakthrough" value={f.summary.breakthrough_days == null ? 'none in horizon' : fmt(f.summary.breakthrough_days, 2)} unit={f.summary.breakthrough_days == null ? '' : 'days'} />
          <Tile label="Np at stop" value={fmt(f.summary.Np_stb, 0)} unit="stb" />
          <Tile label="RF of flooded OOIP" value={fmt(f.summary.recoveryFactorOfFloodedOOIP, 6)} unit="fraction" />
          <Tile label="Final WOR" value={fmt(f.summary.finalWOR, 3)} unit="stb/stb" />
          <Tile label="Elapsed" value={fmt(f.summary.elapsed_days, 0)} unit="days" />
          <Tile label="Stopped by" value={f.summary.stopped} unit="" />
          <Tile label="Flooded OOIP" value={fmt(f.summary.ooip_flooded_stb, 0)} unit="stb" />
        </TileGrid>
      )}

      {f.warnings.length > 0 && <Note>{f.warnings.join(' ')}</Note>}
      <Note>
        The layer column is drawn in DEPTH order and the engine floods it in PERMEABILITY order, so the second
        bar from the top breaks through first. Mobility ratio moves both halves of the answer: it changes the
        Dykstra-Parsons front positions and it changes the areal sweep at breakthrough.
      </Note>
    </PanelShell>
  );
};

export default DesignExplorer;
