import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  engineScope, gasAtConditions, kValueTable, settling, verticalVessel,
} from './separationLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

// Separator explorer, the Associate tier. THE STREAM AND THE SIMPLE VESSEL:
// the gas at separator conditions, the K value and its derating, settling, and
// the vertical vessel whose diameter comes from the gas and whose height comes
// from the retention volume.
//
// Every figure on this page is a return value from separationLab, which is a
// return value from the vendored Separator & Slug Catcher Designer engines on
// the teaching streams ABANA-1, ABANA-2 and AGBAMI. Nothing here computes a
// density, a velocity, a diameter or a height, and nothing reads a clock.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// appears anywhere on this page.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

export const MODES = [
  ['conditions', 'Conditions: gauge to absolute, the pseudo-criticals, z, density and the rate'],
  ['kvalue', 'K value: six published rows, the derating, the floor and a vendor number'],
  ['settling', 'Settling: two liquid densities, the mixture and Souders-Brown'],
  ['vertical', 'Vertical vessel: the diameter the gas demands, and the height at each offered diameter'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const ConditionsMode = ({ gas, scope }) => {
  if (!gas) return <Note>The conditions reader did not return the streams.</Note>;
  const bars = gas.streams.map((s) => ({ stream: s.label, z: s.z, density: s.rhoGas }));
  return (
    <>
      <Tbl
        head={['stream', 'gas MMscfd', 'gauge psig', 'absolute psia (derived)', 'degF', 'gas gravity']}
        rows={gas.streams.map((s) => [s.longLabel, six(s.qGasMMscfd), six(s.pPsig), six(s.pPsiaDerived), six(s.tF), six(s.gasSg)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The absolute pressure is the gauge pressure plus 14.7 psi. A separator reading 600 psig on the gauge is at
        {' '}{six(gas.streams[0].pPsiaDerived)} psia, and every gas property below is read at the absolute figure.
      </p>
      <Tbl
        head={['stream', 'Tpc degR', 'Ppc psia', 'Ppr', 'Tpr', 'z', 'gas density lb/ft3', 'actual gas ft3/s']}
        rows={gas.streams.map((s) => [s.label, six(s.tpcR), six(s.ppcPsia), six(s.ppr), six(s.tpr), six(s.z), six(s.rhoGas), six(s.qGasActFt3S)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="stream" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="z" name="z factor" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="density" name="gas density, lb/ft3" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Rankine at the ABANA temperature" value={six(gas.rankineAtAbana)} unit="degR" />
          <Tile label="ABANA-2 at standard conditions (derived)" value={six(gas.abana2StandardFt3SDerived)} unit="standard ft3/s" />
          <Tile label="ABANA-2 in the vessel" value={six(gas.abana2ActualFt3S)} unit="ft3/s" />
          <Tile label="At" value={six(gas.abana2PPsia)} unit={`psia and ${six(gas.abana2TF)} degF`} />
        </TileGrid>
      </div>
      <Tbl
        head={['stream', 'gas MMscfd', 'standard ft3/s (derived)', 'degR', 'z', 'actual ft3/s', 'shrinkage (derived)']}
        rows={gas.streams.map((s) => [s.label, six(s.qGasMMscfd), six(s.standardFt3SDerived), six(s.rankineR), six(s.z), six(s.qGasActFt3S), six(s.shrinkageDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The shrinkage is the standard rate over the actual rate, and it is what the pressure, the temperature and z do to
        a volume between the sales meter and the vessel. A rate is not a rate until it is quoted at conditions.
      </p>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        ABANA-1 and ABANA-2 share a stream, so they share Ppr, Tpr, z and gas density. Only the gas rate differs,
        {' '}{six(gas.streams[0].qGasMMscfd)} MMscfd against {six(gas.streams[1].qGasMMscfd)} MMscfd, and the rate is what
        sizes the vessel.
      </p>
      <Tbl
        head={['published gasDensity case', 'psia', 'degF', 'gravity', 'what the engine returns']}
        rows={gas.published.map((c) => [
          c.name, six(c.input.pPsia), six(c.input.tF), six(c.input.gasSg),
          c.error ? `refused: ${c.error}` : `z ${six(c.z)}, density ${six(c.rhoLbFt3)} lb/ft3${c.note ? `, with a note` : ''}`,
        ])}
      />
      <Note>
        Three of the published cases sit outside the DAK validity range and come back refused rather than extrapolated.
        A fourth sits below the pressure where the fit data start and is accepted with a note saying so, because that is
        where an ordinary low-pressure separator lives.
      </Note>
      {scope && (
        <Tbl
          head={['what the engine refuses to guess', 'the input it names', 'its own message']}
          rows={scope.refusals.filter((r) => r.label.includes('gas density')).map((r) => [r.label, r.input, r.message])}
        />
      )}
    </>
  );
};

export const KValueMode = ({ k }) => {
  if (!k) return <Note>The K reader did not return the table.</Note>;
  const line = k.atPressure.map((r) => ({ label: `${r.internalsId} ${six(r.pPsig)}`, used: r.k, rule: r.kDerated }));
  return (
    <>
      <Tbl
        head={['id', 'label', 'orientation', 'base K ft/s']}
        rows={k.base.map((r) => [r.id, r.label, r.orientation, six(r.k)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Six published rows, and every one of them can be replaced by a vendor number. A horizontal vessel carries a
        higher K than a vertical one at the same mist extractor, and a vessel with no mist extractor carries the lowest.
      </p>
      <Tbl
        head={['mist extractor', 'psig', 'base K', 'K the rule gives', 'K used', 'derated', 'floored', 'nearFloor']}
        rows={k.atPressure.map((r) => [r.internalsId, six(r.pPsig), six(r.kBase), six(r.kDerated), six(r.k), String(r.derated), String(r.floored), String(r.nearFloor)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={line} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ ...AXIS, fontSize: 9 }} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={k.floor} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'the floor', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="rule" name="what the rule gives" stroke="#475569" dot={false} isAnimationActive={false} />
            <Line dataKey="used" name="K used" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The derating floor" value={six(k.floor)} unit="ft/s, engine constant K_FLOOR" />
          <Tile label="A vendor K wins outright" value={six(k.override.k)} unit={`ft/s, source ${k.override.source}`} />
          <Tile label="Derated by the rule" value={String(k.override.derated)} unit="a typed K is never derated" />
          <Tile label="Floored" value={String(k.override.floored)} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Below the floor the rule stops meaning anything, and the engine says so rather than returning the number the rule
        produced: {k.flooredWarning}
      </p>
      <Tbl
        head={['published kValue case', 'K used ft/s', 'K the rule gives', 'derated', 'floored', 'nearFloor']}
        rows={k.published.map((c) => [c.name, six(c.k), six(c.kDerated), String(c.derated), String(c.floored), String(c.nearFloor)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A derated K can sit close to the floor and still read like a robust one, so the return carries a flag for it.
        {' '}{k.nearFloor.name} comes back at {six(k.nearFloor.k)} ft/s with floored {String(k.nearFloor.floored)} and
        {' '}nearFloor {String(k.nearFloor.nearFloor)}, which is only {six(k.nearFloor.gapAboveFloorDerived)} ft/s above
        {' '}the floor of {six(k.nearFloor.floor)} ft/s. Another 50 psig of operating pressure puts that vessel on the
        {' '}floor. nearFloor is true when one more 100 psi step of the same rule would floor the value, and it is never
        {' '}true at the same time as floored.
      </p>
      <div className="mt-3 rounded-md border border-amber-700/60 bg-amber-950/20 p-3">
        <p className="text-amber-300 text-xs font-medium mb-1">HELD FOR LITERATURE</p>
        <p className="text-xs text-slate-300 mb-0">{k.held.note}</p>
      </div>
    </>
  );
};

export const SettlingMode = ({ st, scope }) => {
  if (!st) return <Note>The settling reader did not return the densities.</Note>;
  return (
    <>
      <Tbl
        head={['stream', 'oil API', 'oil lb/ft3', 'water SG', 'water lb/ft3', 'oil bpd', 'water bpd', 'mixture lb/ft3']}
        rows={st.densities.map((d) => [d.label, six(d.oilApi), six(d.rhoOil), six(d.waterSg), six(d.rhoWater), six(d.qOilBpd), six(d.qWaterBpd), six(d.rhoLiquid)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The mixture the gas load sees is the two densities weighted by their volume rates. On AGBAMI the weighted figure
        is {six(st.agbamiWeighted)} lb/ft3 while a plain average of the two would give {six(st.agbamiAverageDerived)} lb/ft3,
        and the gap grows with the water cut.
      </p>
      <Tbl
        head={['stream', 'K ft/s', 'liquid lb/ft3', 'gas lb/ft3', 'terminal velocity ft/s']}
        rows={st.soudersBrown.map((r) => [r.label, six(r.k), six(r.rhoLiquid), six(r.rhoGas), six(r.vT)])}
      />
      <div className="mt-3">
        <TileGrid>
          {st.soudersBrown.map((r) => (
            <Tile key={r.label} label={r.label} value={six(r.vT)} unit="ft/s" />
          ))}
        </TileGrid>
      </div>
      <Tbl
        head={['published soudersBrown case', 'K ft/s', 'liquid lb/ft3', 'gas lb/ft3', 'terminal velocity ft/s']}
        rows={st.published.map((c) => [c.name, six(c.input.k), six(c.input.rhoLLbFt3), six(c.input.rhoGLbFt3), six(c.vFtS)])}
      />
      {scope && (
        <Tbl
          head={['a state settling has no answer for', 'what the engine returns']}
          rows={scope.softStates.filter((s) => s.label.includes('denser') || s.label.includes('settling velocity'))
            .map((s) => [s.label, s.error])}
        />
      )}
      <Note>
        A settling velocity needs a positive K and a liquid denser than the gas. Where it has neither, the engine returns
        an error string and the vessel is never sized on a number it could not compute.
      </Note>
    </>
  );
};

export const VerticalMode = ({ v }) => {
  if (!v) return <Note>The vertical vessel reader did not return the sizing.</Note>;
  const chart = v.rows.map((r) => ({ diameter: six(r.diameterFt), height: r.heightFt, margin: r.velocityMargin }));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Area the gas needs (derived)" value={six(v.gasAreaDerived)} unit="ft2" />
          <Tile label="Diameter that area implies" value={six(v.diameterGasFt)} unit="ft" />
          <Tile label="Retention volume" value={six(v.liquidVolFt3)} unit="ft3" />
          <Tile label="Held" value={`${six(v.qLiquidBpd)} bpd`} unit={`for ${six(v.retentionMin)} minutes`} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        At the gas-required diameter the liquid stands {six(v.hLiquidFt)} ft deep, the vessel is {six(v.heightFt)} ft tall
        once the {six(v.allowanceFt)} ft allowance is added, the slenderness is {six(v.ldRatio)}, and the velocity margin is
        exactly {six(v.velocityMargin)} because the diameter was chosen to make it so.
      </p>
      <Tbl
        head={['diameter ft', 'liquid ft', 'height ft', 'L/D', 'gas velocity ft/s', 'margin', 'carries the gas']}
        rows={v.rows.map((r) => [six(r.diameterFt), six(r.hLiquidFt), six(r.heightFt), six(r.ldRatio), six(r.gasVelocityFtS), six(r.velocityMargin), String(r.gasCapacityOk)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="diameter" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(val) => six(val)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={1} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'margin of 1', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="height" name="height, ft" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="margin" name="velocity margin" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The height falls and the margin rises with diameter, because the same liquid volume spreads over a larger floor
        while the same gas crosses a larger area. The smallest diameter on the list cannot carry the gas at all.
      </p>
      <Tbl
        head={['published vertical case', 'diameter ft', 'liquid ft', 'height ft', 'L/D', 'margin']}
        rows={v.published.map((c) => [c.name, six(c.diameterFt), six(c.hLiquidFt), six(c.heightFt), six(c.ldRatio), six(c.velocityMargin)])}
      />
      <Note>
        Both published vertical cases are sized by their gas load, so both come back with a margin of exactly one. A
        vessel built wider than that has margin to spare, and a vessel built narrower carries liquid into the gas outlet.
      </Note>
    </>
  );
};

const SeparatorExplorer = ({ initialMode = 'conditions' }) => {
  const [mode, setMode] = useState(initialMode);
  const scope = useMemo(() => safe(engineScope), []);
  const gas = useMemo(() => (mode === 'conditions' ? safe(gasAtConditions) : null), [mode]);
  const k = useMemo(() => (mode === 'kvalue' ? safe(kValueTable) : null), [mode]);
  const st = useMemo(() => (mode === 'settling' ? safe(settling) : null), [mode]);
  const v = useMemo(() => (mode === 'vertical' ? safe(verticalVessel) : null), [mode]);

  return (
    <PanelShell
      title="Separator explorer"
      subtitle="ABANA and AGBAMI in field units: the gas at separator conditions, the K value and its derating, settling, and the vertical vessel whose diameter comes from the gas."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'conditions' && <ConditionsMode gas={gas} scope={scope} />}
        {mode === 'kvalue' && <KValueMode k={k} />}
        {mode === 'settling' && <SettlingMode st={st} scope={scope} />}
        {mode === 'vertical' && <VerticalMode v={v} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored sizing engine on the teaching streams, printed to the
        precision the lessons use. Vessel work is in feet, rates in MMscfd and bpd, pressures in psig and psia,
        and temperatures in degF.
      </Note>
    </PanelShell>
  );
};

export default SeparatorExplorer;
