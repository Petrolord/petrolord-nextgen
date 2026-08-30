import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { WELLS, caseOf, volumesFor, clearances, previousShoeMdOf } from './cementingLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Volume explorer: the annulus capacity rows, what the excess factor does to
// them, and the four volumes a cement job is ordered from.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const WELL_OPTIONS = WELLS.map((w) => ({ value: w, label: w }));
const MODES = [
  { value: 'volumes', label: 'The volumes' },
  { value: 'rows', label: 'Capacity rows' },
  { value: 'excess', label: 'Excess sweep' },
];

const Volumes = () => {
  const [well, setWell] = useState('slant');
  const [toc, setToc] = useState('');
  const [excess, setExcess] = useState('');
  const c = caseOf(well);
  const tocMd = toc === '' ? c.tocMd : Number(toc);
  const ex = excess === '' ? c.excessOpenHolePct : Number(excess);
  const v = useMemo(() => {
    try { return volumesFor(well, { tocMd, excessOpenHolePct: ex }); } catch { return null; }
  }, [well, tocMd, ex]);
  if (!v) return <Note>That top of cement or excess does not describe a runnable job.</Note>;
  const bars = [
    { name: 'spacer', m3: v.spacerVolM3 },
    { name: 'lead', m3: v.leadM3 },
    { name: 'tail', m3: v.tailM3 },
    { name: 'shoe track', m3: v.shoeTrackM3 },
    { name: 'displacement', m3: v.displacementM3 },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <NumField label={`Top of cement (m MD, default ${c.tocMd})`} value={toc} onChange={setToc} placeholder={String(c.tocMd)} />
        <NumField label={`Open hole excess (pct, default ${c.excessOpenHolePct})`} value={excess} onChange={setExcess} placeholder={String(c.excessOpenHolePct)} />
      </div>
      <TileGrid>
        <Tile label="Annular slurry" value={fmt(v.annularSlurryM3, 6)} unit="m3" />
        <Tile label="Shoe track" value={fmt(v.shoeTrackM3, 6)} unit="m3" />
        <Tile label="Total slurry" value={fmt(v.slurryM3, 6)} unit="m3" />
        <Tile label="Lead" value={fmt(v.leadM3, 6)} unit="m3" />
        <Tile label="Tail" value={fmt(v.tailM3, 6)} unit="m3" />
        <Tile label="Displacement" value={fmt(v.displacementM3, 6)} unit="m3" />
        <Tile label="Total pumped" value={fmt(v.totalPumpedM3, 6)} unit="m3" />
        <Tile label="Sacks" value={fmt(v.sacks, 3)} />
        <Tile label="Job time" value={fmt(v.jobTimeS, 3)} unit="s" />
        <Tile label="Inside capacity" value={fmt(v.capInsideM2 * 1e4, 4)} unit="cm2/m" />
        <Tile label="TVD at the shoe" value={fmt(v.tvdShoeM, 3)} unit="m" />
        <Tile label="TVD at the top of cement" value={fmt(v.tvdTocM, 3)} unit="m" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'cubic metres', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="m3" name="volume" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Every one of these is a cylinder volume. The annular slurry is the capacity between the top
        of cement and the shoe, the shoe track is the casing bore between the float collar and the
        shoe, and the displacement is the casing bore from surface down to the float collar. Nothing
        here knows anything about cement chemistry.
      </Note>
    </>
  );
};

