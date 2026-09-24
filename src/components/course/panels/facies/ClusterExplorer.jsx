import React, { useMemo, useState } from 'react';
import {
  parseTable, parseNumber, matrixOf, coredLogsText, uncoredTableText, TEACHING, DEFAULTS,
  standardScalerOf, minMaxScalerOf, applyScalerOf, knnOf, pcaOf, pcaTransformOf, kmeansOf, assignOf, kmeansReader,
} from './faciesLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Warning, Declared, names, safe,
} from './panelBits';

// The cluster explorer (Associate): grouping logs into electrofacies. Scale
// the logs, measure a distance, find the principal components, run k-means and
// put new rows at the nearest centre. Every figure is a return value of the
// vendored clustering engine through faciesLab. Paste your own table: the first
// line names the columns, a column named well holds the well names, null is a
// missing value.

export const MODES = [
  ['scale', 'Standard and min-max scaling'],
  ['distance', 'The nearest rows, raw and scaled'],
  ['pca', 'Principal components'],
  ['kmeans', 'k-means, start by start'],
  ['assign', 'New rows at the nearest centre'],
];

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};

const SCALES = [['standard', 'standard (population SD, n)'], ['minmax', 'min-max'], ['none', 'none (raw logs)']];

export const ScaleMode = () => {
  const [text, setText, t] = useTable(coredLogsText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [sd, setSd] = useState('population');
  const features = names(feats);
  const X = t.error ? null : matrixOf(t.rows, features);
  const st = X ? standardScalerOf({ X, names: features, sd }) : null;
  const mm = X ? minMaxScalerOf({ X, names: features }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (every row is fitted)" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <SelectField label="Standard deviation" value={sd} onChange={setSd} options={[['population', 'population (n), the clustering default'], ['sample', 'sample (n - 1)']]} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {st && st.error && <Refusal r={st} />}
      {mm && mm.error && <Refusal r={mm} />}
      {st && !st.error && mm && !mm.error && (
        <Tbl head={['log', 'centre (mean)', 'scale (standard deviation)', 'min', 'max', 'range']}
          rows={features.map((f, j) => [f, six(st.centre[j]), six(st.scale[j]), six(mm.min[j]), six(mm.max[j]), six(mm.scale[j])])} />
      )}
      {st && !st.error && <Declared title="THE DIVISOR, in the engine's words">{st.basis.sd}</Declared>}
      <Note>k-means, the silhouette and agglomerative clustering fit the scaler on the rows clustered, with the population standard deviation (n). A log that never changes is refused by name.</Note>
    </>
  );
};

export const DistanceMode = () => {
  const [text, setText, t] = useTable(coredLogsText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [row, setRow] = useState('0');
  const [k, setK] = useState('5');
  const [scale, setScale] = useState('standard');
  const features = names(feats);
  const X = t.error ? null : matrixOf(t.rows, features);
  const i = parseNumber(row);
  const labels = t.error ? null : t.rows.map((r) => r.well);
  const xnew = X && Number.isInteger(i) && i >= 0 && i < X.length ? [X[i]] : null;
  const r = xnew ? knnOf({ X, y: labels, Xnew: xnew, k: (parseNumber(k) ?? 5) + 1, scale, names: features }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <NumField label="Row (counted from 0)" value={row} onChange={setRow} />
        <NumField label="Nearest rows to list" value={k} onChange={setK} />
        <SelectField label="Scaling" value={scale} onChange={setScale} options={SCALES} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {X && !xnew && <Note>Choose a row number from 0 to {X.length - 1}.</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <Tbl head={['nearest', 'row', 'well', 'distance']} rows={r.neighbours[0].map((j, q) => [String(q), String(j), labels[j], six(r.distances[0][q])])} />
      )}
      <Note>The row itself comes first, at distance 0. Raw, a distance is ruled by GR, whose units are the largest; scaled, every log counts. Say which scaling a distance was measured on.</Note>
    </>
  );
};

export const PcaMode = () => {
  const [text, setText, t] = useTable(coredLogsText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [matrix, setMatrix] = useState('correlation');
  const [nComp, setNComp] = useState('');
  const [newText, setNewText, tn] = useTable(uncoredTableText());
  const features = names(feats);
  const q = parseNumber(nComp);
  const p = t.error ? null : pcaOf({ X: matrixOf(t.rows, features), names: features, matrix, ...(q === undefined ? {} : { nComponents: q }) });
  const pt = p && !p.error && !tn.error ? pcaTransformOf({ model: p, X: matrixOf(tn.rows, features) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <SelectField label="Matrix" value={matrix} onChange={setMatrix} options={[['correlation', 'correlation (the default)'], ['covariance', 'covariance']]} />
        <NumField label="Components kept (blank for all)" value={nComp} onChange={setNComp} />
        <TextField label="New rows to project (the same logs)" value={newText} onChange={setNewText} rows={3} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {p && p.error && <Refusal r={p} />}
      {p && !p.error && (
        <>
          <Tbl head={['component', 'eigenvalue', 'explained variance ratio', 'cumulative']} rows={p.explainedVariance.map((v, k) => [`PC${k + 1}`, six(v), six(p.explainedVarianceRatio[k]), six(p.cumulativeRatio[k])])} />
          <Tbl head={['log', ...p.loadings.map((_, k) => `PC${k + 1} loading`)]} rows={features.map((f, j) => [f, ...p.loadings.map((l) => six(l[j]))])} />
          {p.warning && <Warning text={p.warning} />}
          <Declared title="THE MATRIX, in the engine's words">{p.basis.matrix}</Declared>
          <Declared title="THE SIGN, in the engine's words">{p.basis.sign}</Declared>
        </>
      )}
      {tn.error && <Note>{tn.error}</Note>}
      {pt && pt.error && <Refusal r={pt} />}
      {pt && !pt.error && (
        <Tbl head={['new row', ...pt.scores[0].map((_, k) => `PC${k + 1} score`)]} rows={pt.scores.slice(0, 10).map((s, i) => [String(i), ...s.map(six)])} />
      )}
      <Note>New rows are scored with the centre, scale and components fitted on your table, never refitted. The first ten are shown.</Note>
    </>
  );
};

export const KmeansMode = ({ k0 }) => {
  const [text, setText, t] = useTable(coredLogsText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [k, setK] = useState(String(TEACHING.k));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [nInit, setNInit] = useState(String(DEFAULTS.KMEANS_N_INIT));
  const [scale, setScale] = useState('standard');
  const features = names(feats);
  const r = t.error ? null : kmeansOf({ X: matrixOf(t.rows, features), k: parseNumber(k), seed: parseNumber(seed), nInit: parseNumber(nInit), scale, names: features });
  const best = r && !r.error ? r.runs[r.bestRun] : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <NumField label="k" value={k} onChange={setK} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
        <NumField label="Starts (nInit)" value={nInit} onChange={setNInit} />
        <SelectField label="Scaling" value={scale} onChange={setScale} options={SCALES} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Inertia (scaled units)" value={six(r.inertia)} />
            <Tile label="Winning start" value={String(r.bestRun)} />
            <Tile label="Passes in the winning start" value={String(r.iterations)} />
            <Tile label="Converged" value={String(r.converged)} />
          </TileGrid>
          <Tbl head={['start', 'starting rows', 'passes', 'inertia']} rows={r.runs.map((s) => [String(s.run), list(s.initialRows), String(s.iterations), six(s.inertia)])} />
          <Tbl head={['pass of the winning start', 'inertia', 'rows that changed']} rows={r.trace.map((p) => [String(p.pass), six(p.inertia), String(p.changed)])} />
          <Tbl head={['cluster', 'rows', ...features.map((f) => `${f} centre`)]} rows={r.centresOriginal.map((c, i) => [String(i), String(r.sizes[i]), ...c.map(six)])} />
          {r.warning && <Warning text={r.warning} />}
          {best && <Declared title="THE BEST START, in the engine's words">{r.basis.best}</Declared>}
          <Declared title="SEEDING, in the engine's words">{r.basis.init}</Declared>
        </>
      )}
      <Note>Centres are printed in log units. Cluster numbers are names: another seed can number the same clusters differently.</Note>
      {k0 && <Note>Ekene cored rows, k {TEACHING.k}, seed {TEACHING.seed}, ten starts: inertia {six(k0.teaching.inertia)}.</Note>}
    </>
  );
};

export const AssignMode = () => {
  const [text, setText, t] = useTable(coredLogsText());
  const [newText, setNewText, tn] = useTable(uncoredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [k, setK] = useState(String(TEACHING.k));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const features = names(feats);
  const model = t.error ? null : kmeansOf({ X: matrixOf(t.rows, features), k: parseNumber(k), seed: parseNumber(seed), names: features });
  const a = model && !model.error && !tn.error ? assignOf({ model, X: matrixOf(tn.rows, features) }) : null;
  const counts = a && !a.error ? model.sizes.map((_, c) => a.labels.filter((l) => l === c).length) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Rows clustered" value={text} onChange={setText} rows={3} />
        <TextField label="New rows" value={newText} onChange={setNewText} rows={3} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <NumField label="k" value={k} onChange={setK} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
      </FieldGrid>
      {(t.error || tn.error) && <Note>{t.error || tn.error}</Note>}
      {model && model.error && <Refusal r={model} />}
      {a && a.error && <Refusal r={a} />}
      {a && !a.error && (
        <>
          <Tbl head={['cluster', 'new rows assigned']} rows={counts.map((n, c) => [String(c), String(n)])} />
          <Tbl head={['new row', 'cluster', 'distance to its centre (scaled units)']} rows={a.labels.slice(0, 10).map((l, i) => [String(i), String(l), six(a.distances[i])])} />
          <Declared title="THE RULE, in the engine's words">{a.basis.rule}</Declared>
        </>
      )}
      <Note>A new row takes the nearest centre after scaling with the scaler fitted on the rows clustered. Nothing is refitted.</Note>
    </>
  );
};

const ClusterExplorer = ({ initialMode = 'scale' }) => {
  const [mode, setMode] = useState(initialMode);
  const k0 = useMemo(() => safe(kmeansReader), []);
  return (
    <PanelShell
      title="Cluster explorer"
      subtitle="An electrofacies is a group of depth samples whose logs look alike."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'scale' && <ScaleMode />}
        {mode === 'distance' && <DistanceMode />}
        {mode === 'pca' && <PcaMode />}
        {mode === 'kmeans' && <KmeansMode k0={k0} />}
        {mode === 'assign' && <AssignMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored clustering engine. A cluster takes a facies name only
        after it is compared with core.
      </Note>
    </PanelShell>
  );
};

export default ClusterExplorer;
