import React, { useMemo, useState } from 'react';
import {
  tnt, blast, blastDistance, thermal, toxic, toxicLoad, overpressureHarm, toProbability, toProbit,
  parseNumber, parseHistory, historyText, STREAMS, THERMAL_PRESETS, TOXIC_PRESETS, PA_PER_PSI,
  blastTeaching, probitTeaching, toxicTeaching,
} from './consequenceLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextRows, Refusal, Declared, Basis, safe,
} from './panelBits';

// The harm explorer (Expert): the blast field of a TNT equivalent charge,
// forward and inverse, and the probits that turn a thermal dose, a toxic load
// or an overpressure into a probability. Every figure is a return value of the
// vendored consequence engine through consequenceLab, on the teaching streams
// or on what the learner types.

export const MODES = [
  ['blast', 'TNT equivalence and the Kinney and Graham blast field'],
  ['probit', 'Probits: the thermal presets and the overpressure probit'],
  ['toxic', 'Toxic probits and a concentration that changes'],
];

const str = (v) => (v === undefined || v === null ? '' : String(v));

export const BlastMode = ({ t }) => {
  const B = STREAMS.BONGA_TNT;
  const [fuel, setFuel] = useState(str(B.fuelMassKg));
  const [dhc, setDhc] = useState(str(B.heatOfCombustionJKg));
  const [yieldFactor, setYield] = useState(str(B.yieldFactor));
  const [etnt, setEtnt] = useState(str(B.tntBlastEnergyJKg));
  const [charge, setCharge] = useState(str(STREAMS.BONGA_CHARGE_KG));
  const [x, setX] = useState('100');
  const [p, setP] = useState('20000');
  const m = useMemo(() => tnt({
    fuelMassKg: parseNumber(fuel), heatOfCombustionJKg: parseNumber(dhc), yieldFactor: parseNumber(yieldFactor), tntBlastEnergyJKg: parseNumber(etnt),
  }), [fuel, dhc, yieldFactor, etnt]);
  const f = useMemo(() => blast({ distanceM: parseNumber(x), tntMassKg: parseNumber(charge) }), [x, charge]);
  const inv = useMemo(() => blastDistance({ tntMassKg: parseNumber(charge), overpressurePa: parseNumber(p) }), [charge, p]);
  return (
    <>
      <FieldGrid>
        <NumField label="Fuel mass, kg" value={fuel} onChange={setFuel} />
        <NumField label="Heat of combustion, J/kg" value={dhc} onChange={setDhc} />
        <NumField label="Yield factor" value={yieldFactor} onChange={setYield} />
        <NumField label="TNT blast energy, J/kg" value={etnt} onChange={setEtnt} />
        <NumField label="TNT charge for the blast field, kg" value={charge} onChange={setCharge} />
        <NumField label="Distance, m" value={x} onChange={setX} />
        <NumField label="Overpressure to find a distance for, Pa" value={p} onChange={setP} />
      </FieldGrid>
      {m.error ? <Refusal r={m} /> : <TileGrid><Tile label="TNT equivalent mass" value={six(m.tntMassKg)} unit="kg" /></TileGrid>}
      {f.error ? <Refusal r={f} /> : (
        <TileGrid>
          <Tile label="Scaled distance Z" value={six(f.scaledDistanceMKg13)} unit="m/kg^(1/3)" />
          <Tile label="Overpressure over ambient" value={six(f.overpressureRatio)} />
          <Tile label="Peak side-on overpressure" value={six(f.overpressurePa)} unit="Pa" />
        </TileGrid>
      )}
      {inv.error ? <Refusal r={inv} /> : <TileGrid><Tile label="Distance for that overpressure" value={six(inv.distanceM)} unit="m" /></TileGrid>}
      <Basis r={f.error ? null : f} />
      <Declared title="A SINGLE ROUTE QUANTITY">
        The TNT equivalence has no second derivation behind it in the engine&apos;s validation record, so every graded blast
        in this course states its TNT mass.
      </Declared>
      {t && (
        <>
          <Tbl head={['distance m', 'Z', 'overpressure Pa']} rows={t.forward.map((v) => [String(v.distanceM), six(v.scaledDistanceMKg13), six(v.overpressurePa)])} />
          <Tbl head={['overpressure Pa', 'Z', 'distance m']} rows={t.inverse.map((v) => [String(v.overpressurePa), six(v.scaledDistanceMKg13), six(v.distanceM)])} />
        </>
      )}
    </>
  );
};

