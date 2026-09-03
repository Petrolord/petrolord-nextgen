import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  IN, UM, FT_PER_M, GUN_CATALOG, catalogSweep, publishedGun, skinOf,
  PUBLISHED_SIEVE, publishedStats, RUNG_SANDS, ptsOf, sieveStats, FINES_CUTOFF_M,
} from './perfsandLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Shot explorer: the gun catalog, the geometry a charge leaves behind, and the
// sieve analysis of the sand it will produce through.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'guns', label: 'The gun catalog' },
  { value: 'geometry', label: 'The geometry' },
  { value: 'sieve', label: 'The sand sample' },
];

const Guns = () => {
  const rows = useMemo(() => catalogSweep(), []);
  const [conv, setConv] = useState('all');
  const shown = rows.filter((r) => conv === 'all' || r.conveyance === conv);
  const options = [
    { value: 'all', label: 'Every row' },
    { value: 'through-tubing', label: 'Through tubing' },
    { value: 'casing', label: 'Casing guns' },
  ];
  return (
    <>
      <SelectField label="Conveyance" value={conv} onChange={setConv} options={options} />
      <TileGrid>
        <Tile label="Rows" value={shown.length} />
        <Tile label="Smallest gun" value={fmt(Math.min(...shown.map((r) => r.odIn)), 4)} unit="in" />
        <Tile label="Largest gun" value={fmt(Math.max(...shown.map((r) => r.odIn)), 4)} unit="in" />
        <Tile label="Shot densities" value={[...new Set(shown.map((r) => r.spfPerFt))].join(', ')} unit="spf/ft" />
        <Tile label="Phasings" value={[...new Set(shown.map((r) => r.phasingDeg))].join(', ')} unit="deg" />
        <Tile label="Rows flagged approx" value={shown.length} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">gun</th>
              <th className="text-right pr-3">OD (in)</th>
              <th className="text-right pr-3">spf/ft</th>
              <th className="text-right pr-3">phasing</th>
              <th className="text-right pr-3">entrance hole (in)</th>
              <th className="text-right pr-3">penetration (in)</th>
              <th className="text-right">conveyance</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.name}>
                <td className="pr-3">{r.name}</td>
                <td className="text-right pr-3">{fmt(r.odIn, 4)}</td>
                <td className="text-right pr-3">{fmt(r.spfPerFt, 0)}</td>
                <td className="text-right pr-3">{fmt(r.phasingDeg, 0)}</td>
                <td className="text-right pr-3">{fmt(r.entranceHoleIn, 3)}</td>
                <td className="text-right pr-3">{fmt(r.penetrationIn, 0)}</td>
                <td className="text-right">{r.conveyance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        A charge is sold on two numbers: how wide a hole it makes in the casing and how far it
        reaches into the rock. Both are measured in an API concrete target, which is not the
        formation, and every row here is flagged approximate. The real design uses the
        manufacturer's data sheet for the actual gun, charge and casing combination.
      </Note>
    </>
  );
};

