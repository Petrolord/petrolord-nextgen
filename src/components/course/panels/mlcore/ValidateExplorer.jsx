import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  parseTable, parseNumber, parseSeries, fitAndScore, crossValidate, leakageOf, matrixOf, reportOf, rocOf, logLossOf,
  attributeTableText, payTableText, TEACHING, ridgeReader, payReader,
} from './mlcoreLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Declared, names, safe,
} from './panelBits';

// The validate explorer (Professional): validating a model. Ridge and its
// penalty, cross-validation by whole wells, the leakage of a random-row split,
// logistic regression on a stated label, the confusion matrix and its ratios,
// ROC, AUC and log loss. Every figure is a return value of the vendored engine
// through mlcoreLab; the one mean on this panel is the arithmetic mean of the
// engine's fold scores.

export const MODES = [
  ['ridge', 'Ridge and its penalty'],
  ['kfold', 'Cross-validation by wells'],
  ['leakage', 'A random-row split against a well split'],
  ['logistic', 'Logistic regression on a stated label'],
  ['confusion', 'The confusion matrix, precision, recall and F1'],
  ['roc', 'ROC, AUC and log loss'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};

export const RidgeMode = ({ path }) => {
  const [text, setText, t] = useTable(attributeTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI, easting, northing, kb, mudWeight');
  const [target, setTarget] = useState('DT');
  const [lambda, setLambda] = useState('10');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const features = names(feats);
  const r = t.error ? null : fitAndScore({ rows: t.rows, features, target: target.trim(), kind: 'ridge', lambda: parseNumber(lambda), testFraction: parseNumber(fraction), seed: parseNumber(seed) });
  const m = r && r.model;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="lambda" value={lambda} onChange={setLambda} />
        <NumField label="Test fraction" value={fraction} onChange={setFraction} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {m && !m.error && (
        <>
          <Tbl head={['term', 'original units', 'standardised']} rows={m.names.map((nm, j) => [nm, six(m.coefficients[j]), six(m.standardizedCoefficients[j])])} />
          <TileGrid>
            <Tile label="Effective degrees of freedom" value={six(m.effectiveDegreesOfFreedom)} />
            <Tile label="Training R-squared" value={six(m.rSquared)} />
            {r.test && !r.test.error && <Tile label={`Test RMSE, ${list(r.split.testGroups)}`} value={six(r.test.rmse)} />}
          </TileGrid>
          <Declared title="THE OBJECTIVE, in the engine's words">{m.basis.objective}; {m.basis.lambda}.</Declared>
        </>
      )}
      {path && (
        <Tbl head={['Ekene lambda', 'effective degrees of freedom', 'training R-squared', 'test RMSE']}
          rows={path.map((p) => [String(p.lambda), six(p.edf), six(p.trainR2), six(p.testRmse)])} />
      )}
    </>
  );
};

export const KFoldMode = () => {
  const [text, setText, t] = useTable(attributeTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [target, setTarget] = useState('DT');
  const [k, setK] = useState('3');
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [kind, setKind] = useState('ols');
  const [lambda, setLambda] = useState('10');
  const r = t.error ? null : crossValidate({ rows: t.rows, features: names(feats), target: target.trim(), k: parseNumber(k), seed: parseNumber(seed), kind, lambda: parseNumber(lambda) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="k" value={k} onChange={setK} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
        <SelectField label="Model" value={kind} onChange={setKind} options={[['ols', 'least squares'], ['ridge', 'ridge']]} />
        <NumField label="lambda (ridge)" value={lambda} onChange={setLambda} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {r && r.folds && (
        <>
          <Tbl head={['fold', 'test wells', 'test rows', 'test RMSE']} rows={r.folds.map((f) => [String(f.fold), list(f.testGroups), String(f.rows), six(f.score)])} />
          <TileGrid><Tile label="Mean test RMSE over the folds" value={six(r.mean)} /></TileGrid>
          <Declared title="THE SHUFFLED ORDER, dealt round robin">{list(r.order)}</Declared>
        </>
      )}
      <Note>Every well is tested once. The mean over the folds is the arithmetic mean of the engine&apos;s fold scores.</Note>
    </>
  );
};

export const LeakageMode = () => {
  const [text, setText, t] = useTable(attributeTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI, easting, northing, kb, mudWeight');
  const [target, setTarget] = useState('DT');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const r = t.error ? null : leakageOf({
    X: matrixOf(t.rows, names(feats)), y: t.rows.map((x) => (x[target.trim()] === undefined ? null : x[target.trim()])), groups: t.rows.map((x) => x.well),
    model: { kind: 'ols' }, testFraction: parseNumber(fraction), seed: parseNumber(seed), metric: 'rmse',
  });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="Test fraction" value={fraction} onChange={setFraction} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['split', 'training rows', 'test rows', 'wells on both sides', 'test RMSE']} rows={[
            ['random rows', String(r.randomRow.nTrain), String(r.randomRow.nTest), String(r.randomRow.sharedGroups.length), six(r.randomRow.testScore)],
            ['whole wells', String(r.group.nTrain), String(r.group.nTest), '0', six(r.group.testScore)],
          ]} />
          <TileGrid><Tile label="Optimism, group RMSE less random-row RMSE" value={six(r.optimism)} /></TileGrid>
        </>
      )}
      <Note>Take the four well attributes out of the features and compare: leakage needs a feature that names the well.</Note>
    </>
  );
};