export const ProbitMode = ({ t }) => {
  const [preset, setPreset] = useState('eisenberg');
  const [q, setQ] = useState('20000');
  const [secs, setSecs] = useState('20');
  const [psig, setPsig] = useState('10');
  const [y, setY] = useState('5');
  const [prob, setProb] = useState('0.5');
  const th = useMemo(() => thermal({ coefficients: preset, heatFluxWM2: parseNumber(q), exposureTimeS: parseNumber(secs) }), [preset, q, secs]);
  const op = useMemo(() => overpressureHarm({ overpressurePa: parseNumber(psig) * PA_PER_PSI }), [psig]);
  const py = useMemo(() => toProbability(parseNumber(y)), [y]);
  const yp = useMemo(() => toProbit(parseNumber(prob)), [prob]);
  return (
    <>
      <FieldGrid>
        <SelectField label="Thermal preset" value={preset} onChange={setPreset} options={THERMAL_PRESETS.map((k) => [k, k])} />
        <NumField label="Heat flux, W/m2" value={q} onChange={setQ} />
        <NumField label="Exposure time, s" value={secs} onChange={setSecs} />
        <NumField label="Overpressure, psig" value={psig} onChange={setPsig} />
        <NumField label="A probit" value={y} onChange={setY} />
        <NumField label="A probability" value={prob} onChange={setProb} />
      </FieldGrid>
      {th.error ? <Refusal r={th} /> : (
        <TileGrid>
          <Tile label="Thermal dose" value={six(th.dose)} unit={th.doseUnit} />
          <Tile label="Thermal probit" value={six(th.probit)} />
          <Tile label="Probability" value={six(th.probability)} />
        </TileGrid>
      )}
      {op.error ? <Refusal r={op} /> : (
        <TileGrid>
          <Tile label="Overpressure probit" value={six(op.probit)} />
          <Tile label="Probability" value={six(op.probability)} />
        </TileGrid>
      )}
      <TileGrid>
        <Tile label="Probability of that probit" value={py.error ? 'refused' : six(py.probability)} />
        <Tile label="Probit of that probability" value={yp.error ? 'refused' : six(yp.probit)} />
      </TileGrid>
      {yp.error && <Refusal r={yp} />}
      <Declared title="THE INVERSE IS APPROXIMATE">
        The engine inverts its own approximate normal CDF by bisection. Read a probit or a lethal dose back from a
        probability to the figures that approximation supports.
      </Declared>
      {t && (
        <>
          <Tbl head={['probit', 'probability']} rows={t.ladder.map((v) => [String(v.probit), six(v.probability)])} />
          <Tbl
            head={['heat flux W/m2', 'time s', ...THERMAL_PRESETS]}
            rows={t.thermal.map((v) => [String(v.heatFluxWM2), String(v.exposureTimeS), ...v.probabilities.map(six)])}
          />
          <Tbl head={['psig', 'probit', 'probability']} rows={t.overpressure.map((v) => [String(v.psig), six(v.probit), six(v.probability)])} />
        </>
      )}
    </>
  );
};

