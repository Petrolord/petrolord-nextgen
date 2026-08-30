import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  WELLS, PROGRAMS, caseOf, placementFor, rateSweep, rateWindow, previousShoeMdOf,
} from './cementingLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Placement explorer: the pump pressure and ECD through the job, the two
// programmes side by side, and the rate window between free fall and the
// fracture limit at the previous shoe.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const WELL_OPTIONS = WELLS.map((w) => ({ value: w, label: w }));
const PROGRAM_OPTIONS = PROGRAMS.map((p) => ({ value: p, label: p === 'neat' ? 'neat (one slurry)' : 'lead and tail' }));
const MODES = [
  { value: 'job', label: 'Through the job' },
  { value: 'compare', label: 'Two programmes' },
  { value: 'window', label: 'The rate window' },
];

const Job = () => {
  const [well, setWell] = useState('slant');
  const [program, setProgram] = useState('lead_tail');
  const [rate, setRate] = useState('');
  const c = caseOf(well);
  const q = rate === '' ? c.pumpRateM3s : Number(rate);
  const r = useMemo(() => {
    if (!(q > 0)) return null;
    try { return placementFor(well, program, { pumpRateM3s: q }); } catch { return null; }
  }, [well, program, q]);
  const rows = useMemo(() => (r ? r.series.map((s) => ({
    pumped: s.pumpedM3,
    pumpMPa: s.pumpPressurePa / 1e6,
    uTubeMPa: s.uTubePa / 1e6,
    ecdPrev: s.ecdPrevShoeKgM3,
    ecdShoe: s.ecdAtShoeKgM3,
  })) : []), [r]);
  if (!r) return <Note>That pump rate does not describe a runnable job.</Note>;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <SelectField label="Programme" value={program} onChange={setProgram} options={PROGRAM_OPTIONS} />
        <NumField label={`Pump rate (m3/s, default ${c.pumpRateM3s})`} value={rate} onChange={setRate} placeholder={String(c.pumpRateM3s)} />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="pumped" type="number" domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'pumped (m3)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="p" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'MPa', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="e" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'ECD (kg/m3)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="p" y={0} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line yAxisId="p" dataKey="uTubeMPa" name="U-tube (MPa)" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="p" dataKey="pumpMPa" name="pump pressure (MPa)" stroke="#fb7185" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line yAxisId="e" dataKey="ecdPrev" name="ECD at previous shoe" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="e" dataKey="ecdShoe" name="ECD at the shoe" stroke="#94a3b8" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="End pump pressure" value={fmt(r.endPumpPressurePa / 1e6, 6)} unit="MPa" />
        <Tile label="Float differential" value={fmt(r.floatDiffPa / 1e6, 6)} unit="MPa" />
        <Tile label="Achieved top of cement" value={fmt(r.achievedTocMd, 3)} unit="m MD" />
        <Tile label="Peak ECD at the previous shoe" value={fmt(r.maxEcdPrevShoeKgM3, 4)} unit="kg/m3" />
        <Tile label="Free fall" value={r.freeFall ? 'yes' : 'no'} />
        <Tile label="Steps in free fall" value={r.series.filter((s) => s.freeFall).length} unit="of 61" />
      </TileGrid>
      {r.warnings.length > 0 && (
        <div className="mt-3 text-xs text-amber-400">
          {r.warnings.map((w) => <p key={w} className="mb-1">{w}</p>)}
        </div>
      )}
      <Note>
        The U-tube value is the annulus head plus friction less the inside head. Where it is
        positive the pumps have to push; where it is NEGATIVE the column falls on its own and the
        surface pressure reads zero. The reported pump pressure is the U-tube clipped at zero, so
        the two lines separate exactly over the free-fall period.
      </Note>
    </>
  );
};

