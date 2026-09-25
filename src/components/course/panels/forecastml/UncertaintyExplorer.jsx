import React, { useMemo, useState } from 'react';
import {
  parseSeries, parseNumber, parseNames, seriesText, WELL_IDS, TEACHING, DEFAULTS, intervalsOf, arpsOf, compareOf, fitOf, backtestOf,
} from './forecastLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, Refusal, Warning, Declared,
} from './panelBits';

// The uncertainty explorer (Expert): intervals, the Arps baseline and the
// engine's rules. Put residual-bootstrap intervals around a forecast with a
// stated seed and number of paths, read the percentiles under the platform's
// exceedance labels (P90 the low case), fit the Arps baseline through the
// decline curve engine, rank the smoothing methods against it on the same
// origins, and probe a boundary rule either side. Every figure is a return
// value of the vendored forecasting engine through forecastLab.

export const MODES = [
  ['intervals', 'Bootstrap intervals'],
  ['paths', 'Seeds, paths and clipping'],
  ['arps', 'The Arps baseline'],
  ['compare', 'Methods ranked against Arps'],
  ['bounds', 'A boundary, either side'],
];

const METHOD_OPTIONS = [['ses', 'ses'], ['holt', 'holt'], ['damped', 'damped']];
const WELL_OPTIONS = WELL_IDS.map((w) => [w, w]);

const useSeries = (initial) => {
  const [text, setText] = useState(initial);
  const s = useMemo(() => parseSeries(text), [text]);
  return [text, setText, s];
};

export const IntervalsMode = () => {
  const [well, setWell] = useState(TEACHING.well);
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [method, setMethod] = useState('damped');
  const [h, setH] = useState(String(TEACHING.h));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [nSims, setNSims] = useState(String(DEFAULTS.N_SIMS));
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : intervalsOf({ y: s.values, method, h: parseNumber(h), seed: parseNumber(seed), nSims: parseNumber(nSims) });
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method (every parameter fitted)" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <NumField label="h" value={h} onChange={setH} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
        <NumField label="Paths (nSims)" value={nSims} onChange={setNSims} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Residual pool" value={String(r.poolSize)} />
            <Tile label="Percentiles reported as 0" value={String(r.clippedToZero)} />
            <Tile label="Seed" value={String(r.seed)} />
            <Tile label="Paths" value={String(r.nSims)} />
          </TileGrid>
          <Tbl head={['step', 'point forecast', 'P90 (low case)', 'P50', 'P10 (high case)']} rows={r.forecast.map((f, j) => [String(j + 1), six(f), six(r.P90[j]), six(r.P50[j]), six(r.P10[j])])} />
          {r.warnings && r.warnings.map((wtext) => <Warning key={wtext} text={wtext} />)}
          <Declared title="THE LABELS">{r.definition}</Declared>
          <Declared title="THE BOOTSTRAP, in the engine's words">{r.basis.bootstrap}</Declared>
          <Declared title="THE PERCENTILES, in the engine's words">{r.basis.percentiles}</Declared>
        </>
      )}
      <Note>Quote a bootstrap figure with its method, seed and number of paths. The point forecast is the fitted method's; the percentiles are its residuals replayed.</Note>
    </>
  );
};

