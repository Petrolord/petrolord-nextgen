import React, { useMemo, useState } from 'react';
import {
  liquid, gas, pool, evaporation, plume, reachOf, parseNumber, STREAMS, STABILITY_CLASSES,
  liquidTeaching, gasTeaching, poolTeaching, evaporationTeaching, plumeTeaching, reachTeaching,
} from './consequenceLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, Tbl, Refusal, Declared, Warning, Basis, safe,
} from './panelBits';

// The release explorer (Associate): how much gets out of a hole, what a spill
// becomes, and where a sustained release goes. Every figure is a return value
// of the vendored consequence engine through consequenceLab, on the teaching
// streams or on what the learner types. A refused input shows the engine's
// own words.

export const MODES = [
  ['outflow', 'Liquid and gas through a hole'],
  ['pool', 'A spill, its pool and its evaporation'],
  ['plume', 'The Gaussian plume and how far it reaches'],
];

const str = (v) => (v === undefined || v === null ? '' : String(v));

export const OutflowMode = ({ t }) => {
  const L = STREAMS.AMENAM_LIQUID;
  const G = STREAMS.AMENAM_GAS;
  const [cd, setCd] = useState(str(L.dischargeCoefficient));
  const [hole, setHole] = useState(str(L.holeDiameterM));
  const [rho, setRho] = useState(str(L.liquidDensityKgM3));
  const [head, setHead] = useState(str(L.liquidHeadM));
  const [ullage, setUllage] = useState(str(L.pressureAboveLiquidPa));
  const [p0, setP0] = useState('500000');
  const [t0, setT0] = useState(str(G.upstreamTemperatureK));
  const [mw, setMw] = useState(str(G.molarMassKgMol));
  const [gamma, setGamma] = useState(str(G.heatCapacityRatio));
  const [gHole, setGHole] = useState(str(G.holeDiameterM));
  const l = useMemo(() => liquid({
    dischargeCoefficient: parseNumber(cd), holeDiameterM: parseNumber(hole), liquidDensityKgM3: parseNumber(rho),
    liquidHeadM: parseNumber(head), pressureAboveLiquidPa: parseNumber(ullage),
  }), [cd, hole, rho, head, ullage]);
  const g = useMemo(() => gas({
    dischargeCoefficient: parseNumber(cd), holeDiameterM: parseNumber(gHole), upstreamPressurePa: parseNumber(p0),
    upstreamTemperatureK: parseNumber(t0), molarMassKgMol: parseNumber(mw), heatCapacityRatio: parseNumber(gamma),
  }), [cd, gHole, p0, t0, mw, gamma]);
  return (
    <>
      <Note>A liquid line: Bernoulli through a hole, with the static head and the pressure above the liquid.</Note>
      <FieldGrid>
        <NumField label="Discharge coefficient" value={cd} onChange={setCd} />
        <NumField label="Liquid hole diameter, m" value={hole} onChange={setHole} />
        <NumField label="Liquid density, kg/m3" value={rho} onChange={setRho} />
        <NumField label="Liquid head above the hole, m" value={head} onChange={setHead} />
        <NumField label="Pressure above the liquid, Pa absolute" value={ullage} onChange={setUllage} />
      </FieldGrid>
      {l.error ? <Refusal r={l} /> : (
        <TileGrid>
          <Tile label="Driving pressure" value={six(l.drivingPressurePa)} unit="Pa" />
          <Tile label="Mass rate" value={six(l.massRateKgS)} unit="kg/s" />
          <Tile label="Jet velocity" value={six(l.jetVelocityMS)} unit="m/s" />
        </TileGrid>
      )}
      <Note>A gas line through a hole of its own: choked or subsonic, by the critical pressure ratio.</Note>
      <FieldGrid>
        <NumField label="Gas hole diameter, m" value={gHole} onChange={setGHole} />
        <NumField label="Upstream pressure, Pa absolute" value={p0} onChange={setP0} />
        <NumField label="Upstream temperature, K" value={t0} onChange={setT0} />
        <NumField label="Molar mass, kg/mol" value={mw} onChange={setMw} />
        <NumField label="Heat capacity ratio" value={gamma} onChange={setGamma} />
      </FieldGrid>
      {g.error ? <Refusal r={g} /> : (
        <TileGrid>
          <Tile label="Regime" value={g.regime} />
          <Tile label="Ambient over upstream" value={six(g.pressureRatio)} />
          <Tile label="Critical pressure ratio" value={six(g.criticalPressureRatio)} />
          <Tile label="Outflow coefficient psi" value={six(g.outflowCoefficientPsi)} />
          <Tile label="Mass rate" value={six(g.massRateKgS)} unit="kg/s" />
        </TileGrid>
      )}
      <Basis r={g.error ? null : g} />
      {t && (
        <>
          <Note>The AMENAM crude line with its head swept, the ullage held.</Note>
          <Tbl head={['head m', 'driving pressure Pa', 'mass rate kg/s']} rows={t.l.heads.map((x) => [String(x.liquidHeadM), six(x.drivingPressurePa), six(x.massRateKgS)])} />
          <Note>The AMENAM methane line across the critical ratio.</Note>
          <Tbl
            head={['upstream Pa', 'ambient over upstream', 'regime', 'psi', 'mass rate kg/s']}
            rows={t.g.rows.map((x) => [String(x.upstreamPressurePa), six(x.pressureRatio), x.regime, six(x.psi), six(x.massRateKgS)])}
          />
        </>
      )}
    </>
  );
};

