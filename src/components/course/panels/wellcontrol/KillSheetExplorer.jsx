import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { WELLS, SCENARIOS, sheet, volumes, INFLUX_GAS_MAX_KGM3, INFLUX_LIQUID_MIN_KGM3 } from './wellcontrolLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Kill sheet explorer: the six numbers a driller fills in, the pressure
// schedule they produce, and what the shut-in pressures say about the influx.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const MPa = (v) => fmt(v / 1e6, 5);

const MODES = [
  { value: 'sheet', label: 'The kill sheet' },
  { value: 'schedule', label: 'The pressure schedule' },
  { value: 'influx', label: 'What the influx is' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.id }));
const SCEN_OPTIONS = Object.keys(SCENARIOS).map((k) => ({ value: k, label: k.replace('_', ' ') }));

const Sheet = () => {
  const [id, setId] = useState('horizontal');
  const [scn, setScn] = useState('moderate_gas');
  const s = useMemo(() => sheet(id, scn), [id, scn]);
  const inp = SCENARIOS[scn];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <SelectField label="Scenario" value={scn} onChange={setScn} options={SCEN_OPTIONS} />
      </div>
      <TileGrid>
        <Tile label="Shut-in drill pipe pressure" value={MPa(inp.sidppPa)} unit="MPa" />
        <Tile label="Shut-in casing pressure" value={MPa(inp.sicpPa)} unit="MPa" />
        <Tile label="Pit gain" value={fmt(inp.pitGainM3, 3)} unit="m3" />
        <Tile label="Formation pressure" value={MPa(s.formationPressurePa)} unit="MPa" />
        <Tile label="Kill mud weight" value={fmt(s.killMudDensityKgM3, 6)} unit="kg/m3" />
        <Tile label="Initial circulating pressure" value={MPa(s.icpPa)} unit="MPa" />
        <Tile label="Final circulating pressure" value={MPa(s.fcpPa)} unit="MPa" />
        <Tile label="Strokes to the bit" value={fmt(s.strokesToBit, 4)} />
        <Tile label="Bottoms up" value={fmt(s.bottomsUpStrokes, 4)} />
        <Tile label="Total strokes" value={fmt(s.totalStrokes, 4)} />
      </TileGrid>
      <Note>
        Six inputs and four outputs. The formation pressure is the mud column plus the shut-in drill
        pipe pressure, because the drill pipe is full of mud of known weight and is a manometer. The
        kill mud weight is whatever raises that column to balance it. The initial circulating
        pressure is the slow circulating pressure plus the same shut-in reading, and the final one
        is the slow circulating pressure scaled by the mud weight ratio.
      </Note>
    </>
  );
};

const Schedule = () => {
  const [id, setId] = useState('horizontal');
  const [scn, setScn] = useState('moderate_gas');
  const [steps, setSteps] = useState('10');
  const s = useMemo(() => {
    const n = Number(steps);
    return sheet(id, scn, { stepCount: Number.isFinite(n) && n >= 1 && n <= 50 ? Math.round(n) : 10 });
  }, [id, scn, steps]);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <SelectField label="Scenario" value={scn} onChange={setScn} options={SCEN_OPTIONS} />
        <NumField label="Steps" value={steps} onChange={setSteps} />
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={s.schedule.map((r) => ({ strokes: r.strokes, p: r.pressurePa / 1e6 }))}
            margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="strokes" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'strokes', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']}
              label={{ value: 'drill pipe pressure (MPa)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 5)} />
            <ReferenceLine y={s.fcpPa / 1e6} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line dataKey="p" stroke="#BFFF00" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto max-h-48">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400 sticky top-0">
            <tr><th className="text-right p-2">Strokes</th><th className="text-right p-2">Drill pipe pressure (MPa)</th></tr>
          </thead>
          <tbody>
            {s.schedule.map((r) => (
              <tr key={r.strokes} className="border-t border-gray-800">
                <td className="p-2 text-right text-gray-200">{fmt(r.strokes, 4)}</td>
                <td className="p-2 text-right text-white">{MPa(r.pressurePa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The schedule is a straight line from the initial to the final circulating pressure over the
        strokes it takes to pump kill mud to the bit. It is a line because the kill mud is
        displacing the old mud in the string at a constant rate, so the hydrostatic head inside the
        string grows linearly with strokes. After the bit the pressure is held at the final value.
      </Note>
    </>
  );
};

const Influx = () => {
  const [id, setId] = useState('horizontal');
  const [sidpp, setSidpp] = useState('2.0');
  const [sicp, setSicp] = useState('2.9');
  const [pit, setPit] = useState('3.0');
  const s = useMemo(() => {
    const a = Number(sidpp) * 1e6;
    const b = Number(sicp) * 1e6;
    const p = Number(pit);
    if (![a, b, p].every(Number.isFinite) || a < 0 || p <= 0) return null;
    try { return sheet(id, { sidppPa: a, sicpPa: b, pitGainM3: p }); } catch { return null; }
  }, [id, sidpp, sicp, pit]);
  const v = volumes(id);
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <NumField label="SIDPP (MPa)" value={sidpp} onChange={setSidpp} />
        <NumField label="SICP (MPa)" value={sicp} onChange={setSicp} />
        <NumField label="Pit gain (m3)" value={pit} onChange={setPit} />
      </div>
      {s && s.influx && (
        <TileGrid>
          <Tile label="Influx height" value={fmt(s.influx.heightM, 6)} unit="m" />
          <Tile label="Influx density" value={fmt(s.influx.densityKgM3, 6)} unit="kg/m3" />
          <Tile label="Classification" value={s.influx.kind} />
          <Tile label="Gas threshold" value={String(INFLUX_GAS_MAX_KGM3)} unit="kg/m3" />
          <Tile label="Liquid threshold" value={String(INFLUX_LIQUID_MIN_KGM3)} unit="kg/m3" />
          <Tile label="Annulus capacity at the bit" value={fmt(v.capBitM2, 9)} unit="m2" />
        </TileGrid>
      )}
      {s && s.warnings?.length > 0 && (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          {s.warnings.map((w) => <p key={w} className="text-[11px] text-amber-200/90 mb-1">{w}</p>)}
        </div>
      )}
      <Note>
        The influx density is not measured. It is inferred: the casing pressure exceeds the drill
        pipe pressure by exactly the weight the influx is NOT providing, so the difference divided
        by the influx height gives the density deficit. That makes the answer proportional to the
        assumed height, which is the pit gain divided by the annulus capacity at the bit, and the
        pit gain is a measurement with its own error.
      </Note>
    </>
  );
};

const KillSheetExplorer = () => {
  const [mode, setMode] = useState('sheet');
  return (
    <PanelShell
      title="Kill sheet explorer"
      subtitle="Six numbers a driller writes down, the pressures they imply, and what they say about the influx"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <p className="text-[11px] text-gray-500 mt-2">
        Mud 1440 kg/m3, pump 0.012 m3/stroke, slow circulating rate pressure 4.5 MPa.
      </p>
      <div className="mt-3">
        {mode === 'sheet' && <Sheet />}
        {mode === 'schedule' && <Schedule />}
        {mode === 'influx' && <Influx />}
      </div>
    </PanelShell>
  );
};

export default KillSheetExplorer;
