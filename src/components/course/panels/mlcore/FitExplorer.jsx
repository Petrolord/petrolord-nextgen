import React, { useMemo, useState } from 'react';
import {
  parseTable, parseNumber, parseSeries, groupSplitOf, randomRowSplitOf, standardScalerOf, minMaxScalerOf, applyScalerOf,
  fitAndScore, regressionMetricsOf, matrixOf, sonicTableText, TEACHING, olsReader, splitsReader,
} from './mlcoreLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Declared, names, safe,
} from './panelBits';

// The fit explorer (Associate): a model and its test. Split by rows or by
// whole wells, scale on the training rows, fit least squares and score it on
// wells the model has not seen. Every figure is a return value of the vendored
// engine through mlcoreLab. Paste your own table: the first line names the
// columns, a column named well holds the well names, null is a missing value.

export const MODES = [
  ['split', 'Split by rows or by whole wells'],
  ['scale', 'Scaling fitted on the training rows'],
  ['ols', 'Least squares, scored on held-out wells'],
  ['metrics', 'RMSE, MAE and R-squared on your own predictions'],
];

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};

const SplitFields = ({ fraction, setFraction, nTest, setNTest, seed, setSeed }) => (
  <>
    <NumField label="Test fraction" value={fraction} onChange={setFraction} />
    <NumField label="Or test wells (nTestGroups)" value={nTest} onChange={setNTest} />
    <NumField label="Seed" value={seed} onChange={setSeed} />
  </>
);

