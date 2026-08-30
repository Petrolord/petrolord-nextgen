import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter,
} from 'recharts';
import {
  CASES, rheology, rheologyCurve, fitResiduals, pressureSplit, flowSweep, flowElements,
} from './hydraulicsLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Rheology explorer: four dial readings, three models, and the pressure chain
// those models produce.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 4);

const MODES = [
  { value: 'models', label: 'Three models, four readings' },
  { value: 'curve', label: 'Stress against shear rate' },
  { value: 'chain', label: 'The pressure chain' },
];
const CASE_OPTIONS = CASES.map((c) => ({ value: c.id, label: `${c.well} / ${c.mudName}` }));

const Models = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const f = useMemo(() => rheology(id), [id]);
  const res = useMemo(() => fitResiduals(id), [id]);
  return (
    <>
      <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
      <TileGrid>
        <Tile label="Power law n" value={fmt(f.powerLaw.n, 8)} />
        <Tile label="Power law K" value={fmt(f.powerLaw.kPaSn, 8)} unit="Pa.s^n" />
        <Tile label="Bingham PV" value={fmt(f.bingham.pvPaS, 8)} unit="Pa.s" />
        <Tile label="Bingham YP" value={fmt(f.bingham.ypPa, 6)} unit="Pa" />
        <Tile label="Herschel-Bulkley tau_y" value={fmt(f.herschelBulkley.tauYPa, 6)} unit="Pa" />
        <Tile label="Herschel-Bulkley n" value={fmt(f.herschelBulkley.n, 8)} />
      </TileGrid>
      <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Reading</th>
              <th className="text-right p-2">Shear rate (1/s)</th>
              <th className="text-right p-2">Measured (Pa)</th>
              <th className="text-right p-2">Power law</th>
              <th className="text-right p-2">Bingham</th>
              <th className="text-right p-2">Herschel-Bulkley</th>
            </tr>
          </thead>
          <tbody>
            {res.map((r) => (
              <tr key={r.name} className="border-t border-gray-800">
                <td className="p-2 text-white">{r.name}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.gammaDot, 3)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.measuredPa, 5)}</td>
                <td className={`p-2 text-right ${Math.abs(r.powerLawPa - r.measuredPa) < 1e-6 ? 'text-emerald-400' : 'text-gray-400'}`}>{fmt(r.powerLawPa, 5)}</td>
                <td className={`p-2 text-right ${Math.abs(r.binghamPa - r.measuredPa) < 1e-6 ? 'text-emerald-400' : 'text-gray-400'}`}>{fmt(r.binghamPa, 5)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.herschelBulkleyPa, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Green is an exact reproduction. The power law and the Bingham model are fitted to the 600
        and 300 rpm readings only, so they hit those two exactly and miss the 6 and 3 rpm readings,
        which is where a mud actually sits in the annulus. Herschel-Bulkley uses a low-rate reading
        as well and misses all of them by a little instead of two of them by a lot.
      </Note>
    </>
  );
};

const Curve = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const curve = useMemo(() => rheologyCurve(id), [id]);
  return (
    <>
      <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="gammaDot" type="number" scale="log" domain={['auto', 'auto']}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'shear rate (1/s)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'shear stress (Pa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="powerLaw" name="power law" stroke="#38bdf8" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="bingham" name="Bingham" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="herschelBulkley" name="Herschel-Bulkley" stroke="#BFFF00" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The three curves converge at high shear rate, where the pipe is, and separate at low shear
        rate, where the annulus is. A model chosen on how well it fits the 600 and 300 rpm readings
        is being chosen on the part of the range that matters least for annular pressure loss.
      </Note>
    </>
  );
};

const Chain = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [q, setQ] = useState('0.025');
  const sweep = useMemo(() => flowSweep(id), [id]);
  const split = useMemo(() => {
    const v = Number(q);
    if (!Number.isFinite(v) || v <= 0) return null;
    return pressureSplit(id, v);
  }, [id, q]);
  const el = useMemo(() => flowElements(id), [id]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Flow rate (m3/s)" value={q} onChange={setQ} />
      </div>
      {split && (
        <TileGrid>
          <Tile label="Pump pressure" value={MPa(split.pumpPressurePa)} unit="MPa" />
          <Tile label="Inside the pipe" value={MPa(split.pipeDpPa)} unit="MPa" />
          <Tile label="Up the annulus" value={MPa(split.annulusDpPa)} unit="MPa" />
          <Tile label="Across the bit" value={MPa(split.bitDpPa)} unit="MPa" />
          <Tile label="Bit share" value={fmt(split.bitShare * 100, 3)} unit="%" />
          <Tile label="ECD at total depth" value={fmt(split.ecdAtTdKgM3, 4)} unit="kg/m3" />
        </TileGrid>
      )}
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sweep.map((r) => ({ q: r.flowRateM3s, pump: r.pumpPressurePa / 1e6, bit: r.bitShare * 100 }))}
            margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="q" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'flow rate (m3/s)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="l" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis yAxisId="r" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="l" dataKey="pump" name="pump (MPa)" stroke="#BFFF00" strokeWidth={2} isAnimationActive={false} />
            <Line yAxisId="r" dataKey="bit" name="bit share (%)" stroke="#38bdf8" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The flow path is {el.pipeElements.length} elements down the inside and
        {' '}{el.annulusElements.length} back up the annulus, with the bit between them. Pipe and
        annulus losses grow roughly as the flow rate to a power below two; the bit grows as the
        square exactly, so the bit&apos;s SHARE rises with every extra litre per second.
      </Note>
    </>
  );
};

const RheologyExplorer = () => {
  const [mode, setMode] = useState('models');
  return (
    <PanelShell
      title="Rheology and pressure explorer"
      subtitle="Four dial readings, three models, and the pump pressure they produce"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <p className="text-[11px] text-gray-500 mt-2">
        Two wells crossed with two muds, one string, one bit at 0.000461814 m2 of nozzle area, and
        a discharge coefficient of 0.95.
      </p>
      <div className="mt-3">
        {mode === 'models' && <Models />}
        {mode === 'curve' && <Curve />}
        {mode === 'chain' && <Chain />}
      </div>
    </PanelShell>
  );
};

export default RheologyExplorer;