const Compare = () => {
  const [well, setWell] = useState('horizontal');
  const rows = useMemo(() => PROGRAMS.map((p) => ({ program: p, r: placementFor(well, p) })), [well]);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">programme</th><th className="text-right pr-3">end pump (MPa)</th>
              <th className="text-right pr-3">float diff (MPa)</th><th className="text-right pr-3">peak ECD</th>
              <th className="text-right pr-3">achieved TOC</th><th className="text-right">free fall</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ program, r }) => (
              <tr key={program}>
                <td className="pr-3">{program}</td>
                <td className="text-right pr-3">{fmt(r.endPumpPressurePa / 1e6, 4)}</td>
                <td className="text-right pr-3">{fmt(r.floatDiffPa / 1e6, 4)}</td>
                <td className="text-right pr-3">{fmt(r.maxEcdPrevShoeKgM3, 4)}</td>
                <td className="text-right pr-3">{fmt(r.achievedTocMd, 2)}</td>
                <td className={`text-right ${r.freeFall ? 'text-rose-400' : 'text-[#BFFF00]'}`}>{r.freeFall ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Both programmes place the same total slurry and reach the same top of cement. The neat one
        replaces the lighter lead with more of the heavy tail, and that costs pump pressure, float
        differential and peak ECD on both wells. On the horizontal well it also costs a free-fall
        period that the two-slurry design does not have.
      </div>
      <Note>
        A lead slurry is usually presented as a way of saving money on cement. It is also, and more
        importantly, a way of controlling the density of the column you are putting in the annulus,
        and that is what the ECD and the U-tube both respond to.
      </Note>
    </>
  );
};

const Window = () => {
  const [well, setWell] = useState('horizontal');
  const [program, setProgram] = useState('neat');
  const [limit, setLimit] = useState('1700');
  const lim = Number(limit);
  const sweep = useMemo(() => rateSweep(well, program), [well, program]);
  const w = useMemo(() => {
    if (!(lim > 0)) return null;
    try { return rateWindow(well, program, lim); } catch { return null; }
  }, [well, program, lim]);
  const rows = sweep.map((s) => ({
    q: s.pumpRateM3s, ecd: s.maxEcdPrevShoeKgM3, worstMPa: s.worstUTubePa / 1e6,
  }));
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <SelectField label="Programme" value={program} onChange={setProgram} options={PROGRAM_OPTIONS} />
        <NumField label="Fracture limit at the previous shoe (kg/m3)" value={limit} onChange={setLimit} />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="q" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'pump rate (m3/s)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="e" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'peak ECD (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="u" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'worst U-tube (MPa)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {lim > 0 && <ReferenceLine yAxisId="e" y={lim} stroke="#fb7185" strokeDasharray="4 4" />}
            <ReferenceLine yAxisId="u" y={0} stroke="#f59e0b" strokeDasharray="4 4" />
            {w?.minRateNoFreeFallM3s != null && <ReferenceLine yAxisId="e" x={w.minRateNoFreeFallM3s} stroke="#BFFF00" strokeDasharray="4 4" />}
            {w?.maxRateUnderEcdM3s != null && <ReferenceLine yAxisId="e" x={w.maxRateUnderEcdM3s} stroke="#38bdf8" strokeDasharray="4 4" />}
            <Line yAxisId="e" dataKey="ecd" name="peak ECD" stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
            <Line yAxisId="u" dataKey="worstMPa" name="worst U-tube" stroke="#BFFF00" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {w && (
        <>
          <TileGrid>
            <Tile label="Slowest rate with no free fall" value={fmt(w.minRateNoFreeFallM3s, 8)} unit="m3/s" />
            <Tile label="Fastest rate under the limit" value={fmt(w.maxRateUnderEcdM3s, 8)} unit="m3/s" />
            <Tile label="Window width" value={fmt(w.widthM3s, 8)} unit="m3/s" />
            <Tile label="Window" value={w.open ? 'open' : 'closed'} />
            <Tile label="Previous shoe" value={fmt(previousShoeMdOf(well), 0)} unit="m MD" />
            <Tile label="Design rate" value={fmt(caseOf(well).pumpRateM3s, 4)} unit="m3/s" />
          </TileGrid>
          <div className="mt-3 text-xs text-slate-300">
            {w.open
              ? 'The two constraints leave a band of rates that satisfy both. Pump inside it.'
              : 'The two constraints CROSS: there is no rate that both avoids free fall and keeps the ECD under the limit. The programme has to change, not the rate.'}
          </div>
        </>
      )}
      <Note>
        Pumping faster adds friction, which supports the annular column and cures free fall, and
        the same friction raises the equivalent circulating density at the weakest shoe. The two
        constraints therefore pull in opposite directions on one knob, and whether a window exists
        between them is a property of the programme rather than of the driller.
      </Note>
    </>
  );
};

const PlacementExplorer = () => {
  const [mode, setMode] = useState('job');
  return (
    <PanelShell
      title="Placement explorer"
      subtitle="Pump pressure and ECD through the job, two programmes, and the rate window between them"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'job' && <Job />}
        {mode === 'compare' && <Compare />}
        {mode === 'window' && <Window />}
      </div>
    </PanelShell>
  );
};

export default PlacementExplorer;