export const LogisticMode = ({ pay }) => {
  const [text, setText, t] = useTable(payTableText());
  const [feats, setFeats] = useState(TEACHING.payFeatures.join(', '));
  const [target, setTarget] = useState('PAY');
  const [l2, setL2] = useState('0');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const r = t.error ? null : fitAndScore({ rows: t.rows, features: names(feats), target: target.trim(), kind: 'logistic', l2: parseNumber(l2), testFraction: parseNumber(fraction), seed: parseNumber(seed) });
  const m = r && r.model;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (the target holds 0 and 1)" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="l2 penalty" value={l2} onChange={setL2} />
        <NumField label="Test fraction" value={fraction} onChange={setFraction} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {m && !m.error && (
        <>
          <Tbl head={['term', 'coefficient (log odds per unit)', 'standard error']} rows={m.names.map((nm, j) => [nm, six(m.coefficients[j]), m.standardErrors ? six(m.standardErrors[j]) : 'none'])} />
          <TileGrid>
            <Tile label="Newton iterations" value={String(m.iterations)} />
            <Tile label="Converged" value={String(m.converged)} />
            <Tile label="Deviance" value={six(m.deviance)} />
            <Tile label="Separation" value={m.separation.type} />
          </TileGrid>
        </>
      )}
      {r && r.report && !r.report.error && (
        <TileGrid>
          <Tile label={`Test wells: ${list(r.split.testGroups)}`} value={`${r.report.n} rows`} />
          <Tile label="Accuracy at 0.5" value={six(r.report.accuracy)} />
          {r.roc && !r.roc.error && <Tile label="AUC" value={six(r.roc.auc)} />}
          {r.loss && !r.loss.error && <Tile label="Log loss" value={six(r.loss.logLoss)} />}
        </TileGrid>
      )}
      <Note>A probability above 0.5 is class 1; exactly 0.5 is class 0. With no penalty a separated label is refused.</Note>
      {pay && <Note>Ekene pay on {list(pay.testGroups)}: AUC {six(pay.auc)}, log loss {six(pay.logLoss)}.</Note>}
    </>
  );
};

