import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { WELLS, PARAMS, window_, caseOf } from './geomechLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Window explorer: the mud weight window walked along a whole trajectory, the
// tightest point on it, and which of the two lower bounds is doing the work.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.id }));
const MODES = [
  { value: 'window', label: 'Along the well' },
  { value: 'compare', label: 'Both wells' },
];

const Window = () => {
  const [id, setId] = useState('slant');
  const [nu, setNu] = useState(String(PARAMS.nu));
  const [phi, setPhi] = useState(String(PARAMS.frictionAngleDeg));
  const [azi, setAzi] = useState(String(PARAMS.shmaxAzimuthDeg));
  const w = useMemo(() => {
    const n = Number(nu); const f = Number(phi); const a = Number(azi);
    if (!(n > 0 && n < 0.5) || !(f >= 0) || !Number.isFinite(a)) return null;
    try { return window_(id, { nu: n, frictionAngleDeg: f, shmaxAzimuthDeg: a }); } catch { return null; }
  }, [id, nu, phi, azi]);
  const rows = useMemo(() => (w ? w.rows.map((r) => ({
    md: r.md,
    lower: Math.max(r.ppEmwKgM3, r.collapseEmwKgM3),
    collapse: r.collapseEmwKgM3,
    pp: r.ppEmwKgM3,
    frac: r.fracInitEmwKgM3,
  })) : []), [w]);
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <NumField label="Poisson ratio" value={nu} onChange={setNu} />
        <NumField label="Friction angle (deg)" value={phi} onChange={setPhi} />
        <NumField label="SHmax azimuth (deg)" value={azi} onChange={setAzi} />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[900, 3200]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'EMW (kg/m3)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {w && <ReferenceLine x={w.tightest.md} stroke="#f59e0b" strokeDasharray="4 4" />}
            <Line dataKey="frac" name="fracture initiation" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="lower" name="lower bound" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="collapse" name="collapse" stroke="#38bdf8" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line dataKey="pp" name="pore pressure" stroke="#94a3b8" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {w && (
        <>
          <TileGrid>
            <Tile label="Rows walked" value={w.rows.length} />
            <Tile label="Tightest at" value={fmt(w.tightest.md, 0)} unit="m MD" />
            <Tile label="TVD there" value={fmt(w.tightest.tvd, 3)} unit="m" />
            <Tile label="Window width" value={fmt(w.tightest.widthKgM3, 4)} unit="kg/m3" />
            <Tile label="Lower bound" value={fmt(w.tightest.lowerEmwKgM3, 4)} unit="kg/m3" />
            <Tile label="Upper bound" value={fmt(w.tightest.upperEmwKgM3, 4)} unit="kg/m3" />
          </TileGrid>
          <div className="mt-3 text-xs text-slate-300">
            At the tightest point the lower bound is set by the
            {' '}<span className="text-[#BFFF00]">{w.boundAtTightest}</span>.
            {w.inversionMd != null
              ? ` The window CLOSES from ${fmt(w.inversionMd, 0)} m MD, which means no mud weight works below that.`
              : ' The window stays open over the whole trajectory.'}
          </div>
        </>
      )}
      <Note>
        The window is a property of the TRAJECTORY rather than of the depth. Change the SHmax
        azimuth and the well suddenly runs across the stress field instead of along it, and the
        tightest point can move hundreds of metres. The lower bound is the larger of the collapse
        pressure and the pore pressure, and reading which of the two is doing the work tells you
        whether the fix is a heavier mud or a different well path.
      </Note>
    </>
  );
};

const Compare = () => {
  const s = useMemo(() => window_('slant'), []);
  const h = useMemo(() => window_('horizontal'), []);
  return (
    <>
      <TileGrid>
        <Tile label="Slant tightest" value={fmt(s.tightest.md, 0)} unit="m MD" />
        <Tile label="Slant width" value={fmt(s.tightest.widthKgM3, 4)} unit="kg/m3" />
        <Tile label="Slant bound" value={s.boundAtTightest} />
        <Tile label="Horizontal tightest" value={fmt(h.tightest.md, 0)} unit="m MD" />
        <Tile label="Horizontal width" value={fmt(h.tightest.widthKgM3, 4)} unit="kg/m3" />
        <Tile label="Horizontal bound" value={h.boundAtTightest} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        The slant well is tightest at total depth, {fmt(caseOf('slant').stations.at(-1).md, 0)} m,
        where it is deepest and the pore pressure has climbed. The horizontal well is tightest at
        {' '}{fmt(h.tightest.md, 0)} m, which is in the BUILD rather than at total depth: it lands
        and then drills a long lateral at constant true vertical depth, so nothing about the rock
        changes after the landing point.
      </div>
      <Note>
        Two wells through one rock, and they have their problems in different places. That is the
        argument for walking the whole trajectory rather than evaluating the reservoir depth and
        assuming the rest of the hole is easier. On a well that lands and turns, the tightest point
        is often in the build, where the hole is being turned across the stress field while the
        rock is still weak.
      </Note>
    </>
  );
};

const WindowExplorer = () => {
  const [mode, setMode] = useState('window');
  return (
    <PanelShell
      title="Mud window explorer"
      subtitle="The window walked along a trajectory, where it is tightest, and which bound binds"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'window' && <Window />}
        {mode === 'compare' && <Compare />}
      </div>
    </PanelShell>
  );
};

export default WindowExplorer;
