import React, { useMemo, useState } from 'react';
import {
  parseSeries, parseNumber, seriesText, WELL_IDS, TEACHING, accuracyOf, backtestOf, holdOut,
} from './forecastLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, Warning, Declared,
} from './panelBits';

// The backtest explorer (Professional): testing a forecast honestly. Score a
// forecast against actuals (ME, MAE, RMSE, MAPE, sMAPE, MASE with its scale),
// hold out the last months of a series, and run a rolling-origin backtest with
// the parameters refitted at every origin or held from the first window,
// pooled and by step ahead. Every figure is a return value of the vendored
// forecasting engine through forecastLab. A metric the engine cannot give is
// shown as none, with the engine's own reason.

export const MODES = [
  ['accuracy', 'Score a forecast against actuals'],
  ['holdout', 'Hold out the last months'],
  ['scale', 'The scaled error and its lag'],
  ['backtest', 'A rolling-origin backtest'],
  ['horizon', 'Errors by step ahead'],
];

const METHOD_OPTIONS = [['ses', 'ses'], ['holt', 'holt'], ['damped', 'damped']];
const WELL_OPTIONS = WELL_IDS.map((w) => [w, w]);

const useSeries = (initial) => {
  const [text, setText] = useState(initial);
  const s = useMemo(() => parseSeries(text), [text]);
  return [text, setText, s];
};

const Notes = ({ r }) => (r.notes ? Object.entries(r.notes).map(([k, v]) => <Declared key={k} title={`${k.toUpperCase()} IS NONE, in the engine's words`}>{v}</Declared>) : null);

const MetricTiles = ({ a }) => (
  <TileGrid>
    <Tile label="ME (bias)" value={six(a.me)} />
    <Tile label="MAE" value={six(a.mae)} />
    <Tile label="RMSE" value={six(a.rmse)} />
    <Tile label="MAPE (percent)" value={six(a.mape)} />
    <Tile label="sMAPE (percent)" value={six(a.smape)} />
    <Tile label="MASE" value={six(a.mase)} />
  </TileGrid>
);

export const AccuracyMode = () => {
  const y1 = parseSeries(seriesText(TEACHING.well)).values;
  const [aText, setAText, sa] = useSeries(y1.slice(TEACHING.train, TEACHING.train + TEACHING.h).join(', '));
  const [fText, setFText, sf] = useSeries(Array(TEACHING.h).fill(y1[TEACHING.train - 1]).join(', '));
  const [iText, setIText, si] = useSeries(y1.slice(0, TEACHING.train).join(', '));
  const [m, setM] = useState('1');
  const bad = sa.error || sf.error || si.error;
  const a = bad ? null : accuracyOf({ actual: sa.values, forecast: sf.values, insample: si.values, m: parseNumber(m) });
  return (
    <>
      <FieldGrid>
        <TextField label="Actuals" value={aText} onChange={setAText} rows={2} />
        <TextField label="Forecasts (one per actual)" value={fText} onChange={setFText} rows={2} />
        <TextField label="Training series (insample, for MASE)" value={iText} onChange={setIText} rows={2} />
        <NumField label="Lag m of the naive forecast" value={m} onChange={setM} />
      </FieldGrid>
      {bad && <Note>{bad}</Note>}
      {a && a.error && <Refusal r={a} />}
      {a && !a.error && (
        <>
          <MetricTiles a={a} />
          <Note>Scale Q of the training series: {six(a.maseScale)}.</Note>
          <Notes r={a} />
          <Declared title="ERRORS, in the engine's words">{a.basis.errors}; {a.basis.me}</Declared>
        </>
      )}
      <Note>An error is actual minus forecast, so a positive mean error means the forecast was low. The starting forecast is the naive one: the last training month, held flat.</Note>
    </>
  );
};

export const HoldoutMode = () => {
  const [well, setWell] = useState(TEACHING.well);
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [method, setMethod] = useState('holt');
  const [train, setTrain] = useState(String(TEACHING.train));
  const [h, setH] = useState(String(TEACHING.h));
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : holdOut({ y: s.values, method, train: parseNumber(train), h: parseNumber(h) });
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method (every parameter fitted)" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <NumField label="Training months (from month 0)" value={train} onChange={setTrain} />
        <NumField label="Months held out" value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {r && r.accuracy && (
        <>
          <MetricTiles a={r.accuracy} />
          <Tbl head={['held-out month', 'actual', 'forecast', 'error']} rows={r.fit.forecast.map((f, j) => {
            const t = parseNumber(train) + j;
            return [String(t), six(s.values[t]), six(f), six(s.values[t] - f)];
          })} />
          <Notes r={r.accuracy} />
        </>
      )}
      <Note>The fit sees the training months only; the held-out months score it.</Note>
    </>
  );
};

