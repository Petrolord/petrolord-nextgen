import React, { useMemo, useState } from 'react';
import {
  parseSeries, parseNumber, seriesText, WELL_IDS, TEACHING, DEFAULTS, fitOf,
} from './forecastLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, Refusal, Warning, Declared,
} from './panelBits';

// The smoothing explorer (Associate): smoothing a rate series into a forecast.
// Fit simple, Holt or damped exponential smoothing with any parameter given or
// left to the fit, read the one-step recursion month by month, the h-step
// forecasts and the fit record. Every figure is a return value of the vendored
// forecasting engine through forecastLab. Paste your own series: numbers
// separated by commas, spaces or new lines, oldest first; null is a missing
// month, which the engine refuses by name.

export const MODES = [
  ['fit', 'Fit a method'],
  ['recursion', 'The recursion, month by month'],
  ['forecast', 'h-step forecasts'],
  ['alpha', 'Simple smoothing across alpha'],
  ['methods', 'Three methods on one series'],
];

const METHOD_OPTIONS = [['ses', 'ses (simple)'], ['holt', "holt (Holt's linear trend)"], ['damped', 'damped (damped trend)']];
const WELL_OPTIONS = WELL_IDS.map((w) => [w, w]);

const useSeries = (well) => {
  const [text, setText] = useState(seriesText(well));
  const s = useMemo(() => parseSeries(text), [text]);
  return [text, setText, s];
};

/** A parameter box: blank means fitted, a number means given. */
const given = (text) => parseNumber(text);

const Params = ({ method, alpha, setAlpha, beta, setBeta, phi, setPhi }) => (
  <>
    <NumField label="alpha (blank to fit)" value={alpha} onChange={setAlpha} />
    {method !== 'ses' && <NumField label="beta (blank to fit)" value={beta} onChange={setBeta} />}
    {method === 'damped' && <NumField label="phi (blank to fit)" value={phi} onChange={setPhi} />}
  </>
);

const argsOf = (y, method, alpha, beta, phi, h) => ({
  y, method, h,
  ...(given(alpha) === undefined ? {} : { alpha: given(alpha) }),
  ...(method === 'ses' || given(beta) === undefined ? {} : { beta: given(beta) }),
  ...(method !== 'damped' || given(phi) === undefined ? {} : { phi: given(phi) }),
});

const FitRecord = ({ r }) => (r.optimiser ? (
  <>
    <Tbl head={['stage', 'point', 'SSE']} rows={[
      ['grid start', Object.entries(r.optimiser.gridStart).map(([k, v]) => `${k} ${v}`).join(', '), six(r.optimiser.gridSse)],
      ['compass search end', Object.entries(r.params).map(([k, v]) => `${k} ${six(v)}`).join(', '), six(r.sse)],
    ]} />
    <TileGrid>
      <Tile label="Moves" value={String(r.optimiser.moves)} />
      <Tile label="Halvings" value={String(r.optimiser.halvings)} />
      <Tile label="SSE evaluations" value={String(r.optimiser.evaluations)} />
      <Tile label="Converged" value={String(r.optimiser.converged)} />
    </TileGrid>
    <Note>On a bound of the box: {list(r.optimiser.atBounds)}.</Note>
  </>
) : <Note>Every parameter was given: nothing was fitted.</Note>);

