import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  WELLS, caseOf, standoffFor, requiredSpacingFor, spacingSweep, springRate,
  clearances, checklistFor, annularVelocities, API_TARGET_STANDOFF, buoyancyFactor,
} from './cementingLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Standoff explorer: the centralization profile along the casing, the spacing
// that would just reach the API target, and the placement checklist.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const pct = (v) => fmt(100 * v, 3);

const WELL_OPTIONS = WELLS.map((w) => ({ value: w, label: w }));
const MODES = [
  { value: 'profile', label: 'Along the casing' },
  { value: 'spacing', label: 'Spacing and force' },
  { value: 'checklist', label: 'The checklist' },
];
const TYPES = [{ value: 'bow', label: 'bow spring' }, { value: 'rigid', label: 'rigid blade' }];

const Profile = () => {
  const [well, setWell] = useState('horizontal');
  const [type, setType] = useState('bow');
  const [spacing, setSpacing] = useState('');
  const [force, setForce] = useState('');
  const [blade, setBlade] = useState('0.206');
  const [mud, setMud] = useState('');
  const c = caseOf(well);
  const over = useMemo(() => {
    const cent = { type };
    if (spacing !== '') cent.spacingM = Number(spacing);
    if (type === 'bow' && force !== '') cent.restoringForceN = Number(force);
    if (type === 'rigid') cent.bladeOdM = Number(blade);
    const o = { centralizer: cent };
    if (mud !== '') o.mudDensityKgM3 = Number(mud);
    return o;
  }, [type, spacing, force, blade, mud]);
  const so = useMemo(() => {
    try { return standoffFor(well, over); } catch { return null; }
  }, [well, over]);
  const rows = useMemo(() => (so ? so.rows.map((r) => ({
    md: r.fromMd,
    inc: r.incDeg,
    atCent: 100 * r.standoffAtCentralizer,
    midSpan: 100 * r.standoffMidSpan,
    standoff: 100 * r.standoff,
  })) : []), [so]);
  if (!so) return <Note>Those centralizer settings do not describe a runnable profile.</Note>;
  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <SelectField label="Type" value={type} onChange={setType} options={TYPES} />
        <NumField label={`Spacing (m, default ${c.centralizer.spacingM})`} value={spacing} onChange={setSpacing} placeholder={String(c.centralizer.spacingM)} />
        {type === 'bow'
          ? <NumField label={`Restoring force (N, default ${c.centralizer.restoringForceN})`} value={force} onChange={setForce} placeholder={String(c.centralizer.restoringForceN)} />
          : <NumField label="Blade OD (m)" value={blade} onChange={setBlade} />}
        <NumField label="Mud density (kg/m3, default 1440)" value={mud} onChange={setMud} placeholder="1440" />
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="s" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'standoff (pct)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="i" orientation="right" domain={[0, 90]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'inclination (deg)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="s" y={100 * API_TARGET_STANDOFF} stroke="#fb7185" strokeDasharray="4 4" />
            <Line yAxisId="s" dataKey="standoff" name="standoff" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="s" dataKey="atCent" name="at the centralizer" stroke="#38bdf8" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line yAxisId="s" dataKey="midSpan" name="mid span" stroke="#a78bfa" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line yAxisId="i" dataKey="inc" name="inclination" stroke="#94a3b8" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Minimum standoff" value={pct(so.minStandoff)} unit="pct" />
        <Tile label="Against the API target" value={so.minStandoff >= API_TARGET_STANDOFF ? 'pass' : 'fail'} />
        <Tile label="Binding term" value={so.bindingTerm} />
        <Tile label="Worst interval" value={`${fmt(so.minRow.fromMd, 0)} to ${fmt(so.minRow.toMd, 0)}`} unit="m MD" />
        <Tile label="Inclination there" value={fmt(so.minRow.incDeg, 4)} unit="deg" />
        <Tile label="Clearance there" value={fmt(so.minRow.clearanceM * 1000, 4)} unit="mm" />
      </TileGrid>
      <Note>
        Three curves. The standoff AT a centralizer is set by how far the bow spring deflects under
        the lateral load. The MID SPAN value subtracts the sag of the pipe between two of them. The
        reported standoff is the smaller of the two, and on both of this course's wells it is the
        mid span that binds.
      </Note>
    </>
  );
};

