import React, { useMemo, useState } from 'react';
import {
  burning, flameLength, tilt, sep, viewFactor, bagster, distanceToHeatFlux, parseNumber, STREAMS, FUELS,
  burningTeaching, flameTeaching, sepTeaching, viewFactorTeaching, bagsterTeaching, solidFlameTeaching, yellowBookPoolFire,
  typedPoolFire, TYPED_POOL_DEFAULT,
} from './consequenceLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, nine, twelve, Tbl, Refusal, Declared, Basis, safe,
} from './panelBits';

// The fire explorer (Professional): the solid flame model one step at a time,
// from the burning flux of a pool to the heat flux at a target. Every figure
// is a return value of the vendored consequence engine through consequenceLab,
// on the teaching streams or on what the learner types.

export const MODES = [
  ['flame', 'Burning flux, flame length, tilt and surface emissive power'],
  ['view', 'The view factor and the transmissivity'],
  ['heat', 'The heat flux from the pool you type, the distance to a heat flux and the worked pool fire'],
];

const str = (v) => (v === undefined || v === null ? '' : String(v));
const SEP_METHODS = [['mudan-diameter', 'from the diameter (Mudan)'], ['radiative-fraction', 'radiative fraction, clear flame'], ['radiative-fraction-soot', 'radiative fraction with soot']];

/** The pool, as the learner types it, shared by the flame view and the heat view. */
const usePool = () => {
  const [pool, setPool] = useState(() => ({ ...TYPED_POOL_DEFAULT }));
  const set = (k) => (v) => setPool((p) => ({ ...p, [k]: v }));
  return [pool, set];
};

const PoolFields = ({ pool, set }) => (
  <>
    <SelectField label="Fuel (Babrauskas table)" value={pool.fuel} onChange={set('fuel')} options={FUELS.map((f) => [f, f])} />
    <NumField label="Pool diameter, m" value={pool.poolDiameterM} onChange={set('poolDiameterM')} />
    <NumField label="Wind at 10 m, m/s" value={pool.windSpeed10mMS} onChange={set('windSpeed10mMS')} />
    <NumField label="Air density, kg/m3" value={pool.airDensityKgM3} onChange={set('airDensityKgM3')} />
    <NumField label="Air kinematic viscosity, m2/s" value={pool.airKinematicViscosityM2S} onChange={set('airKinematicViscosityM2S')} />
    <NumField label="Heat of combustion, J/kg" value={pool.heatOfCombustionJKg} onChange={set('heatOfCombustionJKg')} />
    <NumField label="Radiative fraction" value={pool.radiativeFraction} onChange={set('radiativeFraction')} />
    <NumField label="Soot fraction" value={pool.sootFraction} onChange={set('sootFraction')} />
  </>
);

export const FlameMode = ({ t, pool, set }) => {
  const [method, setMethod] = useState('radiative-fraction-soot');
  const {
    fuel, poolDiameterM: d, windSpeed10mMS: wind, airDensityKgM3: rho, airKinematicViscosityM2S: nu,
    heatOfCombustionJKg: dhc, radiativeFraction: fs, sootFraction: soot,
  } = pool;
  const b = useMemo(() => burning({ method: 'babrauskas', fuel, poolDiameterM: parseNumber(d) }), [fuel, d]);
  const l = useMemo(() => (b.error ? b : flameLength({
    method: 'thomas-wind', poolDiameterM: parseNumber(d), burningFluxKgM2S: b.burningFluxKgM2S, windSpeed10mMS: parseNumber(wind),
    airDensityKgM3: parseNumber(rho),
  })), [b, d, wind, rho]);
  const tl = useMemo(() => tilt({ poolDiameterM: parseNumber(d), windSpeed10mMS: parseNumber(wind), airKinematicViscosityM2S: parseNumber(nu) }), [d, wind, nu]);
  const s = useMemo(() => (l.error ? l : sep({
    method, poolDiameterM: parseNumber(d), radiativeFraction: parseNumber(fs), burningFluxKgM2S: b.burningFluxKgM2S,
    heatOfCombustionJKg: parseNumber(dhc), flameLengthM: l.flameLengthM, sootFraction: parseNumber(soot),
  })), [l, method, d, fs, b, dhc, soot]);
  return (
    <>
      <FieldGrid>
        <PoolFields pool={pool} set={set} />
        <SelectField label="Surface emissive power method" value={method} onChange={setMethod} options={SEP_METHODS} />
      </FieldGrid>
      <Note>The pool you type here is the pool the heat view runs.</Note>
      {b.error ? <Refusal r={b} /> : (
        <TileGrid>
          <Tile label="Burning flux" value={six(b.burningFluxKgM2S)} unit="kg/(m2 s)" />
          {!l.error && <Tile label="Scaled wind speed u*" value={six(l.scaledWindSpeed)} />}
          {!l.error && <Tile label="Flame length with wind" value={six(l.flameLengthM)} unit="m" />}
          {!tl.error && <Tile label="Tilt from the vertical" value={six(tl.tiltDeg)} unit="degrees" />}
          {!s.error && <Tile label="Surface emissive power" value={six(s.surfaceEmissivePowerWM2)} unit="W/m2" />}
        </TileGrid>
      )}
      {l.error && !b.error && <Refusal r={l} />}
      {tl.error && <Refusal r={tl} />}
      {s.error && !l.error && <Refusal r={s} />}
      <Basis r={l.error ? null : l} />
      {t && (
        <>
          <Note>The Babrauskas burning flux against the diameter, six fuels.</Note>
          <Tbl
            head={['diameter m', ...t.b.map((f) => f.fuel)]}
            rows={STREAMS.BURN_DIAMETERS.map((dd, i) => [String(dd), ...t.b.map((f) => six(f.rows[i].burningFluxKgM2S))])}
          />
          <Note>ERHA, the heptane teaching fire, against the wind.</Note>
          <Tbl head={['wind m/s', 'u*', 'flame length m', 'tilt degrees']} rows={t.f.winds.map((x) => [String(x.windSpeed10mMS), six(x.scaledWindSpeed), six(x.flameLengthM), six(x.tiltDeg)])} />
          <Tbl
            head={['surface emissive power method', 'W/m2']}
            rows={[['mudan-diameter', six(t.s.mudan)], ['radiative-fraction', six(t.s.clear)], ['radiative-fraction-soot', six(t.s.soot)]]}
          />
        </>
      )}
    </>
  );
};