export const FitMode = () => {
  const [well, setWell] = useState(TEACHING.well);
  const [text, setText, s] = useSeries(TEACHING.well);
  const [method, setMethod] = useState('holt');
  const [alpha, setAlpha] = useState('');
  const [beta, setBeta] = useState('');
  const [phi, setPhi] = useState('');
  const [h, setH] = useState(String(TEACHING.h));
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const r = s.error ? null : fitOf(argsOf(s.values, method, alpha, beta, phi, parseNumber(h)));
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series (oldest first)" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <Params method={method} alpha={alpha} setAlpha={setAlpha} beta={beta} setBeta={setBeta} phi={phi} setPhi={setPhi} />
        <NumField label="h (steps to forecast)" value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            {Object.entries(r.params).map(([k, v]) => <Tile key={k} label={`${k} (${r.fixed.includes(k) ? 'given' : 'fitted'})`} value={six(v)} />)}
            <Tile label="SSE" value={six(r.sse)} />
            <Tile label="MSE (SSE / scored errors)" value={six(r.mse)} />
            <Tile label="Scored from index" value={String(r.scoredFrom)} />
          </TileGrid>
          <FitRecord r={r} />
          {r.forecast.length > 0 && <Tbl head={['step', 'forecast']} rows={r.forecast.slice(0, 24).map((v, j) => [String(j + 1), six(v)])} />}
          {r.warnings && r.warnings.map((wtext) => <Warning key={wtext} text={wtext} />)}
          <Declared title="THE METHOD, in the engine's words">{r.basis.method}</Declared>
          <Declared title="THE START, in the engine's words">{r.basis.initial}</Declared>
          <Declared title="THE FIT, in the engine's words">{r.basis.fit}</Declared>
        </>
      )}
      <Note>Compare methods by MSE, never by SSE: holt and damped spend the second month on their start and score one error fewer than ses.</Note>
    </>
  );
};

export const RecursionMode = () => {
  const [text, setText, s] = useSeries(TEACHING.well);
  const [method, setMethod] = useState('ses');
  const [alpha, setAlpha] = useState(String(TEACHING.alpha));
  const [beta, setBeta] = useState(String(TEACHING.holtBeta));
  const [phi, setPhi] = useState(String(TEACHING.phi));
  const [from, setFrom] = useState('0');
  const r = s.error ? null : fitOf(argsOf(s.values, method, alpha, beta, phi, 0));
  const a = Math.max(0, parseNumber(from) || 0);
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <Params method={method} alpha={alpha} setAlpha={setAlpha} beta={beta} setBeta={setBeta} phi={phi} setPhi={setPhi} />
        <NumField label="First month to list (counted from 0)" value={from} onChange={setFrom} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl
            head={['month', 'rate', 'one-step forecast', 'residual', 'level', ...(r.trend ? ['trend'] : [])]}
            rows={s.values.slice(a, a + 12).map((v, q) => {
              const t = a + q;
              return [String(t), six(v), six(r.fitted[t]), six(r.residuals[t]), six(r.level[t]), ...(r.trend ? [six(r.trend[t])] : [])];
            })}
          />
          <Declared title="THE START, in the engine's words">{r.basis.initial}</Declared>
        </>
      )}
      <Note>A residual is none before the index scoring starts from: month 0 has no forecast, and a Holt or damped start spends month 1 on its trend.</Note>
    </>
  );
};

export const ForecastMode = () => {
  const [text, setText, s] = useSeries(TEACHING.well);
  const [method, setMethod] = useState('damped');
  const [alpha, setAlpha] = useState(String(TEACHING.holtAlpha));
  const [beta, setBeta] = useState(String(TEACHING.holtBeta));
  const [phi, setPhi] = useState(String(TEACHING.phi));
  const [h, setH] = useState(String(TEACHING.h));
  const r = s.error ? null : fitOf(argsOf(s.values, method, alpha, beta, phi, parseNumber(h)));
  const n = s.error ? 0 : s.values.length;
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <SelectField label="Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <Params method={method} alpha={alpha} setAlpha={setAlpha} beta={beta} setBeta={setBeta} phi={phi} setPhi={setPhi} />
        <NumField label={`h (up to ${DEFAULTS.MAX_H})`} value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Final level" value={six(r.level[n - 1])} />
            {r.trend && <Tile label="Final trend" value={six(r.trend[n - 1])} />}
            <Tile label="Last month's rate" value={six(s.values[n - 1])} />
          </TileGrid>
          <Tbl head={['step', 'forecast', 'change from the step before']} rows={r.forecast.slice(0, 36).map((v, j) => [String(j + 1), six(v), six(j === 0 ? v - r.level[n - 1] : v - r.forecast[j - 1])])} />
        </>
      )}
      <Note>ses forecasts its final level at every step; holt adds the final trend each step; damped multiplies each step's change by phi, so its forecast levels off. The first 36 steps are listed.</Note>
    </>
  );
};