const Spacing = () => {
  const [well, setWell] = useState('horizontal');
  const sweep = useMemo(() => spacingSweep(well), [well]);
  const forces = useMemo(() => [4450, 6675, 8900, 13350, 17800, 26700].map((f) => ({
    force: f, minStandoff: 100 * standoffFor(well, { centralizer: { restoringForceN: f } }).minStandoff,
  })), [well]);
  const req = useMemo(() => requiredSpacingFor(well), [well]);
  const k = useMemo(() => springRate(well), [well]);
  const cl = useMemo(() => clearances(well), [well]);
  const c = caseOf(well);
  const data = sweep.map((s) => ({ spacing: s.spacingM, standoff: 100 * s.minStandoff }));
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="spacing" type="number" domain={[0, 32]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'centralizer spacing (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'minimum standoff (pct)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={100 * API_TARGET_STANDOFF} stroke="#fb7185" strokeDasharray="4 4" />
            {req != null && <ReferenceLine x={req} stroke="#BFFF00" strokeDasharray="4 4" />}
            <Line dataKey="standoff" name="minimum standoff" stroke="#BFFF00" strokeWidth={2} dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Required spacing" value={req == null ? 'not achievable' : fmt(req, 6)} unit={req == null ? '' : 'm'} />
        <Tile label="Spacing on this job" value={fmt(c.centralizer.spacingM, 2)} unit="m" />
        <Tile label="Verdict" value={req != null && c.centralizer.spacingM <= req ? 'inside' : 'too wide'} />
        <Tile label="Spring rate" value={fmt(k.kNPerM, 3)} unit="N/m" />
        <Tile label="Nominal clearance" value={fmt(k.clearanceM * 1000, 4)} unit="mm" />
        <Tile label="Buoyancy factor at 1440" value={fmt(buoyancyFactor(1440), 8)} />
      </TileGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr><th className="text-left pr-3">restoring force (N)</th><th className="text-right">minimum standoff (pct)</th></tr>
          </thead>
          <tbody>
            {forces.map((f) => (
              <tr key={f.force}>
                <td className="pr-3">{fmt(f.force, 0)}</td>
                <td className="text-right">{fmt(f.minStandoff, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The volume side of this course measures the open hole at
        {' '}{fmt(cl.effectiveBoreM, 6)} m after the excess, and the centralization side measures it
        at the nominal {fmt(cl.nominalBoreM, 6)}. The clearance the spring rate is computed on is
        the nominal one.
      </div>
      <Note>
        Halving the spacing does far more than doubling the restoring force, because the sag term
        goes as the fourth power of the span and the deflection at the centralizer goes as the
        first. Past about twenty metres the sag reaches the whole clearance and the standoff is
        zero whatever centralizer you fit.
      </Note>
    </>
  );
};

const Checklist = () => {
  const [well, setWell] = useState('horizontal');
  const list = useMemo(() => checklistFor(well, 'lead_tail'), [well]);
  const vels = useMemo(() => annularVelocities(well), [well]);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr><th className="text-left pr-3">item</th><th className="text-left pr-3">detail</th><th className="text-right">verdict</th></tr>
          </thead>
          <tbody>
            {list.items.map((i) => (
              <tr key={i.id}>
                <td className="pr-3">{i.id}</td>
                <td className="pr-3">{i.detail}</td>
                <td className={`text-right ${i.ok ? 'text-[#BFFF00]' : 'text-rose-400'}`}>{i.ok ? 'pass' : 'fail'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Passed" value={`${list.passed} of ${list.total}`} />
        {vels.map((v) => (
          <Tile key={v.fromMd} label={`Annular velocity ${fmt(v.fromMd, 0)} to ${fmt(v.toMd, 0)} m`} value={fmt(v.vMs, 6)} unit="m/s" />
        ))}
      </TileGrid>
      <Note>
        Five items, counted, with no weighting and no overall percentage. A cementing model that
        returns an efficiency of 87 percent is claiming to know something no model of this kind can
        know. A list of five things that either hold or do not is a smaller claim and a true one,
        and the reader can see which of the five failed and go and fix that.
      </Note>
    </>
  );
};

const StandoffExplorer = () => {
  const [mode, setMode] = useState('profile');
  return (
    <PanelShell
      title="Standoff and job quality explorer"
      subtitle="Centralization along the casing, the spacing that reaches the API target, and the checklist"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'profile' && <Profile />}
        {mode === 'spacing' && <Spacing />}
        {mode === 'checklist' && <Checklist />}
      </div>
    </PanelShell>
  );
};

export default StandoffExplorer;
