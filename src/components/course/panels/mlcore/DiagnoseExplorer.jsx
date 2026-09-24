import React, { useMemo, useState } from 'react';
import {
  parseTable, parseNumber, matrixOf, olsOf, logisticOf, groupSplitOf, importanceOf, learningCurveOf, predictNewWell,
  sonicTableText, payTableText, highRtTableText, noSonicTableText, TEACHING, DEFAULTS, diagnoseReader,
} from './mlcoreLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Warning, Declared, names, safe,
} from './panelBits';

// The diagnose explorer (Expert): when the engine refuses, stops or
// extrapolates. The condition number and its refusal limit, separation and its
// exact test, convergence and its stated rule, permutation importance, the
// learning curve counted in wells, and a log predicted for a well that has
// none. Every figure is a return value of the vendored engine through
// mlcoreLab.

export const MODES = [
  ['condition', 'The condition number and the refusal limit'],
  ['separation', 'Separation, and a penalty that fits'],
  ['convergence', 'Newton steps and the stopping rule'],
  ['importance', 'Permutation importance'],
  ['learning', 'The learning curve, counted in wells'],
  ['missing', 'A missing log, predicted and range checked'],
];

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};
const col = (rows, c) => rows.map((r) => (r[c] === undefined ? null : r[c]));

export const ConditionMode = () => {
  const [text, setText, t] = useTable(sonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [target, setTarget] = useState('DT');
  const [maxc, setMaxc] = useState(String(DEFAULTS.MAX_CONDITION));
  const r = t.error ? null : olsOf({ X: matrixOf(t.rows, names(feats)), y: col(t.rows, target.trim()), names: names(feats), maxCondition: parseNumber(maxc) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="maxCondition" value={maxc} onChange={setMaxc} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <TileGrid>
          <Tile label="Condition number, raw" value={six(r.conditionNumber)} />
          <Tile label="Scaled condition number" value={six(r.scaledConditionNumber)} />
          <Tile label="R-squared" value={six(r.rSquared)} />
        </TileGrid>
      )}
      <Note>A fit is refused when the scaled condition number is above maxCondition. Centring a feature that sits far from zero lowers it.</Note>
    </>
  );
};

export const SeparationMode = ({ d }) => {
  const [text, setText, t] = useTable(highRtTableText());
  const [feats, setFeats] = useState('PHIC');
  const [target, setTarget] = useState('PAY');
  const [l2, setL2] = useState('0');
  const r = t.error ? null : logisticOf({ X: matrixOf(t.rows, names(feats)), y: col(t.rows, target.trim()), names: names(feats), l2: parseNumber(l2) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="l2 penalty" value={l2} onChange={setL2} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['term', 'coefficient']} rows={r.names.map((nm, j) => [nm, six(r.coefficients[j])])} />
          <TileGrid>
            <Tile label="Separation" value={r.separation.type} />
            <Tile label="Iterations" value={String(r.iterations)} />
            <Tile label="Converged" value={String(r.converged)} />
          </TileGrid>
          {r.separation.certificate && <Declared title="THE CERTIFICATE, in the engine's words">{r.separation.certificate}</Declared>}
        </>
      )}
      <Note>The separation test runs before any Newton step. With l2 at zero a separated label is refused; with a penalty it is fitted and reported.</Note>
      {d && <Note>Ekene, PHIC on the {d.separation.rows} rows at or above the RT cutoff: coefficient {six(d.separation.l2One)} at l2 1.</Note>}
    </>
  );
};

export const ConvergenceMode = () => {
  const [text, setText, t] = useTable(payTableText());
  const [feats, setFeats] = useState(TEACHING.payFeatures.join(', '));
  const [target, setTarget] = useState('PAY');
  const [tol, setTol] = useState(String(DEFAULTS.LOGISTIC_TOL));
  const [maxIter, setMaxIter] = useState(String(DEFAULTS.LOGISTIC_MAX_ITER));
  const r = t.error ? null : logisticOf({ X: matrixOf(t.rows, names(feats)), y: col(t.rows, target.trim()), names: names(feats), tol: parseNumber(tol), maxIter: parseNumber(maxIter) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="tol, in coefficient units" value={tol} onChange={setTol} />
        <NumField label="maxIter" value={maxIter} onChange={setMaxIter} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['iteration', 'largest full Newton step', 'log likelihood', 'halvings']} rows={r.trace.map((s) => [String(s.iteration), s.maxChange < 1e-4 ? s.maxChange.toExponential(2) : six(s.maxChange), six(s.logLikelihood), String(s.stepHalvings)])} />
          <TileGrid>
            <Tile label="Converged" value={String(r.converged)} />
            <Tile label="Iterations" value={String(r.iterations)} />
          </TileGrid>
          {r.warning && <Warning text={r.warning} />}
          <Declared title="THE STOPPING RULE, in the engine's words">{r.basis.convergence}</Declared>
        </>
      )}
    </>
  );
};

