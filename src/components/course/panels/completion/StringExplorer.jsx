import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  IN, driftTable, driftClasses, publishedStack, publishedProfile, publishedVolumes,
  publishedThroughBore, throughBoreExtent, governingDriftTo,
} from './completionLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// String explorer: the API 5CT drift table, the stack-up of the published
// completion, and the casing bores the string has to pass through.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'drift', label: 'Drift table' },
  { value: 'stack', label: 'Stack-up' },
  { value: 'profile', label: 'Casing profile' },
];

const CLASS_LABEL = {
  '0.09375': 'tubing, 3/32 in',
  '0.12500': 'casing to 8-5/8 in, 1/8 in',
  '0.15625': 'casing over 8-5/8 to 13-3/8 in, 5/32 in',
  '0.18750': 'casing over 13-3/8 in, 3/16 in',
};

const Drift = () => {
  const [kind, setKind] = useState('all');
  const rows = useMemo(() => driftTable().filter(
    (r) => kind === 'all' || String(r.deductionIn.toFixed(5)) === kind,
  ), [kind]);
  const classes = useMemo(() => driftClasses(), []);
  const options = [{ value: 'all', label: 'Every catalog row' }].concat(
    Object.keys(classes).sort().map((k) => ({ value: k, label: CLASS_LABEL[k] })),
  );
  return (
    <>
      <SelectField label="Deduction class" value={kind} onChange={setKind} options={options} />
      <TileGrid>
        {Object.keys(classes).sort().map((k) => (
          <Tile key={k} label={CLASS_LABEL[k]} value={classes[k].length} unit="rows" />
        ))}
      </TileGrid>
      <div className="mt-3 overflow-x-auto" style={{ maxHeight: 300 }}>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">tubular</th>
              <th className="text-right pr-3">OD (in)</th>
              <th className="text-right pr-3">weight (lb/ft)</th>
              <th className="text-right pr-3">ID (in)</th>
              <th className="text-right pr-3">deduction (in)</th>
              <th className="text-right">drift (m)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.kind}-${r.odIn}-${r.weightLbFt}`}>
                <td className="pr-3">{r.kind}</td>
                <td className="text-right pr-3">{fmt(r.odIn, 3)}</td>
                <td className="text-right pr-3">{fmt(r.weightLbFt, 2)}</td>
                <td className="text-right pr-3">{fmt(r.idIn, 4)}</td>
                <td className="text-right pr-3">{fmt(r.deductionIn, 5)}</td>
                <td className="text-right">{fmt(r.driftM, 7)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The deduction is a lookup on the OUTSIDE diameter and nothing else. Every 9-5/8 inch row in
        the catalog gives up the same 5/32 of an inch whatever it weighs, so the drifts inside a
        size differ only because the inside diameters do. That is why a drift is quoted with the
        weight beside it and never on its own.
      </Note>
    </>
  );
};

const Stack = () => {
  const stack = useMemo(() => publishedStack(), []);
  const tb = useMemo(() => publishedThroughBore(), []);
  const extent = useMemo(() => throughBoreExtent(stack, tb), [stack, tb]);
  const vol = useMemo(() => publishedVolumes(), []);
  return (
    <>
      <TileGrid>
        <Tile label="Components" value={stack.components.length} />
        <Tile label="Hanger" value={fmt(stack.hangerMdM, 1)} unit="m MD" />
        <Tile label="Bottom" value={fmt(stack.bottomMdM, 3)} unit="m MD" />
        <Tile label="String length" value={fmt(stack.lengthM, 3)} unit="m" />
        <Tile label="Through bore" value={fmt(tb.minIdM, 6)} unit="m" />
        <Tile label="Capacity" value={fmt(vol.stringCapacityM3, 6)} unit="m3" />
      </TileGrid>
      <div className="mt-3 overflow-x-auto" style={{ maxHeight: 300 }}>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">component</th>
              <th className="text-right pr-3">top (m)</th>
              <th className="text-right pr-3">bottom (m)</th>
              <th className="text-right pr-3">length (m)</th>
              <th className="text-right pr-3">OD (in)</th>
              <th className="text-right pr-3">ID (in)</th>
              <th className="text-right">governs (m)</th>
            </tr>
          </thead>
          <tbody>
            {stack.components.map((c) => (
              <tr key={`${c.name}-${c.topMdM}`}>
                <td className="pr-3">{c.name}</td>
                <td className="text-right pr-3">{fmt(c.topMdM, 2)}</td>
                <td className="text-right pr-3">{fmt(c.bottomMdM, 2)}</td>
                <td className="text-right pr-3">{fmt(c.lengthM, 2)}</td>
                <td className="text-right pr-3">{fmt(c.odM / IN, 4)}</td>
                <td className="text-right pr-3">{fmt(c.idM / IN, 4)}</td>
                <td className="text-right">{extent[c.name] ? fmt(extent[c.name], 2) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The last column is how much of the string each component is the smallest bore SO FAR for.
        The safety valve holds the record for most of the well and the no-go nipple takes it back
        for the last few metres, which is the whole story of a through bore in one column: the
        number that gets quoted is set by a component that governs almost none of the string.
      </Note>
    </>
  );
};

const Profile = () => {
  const profile = useMemo(() => publishedProfile(), []);
  const data = useMemo(() => {
    const out = [];
    for (let md = 100; md <= 3000; md += 100) {
      const g = governingDriftTo(profile, md);
      out.push({ md, drift: g ? g.driftM : null, label: g ? g.label : '' });
    }
    return out;
  }, [profile]);
  return (
    <>
      <div className="mt-1 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">from (m MD)</th><th className="text-left pr-3">to</th>
              <th className="text-right pr-3">ID (in)</th><th className="text-right pr-3">drift (m)</th>
              <th className="text-right">string</th>
            </tr>
          </thead>
          <tbody>
            {profile.map((s) => (
              <tr key={s.topMdM}>
                <td className="pr-3">{fmt(s.topMdM, 1)}</td>
                <td className="pr-3">{fmt(s.bottomMdM, 1)}</td>
                <td className="text-right pr-3">{fmt(s.idM / IN, 4)}</td>
                <td className="text-right pr-3">{fmt(s.driftM, 7)}</td>
                <td className="text-right">{s.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0.14, 0.23]}
              label={{ value: 'governing drift (m)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="drift" name="governing drift" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The profile keeps the INNERMOST bore wherever two strings overlap, and the governing drift
        to a depth is the smallest one anywhere above it. That is why the curve only ever steps
        down: a string cannot un-pass a restriction it has already been through.
      </Note>
    </>
  );
};

const StringExplorer = () => {
  const [mode, setMode] = useState('drift');
  return (
    <PanelShell
      title="Completion string explorer"
      subtitle="API 5CT drift, the stack-up of the published string, and the bores it passes through"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'drift' && <Drift />}
        {mode === 'stack' && <Stack />}
        {mode === 'profile' && <Profile />}
      </div>
    </PanelShell>
  );
};

export default StringExplorer;