export const SplitMode = () => {
  const [text, setText, t] = useTable(sonicTableText());
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [nTest, setNTest] = useState('');
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const groups = t.error ? null : t.rows.map((r) => r.well);
  const nt = parseNumber(nTest);
  const g = groups ? groupSplitOf(nt === undefined
    ? { groups, testFraction: parseNumber(fraction), seed: parseNumber(seed) }
    : { groups, nTestGroups: nt, seed: parseNumber(seed) }) : null;
  const r = groups ? randomRowSplitOf({ groups, testFraction: parseNumber(fraction), seed: parseNumber(seed) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (the well column sets the groups)" value={text} onChange={setText} rows={4} />
        <SplitFields fraction={fraction} setFraction={setFraction} nTest={nTest} setNTest={setNTest} seed={seed} setSeed={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {g && g.error && <Refusal r={g} />}
      {g && !g.error && (
        <Tbl head={['split', 'test rows', 'training rows', 'test wells', 'wells on both sides']} rows={[
          ['whole wells (groupSplit)', String(g.testIndices.length), String(g.trainIndices.length), list(g.testGroups), '0'],
          ...(r && !r.error ? [['rows (randomRowSplit)', String(r.testIndices.length), String(r.trainIndices.length), list(r.testGroups), String(r.sharedGroups.length)]] : []),
        ]} />
      )}
      {r && r.error && <Refusal r={r} />}
      {g && !g.error && <Declared title="THE SHUFFLED ORDER, first the test wells">{list(g.order)}</Declared>}
      {g && !g.error && <Declared title="THE RULE, in the engine's words">{g.basis.rule}; {g.basis.testSize}.</Declared>}
      <Note>Names sort by character before the shuffle, so EKENE-10 comes before EKENE-2. A random-row split puts rows of one well on both sides.</Note>
    </>
  );
};

export const ScaleMode = () => {
  const [text, setText, t] = useTable(sonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [nTest, setNTest] = useState('');
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [sd, setSd] = useState('population');
  const features = names(feats);
  const nt = parseNumber(nTest);
  const g = t.error ? null : groupSplitOf(nt === undefined
    ? { groups: t.rows.map((r) => r.well), testFraction: parseNumber(fraction), seed: parseNumber(seed) }
    : { groups: t.rows.map((r) => r.well), nTestGroups: nt, seed: parseNumber(seed) });
  const X = t.error ? null : matrixOf(t.rows, features);
  const st = g && !g.error ? standardScalerOf({ X, trainIndices: g.trainIndices, names: features, sd }) : null;
  const mm = g && !g.error ? minMaxScalerOf({ X, trainIndices: g.trainIndices, names: features }) : null;
  const mmTest = mm && !mm.error ? applyScalerOf({ scaler: mm, X: g.testIndices.map((i) => X[i]) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <SplitFields fraction={fraction} setFraction={setFraction} nTest={nTest} setNTest={setNTest} seed={seed} setSeed={setSeed} />
        <SelectField label="Standard deviation" value={sd} onChange={setSd} options={[['population', 'population (n), the default'], ['sample', 'sample (n - 1)']]} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {g && g.error && <Refusal r={g} />}
      {st && st.error && <Refusal r={st} />}
      {mm && mm.error && <Refusal r={mm} />}
      {st && !st.error && mm && !mm.error && mmTest && !mmTest.error && (
        <Tbl head={['feature', 'centre', 'scale', 'training minimum', 'training maximum', 'test rows above 1', 'test rows below 0']}
          rows={features.map((f, j) => [f, six(st.centre[j]), six(st.scale[j]), six(mm.min[j]), six(mm.max[j]),
            String(mmTest.X.filter((r) => r[j] > 1).length), String(mmTest.X.filter((r) => r[j] < 0).length)])} />
      )}
      {st && !st.error && <Declared title="FITTED ON">{st.nFit} training rows; {st.basis.sd}.</Declared>}
      <Note>The scaler is fitted on the training wells only and applied unchanged to the test wells. Min-max does not clip a new row.</Note>
    </>
  );
};

export const OlsMode = ({ t0 }) => {
  const [text, setText, t] = useTable(sonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [target, setTarget] = useState('DT');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [nTest, setNTest] = useState('');
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const features = names(feats);
  const nt = parseNumber(nTest);
  const r = t.error ? null : fitAndScore({
    rows: t.rows, features, target: target.trim(), kind: 'ols', seed: parseNumber(seed),
    ...(nt === undefined ? { testFraction: parseNumber(fraction) } : { nTestGroups: nt }),
  });
  const m = r && r.model;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <SplitFields fraction={fraction} setFraction={setFraction} nTest={nTest} setNTest={setNTest} seed={seed} setSeed={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {m && !m.error && (
        <>
          <Tbl head={['term', 'coefficient', 'standard error', 't value']} rows={m.names.map((nm, j) => [nm, six(m.coefficients[j]), six(m.standardErrors[j]), six(m.tValues ? m.tValues[j] : null)])} />
          <TileGrid>
            <Tile label="Training rows" value={String(m.n)} />
            <Tile label="Residual degrees of freedom" value={String(m.dfResidual)} />
            <Tile label="Residual standard error" value={six(m.residualSE)} />
            <Tile label="Training R-squared" value={six(m.rSquared)} />
            <Tile label="Adjusted R-squared" value={six(m.adjustedRSquared)} />
          </TileGrid>
        </>
      )}
      {r && r.test && !r.test.error && (
        <TileGrid>
          <Tile label={`Test wells: ${list(r.split.testGroups)}`} value={`${r.test.n} rows`} />
          <Tile label="Test RMSE" value={six(r.test.rmse)} />
          <Tile label="Test MAE" value={six(r.test.mae)} />
          <Tile label="Test R-squared, about the test mean" value={six(r.test.r2)} />
          <Tile label="Training RMSE" value={six(r.train.rmse)} />
        </TileGrid>
      )}
      {r && r.test && r.test.error && <Refusal r={r.test} />}
      <Note>The model is fitted on the training wells and scored on the held-out wells. Least squares needs more rows than coefficients.</Note>
      {t0 && <Note>Ekene at the teaching split: test RMSE {six(t0.test.rmse)} us/ft against a training RMSE of {six(t0.train.rmse)}.</Note>}
    </>
  );
};

export const MetricsMode = () => {
  const [yt, setYt] = useState('1, 2, 3');
  const [yp, setYp] = useState('3, 2, 1');
  const [ref, setRef] = useState('');
  const a = parseSeries(yt);
  const b = parseSeries(yp);
  const rm = parseNumber(ref);
  const r = a.error || b.error ? null : regressionMetricsOf({ yTrue: a.values, yPred: b.values, ...(rm === undefined ? {} : { referenceMean: rm }) });
  return (
    <>
      <FieldGrid>
        <TextField label="True values" value={yt} onChange={setYt} rows={2} />
        <TextField label="Predicted values" value={yp} onChange={setYp} rows={2} />
        <NumField label="referenceMean (blank for the mean of the true values)" value={ref} onChange={setRef} />
      </FieldGrid>
      {(a.error || b.error) && <Note>{a.error || b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="RMSE" value={six(r.rmse)} />
            <Tile label="MAE" value={six(r.mae)} />
            <Tile label="R-squared" value={six(r.r2)} />
            <Tile label="Reference mean" value={six(r.referenceMean)} />
          </TileGrid>
          <Declared title="R-SQUARED, in the engine's words">{r.basis.r2}</Declared>
        </>
      )}
    </>
  );
};

const FitExplorer = ({ initialMode = 'split' }) => {
  const [mode, setMode] = useState(initialMode);
  const t0 = useMemo(() => safe(olsReader), []);
  const s0 = useMemo(() => safe(splitsReader), []);
  return (
    <PanelShell
      title="Fit explorer"
      subtitle="A model is a rule fitted to some wells and judged on wells it has never seen."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'split' && <SplitMode />}
        {mode === 'scale' && <ScaleMode />}
        {mode === 'ols' && <OlsMode t0={t0} />}
        {mode === 'metrics' && <MetricsMode />}
      </div>
      {s0 && <Note>The Ekene teaching split holds out {list(s0.group.testGroups)}.</Note>}
      <Note>
        Every number on this panel is a return value of the vendored machine learning engine. A test score is a score on
        wells the model was not fitted on.
      </Note>
    </PanelShell>
  );
};

export default FitExplorer;