export const AlphaMode = () => {
  const [text, setText, s] = useSeries(TEACHING.well);
  const [alphas, setAlphas] = useState('0, 0.1, 0.3, 0.5, 0.9, 1');
  const values = alphas.split(/[\s,]+/).filter((x) => x !== '').map(Number);
  const rows = s.error ? [] : values.map((a) => [a, fitOf({ y: s.values, method: 'ses', alpha: a, h: 1 })]);
  const fitted = s.error ? null : fitOf({ y: s.values, method: 'ses', h: 1 });
  return (
    <>
      <FieldGrid>
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <TextField label="alphas to try" value={alphas} onChange={setAlphas} rows={1} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {rows.filter(([, r]) => r.error).slice(0, 1).map(([, r]) => <Refusal key="r" r={r} />)}
      {rows.length > 0 && (
        <Tbl head={['alpha', 'SSE', 'MSE', 'forecast at every step']} rows={rows.filter(([, r]) => !r.error).map(([a, r]) => [String(a), six(r.sse), six(r.mse), six(r.forecast[0])])} />
      )}
      {fitted && !fitted.error && <Note>Fitted: alpha {six(fitted.params.alpha)}, SSE {six(fitted.sse)}, on a bound: {list(fitted.optimiser.atBounds)}.</Note>}
      <Note>At alpha 1 each one-step forecast is the month before: the naive forecast. At alpha 0 the level never leaves the first month.</Note>
    </>
  );
};

export const MethodsMode = () => {
  const [well, setWell] = useState('EKENE-P4');
  const [text, setText, s] = useSeries('EKENE-P4');
  const [h, setH] = useState(String(TEACHING.h));
  const pickWell = (w) => { setWell(w); setText(seriesText(w)); };
  const rows = s.error ? [] : ['ses', 'holt', 'damped'].map((m) => [m, fitOf({ y: s.values, method: m, h: parseNumber(h) })]);
  return (
    <>
      <FieldGrid>
        <SelectField label="Start from an Ekene well" value={well} onChange={pickWell} options={WELL_OPTIONS} />
        <TextField label="Your series" value={text} onChange={setText} rows={3} />
        <NumField label="h" value={h} onChange={setH} />
      </FieldGrid>
      {s.error && <Note>{s.error}</Note>}
      {rows.filter(([, r]) => r.error).slice(0, 1).map(([, r]) => <Refusal key="r" r={r} />)}
      {rows.length > 0 && rows.every(([, r]) => !r.error) && (
        <Tbl
          head={['method', 'parameters', 'on a bound', 'scored from', 'SSE', 'MSE', 'forecast step 1', 'forecast step h']}
          rows={rows.map(([m, r]) => [m, Object.entries(r.params).map(([k, v]) => `${k} ${six(v)}`).join(', '), list(r.optimiser.atBounds), String(r.scoredFrom), six(r.sse), six(r.mse), six(r.forecast[0]), six(r.forecast[r.forecast.length - 1])])}
        />
      )}
      <Note>An in-sample MSE says how well a method followed months it had already seen. Whether it forecasts months it has not seen is a backtest, on the backtest explorer.</Note>
    </>
  );
};

const SmoothingExplorer = ({ initialMode = 'fit' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Smoothing explorer"
      subtitle="Exponential smoothing turns a well's monthly rates into a forecast."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fit' && <FitMode />}
        {mode === 'recursion' && <RecursionMode />}
        {mode === 'forecast' && <ForecastMode />}
        {mode === 'alpha' && <AlphaMode />}
        {mode === 'methods' && <MethodsMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored forecasting engine. A forecast is named with its method,
        its parameters and whether each was fitted or given.
      </Note>
    </PanelShell>
  );
};

export default SmoothingExplorer;