export const PathsMode = () => {
  const [text, setText, s] = useSeries(seriesText('EKENE-P5'));
  const [method, setMethod] = useState('holt');
  const [h, setH] = useState(String(TEACHING.h));
  const [seeds, setSeeds] = useState(`${TEACHING.seed}, ${TEACHING.seed + 1}`);
  const [nonNegative, setNonNegative] = useState('true');
  const list0 = seeds.split(/[\s,]+/).filter((x) => x !== '').map(Number);
  const rows = s.error ? [] : list0.map((sd) => [sd, intervalsOf({ y: s.values, method, h: parseNumber(h), seed: sd, nonNegative: nonNegative === 'true' })]);
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <NumField label="h" value={h} onChange={setH} />
        <TextField label="Seeds to compare" value={seeds} onChange={setSeeds} rows={1} />
        <SelectField label="nonNegative" value={nonNegative} onChange={setNonNegative} options={[['true', 'true (a negative percentile reported as 0)'], ['false', 'false (as simulated)']]} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {rows.filter(([, r]) => r.error).slice(0, 1).map(([, r]) => <Refusal key="r" r={r} />)}
      {rows.length > 0 && rows.every(([, r]) => !r.error) && (
        <Tbl head={['seed', 'P90 at step h', 'P50 at step h', 'P10 at step h', 'reported as 0']} rows={rows.map(([sd, r]) => {
          const j = r.forecast.length - 1;
          return [String(sd), six(r.P90[j]), six(r.P50[j]), six(r.P10[j]), String(r.clippedToZero)];
        })} />
      )}
      <Note>The same seed gives the same percentiles bit for bit; another seed moves them. Only negative percentiles change when nonNegative is true; the point forecast is never clipped.</Note>
    </>
  );
};

export const ArpsMode = () => {
  const [well, setWell] = useState(TEACHING.well);
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [model, setModel] = useState('Auto-Select');
  const [h, setH] = useState(String(TEACHING.h));
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : arpsOf({ y: s.values, modelType: model, h: parseNumber(h) });
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Arps model" value={model} onChange={setModel} options={['Auto-Select', 'Exponential', 'Harmonic', 'Hyperbolic'].map((x) => [x, x])} />
        <NumField label="h" value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Model" value={r.modelType} />
            <Tile label="qi (per month-step)" value={six(r.qi)} />
            <Tile label="Di (per month)" value={six(r.Di)} />
            <Tile label="b" value={six(r.b)} />
            <Tile label="R2" value={six(r.R2)} />
            <Tile label="RMSE" value={six(r.RMSE)} />
            <Tile label="Months dropped" value={String(r.dropped)} />
            <Tile label="First positive month" value={String(r.t0Index)} />
          </TileGrid>
          {r.forecast.length > 0 && <Tbl head={['step', 'Arps forecast']} rows={r.forecast.map((v, j) => [String(j + 1), six(v)])} />}
          <Declared title="THE ENGINE, in its own words">{r.basis.engine}</Declared>
          <Declared title="THE TIME BASE, in the engine's words">{r.basis.time}</Declared>
        </>
      )}
      <Note>A month is passed to the decline curve engine as a day, so Di is per month. Shut-in months are dropped before the fit.</Note>
    </>
  );
};

export const CompareMode = () => {
  const [well, setWell] = useState(TEACHING.compare.well);
  const [text, setText, s] = useSeries(seriesText(TEACHING.compare.well));
  const [methods, setMethods] = useState('ses, holt, damped');
  const [first, setFirst] = useState(String(TEACHING.compare.firstOrigin));
  const [horizon, setHorizon] = useState(String(TEACHING.compare.horizon));
  const [step, setStep] = useState(String(TEACHING.compare.step));
  const [rankBy, setRankBy] = useState('mase');
  const [refit, setRefit] = useState('true');
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : compareOf({ y: s.values, methods: parseNames(methods), firstOrigin: parseNumber(first), horizon: parseNumber(horizon), step: parseNumber(step), rankBy, refit: refit === 'true' });
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <TextField label="Methods, in the order listed" value={methods} onChange={setMethods} rows={1} />
        <NumField label="First origin" value={first} onChange={setFirst} />
        <NumField label="Horizon" value={horizon} onChange={setHorizon} />
        <NumField label="Step" value={step} onChange={setStep} />
        <SelectField label="Rank by" value={rankBy} onChange={setRankBy} options={['mase', 'mae', 'rmse', 'smape', 'mape'].map((x) => [x, x])} />
        <SelectField label="Smoothing parameters" value={refit} onChange={setRefit} options={[['true', 'refitted at every origin'], ['false', 'held from the first window']]} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Ranking" value={list(r.ranking)} />
            <Tile label="Best" value={String(r.best ?? 'none')} />
            <Tile label="Unranked" value={list(r.unranked)} />
          </TileGrid>
          <Tbl head={['method', 'MAE', 'RMSE', 'MAPE', 'sMAPE', 'MASE']} rows={r.rows.map((x) => [x.method, six(x.mae), six(x.rmse), six(x.mape), six(x.smape), six(x.mase)])} />
          {r.rows.filter((x) => x.error).map((x) => <Declared key={x.method} title={`${x.method.toUpperCase()} HAS NO FIT, in the engine's words`}>{x.error}</Declared>)}
          {r.rows.filter((x) => x.notes).slice(0, 1).map((x) => Object.entries(x.notes).map(([k, v]) => <Declared key={k} title={`${k.toUpperCase()} IS NONE, in the engine's words`}>{v}</Declared>))}
          <Declared title="THE RANKING, in the engine's words">{r.basis.ranking}</Declared>
          <Declared title="ARPS, in the engine's words">{r.basis.arps}</Declared>
        </>
      )}
      <Note>Every row is scored on the same origins with the same metric. Report a ranking with its origins, horizon, step and metric.</Note>
    </>
  );
};

