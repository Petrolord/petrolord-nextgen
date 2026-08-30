import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  WELLS, pipeLimits, bucklingLadder, utilization, runCase, wearRun, wearOracleCheck,
  WEAR_CASE, slidingDistance,
} from './torquedragLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Buckling explorer: what the pipe can take, where it stops taking it, and what
// the side force does to the casing it is rubbing against.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const kN = (v) => fmt(v / 1000, 3);

const MODES = [
  { value: 'limits', label: 'The two buckling limits' },
  { value: 'utilization', label: 'What the pipe has left' },
  { value: 'wear', label: 'Casing wear' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.label }));

const Limits = () => {
  const [inc, setInc] = useState('90');
  const ladder = useMemo(() => bucklingLadder('horizontal'), []);
  const at = useMemo(() => {
    const i = Number(inc);
    if (!Number.isFinite(i) || i < 0 || i > 90) return null;
    return pipeLimits({ well: 'horizontal', incDeg: i });
  }, [inc]);
  return (
    <>
      <NumField label="Inclination (deg)" value={inc} onChange={setInc} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ladder.map((r) => ({ ...r, sin: r.sinusoidalN / 1000, hel: r.helicalN / 1000 }))}
            margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="incDeg" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'inclination (deg)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'compression (kN)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 2)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line dataKey="sin" name="sinusoidal" stroke="#f59e0b" strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="hel" name="helical" stroke="#ef4444" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {at && (
        <TileGrid>
          <Tile label="Sinusoidal limit" value={kN(at.sinusoidalN)} unit="kN" />
          <Tile label="Helical limit" value={kN(at.helicalN)} unit="kN" />
          <Tile label="Helical over sinusoidal" value={fmt(at.helicalN / at.sinusoidalN, 9)} />
          <Tile label="Bending stiffness EI" value={fmt(at.eiNm2, 3)} unit="N.m2" />
          <Tile label="Buoyed weight" value={fmt(at.buoyedWeightNPerM, 4)} unit="N/m" />
          <Tile label="Radial clearance" value={fmt(at.radialClearanceM, 6)} unit="m" />
        </TileGrid>
      )}
      <Note>
        Read the ratio tile at any inclination and any clearance. The helical limit is always the
        same multiple of the sinusoidal one, two root two less one, because both come from the same
        expression with a different constant in front. At zero inclination both limits are zero:
        a vertical hole offers the pipe nothing to lie against.
      </Note>
    </>
  );
};

const Utilization = () => {
  const [well, setWell] = useState('horizontal');
  const u = useMemo(() => utilization(well, 'rotate_on_bottom'), [well]);
  const rows = useMemo(() => runCase(well, 'rotate_on_bottom').profile.map((r) => ({
    md: r.md,
    tension: (r.utilization?.tension ?? 0) * 100,
    torsion: (r.utilization?.torsion ?? 0) * 100,
  })), [well]);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]}
              label={{ value: 'percent of capacity', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line dataKey="tension" name="tension" stroke="#BFFF00" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="torsion" name="torsion" stroke="#38bdf8" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Worst tension utilization" value={fmt(u.maxTensionUtilization * 100, 4)} unit="%" />
        <Tile label="Worst torsion utilization" value={fmt(u.maxTorsionUtilization * 100, 4)} unit="%" />
        <Tile label="Torsion over tension" value={fmt(u.maxTorsionUtilization / u.maxTensionUtilization, 4)} />
      </TileGrid>
      <Note>
        On a horizontal well torsion is the binding constraint and tension is nowhere near it. That
        is the opposite of the vertical well the pipe rating was written for, and it is why extended
        reach wells are limited by what the top drive can turn rather than by what the derrick can
        lift.
      </Note>
    </>
  );
};

const Wear = () => {
  const [hours, setHours] = useState('50');
  const [wf, setWf] = useState('2');
  const run = useMemo(() => {
    const h = Number(hours); const f = Number(wf);
    if (!Number.isFinite(h) || !Number.isFinite(f) || h < 0 || f < 0) return null;
    return wearRun({ schedule: [{ rpm: 120, hours: h }], wearFactorMm3PerKNm: f });
  }, [hours, wf]);
  const oracle = useMemo(() => wearOracleCheck(), []);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Rotating hours at 120 rpm" value={hours} onChange={setHours} />
        <NumField label="Wear factor (mm3/kN.m)" value={wf} onChange={setWf} />
      </div>
      {run && (
        <>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={run.rows.map((r) => ({ md: (r.fromMd + r.toMd) / 2, loss: r.wallLossPct, side: r.sideForceN / 1000 }))}
                margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="md" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'casing MD (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
                <YAxis yAxisId="l" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
                  formatter={(v) => fmt(v, 4)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="l" dataKey="loss" name="wall loss (%)" stroke="#ef4444" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line yAxisId="r" dataKey="side" name="side force (kN)" stroke="#38bdf8" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <TileGrid>
            <Tile label="Worst wear depth" value={fmt(run.maxWearDepthM * 1000, 6)} unit="mm" />
            <Tile label="Worst wall loss" value={fmt(run.worstWallLossPct, 6)} unit="%" />
            <Tile label="Remaining wall there" value={fmt(run.minRemainingWallM * 1000, 6)} unit="mm" />
            <Tile label="Sliding distance" value={fmt(run.totalSlidingM / 1000, 6)} unit="km" />
            <Tile label="Nominal wall" value={fmt(WEAR_CASE.casingWallM * 1000, 4)} unit="mm" />
            <Tile label="Shoe depth" value={fmt(WEAR_CASE.shoeMd, 0)} unit="m" />
          </TileGrid>
        </>
      )}
      <Note>
        Fifty hours of rotating at 120 rpm slides the tool joints
        {' '}{fmt(slidingDistance({ rpm: 120, hours: 50 }) / 1000, 3)} km against the casing, which is
        why the wear is not a small correction. The published oracle for this case used its own side
        forces rather than these, so the two answers sit {fmt(oracle.relDepth * 100, 3)} percent
        apart on the worst wear depth while the sliding distance agrees exactly. That gap is the
        torque and drag gap carried one step downstream.
      </Note>
    </>
  );
};

const BucklingExplorer = () => {
  const [mode, setMode] = useState('limits');
  return (
    <PanelShell
      title="Buckling and wear explorer"
      subtitle="What the pipe can take, where it stops taking it, and what the side force does to the casing"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'limits' && <Limits />}
        {mode === 'utilization' && <Utilization />}
        {mode === 'wear' && <Wear />}
      </div>
    </PanelShell>
  );
};

export default BucklingExplorer;