export const ToxicMode = ({ t }) => {
  const [preset, setPreset] = useState('lees-chlorine');
  const [unit, setUnit] = useState('ppm');
  const [c, setC] = useState('200');
  const [mins, setMins] = useState(str(STREAMS.CHLORINE_MINUTES));
  const [mw, setMw] = useState(str(STREAMS.CHLORINE_MOLAR_MASS));
  const [temp, setTemp] = useState('298.15');
  const [n, setN] = useState('2');
  const [hist, setHist] = useState(historyText(STREAMS.TOXIC_HISTORY));
  const r = useMemo(() => toxic({
    coefficients: preset,
    ...(unit === 'ppm' ? { concentrationPpm: parseNumber(c) } : { concentrationMgM3: parseNumber(c) }),
    exposureMinutes: parseNumber(mins), molarMassGMol: parseNumber(mw), temperatureK: parseNumber(temp),
  }), [preset, unit, c, mins, mw, temp]);
  const h = useMemo(() => toxicLoad({ n: parseNumber(n), history: parseHistory(hist) }), [n, hist]);
  return (
    <>
      <FieldGrid>
        <SelectField label="Toxic preset" value={preset} onChange={setPreset} options={TOXIC_PRESETS.map((k) => [k, k])} />
        <SelectField label="Concentration typed in" value={unit} onChange={setUnit} options={[['ppm', 'ppm'], ['mg/m3', 'mg/m3']]} />
        <NumField label="Concentration" value={c} onChange={setC} />
        <NumField label="Exposure, minutes" value={mins} onChange={setMins} />
        <NumField label="Molar mass, g/mol (to convert)" value={mw} onChange={setMw} />
        <NumField label="Temperature, K (to convert)" value={temp} onChange={setTemp} />
        <NumField label="Toxic load exponent n, for the history" value={n} onChange={setN} />
        <TextRows label="A concentration history, one step per line: concentration, minutes" value={hist} onChange={setHist} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <TileGrid>
          <Tile label="Concentration in the preset unit" value={six(r.concentrationInPresetUnit)} />
          <Tile label="Toxic load" value={six(r.dose)} unit={r.doseUnit} />
          <Tile label="Probit" value={six(r.probit)} />
          <Tile label="Probability" value={six(r.probability)} />
        </TileGrid>
      )}
      {h.error ? <Refusal r={h} /> : <TileGrid><Tile label="Toxic load of the history" value={six(h.dose)} /></TileGrid>}
      <Basis r={r.error ? null : r} />
      {t && (
        <>
          <Note>Chlorine for {STREAMS.CHLORINE_MINUTES} minutes under the two sources that carry it.</Note>
          <Tbl head={['ppm', 'lees probability', 'pb probability']} rows={t.chlorine.map((v) => [String(v.concentrationPpm), six(v.leesProbability), six(v.pbProbability)])} />
          <Tbl head={['teaching history', 'toxic load at n = 2']} rows={[['three steps', six(t.history)]]} />
        </>
      )}
    </>
  );
};

const HarmExplorer = ({ initialMode = 'blast' }) => {
  const [mode, setMode] = useState(initialMode);
  const tBlast = useMemo(() => (mode === 'blast' ? safe(blastTeaching) : null), [mode]);
  const tProbit = useMemo(() => (mode === 'probit' ? safe(probitTeaching) : null), [mode]);
  const tToxic = useMemo(() => (mode === 'toxic' ? safe(toxicTeaching) : null), [mode]);
  return (
    <PanelShell
      title="Harm explorer"
      subtitle="A blast field forward and inverse, and the probits that turn a thermal dose, a toxic load or an overpressure into a probability. Every preset is named by its source."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'blast' && <BlastMode t={tBlast} />}
        {mode === 'probit' && <ProbitMode t={tProbit} />}
        {mode === 'toxic' && <ToxicMode t={tToxic} />}
      </div>
      <Note>Every number on this panel is a return value of the vendored consequence engine. A probit gives a probability of harm to the people exposed and says nothing about how often the exposure happens.</Note>
    </PanelShell>
  );
};

export default HarmExplorer;