export const ConfusionMode = () => {
  const [yt, setYt] = useState('0, 1, 1, 0, 1');
  const [yp, setYp] = useState('0, 1, 0, 0, 1');
  const [zd, setZd] = useState('0');
  const a = parseSeries(yt);
  const b = parseSeries(yp);
  const r = a.error || b.error ? null : reportOf({ yTrue: a.values, yPred: b.values, zeroDivision: parseNumber(zd) });
  return (
    <>
      <FieldGrid>
        <TextField label="True labels" value={yt} onChange={setYt} rows={2} />
        <TextField label="Predicted labels" value={yp} onChange={setYp} rows={2} />
        <SelectField label="zeroDivision" value={zd} onChange={setZd} options={[['0', '0, the default'], ['1', '1']]} />
      </FieldGrid>
      {(a.error || b.error) && <Note>{a.error || b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['true \\ predicted', ...r.labels.map(String)]} rows={r.labels.map((l, i) => [String(l), ...r.matrix[i].map(String)])} />
          <Tbl head={['label', 'TP', 'FP', 'FN', 'support', 'precision', 'recall', 'F1']} rows={r.perClass.map((c) => [String(c.label), String(c.tp), String(c.fp), String(c.fn), String(c.support), six(c.precision), six(c.recall), six(c.f1)])} />
          <Tbl head={['average', 'precision', 'recall', 'F1']} rows={[['macro', six(r.macro.precision), six(r.macro.recall), six(r.macro.f1)], ['weighted', six(r.weighted.precision), six(r.weighted.recall), six(r.weighted.f1)]]} />
          <TileGrid><Tile label="Accuracy" value={six(r.accuracy)} /></TileGrid>
          {r.undefinedRatios.length > 0 && <Declared title="A ZERO DENOMINATOR, scored zeroDivision">{r.undefinedRatios.map((u) => `${u.metric} of ${u.label}`).join('; ')}</Declared>}
        </>
      )}
    </>
  );
};

export const RocMode = () => {
  const [yt, setYt] = useState('0, 1, 0, 1, 1, 0');
  const [sc, setSc] = useState('0.1, 0.4, 0.4, 0.8, 0.8, 0.2');
  const a = parseSeries(yt);
  const b = parseSeries(sc);
  const r = a.error || b.error ? null : rocOf({ yTrue: a.values, scores: b.values });
  const ll = a.error || b.error ? null : logLossOf({ yTrue: a.values, probabilities: b.values });
  const data = r && !r.error ? r.fpr.map((f, i) => ({ fpr: f, tpr: r.tpr[i] })) : [];
  return (
    <>
      <FieldGrid>
        <TextField label="True labels, 0 and 1" value={yt} onChange={setYt} rows={2} />
        <TextField label="Scores or probabilities" value={sc} onChange={setSc} rows={2} />
      </FieldGrid>
      {(a.error || b.error) && <Note>{a.error || b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={AXIS} />
                <YAxis type="number" domain={[0, 1]} tick={AXIS} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => six(v)} />
                <Line dataKey="tpr" name="true positive rate" stroke="#38bdf8" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Tbl head={['threshold', 'FPR', 'TPR']} rows={r.fpr.map((f, i) => [r.thresholds[i] === null ? 'null' : six(r.thresholds[i]), six(f), six(r.tpr[i])])} />
          <TileGrid><Tile label="AUC" value={six(r.auc)} /></TileGrid>
        </>
      )}
      {ll && ll.error && <Refusal r={ll} />}
      {ll && !ll.error && <TileGrid><Tile label="Log loss" value={six(ll.logLoss)} /><Tile label="Rows clipped" value={String(ll.clipped)} /></TileGrid>}
      <Note>Equal scores move together, a diagonal step. Log loss needs probabilities from 0 to 1.</Note>
    </>
  );
};

const ValidateExplorer = ({ initialMode = 'ridge' }) => {
  const [mode, setMode] = useState(initialMode);
  const path = useMemo(() => safe(ridgeReader), []);
  const pay = useMemo(() => safe(payReader), []);
  return (
    <PanelShell
      title="Validate explorer"
      subtitle="Penalise, cross-validate by wells, catch leakage, and score a classifier."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ridge' && <RidgeMode path={path} />}
        {mode === 'kfold' && <KFoldMode />}
        {mode === 'leakage' && <LeakageMode />}
        {mode === 'logistic' && <LogisticMode pay={pay} />}
        {mode === 'confusion' && <ConfusionMode />}
        {mode === 'roc' && <RocMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored machine learning engine, or the mean of its fold
        scores. A score from a random-row split is a score on wells the model has already seen.
      </Note>
    </PanelShell>
  );
};

export default ValidateExplorer;
