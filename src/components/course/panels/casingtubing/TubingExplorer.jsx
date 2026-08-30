import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  PUBLISHED_TUBING, tubingGeometry, tubingRun, tubingScenario, tempSweep, envelope,
  erosionalVelocityMs, HELICAL_RATIO,
} from './casingTubingLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Tubing explorer: the Lubinski force set at the packer, the length changes it
// produces, and the temperature band inside which the string neither buckles
// nor runs out of stroke.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');
const kN = (v) => fmt(v / 1e3, 3);

const MODES = [
  { value: 'forces', label: 'Forces and length' },
  { value: 'envelope', label: 'The envelope' },
  { value: 'scenarios', label: 'Three scenarios' },
];
const STATE_COLOUR = { none: 'text-[#BFFF00]', sinusoidal: 'text-amber-400', helical: 'text-rose-400' };

const Forces = () => {
  const [dPi, setDPi] = useState('10');
  const [dPo, setDPo] = useState('0');
  const [dT, setDT] = useState('45');
  const g = useMemo(() => tubingGeometry(), []);
  const r = useMemo(() => {
    const a = Number(dPi); const b = Number(dPo); const c = Number(dT);
    if (![a, b, c].every(Number.isFinite)) return null;
    try {
      return tubingRun({ dPiPa: a * 1e6, dPoPa: b * 1e6, externalKgM3: 1150 }, { deltaOpC: c });
    } catch { return null; }
  }, [dPi, dPo, dT]);
  if (!r) return <Note>Those inputs do not make a runnable case.</Note>;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <NumField label="Bore pressure change (MPa)" value={dPi} onChange={setDPi} />
        <NumField label="Annulus pressure change (MPa)" value={dPo} onChange={setDPo} />
        <NumField label="Mean temperature change (deg C)" value={dT} onChange={setDT} />
      </div>
      <TileGrid>
        <Tile label="Piston" value={kN(r.forces.pistonN)} unit="kN" />
        <Tile label="Ballooning" value={kN(r.forces.ballooningN)} unit="kN" />
        <Tile label="Thermal" value={kN(r.forces.thermalN)} unit="kN" />
        <Tile label="Total at the packer" value={kN(r.forces.totalN)} unit="kN" />
        <Tile label="Packer safety factor" value={fmt(r.packer.sf, 4)} />
        <Tile label="Buckling" value={r.buckling.state} />
        <Tile label="Piston length" value={fmt(r.lengthChanges.pistonM, 4)} unit="m" />
        <Tile label="Ballooning length" value={fmt(r.lengthChanges.ballooningM, 4)} unit="m" />
        <Tile label="Thermal length" value={fmt(r.lengthChanges.thermalM, 4)} unit="m" />
        <Tile label="Total length change" value={fmt(r.lengthChanges.totalM, 4)} unit="m" />
        <Tile label="Stroke available" value={fmt(PUBLISHED_TUBING.packer.strokeM, 2)} unit="m" />
        <Tile label="Within stroke" value={r.packer.strokeOk ? 'yes' : 'no'} />
      </TileGrid>
      <div className="mt-3 text-xs text-slate-300">
        The three areas this string works on are Ai {fmt(g.Ai * 1e4, 3)}, Ao {fmt(g.Ao * 1e4, 3)} and
        the seal bore Ap {fmt(g.Ap * 1e4, 3)}, all in square centimetres, and the steel section is
        {' '}{fmt(g.areaM2 * 1e4, 3)}. Piston acts on the differences between them, ballooning on the
        bore and annulus areas separately, and thermal on the steel alone.
      </div>
      <Note>
        A positive total is tension pulling up on the packer and a negative one is compression
        pushing down on it. Heating a string that cannot lengthen puts it in compression, which is
        why production is the case that buckles and injection is the case that pulls.
      </Note>
    </>
  );
};