export const ScaleMode = () => {
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [train, setTrain] = useState(String(TEACHING.train));
  const [h, setH] = useState(String(TEACHING.h));
  const lags = [1, 3, 6, 12];
  const rows = s.error ? [] : lags.map((m) => [m, holdOut({ y: s.values, method: 'holt', train: parseNumber(train), h: parseNumber(h), m })]);
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <NumField label="Training months" value={train} onChange={setTrain} />
        <NumField label="Months held out" value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {rows.filter(([, r]) => r.refusal).slice(0, 1).map(([, r]) => <Refusal key="r" r={r.refusal} />)}
      {rows.length > 0 && rows.every(([, r]) => r.accuracy) && (
        <Tbl head={['lag m', 'scale Q (in-sample naive MAE)', 'holt MAE', 'MASE']} rows={rows.map(([m, r]) => [String(m), six(r.accuracy.maseScale), six(r.accuracy.mae), six(r.accuracy.mase)])} />
      )}
      {rows.filter(([, r]) => r.accuracy && r.accuracy.notes && r.accuracy.notes.mase).slice(0, 1).map(([, r]) => <Declared key="n" title="MASE IS NONE, in the engine's words">{r.accuracy.notes.mase}</Declared>)}
      <Note>The scale comes from the training months, before the forecast is scored. Quote MASE with its lag.</Note>
    </>
  );
};

export const BacktestMode = () => {
  const [well, setWell] = useState(TEACHING.well);
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [method, setMethod] = useState('holt');
  const [first, setFirst] = useState(String(TEACHING.backtest.firstOrigin));
  const [horizon, setHorizon] = useState(String(TEACHING.backtest.horizon));
  const [step, setStep] = useState(String(TEACHING.backtest.step));
  const [refit, setRefit] = useState('true');
  const [m, setM] = useState('1');
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : backtestOf({ y: s.values, method, firstOrigin: parseNumber(first), horizon: parseNumber(horizon), step: parseNumber(step), refit: refit === 'true', m: parseNumber(m) });
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <NumField label="First origin" value={first} onChange={setFirst} />
        <NumField label="Horizon" value={horizon} onChange={setHorizon} />
        <NumField label="Step between origins" value={step} onChange={setStep} />
        <SelectField label="Parameters" value={refit} onChange={setRefit} options={[['true', 'refitted at every origin'], ['false', 'held from the first window']]} />
        <NumField label="Lag m for MASE" value={m} onChange={setM} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <MetricTiles a={r.overall} />
          <Tbl head={['origin', 'training months', 'parameters', 'scale Q', ...r.perOrigin[0].errors.map((_, j) => `error ${j + 1}`)]} rows={r.perOrigin.map((p) => [String(p.origin), `0 to ${p.origin - 1}`, Object.entries(p.params).map(([k, v]) => `${k} ${six(v)}`).join(', '), six(p.maseScale), ...p.errors.map(six)])} />
          <Notes r={r.overall} />
          {r.warnings && r.warnings.map((wtext) => <Warning key={wtext} text={wtext} />)}
          <Declared title="THE ORIGINS, in the engine's words">{r.basis.origins}</Declared>
          <Declared title="THE PARAMETERS, in the engine's words">{r.basis.refit}</Declared>
          <Declared title="POOLING, in the engine's words">{r.basis.pooling}</Declared>
        </>
      )}
      <Note>At every origin only the months before it are fitted. State the origins, the horizon, the step and whether the parameters were refitted.</Note>
    </>
  );
};

export const HorizonMode = () => {
  const [text, setText, s] = useSeries(seriesText(TEACHING.well));
  const [method, setMethod] = useState('holt');
  const [first, setFirst] = useState(String(TEACHING.backtest.firstOrigin));
  const [horizon, setHorizon] = useState(String(TEACHING.backtest.horizon));
  const [step, setStep] = useState(String(TEACHING.backtest.step));
  const r = s.error ? null : backtestOf({ y: s.values, method, firstOrigin: parseNumber(first), horizon: parseNumber(horizon), step: parseNumber(step) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <NumField label="First origin" value={first} onChange={setFirst} />
        <NumField label="Horizon" value={horizon} onChange={setHorizon} />
        <NumField label="Step between origins" value={step} onChange={setStep} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <Tbl head={['step ahead', 'errors', 'ME', 'MAE', 'RMSE', 'MASE']} rows={r.byHorizon.map((b) => [String(b.step), String(b.n), six(b.me), six(b.mae), six(b.rmse), six(b.mase)])} />
      )}
      <Note>Each step ahead is scored over one error per origin, so a by-horizon figure rests on as many numbers as there are origins.</Note>
    </>
  );
};

const BacktestExplorer = ({ initialMode = 'accuracy' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Backtest explorer"
      subtitle="A forecast is tested on months it never saw."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'accuracy' && <AccuracyMode />}
        {mode === 'holdout' && <HoldoutMode />}
        {mode === 'scale' && <ScaleMode />}
        {mode === 'backtest' && <BacktestMode />}
        {mode === 'horizon' && <HorizonMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored forecasting engine. A metric is named with the months it
        was scored on.
      </Note>
    </PanelShell>
  );
};

export default BacktestExplorer;
