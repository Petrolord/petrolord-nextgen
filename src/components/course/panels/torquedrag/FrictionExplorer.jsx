import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  WELLS, frictionSweep, frictionFromHookload, summaryOf, runCase, oracleCheck, stepStudy,
} from './torquedragLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Friction explorer: the one number in the model that is calibrated rather than
// measured, the side force it multiplies, and how far the engine sits from the
// independent oracle that generated its goldens.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const kN = (v) => fmt(v / 1000, 3);

const MODES = [
  { value: 'sweep', label: 'What friction moves' },
  { value: 'calibrate', label: 'Back it out of a trip' },
  { value: 'oracle', label: 'Against the oracle' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.label }));
const OP_OPTIONS = [
  { value: 'trip_out', label: 'pick up' },
  { value: 'trip_in', label: 'slack off' },
  { value: 'rotate_on_bottom', label: 'rotate on bottom' },
  { value: 'backream', label: 'back ream' },
];

const Sweep = () => {
  const [well, setWell] = useState('buildhold');
  const [op, setOp] = useState('trip_out');
  const rows = useMemo(() => frictionSweep(well, op), [well, op]);
  const base = rows.find((r) => r.frictionOpen === 0.35);
  const span = rows[rows.length - 1].hookloadN - rows[0].hookloadN;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <SelectField label="Operation" value={op} onChange={setOp} options={OP_OPTIONS} />
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows.map((r) => ({ ...r, hookkN: r.hookloadN / 1000, torquekNm: r.surfaceTorqueNm / 1000 }))}
            margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="frictionOpen" type="number" domain={[0.15, 0.5]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'open-hole friction factor', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="l" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis yAxisId="r" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="l" dataKey="hookkN" name="hookload (kN)" stroke="#BFFF00" strokeWidth={2} isAnimationActive={false} />
            <Line yAxisId="r" dataKey="torquekNm" name="torque (kN.m)" stroke="#38bdf8" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="At the standard 0.35" value={kN(base.hookloadN)} unit="kN" />
        <Tile label="Across 0.15 to 0.50" value={kN(span)} unit="kN" />
        <Tile label="Per 0.01 of friction" value={kN(span / 35)} unit="kN" />
        <Tile label="Max side force" value={fmt(base.maxSideForceNPerM, 4)} unit="N/m" />
      </TileGrid>
      <Note>
        The response is close to linear and it is entirely a property of the geometry: friction
        multiplies a side force the hole shape already fixed. Nothing here is a measurement of the
        rock. It is a number chosen so that the calculation reproduces a trip that was observed.
      </Note>
    </>
  );
};

const Calibrate = () => {
  const [well, setWell] = useState('buildhold');
  const [target, setTarget] = useState('1100000');
  const solved = useMemo(() => {
    const t = Number(target);
    if (!Number.isFinite(t)) return null;
    try {
      const mu = frictionFromHookload({ well, operation: 'trip_out', targetN: t });
      return {
        mu,
        check: summaryOf(well, 'trip_out', { frictionOpen: mu }).hookloadN,
        torque: summaryOf(well, 'rotate_on_bottom', { frictionOpen: mu }).surfaceTorqueNm,
        baseTorque: summaryOf(well, 'rotate_on_bottom').surfaceTorqueNm,
      };
    } catch { return null; }
  }, [well, target]);
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <NumField label="Observed pick-up hookload (N)" value={target} onChange={setTarget} />
      </div>
      {solved && (
        <TileGrid>
          <Tile label="Open-hole friction factor" value={fmt(solved.mu, 8)} />
          <Tile label="Hookload it reproduces" value={kN(solved.check)} unit="kN" />
          <Tile label="Torque it then predicts" value={fmt(solved.torque / 1000, 4)} unit="kN.m" />
          <Tile label="Torque at the standard 0.35" value={fmt(solved.baseTorque / 1000, 4)} unit="kN.m" />
        </TileGrid>
      )}
      <Note>
        This is what calibration is: one observed number in, one friction factor out, by bisection
        over a monotone response. It always succeeds, which is the danger. A friction factor fitted
        to a pick-up hookload absorbs every error in the survey, the string description, the mud
        weight and the model itself, and then predicts a torque that inherits all of them.
      </Note>
    </>
  );
};

const Oracle = () => {
  const [well, setWell] = useState('horizontal');
  const [op, setOp] = useState('trip_in');
  const check = useMemo(() => oracleCheck(), []);
  const steps = useMemo(() => stepStudy(well, op), [well, op]);
  return (
    <>
      <TileGrid>
        <Tile label="Values checked" value={String(check.checked)} />
        <Tile label="Worst relative" value={check.worstRel.toExponential(3)} />
        <Tile label="Worst absolute" value={fmt(check.worstAbs, 3)} unit="N" />
        <Tile label="Worst relative at" value={`${check.relAt.well} / ${check.relAt.operation.replace(/_/g, ' ')}`} />
      </TileGrid>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
        <SelectField label="Operation" value={op} onChange={setOp} options={OP_OPTIONS} />
      </div>
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-right p-2">Step (m)</th>
              <th className="text-right p-2">Hookload (N)</th>
              <th className="text-right p-2">Less the oracle (N)</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((r) => (
              <tr key={r.stepM} className="border-t border-gray-800">
                <td className="p-2 text-right text-white">{fmt(r.stepM, 2)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.hookloadN, 3)}</td>
                <td className="p-2 text-right text-gray-400">{r.vsOracleN == null ? '-' : fmt(r.vsOracleN, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Halve the step and watch. On the horizontal well the gap halves with it, so it is
        discretisation and the two implementations agree in the limit. On the slant and build wells
        it stops moving at a few tens of newtons, which is a difference in the models rather than in
        the arithmetic. The vertical well settles which one is right: it has a closed-form answer,
        and the engine reproduces it to machine precision.
      </Note>
    </>
  );
};

const FrictionExplorer = () => {
  const [mode, setMode] = useState('sweep');
  return (
    <PanelShell
      title="Friction explorer"
      subtitle="The one calibrated number in the model, and how far this implementation sits from the oracle that generated its goldens"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'sweep' && <Sweep />}
        {mode === 'calibrate' && <Calibrate />}
        {mode === 'oracle' && <Oracle />}
      </div>
    </PanelShell>
  );
};

export default FrictionExplorer;