const PROBES = [
  ['ses length', (n) => fitOf({ y: Array.from({ length: n }, (_, i) => 100 - i), method: 'ses' }), 2],
  ['holt length', (n) => fitOf({ y: Array.from({ length: n }, (_, i) => 100 - i), method: 'holt' }), 3],
  ['bootstrap pool, holt', (n) => intervalsOf({ y: Array.from({ length: n }, (_, i) => 100 - i * i), method: 'holt', h: 1, seed: 1 }), 4],
  ['backtest first origin, holt', (n) => backtestOf({ y: Array.from({ length: 12 }, (_, i) => 100 - i * i), method: 'holt', alpha: 0.5, beta: 0.2, firstOrigin: n, horizon: 1 }), 3],
  ['Arps positive values', (n) => arpsOf({ y: Array.from({ length: n }, (_, i) => 100 * 0.9 ** i) }), 3],
];

export const BoundsMode = () => {
  const [probe, setProbe] = useState(PROBES[0][0]);
  const [n, setN] = useState(String(PROBES[0][2]));
  const p = PROBES.find((x) => x[0] === probe);
  const v = parseNumber(n);
  const at = Number.isInteger(v) ? p[1](v) : null;
  const below = Number.isInteger(v) ? p[1](v - 1) : null;
  return (
    <>
      <FieldGrid>
        <SelectField label="Rule" value={probe} onChange={(x) => { setProbe(x); setN(String(PROBES.find((q) => q[0] === x)[2])); }} options={PROBES.map((x) => [x[0], x[0]])} />
        <NumField label="Values (or origin) to try" value={n} onChange={setN} />
      </FieldGrid>
      {at && <Note>At {String(v)}: {at.error ? 'refused' : 'accepted'}. At {String(v - 1)}: {below && below.error ? 'refused' : 'accepted'}.</Note>}
      {at && at.error && <Refusal r={at} />}
      {below && below.error && !(at && at.error) && <Refusal r={below} />}
      <Note>Every rule draws its own boundary. The rows probe a stated declining series of your chosen length, and each answer is the engine's.</Note>
    </>
  );
};

const UncertaintyExplorer = ({ initialMode = 'intervals' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Uncertainty explorer"
      subtitle="Intervals from the method's own residuals, tested against the Arps baseline."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'intervals' && <IntervalsMode />}
        {mode === 'paths' && <PathsMode />}
        {mode === 'arps' && <ArpsMode />}
        {mode === 'compare' && <CompareMode />}
        {mode === 'bounds' && <BoundsMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored forecasting engine. P90 is the low case and P10 the high
        case, by the platform&apos;s exceedance convention.
      </Note>
    </PanelShell>
  );
};

export default UncertaintyExplorer;