export const ImportanceMode = () => {
  const [text, setText, t] = useTable(sonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI, CALI');
  const [target, setTarget] = useState('DT');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [repeats, setRepeats] = useState('5');
  const [pseed, setPseed] = useState(String(TEACHING.seed));
  const features = names(feats);
  const g = t.error ? null : groupSplitOf({ groups: t.rows.map((r) => r.well), testFraction: parseNumber(fraction), seed: parseNumber(seed) });
  const X = t.error ? null : matrixOf(t.rows, features);
  const y = t.error ? null : col(t.rows, target.trim());
  const m = g && !g.error ? olsOf({ X: g.trainIndices.map((i) => X[i]), y: g.trainIndices.map((i) => y[i]), names: features }) : null;
  const pi = m && !m.error ? importanceOf({ model: m, X: g.testIndices.map((i) => X[i]), y: g.testIndices.map((i) => y[i]), metric: 'rmse', nRepeats: parseNumber(repeats), seed: parseNumber(pseed) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="Test fraction" value={fraction} onChange={setFraction} />
        <NumField label="Split seed" value={seed} onChange={setSeed} />
        <NumField label="Repeats" value={repeats} onChange={setRepeats} />
        <NumField label="Permutation seed" value={pseed} onChange={setPseed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {g && g.error && <Refusal r={g} />}
      {m && m.error && <Refusal r={m} />}
      {pi && pi.error && <Refusal r={pi} />}
      {pi && !pi.error && (
        <>
          <TileGrid><Tile label={`Baseline test RMSE, ${list(g.testGroups)}`} value={six(pi.baseline)} /></TileGrid>
          <Tbl head={['feature', 'mean drop', 'SD over repeats', 'drops']} rows={pi.importances.map((im) => [im.feature, six(im.mean), six(im.sd), im.drops.map(six).join(', ')])} />
          <Declared title="RANKING, largest mean drop first">{list(pi.ranking)}</Declared>
        </>
      )}
      <Note>Least squares is fitted on the training wells and shuffled one feature at a time on the test wells. Quote a drop with its seed and repeats.</Note>
    </>
  );
};

export const LearningMode = ({ d }) => {
  const [text, setText, t] = useTable(sonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [target, setTarget] = useState('DT');
  const [counts, setCounts] = useState('1, 2, 3, 4, 5, 6');
  const [fraction, setFraction] = useState(String(TEACHING.testFraction));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const cs = names(counts).map(Number);
  const r = t.error ? null : learningCurveOf({
    X: matrixOf(t.rows, names(feats)), y: col(t.rows, target.trim()), groups: t.rows.map((x) => x.well), model: { kind: 'ols' },
    trainGroupCounts: cs, testFraction: parseNumber(fraction), seed: parseNumber(seed), metric: 'rmse',
  });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <WordField label="Training wells at each point" value={counts} onChange={setCounts} />
        <NumField label="Test fraction" value={fraction} onChange={setFraction} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Declared title="TEST WELLS, then the training order">{list(r.testGroups)}; {list(r.trainOrder)}</Declared>
          <Tbl head={['training wells', 'rows', 'training RMSE', 'test RMSE']} rows={r.points.map((p) => [String(p.nGroups), String(p.nRows), six(p.trainScore), six(p.testScore)])} />
        </>
      )}
      {d && <Note>Ekene: {d.learningCurve.length} points, the test RMSE at one well {six(d.learningCurve[0].test)}.</Note>}
    </>
  );
};

export const MissingMode = ({ d }) => {
  const [text, setText, t] = useTable(sonicTableText());
  const [ntext, setNtext, n] = useTable(noSonicTableText());
  const [feats, setFeats] = useState('GR, RHOB, NPHI');
  const [target, setTarget] = useState('DT');
  const [lambda, setLambda] = useState('10');
  const r = t.error || n.error ? null : predictNewWell({ trainRows: t.rows, newRows: n.rows, features: names(feats), target: target.trim(), lambda: parseNumber(lambda) });
  return (
    <>
      <FieldGrid>
        <TextField label="Training rows (wells with the log)" value={text} onChange={setText} rows={3} />
        <TextField label="Rows to predict (the well without it)" value={ntext} onChange={setNtext} rows={3} />
        <WordField label="Features" value={feats} onChange={setFeats} />
        <WordField label="Target" value={target} onChange={setTarget} />
        <NumField label="lambda (0 is least squares)" value={lambda} onChange={setLambda} />
      </FieldGrid>
      {(t.error || n.error) && <Note>{t.error || n.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {r && !r.refusal && (
        <>
          <Tbl head={['feature', 'training minimum', 'training maximum', 'rows above the range', 'rows below it']} rows={r.outside.map((o, j) => [o.feature, six(r.min[j]), six(r.max[j]), String(o.above), String(o.below)])} />
          <Tbl head={['row', 'predicted', 'outside the training range']} rows={r.values.map((v, i) => [String(i), six(v), r.flagged.includes(i) ? 'yes' : 'no'])} />
        </>
      )}
      <Note>Write a prediction back as a new channel with its method, its training wells, its whole-well error and its out-of-range rows. The measured log stays empty.</Note>
      {d && <Note>Ekene {d.missingLog.well}: {d.missingLog.rows} predictions from {six(d.missingLog.lowest)} to {six(d.missingLog.highest)} us/ft.</Note>}
    </>
  );
};

const DiagnoseExplorer = ({ initialMode = 'condition' }) => {
  const [mode, setMode] = useState(initialMode);
  const d = useMemo(() => safe(diagnoseReader), []);
  return (
    <PanelShell
      title="Diagnose explorer"
      subtitle="When the engine refuses, stops or extrapolates, and why."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'condition' && <ConditionMode />}
        {mode === 'separation' && <SeparationMode d={d} />}
        {mode === 'convergence' && <ConvergenceMode />}
        {mode === 'importance' && <ImportanceMode />}
        {mode === 'learning' && <LearningMode d={d} />}
        {mode === 'missing' && <MissingMode d={d} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored machine learning engine. A refusal is the engine
        declining to print a number it cannot vouch for.
      </Note>
    </PanelShell>
  );
};

export default DiagnoseExplorer;