export const PoolMode = ({ t }) => {
  const [volume, setVolume] = useState(str(STREAMS.SPILL_M3));
  const [bundArea, setBundArea] = useState(str(STREAMS.BUND.bundAreaM2));
  const [wall, setWall] = useState(str(STREAMS.BUND.bundWallHeightM));
  const [thickness, setThickness] = useState('');
  const E = STREAMS.EVAP;
  const [wind, setWind] = useState(str(E.windSpeed10mMS));
  const [pv, setPv] = useState(str(E.vapourPressurePa));
  const [mw, setMw] = useState(str(E.molarMassKgMol));
  const [temp, setTemp] = useState(str(E.liquidTemperatureK));
  const p = useMemo(() => pool({
    spillVolumeM3: parseNumber(volume),
    ...(thickness === '' ? { bundAreaM2: parseNumber(bundArea), bundWallHeightM: parseNumber(wall) } : { poolThicknessM: parseNumber(thickness) }),
  }), [volume, bundArea, wall, thickness]);
  const ev = useMemo(() => (p.error ? null : evaporation({
    poolDiameterM: p.equivalentDiameterM, windSpeed10mMS: parseNumber(wind), vapourPressurePa: parseNumber(pv),
    molarMassKgMol: parseNumber(mw), liquidTemperatureK: parseNumber(temp),
  })), [p, wind, pv, mw, temp]);
  return (
    <>
      <FieldGrid>
        <NumField label="Spill volume, m3" value={volume} onChange={setVolume} />
        <NumField label="Bund floor area, m2" value={bundArea} onChange={setBundArea} />
        <NumField label="Bund wall height, m" value={wall} onChange={setWall} />
        <NumField label="Pool thickness, m (typed: an unconfined pool)" value={thickness} onChange={setThickness} />
        <NumField label="Wind at 10 m, m/s" value={wind} onChange={setWind} />
        <NumField label="Vapour pressure, Pa" value={pv} onChange={setPv} />
        <NumField label="Molar mass, kg/mol" value={mw} onChange={setMw} />
        <NumField label="Liquid temperature, K" value={temp} onChange={setTemp} />
      </FieldGrid>
      {p.error ? <Refusal r={p} /> : (
        <TileGrid>
          <Tile label="Containment" value={p.containment} />
          <Tile label="Pool area" value={six(p.areaM2)} unit="m2" />
          <Tile label="Depth" value={six(p.depthM)} unit="m" />
          <Tile label="Equivalent diameter" value={six(p.equivalentDiameterM)} unit="m" />
        </TileGrid>
      )}
      {ev && (ev.error ? <Refusal r={ev} /> : (
        <TileGrid>
          <Tile label="Evaporation flux" value={twelve(ev.evaporationFluxKgM2S)} unit="kg/(m2 s)" />
          <Tile label="Evaporation rate" value={six(ev.evaporationRateKgS)} unit="kg/s" />
        </TileGrid>
      ))}
      <Declared title="A SINGLE ROUTE CORRELATION">
        Mackay and Matsugu has no second derivation behind it in the engine&apos;s validation record. It is taught here and
        never carries a graded answer.
      </Declared>
      {t && (
        <>
          <Note>The teaching spill of {STREAMS.SPILL_M3} m3 at stated thicknesses.</Note>
          <Tbl head={['thickness m', 'area m2', 'equivalent diameter m']} rows={t.p.thicknesses.map((x) => [String(x.poolThicknessM), six(x.areaM2), six(x.equivalentDiameterM)])} />
          <Note>The hexane-like pool with the wind swept.</Note>
          <Tbl head={['wind m/s', 'evaporation rate kg/s']} rows={t.e.winds.map((x) => [String(x.windSpeed10mMS), six(x.evaporationRateKgS)])} />
        </>
      )}
    </>
  );
};