export const ViewMode = ({ t }) => {
  const [radius, setRadius] = useState('10');
  const [length, setLength] = useState('30');
  const [x, setX] = useState('50');
  const [deg, setDeg] = useState('20');
  const [pw, setPw] = useState(str(STREAMS.BAGSTER_PW));
  const [path, setPath] = useState('30');
  const v = useMemo(() => viewFactor({
    flameRadiusM: parseNumber(radius), flameLengthM: parseNumber(length), distanceFromAxisM: parseNumber(x), tiltDeg: parseNumber(deg),
  }), [radius, length, x, deg]);
  const b = useMemo(() => bagster({ waterVapourPartialPressurePa: parseNumber(pw), pathLengthM: parseNumber(path) }), [pw, path]);
  return (
    <>
      <FieldGrid>
        <NumField label="Flame radius, m" value={radius} onChange={setRadius} />
        <NumField label="Flame length, m" value={length} onChange={setLength} />
        <NumField label="Target distance from the flame axis, m" value={x} onChange={setX} />
        <NumField label="Tilt toward the target, degrees" value={deg} onChange={setDeg} />
        <NumField label="Water vapour partial pressure, Pa" value={pw} onChange={setPw} />
        <NumField label="Path from the flame surface, m" value={path} onChange={setPath} />
      </FieldGrid>
      {v.error ? <Refusal r={v} /> : (
        <TileGrid>
          <Tile label="Fv, a vertical target" value={twelve(v.viewFactorVertical)} />
          <Tile label="Fh, a horizontal target" value={twelve(v.viewFactorHorizontal)} />
          <Tile label="Fmax" value={twelve(v.viewFactorMax)} />
        </TileGrid>
      )}
      {b.error ? <Refusal r={b} /> : (
        <TileGrid>
          <Tile label="pw x" value={six(b.waterVapourPathProductPaM)} unit="N/m" />
          <Tile label="Transmissivity" value={six(b.transmissivity)} />
        </TileGrid>
      )}
      <Declared title="A SINGLE ROUTE CORRELATION">
        The Bagster fit has no second derivation behind it in the engine&apos;s validation record. Every graded heat flux
        in this course uses a stated transmissivity.
      </Declared>
      {t && (
        <>
          <Note>A flame of radius 10 m and length 30 m, targets swept, three tilts. A refusal field marks a target under the flame.</Note>
          <Tbl
            head={['tilt degrees', 'distance m', 'Fv', 'Fh', 'Fmax', 'refusal field']}
            rows={t.v.map((r) => [String(r.tiltDeg), String(r.distanceFromAxisM), twelve(r.viewFactorVertical), twelve(r.viewFactorHorizontal), twelve(r.viewFactorMax), r.field || ''])}
          />
          <Tbl head={['path m', 'transmissivity or refusal field']} rows={t.b.map((r) => [String(r.pathLengthM), r.field ? r.field : six(r.transmissivity)])} />
        </>
      )}
    </>
  );
};

