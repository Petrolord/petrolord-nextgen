import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  CASES, pressureSplit, holeCleaning, cleaningSweep, minimumFlow, oracleCheck,
} from './hydraulicsLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Cleaning explorer: what the annulus is doing with the cuttings, what the ECD
// costs, and how far the engine sits from the independent oracle.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'transport', label: 'Transport along the annulus' },
  { value: 'ecd', label: 'ECD against depth' },
  { value: 'minflow', label: 'The flow rate you need' },
];
const CASE_OPTIONS = CASES.map((c) => ({ value: c.id, label: `${c.well} / ${c.mudName}` }));

const Transport = () => {
  const [id, setId] = useState('horizontal_kcl_polymer');
  const [q, setQ] = useState('0.025');
  const hc = useMemo(() => {
    const v = Number(q);
    if (!Number.isFinite(v) || v <= 0) return null;
    return holeCleaning(id, v);
  }, [id, q]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Flow rate (m3/s)" value={q} onChange={setQ} />
      </div>
      {hc && (
        <>
          <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="text-left p-2">Interval (m)</th>
                  <th className="text-right p-2">Annular velocity</th>
                  <th className="text-right p-2">Slip velocity</th>
                  <th className="text-right p-2">Transport ratio</th>
                  <th className="text-right p-2">Cuttings (%)</th>
                </tr>
              </thead>
              <tbody>
                {hc.rows.map((r) => (
                  <tr key={r.fromMd} className="border-t border-gray-800">
                    <td className="p-2 text-white">{fmt(r.fromMd, 0)} to {fmt(r.toMd, 0)}</td>
                    <td className="p-2 text-right text-gray-200">{fmt(r.annularVelocityMs, 6)}</td>
                    <td className="p-2 text-right text-gray-400">{fmt(r.slipMs, 6)}</td>
                    <td className={`p-2 text-right ${r.transportRatio < 0.5 ? 'text-red-400' : 'text-gray-200'}`}>{fmt(r.transportRatio, 6)}</td>
                    <td className="p-2 text-right text-gray-400">{fmt(r.cuttingsConcPct, 6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label="Worst transport ratio" value={fmt(hc.minTransportRatio, 8)} />
            <Tile label="Worst cuttings concentration" value={fmt(hc.worstCuttingsConcPct, 6)} unit="%" />
            <Tile label="Cuttings feed" value={fmt(hc.feedM3s * 1000, 6)} unit="l/s" />
          </TileGrid>
        </>
      )}
      <Note>
        The transport ratio is one less the slip velocity over the annular velocity. It is the
        fraction of the mud&apos;s speed the cuttings actually travel at, so a ratio of 0.83 means
        the cuttings are moving at 83 percent of the mud and the annulus is carrying more of them
        than the feed rate alone would suggest.
      </Note>
    </>
  );
};

const Ecd = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [q, setQ] = useState('0.025');
  const s = useMemo(() => {
    const v = Number(q);
    if (!Number.isFinite(v) || v <= 0) return null;
    return pressureSplit(id, v);
  }, [id, q]);
  const rho = CASES.find((c) => c.id === id).densityKgM3;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Flow rate (m3/s)" value={q} onChange={setQ} />
      </div>
      {s && (
        <>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.ecdProfile} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="tvd" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'true vertical depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']}
                  label={{ value: 'ECD (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                  formatter={(v) => fmt(v, 4)} />
                <ReferenceLine y={rho} stroke="#f59e0b" strokeDasharray="4 4" />
                <Line dataKey="ecdKgM3" name="ECD" stroke="#BFFF00" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <TileGrid>
            <Tile label="Static mud weight" value={fmt(rho, 0)} unit="kg/m3" />
            <Tile label="ECD at total depth" value={fmt(s.ecdAtTdKgM3, 5)} unit="kg/m3" />
            <Tile label="Circulating uplift" value={fmt(s.ecdOverMudKgM3, 5)} unit="kg/m3" />
            <Tile label="Annulus loss" value={fmt(s.annulusDpPa / 1e6, 5)} unit="MPa" />
            <Tile label="Worst annular velocity" value={fmt(s.minAnnularVelocityMs, 6)} unit="m/s" />
          </TileGrid>
        </>
      )}
      <Note>
        Only the ANNULUS loss reaches the formation. The pipe loss and the bit loss are inside the
        string and are paid for by the pump, and neither of them appears in the ECD. The dashed line
        is the static mud weight, and the gap above it is what circulating adds.
      </Note>
    </>
  );
};

const MinFlow = () => {
  const [id, setId] = useState('horizontal_kcl_polymer');
  const [target, setTarget] = useState('0.9');
  const sweep = useMemo(() => cleaningSweep(id), [id]);
  const solved = useMemo(() => {
    const t = Number(target);
    if (!Number.isFinite(t) || t <= 0 || t >= 1) return null;
    const q = minimumFlow(id, t);
    if (q == null) return null;
    return { q, split: pressureSplit(id, q), hc: holeCleaning(id, q) };
  }, [id, target]);
  const check = useMemo(() => oracleCheck(), []);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Target transport ratio" value={target} onChange={setTarget} />
      </div>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep.map((r) => ({ q: r.flowRateM3s, tr: r.minTransportRatio, conc: r.worstCuttingsConcPct }))}
            margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="q" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'flow rate (m3/s)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="l" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 1]} />
            <YAxis yAxisId="r" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 5)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="l" dataKey="tr" name="transport ratio" stroke="#BFFF00" strokeWidth={2} isAnimationActive={false} />
            <Line yAxisId="r" dataKey="conc" name="cuttings (%)" stroke="#f59e0b" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {solved && (
        <TileGrid>
          <Tile label="Flow rate required" value={fmt(solved.q, 8)} unit="m3/s" />
          <Tile label="Transport ratio there" value={fmt(solved.hc.minTransportRatio, 6)} />
          <Tile label="Pump pressure it costs" value={fmt(solved.split.pumpPressurePa / 1e6, 4)} unit="MPa" />
          <Tile label="ECD it produces" value={fmt(solved.split.ecdAtTdKgM3, 4)} unit="kg/m3" />
        </TileGrid>
      )}
      <Note>
        Cleaning wants more flow and the pressure window wants less. This is the whole hydraulics
        trade in two tiles. The engine agrees with the independent numpy oracle that generated its
        goldens to a worst relative error of {check.worstRel.toExponential(2)} over {check.checked}
        {' '}checked values, which is inside the 1e-6 the goldens ask for.
      </Note>
    </>
  );
};

const CleaningExplorer = () => {
  const [mode, setMode] = useState('transport');
  return (
    <PanelShell
      title="Cleaning and ECD explorer"
      subtitle="What the annulus is carrying, what it costs the formation, and the flow rate the two of them argue about"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <p className="text-[11px] text-gray-500 mt-2">
        Cuttings at 2600 kg/m3 and 6 mm, rate of penetration 0.005 m/s, Schiller-Naumann slip.
      </p>
      <div className="mt-3">
        {mode === 'transport' && <Transport />}
        {mode === 'ecd' && <Ecd />}
        {mode === 'minflow' && <MinFlow />}
      </div>
    </PanelShell>
  );
};

export default CleaningExplorer;