const Envelope = () => {
  const [dPi, setDPi] = useState('10');
  const rows = useMemo(() => {
    const a = Number(dPi);
    if (!Number.isFinite(a)) return [];
    return tempSweep({ dPiPa: a * 1e6 }).map((x) => ({
      dT: x.dT, totalKN: x.totalN / 1e3, dLm: x.totalDlM, state: x.state,
    }));
  }, [dPi]);
  const e = useMemo(() => {
    const a = Number(dPi);
    return Number.isFinite(a) ? envelope({ dPiPa: a * 1e6 }) : null;
  }, [dPi]);
  return (
    <>
      <NumField label="Bore pressure change (MPa)" value={dPi} onChange={setDPi} />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="dT" type="number" domain={[-80, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'mean temperature change (deg C)', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'kN, or m for length', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }}
              formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {e && <ReferenceLine x={e.sinusoidalOnsetDegC} stroke="#f59e0b" strokeDasharray="4 4" />}
            {e && <ReferenceLine x={e.coldStrokeDegC} stroke="#38bdf8" strokeDasharray="4 4" />}
            {e && <ReferenceLine x={e.hotStrokeDegC} stroke="#38bdf8" strokeDasharray="4 4" />}
            <Line dataKey="totalKN" name="total force (kN)" stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line dataKey="dLm" name="length change (m)" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {e && (
        <>
          <TileGrid>
            <Tile label="Cold stroke limit" value={fmt(e.coldStrokeDegC, 4)} unit="deg C" />
            <Tile label="Sinusoidal onset" value={fmt(e.sinusoidalOnsetDegC, 4)} unit="deg C" />
            <Tile label="Helical onset" value={fmt(e.helicalOnsetDegC, 4)} unit="deg C" />
            <Tile label="Hot stroke limit" value={fmt(e.hotStrokeDegC, 4)} unit="deg C" />
            <Tile label="Stroke window" value={fmt(e.strokeWindowDegC, 4)} unit="deg C" />
            <Tile label="Hot limit is" value={e.hotLimitIs} />
          </TileGrid>
          <div className="mt-3 text-xs text-slate-300">
            The stroke window is {fmt(e.strokeWindowDegC, 4)} degrees wide, and it stays that width
            at any pressure change you type, because only the thermal term contains the
            temperature. Two times the stroke over alpha times the length is
            {' '}{fmt(e.closedFormStrokeWindowDegC, 4)}, which is the same number. The pressures slide
            the window along the axis; they never widen it.
          </div>
        </>
      )}
      <Note>
        Buckling arrives on the hot side well before the stroke does on this string, so the hot
        limit is a buckling limit and not a seal limit. Which of the two binds is a property of
        this geometry, not a rule.
      </Note>
    </>
  );
};

const SCENARIO_NAMES = ['production-heating', 'injection-cooling', 'stimulation'];

const Scenarios = () => {
  const rows = useMemo(() => SCENARIO_NAMES.map((n) => tubingScenario(n)), []);
  const [rho, setRho] = useState('700');
  const ve = useMemo(() => {
    const v = Number(rho);
    if (!(v > 0)) return null;
    try { return erosionalVelocityMs({ mixtureKgM3: v, cFactor: 100 }); } catch { return null; }
  }, [rho]);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">scenario</th><th className="text-right pr-3">total (kN)</th>
              <th className="text-right pr-3">packer SF</th><th className="text-right pr-3">length (m)</th>
              <th className="text-right pr-3">stroke</th><th className="text-right">buckling</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="pr-3">{r.name}</td>
                <td className="text-right pr-3">{kN(r.run.forces.totalN)}</td>
                <td className="text-right pr-3">{fmt(r.run.packer.sf, 4)}</td>
                <td className="text-right pr-3">{fmt(r.run.lengthChanges.totalM, 4)}</td>
                <td className="text-right pr-3">{r.run.packer.strokeOk ? 'ok' : 'exceeded'}</td>
                <td className={`text-right ${STATE_COLOUR[r.run.buckling.state]}`}>{r.run.buckling.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Three cases and three different limits. Production heating is the only one that buckles and
        it is inside its stroke. Injection cooling does not buckle and runs out of stroke.
        Stimulation has the lowest packer safety factor of the three and does not buckle either.
        Ask which case is the design case and the honest answer is that it depends which limit you
        are asking about. The helical threshold is always {fmt(HELICAL_RATIO, 10)} times the
        sinusoidal one.
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <NumField label="Mixture density (kg/m3)" value={rho} onChange={setRho} />
        <Tile label="RP 14E erosional velocity at C of 100" value={fmt(ve, 6)} unit="m/s" />
      </div>
      <Note>
        The erosional velocity is the one flow limit this engine keeps, and it is a screening
        number: an API RP 14E C factor with no corrosion, no sand and no material dependence in it.
        It sizes a tubing for rate; it does not certify one.
      </Note>
    </>
  );
};

const TubingExplorer = () => {
  const [mode, setMode] = useState('forces');
  return (
    <PanelShell
      title="Tubing and packer explorer"
      subtitle="The Lubinski force set, the length it produces, and the band the string can work in"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'forces' && <Forces />}
        {mode === 'envelope' && <Envelope />}
        {mode === 'scenarios' && <Scenarios />}
      </div>
    </PanelShell>
  );
};

export default TubingExplorer;