export const HeatMode = ({ t, pool, set }) => {
  const [target, setTarget] = useState('5000');
  const r = useMemo(() => typedPoolFire(pool), [pool]);
  const d = useMemo(() => (r.ok ? distanceToHeatFlux({ ...r.args, targetHeatFluxWM2: parseNumber(target) }) : null), [r, target]);
  return (
    <>
      <Note>
        The whole solid flame chain on the pool you type: the Babrauskas burning flux, Thomas with wind, the tilt, the soot
        surface emissive power, the view factor at a ground level target the flame leans toward, and a stated transmissivity.
        Nothing is rounded between the steps. The view opens on ERHA, the heptane teaching fire, and every input can be retyped.
      </Note>
      <FieldGrid>
        <PoolFields pool={pool} set={set} />
        <NumField label="Target distance from the pool centre, m" value={pool.distanceFromCentreM} onChange={set('distanceFromCentreM')} />
        <NumField label="Transmissivity, stated" value={pool.transmissivity} onChange={set('transmissivity')} />
        <NumField label="Target heat flux, W/m2" value={target} onChange={setTarget} />
      </FieldGrid>
      {!r.ok ? (r.field ? <Refusal r={{ field: r.field, error: r.errors.join(' ') }} /> : <Note>{r.errors.join(' ')}</Note>) : (
        <TileGrid>
          <Tile label="Flame length with wind" value={nine(r.flameLengthM)} unit="m" />
          <Tile label="Tilt from the vertical" value={nine(r.tiltDeg)} unit="degrees" />
          <Tile label="Surface emissive power from the diameter (Mudan)" value={nine(r.surfaceEmissivePowerMudanWM2)} unit="W/m2" />
          <Tile label="Surface emissive power, radiative fraction with soot" value={nine(r.surfaceEmissivePowerWM2)} unit="W/m2" />
          <Tile label="Fmax" value={twelve(r.viewFactorMax)} />
          <Tile label="Heat flux" value={nine(r.heatFluxWM2)} unit="W/m2" />
        </TileGrid>
      )}
      {r.ok && r.warnings.length > 0 && <Note>Engine warning: {r.warnings.join(' ')}</Note>}
      {d && (d.error ? <Refusal r={d} /> : (
        <TileGrid>
          <Tile label="State" value={d.state} />
          <Tile label="Distance from the centre" value={six(d.distanceFromCentreM)} unit="m" />
        </TileGrid>
      ))}
      <Note>The heat flux uses the surface emissive power with soot. The flame radius is half the pool diameter.</Note>
      <Basis r={r.ok ? r : null} />
      {t && (
        <>
          <Note>ERHA, the heptane teaching fire, at five distances.</Note>
          <Tbl
            head={['distance from centre m', 'Fmax', 'heat flux W/m2 or refusal field']}
            rows={t.s.rows.map((v) => [String(v.distanceFromCentreM), twelve(v.viewFactorMax), v.field ? v.field : six(v.heatFluxWM2)])}
          />
          <Note>The Yellow Book pool fire (golden), through the engine, beside what the book prints.</Note>
          <Tbl
            head={['quantity', 'engine', 'printed']}
            rows={[
              ['flame length m', six(t.y.flameLengthM), String(t.y.printed.flameLengthM)],
              ['tilt degrees', six(t.y.tiltDeg), String(t.y.printed.tiltDeg)],
              ['surface emissive power W/m2', six(t.y.surfaceEmissivePowerWM2), String(t.y.printed.surfaceEmissivePowerWM2)],
              ['Fmax', twelve(t.y.viewFactorMax), String(t.y.printed.viewFactorMax)],
              ['heat flux W/m2', six(t.y.heatFluxWM2), String(t.y.printed.heatFluxWM2)],
            ]}
          />
        </>
      )}
    </>
  );
};

const FireExplorer = ({ initialMode = 'flame' }) => {
  const [mode, setMode] = useState(initialMode);
  const [pool, set] = usePool();
  const tFlame = useMemo(() => (mode === 'flame' ? safe(() => ({ b: burningTeaching(), f: flameTeaching(), s: sepTeaching() })) : null), [mode]);
  const tView = useMemo(() => (mode === 'view' ? safe(() => ({ v: viewFactorTeaching(), b: bagsterTeaching() })) : null), [mode]);
  const tHeat = useMemo(() => (mode === 'heat' ? safe(() => ({ s: solidFlameTeaching(), y: yellowBookPoolFire() })) : null), [mode]);
  return (
    <PanelShell
      title="Fire explorer"
      subtitle="The solid flame model, one step at a time: burning flux, flame length, tilt, surface emissive power, view factor, transmissivity and the heat flux at a target."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'flame' && <FlameMode t={tFlame} pool={pool} set={set} />}
        {mode === 'view' && <ViewMode t={tView} />}
        {mode === 'heat' && <HeatMode t={tHeat} pool={pool} set={set} />}
      </div>
      <Note>Every number on this panel is a return value of the vendored consequence engine. The heat flux uses Fmax, the most exposed target.</Note>
    </PanelShell>
  );
};

export default FireExplorer;