export const PlumeMode = ({ t }) => {
  const U = STREAMS.UBIT;
  const [q, setQ] = useState(str(U.massRateKgS));
  const [u, setU] = useState(str(U.windSpeedMS));
  const [cls, setCls] = useState('D');
  const [x, setX] = useState('500');
  const [y, setY] = useState('0');
  const [z, setZ] = useState('0');
  const [h, setH] = useState('0');
  const [mw, setMw] = useState(str(U.molarMassGMol));
  const [target, setTarget] = useState('100');
  const r = useMemo(() => plume({
    massRateKgS: parseNumber(q), windSpeedMS: parseNumber(u), stabilityClass: cls, downwindDistanceM: parseNumber(x),
    crosswindDistanceM: parseNumber(y), receptorHeightM: parseNumber(z), releaseHeightM: parseNumber(h), molarMassGMol: parseNumber(mw),
  }), [q, u, cls, x, y, z, h, mw]);
  const d = useMemo(() => reachOf({
    massRateKgS: parseNumber(q), windSpeedMS: parseNumber(u), stabilityClass: cls, targetConcentrationMgM3: parseNumber(target),
    receptorHeightM: parseNumber(z), releaseHeightM: parseNumber(h),
  }), [q, u, cls, target, z, h]);
  return (
    <>
      <FieldGrid>
        <NumField label="Release rate, kg/s" value={q} onChange={setQ} />
        <NumField label="Wind speed, m/s" value={u} onChange={setU} />
        <SelectField label="Pasquill-Gifford class" value={cls} onChange={setCls} options={STABILITY_CLASSES.map((k) => [k, k])} />
        <NumField label="Downwind distance, m" value={x} onChange={setX} />
        <NumField label="Crosswind distance, m" value={y} onChange={setY} />
        <NumField label="Receptor height, m" value={z} onChange={setZ} />
        <NumField label="Release height, m" value={h} onChange={setH} />
        <NumField label="Molar mass, g/mol (for ppm)" value={mw} onChange={setMw} />
        <NumField label="Target concentration, mg/m3" value={target} onChange={setTarget} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <TileGrid>
          <Tile label="sigma_y" value={six(r.sigmaYM)} unit="m" />
          <Tile label="sigma_z" value={six(r.sigmaZM)} unit="m" />
          <Tile label="Concentration" value={six(r.concentrationMgM3)} unit="mg/m3" />
          <Tile label="Concentration" value={six(r.concentrationPpm)} unit="ppm" />
        </TileGrid>
      )}
      {!r.error && <Warning text={r.warning} />}
      {d.error ? <Refusal r={d} /> : (
        <TileGrid>
          <Tile label="State" value={d.state} />
          <Tile label="Peak on the centreline" value={six(d.peakConcentrationMgM3)} unit="mg/m3" />
          <Tile label="Near distance" value={six(d.nearDistanceM)} unit="m" />
          <Tile label="Far distance" value={six(d.farDistanceM)} unit="m" />
        </TileGrid>
      )}
      <Basis r={r.error ? null : r} />
      {t && (
        <>
          <Note>The UBIT release on the centreline at ground level, class D.</Note>
          <Tbl head={['distance m', 'mg/m3', 'ppm']} rows={t.p.distances.map((v) => [String(v.downwindDistanceM), six(v.concentrationMgM3), six(v.concentrationPpm)])} />
          <Note>UBIT from the stack: a near root and a far root below the peak.</Note>
          <Tbl
            head={['target mg/m3', 'state', 'peak mg/m3', 'near m', 'far m']}
            rows={t.r.stack.map((v) => [String(v.target), v.state, six(v.peakConcentrationMgM3), six(v.nearDistanceM), six(v.farDistanceM)])}
          />
        </>
      )}
    </>
  );
};

const ReleaseExplorer = ({ initialMode = 'outflow' }) => {
  const [mode, setMode] = useState(initialMode);
  const tOut = useMemo(() => (mode === 'outflow' ? safe(() => ({ l: liquidTeaching(), g: gasTeaching() })) : null), [mode]);
  const tPool = useMemo(() => (mode === 'pool' ? safe(() => ({ p: poolTeaching(), e: evaporationTeaching() })) : null), [mode]);
  const tPlume = useMemo(() => (mode === 'plume' ? safe(() => ({ p: plumeTeaching(), r: reachTeaching() })) : null), [mode]);
  return (
    <PanelShell
      title="Release explorer"
      subtitle="How much gets out of a hole, what a spill becomes, and where a sustained release goes. Type every input: the engine refuses what it cannot model and says why."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'outflow' && <OutflowMode t={tOut} />}
        {mode === 'pool' && <PoolMode t={tPool} />}
        {mode === 'plume' && <PlumeMode t={tPlume} />}
      </div>
      <Note>Every number on this panel is a return value of the vendored consequence engine. Pressures are absolute.</Note>
    </PanelShell>
  );
};

export default ReleaseExplorer;
