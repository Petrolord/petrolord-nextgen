import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  CASES, surgeSwab, tripSweep, closedOverOpen, speedLimit, pressureSplit, CLINGING_CONSTANT,
} from './hydraulicsLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Surge explorer: what moving the string does to the formation, and the window
// between the two pressures it has to stay inside.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'sweep', label: 'Speed against pressure' },
  { value: 'closedopen', label: 'Closed string and open' },
  { value: 'window', label: 'The window and the speed limit' },
];
const CASE_OPTIONS = CASES.map((c) => ({ value: c.id, label: `${c.well} / ${c.mudName}` }));

const Sweep = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [mode, setMode] = useState('closed');
  const sw = useMemo(() => tripSweep(id, [0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5], mode), [id, mode]);
  const rho = CASES.find((c) => c.id === id).densityKgM3;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <SelectField label="String" value={mode} onChange={setMode}
          options={[{ value: 'closed', label: 'closed (float or plugged)' }, { value: 'open', label: 'open (flowing through)' }]} />
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sw} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="tripSpeedMs" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'trip speed (m/s)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']}
              label={{ value: 'EMW (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={rho} stroke="#94a3b8" strokeDasharray="4 4" />
            <Line dataKey="surgeEmwKgM3" name="surge, running in" stroke="#ef4444" strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="swabEmwKgM3" name="swab, pulling out" stroke="#38bdf8" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-right p-2">Speed (m/s)</th>
              <th className="text-right p-2">Pressure (MPa)</th>
              <th className="text-right p-2">Surge EMW</th>
              <th className="text-right p-2">Swab EMW</th>
            </tr>
          </thead>
          <tbody>
            {sw.map((r) => (
              <tr key={r.tripSpeedMs} className="border-t border-gray-800">
                <td className="p-2 text-right text-white">{fmt(r.tripSpeedMs, 2)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.dpPa / 1e6, 6)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.surgeEmwKgM3, 4)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.swabEmwKgM3, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Surge and swab are symmetric about the static mud weight: the same pressure, applied with
        opposite sign. Doubling the speed does NOT double the pressure, because the annular flow is
        partly turbulent and the loss grows as a power below two.
      </Note>
    </>
  );
};

const ClosedOpen = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [v, setV] = useState('0.5');
  const r = useMemo(() => {
    const s = Number(v);
    if (!Number.isFinite(s) || s < 0) return null;
    return {
      closed: surgeSwab(id, s, 'closed'),
      open: surgeSwab(id, s, 'open'),
      ratio: closedOverOpen(id, s),
    };
  }, [id, v]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Trip speed (m/s)" value={v} onChange={setV} />
      </div>
      {r && (
        <TileGrid>
          <Tile label="Closed string pressure" value={fmt(r.closed.dpPa / 1e6, 6)} unit="MPa" />
          <Tile label="Open string pressure" value={fmt(r.open.dpPa / 1e6, 6)} unit="MPa" />
          <Tile label="Closed over open" value={fmt(r.ratio, 8)} />
          <Tile label="Closed surge EMW" value={fmt(r.closed.surgeEmwKgM3, 4)} unit="kg/m3" />
          <Tile label="Open surge EMW" value={fmt(r.open.surgeEmwKgM3, 4)} unit="kg/m3" />
          <Tile label="Clinging constant" value={String(CLINGING_CONSTANT)} />
        </TileGrid>
      )}
      <Note>
        A closed string displaces its whole outside area. An open string displaces only its steel,
        because mud flows up the inside as it goes down. That is the entire difference, and it is
        why running casing with a float, or a plugged bit, is the worst surge case on a well.
        The clinging constant adds 0.45 of the trip speed on top, for the mud dragged along by the
        pipe wall.
      </Note>
    </>
  );
};

const Window = () => {
  const [id, setId] = useState('slant_kcl_polymer');
  const [frac, setFrac] = useState('1520');
  const [pore, setPore] = useState('1380');
  const rho = CASES.find((c) => c.id === id).densityKgM3;
  const solved = useMemo(() => {
    const f = Number(frac);
    const p = Number(pore);
    if (!Number.isFinite(f) || !Number.isFinite(p)) return null;
    const vClosed = speedLimit(id, { fracEmwKgM3: f, poreEmwKgM3: p, mode: 'closed' });
    const vOpen = speedLimit(id, { fracEmwKgM3: f, poreEmwKgM3: p, mode: 'open' });
    return { vClosed, vOpen, at: surgeSwab(id, vClosed, 'closed'), circ: pressureSplit(id, 0.025) };
  }, [id, frac, pore]);
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Case" value={id} onChange={setId} options={CASE_OPTIONS} />
        <NumField label="Fracture EMW (kg/m3)" value={frac} onChange={setFrac} />
        <NumField label="Pore EMW (kg/m3)" value={pore} onChange={setPore} />
      </div>
      {solved && (
        <TileGrid>
          <Tile label="Static mud weight" value={fmt(rho, 0)} unit="kg/m3" />
          <Tile label="ECD while circulating" value={fmt(solved.circ.ecdAtTdKgM3, 4)} unit="kg/m3" />
          <Tile label="Speed limit, closed string" value={fmt(solved.vClosed, 6)} unit="m/s" />
          <Tile label="Speed limit, open string" value={fmt(solved.vOpen, 6)} unit="m/s" />
          <Tile label="Surge at that speed" value={fmt(solved.at.surgeEmwKgM3, 4)} unit="kg/m3" />
          <Tile label="Swab at that speed" value={fmt(solved.at.swabEmwKgM3, 4)} unit="kg/m3" />
        </TileGrid>
      )}
      <Note>
        Four pressures have to fit inside one window: the static mud weight, the ECD while
        circulating, the surge while running in, and the swab while pulling out. The mud weight is
        chosen to sit between pore and fracture, and the other three then have to fit around it.
        On a narrow-margin well the speed limit is what the driller is actually managing.
      </Note>
    </>
  );
};

const SurgeExplorer = () => {
  const [mode, setMode] = useState('sweep');
  return (
    <PanelShell
      title="Surge and swab explorer"
      subtitle="What moving the string does to the formation, and the window all four pressures share"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'sweep' && <Sweep />}
        {mode === 'closedopen' && <ClosedOpen />}
        {mode === 'window' && <Window />}
      </div>
    </PanelShell>
  );
};

export default SurgeExplorer;