const Rows = () => {
  const [well, setWell] = useState('slant');
  const [excess, setExcess] = useState('');
  const c = caseOf(well);
  const ex = excess === '' ? c.excessOpenHolePct : Number(excess);
  const v = useMemo(() => {
    try { return volumesFor(well, { excessOpenHolePct: ex }); } catch { return null; }
  }, [well, ex]);
  const cl = useMemo(() => {
    try { return clearances(well, { excessOpenHolePct: ex }); } catch { return null; }
  }, [well, ex]);
  if (!v || !cl) return <Note>That excess does not describe a runnable job.</Note>;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <NumField label={`Open hole excess (pct, default ${c.excessOpenHolePct})`} value={excess} onChange={setExcess} placeholder={String(c.excessOpenHolePct)} />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">from (m MD)</th><th className="text-left pr-3">to</th>
              <th className="text-right pr-3">capacity (m2)</th><th className="text-right pr-3">effective bore (m)</th>
              <th className="text-right pr-3">volume (m3)</th><th className="text-right">kind</th>
            </tr>
          </thead>
          <tbody>
            {v.annulusRows.map((r) => (
              <tr key={r.fromMd}>
                <td className="pr-3">{fmt(r.fromMd, 1)}</td>
                <td className="pr-3">{fmt(r.toMd, 1)}</td>
                <td className="text-right pr-3">{fmt(r.capM2, 9)}</td>
                <td className="text-right pr-3">{fmt(r.boreIdEffM, 9)}</td>
                <td className="text-right pr-3">{fmt(r.capM2 * (r.toMd - r.fromMd), 6)}</td>
                <td className="text-right">{r.openHole ? 'open hole' : 'cased'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Previous shoe" value={fmt(previousShoeMdOf(well), 0)} unit="m MD" />
        <Tile label="Nominal open hole" value={fmt(cl.nominalBoreM, 6)} unit="m" />
        <Tile label="Effective open hole" value={fmt(cl.effectiveBoreM, 6)} unit="m" />
        <Tile label="Nominal clearance" value={fmt(cl.nominalClearanceM * 1000, 4)} unit="mm" />
        <Tile label="Effective clearance" value={fmt(cl.effectiveClearanceM * 1000, 4)} unit="mm" />
        <Tile label="Casing OD" value={fmt(c.casing.odM, 6)} unit="m" />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        The rows are cut at the section boundaries and at the shoe, and nowhere else. Only the OPEN
        HOLE row is inflated by the excess, and the effective bore is back-solved from the inflated
        capacity rather than assumed. At the published excess the washed-out open hole is WIDER than
        the cased annulus above it, and at zero excess it is narrower.
      </div>
      <Note>
        Two clearances live in this course and they are not the same number. The volume side uses
        the washed-out one, because that is how much cement the hole swallows. The centralization
        side uses the NOMINAL one, because a centralizer is sized to the bit.
      </Note>
    </>
  );
};

const Excess = () => {
  const [well, setWell] = useState('slant');
  const data = useMemo(() => [0, 5, 10, 15, 20, 25, 30, 40, 50].map((ex) => {
    const v = volumesFor(well, { excessOpenHolePct: ex });
    return { excess: ex, slurry: v.slurryM3, sacks: v.sacks };
  }), [well]);
  const base = data[0];
  const top = data.at(-1);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="excess" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'open hole excess (pct)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'slurry (m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="slurry" name="slurry volume" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Slurry at zero excess" value={fmt(base.slurry, 6)} unit="m3" />
        <Tile label="Slurry at fifty percent" value={fmt(top.slurry, 6)} unit="m3" />
        <Tile label="Sacks at zero" value={fmt(base.sacks, 3)} />
        <Tile label="Sacks at fifty percent" value={fmt(top.sacks, 3)} />
        <Tile label="Extra sacks" value={fmt(top.sacks - base.sacks, 3)} />
        <Tile label="Ratio" value={fmt(top.slurry / base.slurry, 6)} />
      </TileGrid>
      <Note>
        The excess is a straight multiplier on the open hole capacity, so the slurry volume is
        linear in it. It is also the least defensible number on the sheet: nobody measures the
        washout before the job, and a caliper run afterwards is the only way to find out what the
        number should have been. Getting it wrong low leaves the top of cement short.
      </Note>
    </>
  );
};

const VolumeExplorer = () => {
  const [mode, setMode] = useState('volumes');
  return (
    <PanelShell
      title="Cement volume explorer"
      subtitle="Capacity rows, open hole excess, and the four volumes a job is ordered from"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'volumes' && <Volumes />}
        {mode === 'rows' && <Rows />}
        {mode === 'excess' && <Excess />}
      </div>
    </PanelShell>
  );
};

export default VolumeExplorer;