const Geometry = () => {
  const [spf, setSpf] = useState('');
  const [pen, setPen] = useState('');
  const [eh, setEh] = useState('');
  const i = publishedGun('hsd-4-5-8');
  const spfPerFt = spf === '' ? 12 : Number(spf);
  const penIn = pen === '' ? 32 : Number(pen);
  const ehIn = eh === '' ? 0.43 : Number(eh);
  const s = useMemo(() => {
    try {
      return skinOf(i, {
        spfPerM: spfPerFt * FT_PER_M, lpM: penIn * IN, rpM: (ehIn * IN) / 2,
      });
    } catch { return null; }
  }, [spfPerFt, penIn, ehIn, i]);
  const data = useMemo(() => [2, 4, 6, 8, 12, 16, 20].map((n) => ({
    spf: n, spacingMm: (0.3048 / n) * 1000,
  })), []);
  if (!s) return <Note>Those numbers do not describe a charge.</Note>;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label="Shot density (spf per foot, default 12)" value={spf} onChange={setSpf} placeholder="12" />
        <NumField label="Penetration (in, default 32)" value={pen} onChange={setPen} placeholder="32" />
        <NumField label="Entrance hole (in, default 0.43)" value={eh} onChange={setEh} placeholder="0.43" />
      </div>
      <TileGrid>
        <Tile label="Shot density" value={fmt(spfPerFt * FT_PER_M, 6)} unit="per m" />
        <Tile label="Perf spacing" value={fmt(s.hM, 6)} unit="m" />
        <Tile label="Tunnel length" value={fmt(penIn * IN, 6)} unit="m" />
        <Tile label="Tunnel radius" value={fmt((ehIn * IN) / 2, 7)} unit="m" />
        <Tile label="Effective wellbore radius" value={fmt(s.rwPrimeM, 6)} unit="m" />
        <Tile label="Dimensionless spacing" value={fmt(s.hD, 6)} />
        <Tile label="Dimensionless radius" value={fmt(s.rpD, 6)} />
        <Tile label="Blockage ratio" value={fmt(s.rwD, 6)} />
        <Tile label="Total skin" value={fmt(s.total, 6)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="spf" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'shots per foot', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'spacing (mm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="spacingMm" name="perf spacing" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Four lengths describe a perforation and the skin calculation reads nothing else: the tunnel
        length, the tunnel radius, the spacing between shots and the wellbore radius. Spacing is one
        over the shot density, so doubling the density halves it, and the bar chart is a reciprocal
        rather than a straight line.
      </Note>
    </>
  );
};

const Sieve = () => {
  const names = ['published sand', ...Object.keys(RUNG_SANDS)];
  const [name, setName] = useState('published sand');
  const stats = useMemo(() => {
    if (name === 'published sand') return publishedStats();
    return sieveStats(ptsOf(RUNG_SANDS[name]));
  }, [name]);
  const pts = name === 'published sand' ? PUBLISHED_SIEVE : ptsOf(RUNG_SANDS[name]);
  const data = [...pts]
    .sort((a, b) => b.sizeM - a.sizeM)
    .map((p) => ({ sizeUm: p.sizeM / UM, retained: p.cumRetainedPct }));
  return (
    <>
      <SelectField label="Sand" value={name} onChange={setName}
        options={names.map((n) => ({ value: n, label: n }))} />
      <TileGrid>
        <Tile label="D10" value={fmt(stats.d10M / UM, 3)} unit="um" />
        <Tile label="D40" value={fmt(stats.d40M / UM, 3)} unit="um" />
        <Tile label="D50" value={fmt(stats.d50M / UM, 3)} unit="um" />
        <Tile label="D90" value={fmt(stats.d90M / UM, 3)} unit="um" />
        <Tile label="Uniformity" value={fmt(stats.uniformity, 5)} />
        <Tile label="Sorting" value={fmt(stats.sorting, 5)} />
        <Tile label="Fines" value={fmt(stats.finesPct, 4)} unit="pct" />
        <Tile label="Fines cutoff" value={fmt(FINES_CUTOFF_M / UM, 1)} unit="um" />
        <Tile label="Points" value={pts.length} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="sizeUm" type="number" scale="log" domain={['dataMin', 'dataMax']} reversed
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'grain size (um, log)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]}
              label={{ value: 'cumulative retained (pct)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="retained" name="cumulative retained" stroke="#38bdf8" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The curve is cumulative RETAINED, which is the sand control convention and the opposite of
        the soils one. D10 is therefore the COARSE decile: only a tenth of the sample is coarser
        than it. Every D-value between two sieves is interpolated on a log scale, because grain
        size distributions are log-normal and a straight line between two sieves is not.
      </Note>
    </>
  );
};

const ShotExplorer = () => {
  const [mode, setMode] = useState('guns');
  return (
    <PanelShell
      title="Shot and sample explorer"
      subtitle="The gun catalog, the geometry a charge leaves, and the sieve curve of the sand"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'guns' && <Guns />}
        {mode === 'geometry' && <Geometry />}
        {mode === 'sieve' && <Sieve />}
      </div>
    </PanelShell>
  );
};

export default ShotExplorer;
