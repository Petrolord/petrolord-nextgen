import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  WELLS, wellSummary, stringWeights, broomstick, operationTable, runCase, verticalClosedForm,
  TEACHING_MUD_KGM3, mudOver,
} from './torquedragLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// String explorer: one string, five holes, and the hookload each of them
// returns. The broomstick view is the plot a drilling engineer actually reads.

const fmt = (v, d = 2) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const kN = (v) => fmt(v / 1000, 3);
// Hookloads and tensions in newtons to 2 dp, torques in N.m to 3 dp: the
// precision the course grades them at.
const N = (v) => fmt(v, 2);
const Nm = (v) => fmt(v, 3);

const MODES = [
  { value: 'weights', label: 'The string and its weight' },
  { value: 'broomstick', label: 'Hookload against depth' },
  { value: 'operations', label: 'Every operation' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.label }));

const Weights = ({ over }) => {
  const [well, setWell] = useState('vertical');
  const s = useMemo(() => wellSummary(well), [well]);
  const w = useMemo(() => stringWeights(well, over), [well, over]);
  const closed = useMemo(() => verticalClosedForm(), []);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Component</th>
              <th className="text-right p-2">Length (m)</th>
              <th className="text-right p-2">OD (m)</th>
              <th className="text-right p-2">ID (m)</th>
              <th className="text-right p-2">Weight (kg/m)</th>
              <th className="text-right p-2">Air weight (kN)</th>
            </tr>
          </thead>
          <tbody>
            {s.string.map((c) => (
              <tr key={c.type} className="border-t border-gray-800">
                <td className="p-2 text-white uppercase">{c.type}</td>
                <td className="p-2 text-right text-gray-200">{fmt(c.lengthM, 0)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(c.odM, 5)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(c.idM, 5)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(c.weightKgM, 4)}</td>
                <td className="p-2 text-right text-gray-400">{kN(c.weightKgM * c.lengthM * 9.80665)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Buoyancy factor" value={fmt(w.buoyancyFactor, 10)} />
        <Tile label="Air weight" value={N(w.airWeightN)} unit="N" />
        <Tile label="Buoyed weight" value={N(w.buoyedWeightN)} unit="N" />
        <Tile label="Mud density" value={fmt(over.mudDensityKgM3 ?? s.mudDensityKgM3, 3)} unit="kg/m3" />
        <Tile label="Total depth" value={fmt(s.totalDepthM, 0)} unit="m" />
        <Tile label="Maximum inclination" value={fmt(s.maxIncDeg, 1)} unit="deg" />
      </TileGrid>
      <Note>
        On the vertical well the buoyed weight IS the hookload, because there is no side force
        anywhere and therefore no friction. That is the one case in this course with a closed-form
        answer, and it is worth knowing which way the two implementations miss it: the engine
        reproduces {fmt(closed.closedFormN, 6)} N to {Math.abs(closed.engineErrorN).toExponential(1)} N,
        and the oracle that generated the goldens is {fmt(Math.abs(closed.oracleErrorN), 4)} N away
        from it.
      </Note>
    </>
  );
};

const Broomstick = ({ over }) => {
  const [well, setWell] = useState('buildhold');
  const rows = useMemo(() => {
    const pu = runCase(well, 'trip_out', over).profile;
    const so = runCase(well, 'trip_in', over).profile;
    const ro = runCase(well, 'rotate_off_bottom', over).profile;
    return pu.map((r, i) => ({
      md: r.md,
      pickup: r.tensionN / 1000,
      slackoff: so[i]?.tensionN / 1000,
      rotating: ro[i]?.tensionN / 1000,
    }));
  }, [well, over]);
  const b = useMemo(() => broomstick(well, over), [well, over]);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="md" type="number" tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'measured depth (m)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'tension (kN)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 2)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
            <Line dataKey="pickup" name="pick up" stroke="#BFFF00" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="rotating" name="rotate off bottom" stroke="#38bdf8" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line dataKey="slackoff" name="slack off" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <TileGrid>
        <Tile label="Pick up" value={N(b.pickupN)} unit="N" />
        <Tile label="Rotate off bottom" value={N(b.rotatingN)} unit="N" />
        <Tile label="Slack off" value={N(b.slackoffN)} unit="N" />
        <Tile label="Pick-up drag" value={N(b.pickupDragN)} unit="N" />
        <Tile label="Slack-off drag" value={N(b.slackoffDragN)} unit="N" />
        <Tile label="Total swing" value={N(b.dragSwingN)} unit="N" />
      </TileGrid>
      {b.slackoffN < 0 && (
        <div className="mt-3 rounded border border-amber-700/60 bg-amber-950/30 p-3">
          <p className="text-amber-300 text-xs font-medium mb-1">The slack-off hookload is negative</p>
          <p className="text-[11px] text-amber-200/90">
            The model is saying the string will not fall into this hole under its own weight: it
            would have to be pushed, and a drill string in compression buckles rather than pushes.
            Read the tension curve: it crosses zero and keeps going, which is where the soft-string
            model stops describing anything real.
          </p>
        </div>
      )}
      <Note>
        The three curves separate wherever there is side force, and only there. On the vertical
        well they lie exactly on top of one another, because a hole with no curvature and no
        inclination generates no normal force for friction to act on.
      </Note>
    </>
  );
};

const Operations = ({ over }) => {
  const [well, setWell] = useState('horizontal');
  const t = useMemo(() => operationTable(well, over), [well, over]);
  return (
    <>
      <SelectField label="Well" value={well} onChange={setWell} options={WELL_OPTIONS} />
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Operation</th>
              <th className="text-right p-2">Hookload (N)</th>
              <th className="text-right p-2">Surface torque (N.m)</th>
              <th className="text-right p-2">Min tension (N)</th>
              <th className="text-right p-2">Max side force (N/m)</th>
              <th className="text-right p-2">Buckles from</th>
            </tr>
          </thead>
          <tbody>
            {t.map((r) => (
              <tr key={r.operation} className="border-t border-gray-800">
                <td className="p-2 text-white">{r.operation.replace(/_/g, ' ')}</td>
                <td className={`p-2 text-right ${r.hookloadN < 0 ? 'text-red-400' : 'text-gray-200'}`}>{N(r.hookloadN)}</td>
                <td className="p-2 text-right text-gray-200">{Nm(r.surfaceTorqueNm)}</td>
                <td className="p-2 text-right text-gray-400">{N(r.minTensionN)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.maxSideForceNPerM, 4)}</td>
                <td className={`p-2 text-right ${r.bucklingFirstMd == null ? 'text-gray-600' : 'text-amber-400'}`}>
                  {r.bucklingFirstMd == null ? 'none' : `${fmt(r.bucklingFirstMd, 0)} m`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Six operations, one string, one hole. Tripping generates no torque because nothing is
        turning; sliding generates only the bit torque because the string above the motor is not
        turning either. Rotating off bottom carries no weight on bit, so its hookload is the
        free-hanging value and its torque is pure friction.
      </Note>
    </>
  );
};

const StringExplorer = () => {
  const [mode, setMode] = useState('weights');
  const [mud, setMud] = useState('');
  const over = useMemo(() => mudOver(mud), [mud]);
  return (
    <PanelShell
      title="String explorer"
      subtitle="One string and one mud in five different holes, and the hookload each of them returns"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <NumField label={`Mud density (kg/m3), blank for the lessons' ${TEACHING_MUD_KGM3}`} value={mud}
          onChange={setMud} placeholder={String(TEACHING_MUD_KGM3)} />
      </div>
      <p className="text-[11px] text-gray-500 mt-2">
        Drill collars, heavy weight and drill pipe in {over?.mudDensityKgM3 ?? TEACHING_MUD_KGM3} kg/m3 mud,
        friction 0.25 cased and 0.35 open hole, 120 rpm, 0.3 m/s trip speed, 89 kN weight on bit,
        2.7 kN.m bit torque. Type a mud density to run your own case.
      </p>
      <div className="mt-3">
        {!over && <Note>Type a mud density between 0 and 7850 kg/m3, or leave it blank.</Note>}
        {over && mode === 'weights' && <Weights over={over} />}
        {over && mode === 'broomstick' && <Broomstick over={over} />}
        {over && mode === 'operations' && <Operations over={over} />}
      </div>
    </PanelShell>
  );
};

export default StringExplorer;
