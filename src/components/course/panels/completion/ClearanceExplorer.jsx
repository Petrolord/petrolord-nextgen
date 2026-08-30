import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  IN, PUBLISHED, publishedClearance, publishedThroughBore, publishedVolumes,
  clearanceByTightness, fitMatrix, fitCheck, EQUIPMENT_CATALOG,
} from './completionLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Clearance explorer: what fits through what. Run-in clearance row by row,
// the through bore from the top down, and the size matrix behind both.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'runin', label: 'Run-in clearance' },
  { value: 'bore', label: 'Through bore' },
  { value: 'fit', label: 'Size matrix' },
];

const STATUS_COLOR = { PASS: 'text-emerald-400', WARN: 'text-amber-400', FAIL: 'text-rose-400', UNKNOWN: 'text-slate-400' };

const RunIn = () => {
  const [margin, setMargin] = useState('');
  const m = margin === '' ? PUBLISHED.warnMarginM : Number(margin);
  const res = useMemo(() => {
    try { return publishedClearance(m); } catch { return null; }
  }, [m]);
  if (!res) return <Note>That warn margin does not describe a runnable check.</Note>;
  const sorted = clearanceByTightness(res.rows);
  const bars = sorted.map((r) => ({ name: r.type, mm: r.clearanceM * 1000 }));
  return (
    <>
      <NumField label={`Warn margin (m, default ${PUBLISHED.warnMarginM})`} value={margin} onChange={setMargin} placeholder={String(PUBLISHED.warnMarginM)} />
      <TileGrid>
        <Tile label="Rows checked" value={res.rows.length} />
        <Tile label="Tightest" value={res.worst.type} />
        <Tile label="Tightest clearance" value={fmt(res.worst.clearanceM * 1000, 4)} unit="mm" />
        <Tile label="Second tightest" value={fmt(sorted[1].clearanceM * 1000, 4)} unit="mm" />
        <Tile label="Loosest" value={fmt(sorted.at(-1).clearanceM * 1000, 4)} unit="mm" />
        <Tile label="Ratio, first row to tightest" value={fmt(res.rows[0].clearanceM / res.worst.clearanceM, 4)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto" style={{ maxHeight: 260 }}>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">component</th>
              <th className="text-right pr-3">OD (in)</th>
              <th className="text-right pr-3">bottom (m)</th>
              <th className="text-right pr-3">governing drift (m)</th>
              <th className="text-right pr-3">clearance (mm)</th>
              <th className="text-left pr-3">controlling string</th>
              <th className="text-right">status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name}>
                <td className="pr-3">{r.name}</td>
                <td className="text-right pr-3">{fmt(r.odM / IN, 4)}</td>
                <td className="text-right pr-3">{fmt(r.bottomMdM, 1)}</td>
                <td className="text-right pr-3">{fmt(r.governingDriftM, 7)}</td>
                <td className="text-right pr-3">{fmt(r.clearanceM * 1000, 4)}</td>
                <td className="pr-3">{r.controlling}</td>
                <td className={`text-right ${STATUS_COLOR[r.status]}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'clearance (mm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 4)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="mm" name="radial clearance" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Each row is checked against the tightest bore anywhere ABOVE it, not the bore at its own
        depth, because a component has to pass everything on the way down. The table is sorted
        tightest first, which is not the order the string is made up in: the first joint off the
        rack is one of the loosest rows on the sheet.
      </Note>
    </>
  );
};

const Bore = () => {
  const tb = useMemo(() => publishedThroughBore(), []);
  const vol = useMemo(() => publishedVolumes(), []);
  const data = tb.rows.map((r, i) => ({ i: i + 1, cum: r.cumMinIdM * 1000, own: r.idM * 1000 }));
  return (
    <>
      <TileGrid>
        <Tile label="Through bore" value={fmt(tb.minIdM, 6)} unit="m" />
        <Tile label="Through bore" value={fmt(tb.minIdM / IN, 4)} unit="in" />
        <Tile label="Controlling" value={tb.controlling} />
        <Tile label="Capacity" value={fmt(vol.stringCapacityM3, 6)} unit="m3" />
        <Tile label="Displacement" value={fmt(vol.stringDisplacementM3, 6)} unit="m3" />
        <Tile label="Steel" value={fmt(vol.stringDisplacementM3 - vol.stringCapacityM3, 6)} unit="m3" />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="i" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'component, top down', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'bore (mm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(x) => fmt(x, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="own" name="own bore" fill="#334155" isAnimationActive={false} />
            <Bar dataKey="cum" name="smallest so far" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>
        The green bars are a running minimum, so they can only step down. A tool run on wireline
        stops at the first bar that is smaller than the tool, and the number a completion is
        advertised with is the last green bar in the chart.
      </Note>
    </>
  );
};

const Fit = () => {
  const [tubing, setTubing] = useState('3.5');
  const matrix = useMemo(() => fitMatrix().filter((r) => r.tubingOdIn === Number(tubing)), [tubing]);
  const kit = useMemo(() => EQUIPMENT_CATALOG.filter((r) => r.forTubingOdIn === Number(tubing)), [tubing]);
  const options = [
    { value: '2.375', label: '2-3/8 in' }, { value: '2.875', label: '2-7/8 in' },
    { value: '3.5', label: '3-1/2 in' }, { value: '4.5', label: '4-1/2 in' },
  ];
  const worst = useMemo(() => {
    const rows = matrix.filter((r) => r.failCount > 0);
    return rows.length ? rows[0] : null;
  }, [matrix]);
  return (
    <>
      <SelectField label="Tubing size" value={tubing} onChange={setTubing} options={options} />
      <TileGrid>
        <Tile label="Kit items" value={kit.length} />
        <Tile label="Casings tested" value={matrix.length} />
        <Tile label="Casings that fail" value={matrix.filter((r) => r.failCount > 0).length} />
        <Tile label="Widest body" value={fmt(Math.max(...kit.map((k) => k.odIn)), 4)} unit="in" />
        <Tile label="Widest body is" value={kit.find((k) => k.odIn === Math.max(...kit.map((x) => x.odIn))).type} />
        <Tile label="First casing that fails" value={worst ? `${worst.casingOdIn} in ${worst.casingWeightLbFt} lb/ft` : 'none'} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">casing</th>
              <th className="text-right pr-3">drift (m)</th>
              <th className="text-right pr-3">tightest clearance (mm)</th>
              <th className="text-right pr-3">fails</th>
              <th className="text-left">which</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((r) => (
              <tr key={`${r.casingOdIn}-${r.casingWeightLbFt}`}>
                <td className="pr-3">{fmt(r.casingOdIn, 3)} in {fmt(r.casingWeightLbFt, 1)} lb/ft</td>
                <td className="text-right pr-3">{fmt(r.driftM, 7)}</td>
                <td className="text-right pr-3">{fmt(r.tightestM * 1000, 3)}</td>
                <td className={`text-right pr-3 ${r.failCount ? 'text-rose-400' : 'text-emerald-400'}`}>{r.failCount}</td>
                <td>{r.fails.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A single item decides the completion size. {fmt(fitCheck(3.5, 5.5, 20).failCount, 0)} of the
        3-1/2 inch kit will not go into 5-1/2 inch 20 lb/ft casing, and they are the same three
        every time: the side pocket mandrel, the safety valve and the expansion joint. The tubing
        itself fits comfortably, which is exactly the trap.
      </div>
      <Note>
        The catalog outside diameters here are representative rather than a particular vendor's,
        and every row is flagged as approximate. Order from the real data sheet. The lesson the
        table teaches survives the substitution: it is the big bodies, not the pipe, that size a
        completion.
      </Note>
    </>
  );
};

const ClearanceExplorer = () => {
  const [mode, setMode] = useState('runin');
  return (
    <PanelShell
      title="Clearance explorer"
      subtitle="What fits down, what fits through, and which item decides the size"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'runin' && <RunIn />}
        {mode === 'bore' && <Bore />}
        {mode === 'fit' && <Fit />}
      </div>
    </PanelShell>
  );
};

export default ClearanceExplorer;
