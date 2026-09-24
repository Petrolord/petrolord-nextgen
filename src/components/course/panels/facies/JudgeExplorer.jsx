import React, { useMemo, useState } from 'react';
import {
  parseTable, parseNumber, parseLabels, matrixOf, coredTableText, TEACHING,
  elbowOf, silhouetteOf, kmeansOf, agglomerativeOf, cutTreeOf, matchOf, ariOf, ariReader,
} from './faciesLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Warning, Declared, names, safe,
} from './panelBits';

// The judge explorer (Professional): judging groups against core. The elbow,
// the silhouette, agglomerative clustering with its tree and cut, matching
// clusters to core facies and the adjusted Rand index. Every figure is a return
// value of the vendored clustering engine through faciesLab. The default table
// is the Ekene cored rows with their core facies in a FACIES column.

export const MODES = [
  ['elbow', 'The elbow: inertia against k'],
  ['silhouette', 'The silhouette, row by row and cluster by cluster'],
  ['tree', 'Agglomerative clustering, the tree and its cut'],
  ['match', 'Matching clusters to core facies'],
  ['ari', 'The adjusted Rand index of two labellings'],
];

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};

const SCALES = [['standard', 'standard (population SD, n)'], ['minmax', 'min-max'], ['none', 'none (raw logs)']];
const LINKS = [['ward', 'Ward'], ['complete', 'complete'], ['average', 'average']];

export const ElbowMode = ({ kMin0 = '1', kMax0 = '8' }) => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [kMin, setKMin] = useState(kMin0);
  const [kMax, setKMax] = useState(kMax0);
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [nInit, setNInit] = useState('');
  const features = names(feats);
  const r = t.error ? null : elbowOf({ X: matrixOf(t.rows, features), kMin: parseNumber(kMin), kMax: parseNumber(kMax), seed: parseNumber(seed), nInit: parseNumber(nInit), names: features, withSilhouette: true });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <NumField label="Smallest k" value={kMin} onChange={setKMin} />
        <NumField label="Largest k" value={kMax} onChange={setKMax} />
        <NumField label="Seed" value={seed} onChange={setSeed} />
        <NumField label="Starts (blank for the default)" value={nInit} onChange={setNInit} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['k', 'inertia', 'drop', 'drop fraction', 'passes', 'mean silhouette']} rows={r.table.map((x) => [String(x.k), six(x.inertia), six(x.drop), six(x.dropFraction), String(x.iterations), six(x.silhouette)])} />
          {r.warning && <Warning text={r.warning} />}
          <Declared title="THE PICK, in the engine's words">{r.basis.pick}</Declared>
          <TileGrid><Tile label="Highest mean silhouette at k" value={String(r.bestSilhouetteK)} /></TileGrid>
        </>
      )}
      <Note>No elbow is picked for you. Each k runs with its own seed stream, so a row equals the single k-means call.</Note>
    </>
  );
};

export const SilhouetteMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [by, setBy] = useState('kmeans');
  const [k, setK] = useState(String(TEACHING.k));
  const [scale, setScale] = useState('standard');
  const [sample, setSample] = useState('');
  const features = names(feats);
  const X = t.error ? null : matrixOf(t.rows, features);
  const km = X && by === 'kmeans' ? kmeansOf({ X, k: parseNumber(k), seed: TEACHING.seed, names: features }) : null;
  const labels = by === 'kmeans' ? (km && !km.error ? km.labels : null) : (t.error ? null : t.rows.map((r) => r.FACIES));
  const n = parseNumber(sample);
  const s = X && labels ? silhouetteOf({ X, labels, scale, names: features, ...(n === undefined ? {} : { sampleSize: n, seed: TEACHING.seed }) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <SelectField label="Labels" value={by} onChange={setBy} options={[['kmeans', 'k-means clusters (seed stated)'], ['facies', 'the FACIES column']]} />
        <NumField label="k for k-means" value={k} onChange={setK} />
        <SelectField label="Scaling of the distance" value={scale} onChange={setScale} options={SCALES} />
        <NumField label="Sample size (blank for every row)" value={sample} onChange={setSample} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {km && km.error && <Refusal r={km} />}
      {s && s.error && <Refusal r={s} />}
      {s && !s.error && (
        <>
          <TileGrid><Tile label="Mean silhouette" value={six(s.mean)} /><Tile label="Rows scored" value={String(s.n)} /></TileGrid>
          <Tbl head={['group', 'rows', 'mean silhouette']} rows={s.perCluster.map((c) => [String(c.label), String(c.size), six(c.mean)])} />
          <Declared title="THE FORMULA, in the engine's words">{s.basis.formula}</Declared>
          <Declared title="A ROW ALONE, in the engine's words">{s.basis.singleton}</Declared>
        </>
      )}
      <Note>k-means here uses seed {TEACHING.seed}. A sampled silhouette is quoted with its size and seed.</Note>
    </>
  );
};

export const TreeMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [linkage, setLinkage] = useState('ward');
  const [k, setK] = useState(String(TEACHING.k));
  const [recut, setRecut] = useState('3');
  const features = names(feats);
  const a = t.error ? null : agglomerativeOf({ X: matrixOf(t.rows, features), linkage, k: parseNumber(k), names: features });
  const c = a && !a.error ? cutTreeOf({ linkageMatrix: a.linkageMatrix, k: parseNumber(recut) }) : null;
  const sizes = (lab) => [...new Set(lab)].sort((x, y) => x - y).map((v) => lab.filter((l) => l === v).length);
  const lm = a && !a.error ? a.linkageMatrix : [];
  return (
    <>
      <FieldGrid>
        <TextField label="Your table" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <SelectField label="Linkage" value={linkage} onChange={setLinkage} options={LINKS} />
        <NumField label="Cut at k" value={k} onChange={setK} />
        <NumField label="Re-cut the same tree at k" value={recut} onChange={setRecut} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {a && a.error && <Refusal r={a} />}
      {a && !a.error && (
        <>
          <TileGrid>
            <Tile label="Cluster sizes" value={list(sizes(a.labels).map(String))} />
            <Tile label="Last merge made (below the cut)" value={six(a.cutHeights.below)} />
            <Tile label="Next merge (above the cut)" value={six(a.cutHeights.above)} />
            <Tile label="Tied merges" value={String(a.tiedSteps)} />
          </TileGrid>
          <Tbl head={['merge', 'id 1', 'id 2', 'height', 'rows']} rows={[...lm.slice(0, 5).map((r, s) => [s, r]), ...lm.slice(-5).map((r, s) => [lm.length - 5 + s, r])]
            .map(([s, r]) => [String(s), String(r[0]), String(r[1]), six(r[2]), String(r[3])])} />
          <Declared title="THE LINKAGE, in the engine's words">{a.basis.linkage}</Declared>
          <Declared title="THE CUT, in the engine's words">{a.basis.cut}</Declared>
        </>
      )}
      {c && c.error && <Refusal r={c} />}
      {c && !c.error && <Note>Re-cut at k {c.k} without re-running: cluster sizes {list(sizes(c.labels).map(String))}.</Note>}
      <Note>The first five and the last five merges are shown. Heights are in scaled units, and Ward heights are on their own scale.</Note>
    </>
  );
};

export const MatchMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [method, setMethod] = useState('kmeans');
  const [k, setK] = useState(String(TEACHING.k));
  const [mode, setMode] = useState('one-to-one');
  const features = names(feats);
  const X = t.error ? null : matrixOf(t.rows, features);
  const cl = X ? (method === 'kmeans' ? kmeansOf({ X, k: parseNumber(k), seed: TEACHING.seed, names: features }) : agglomerativeOf({ X, linkage: method, k: parseNumber(k), names: features })) : null;
  const m = cl && !cl.error ? matchOf({ yTrue: t.rows.map((r) => r.FACIES), clusters: cl.labels, mode }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (with a FACIES column)" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <SelectField label="Clusters from" value={method} onChange={setMethod} options={[['kmeans', 'k-means (seed stated)'], ...LINKS]} />
        <NumField label="k" value={k} onChange={setK} />
        <SelectField label="Matching" value={mode} onChange={setMode} options={[['one-to-one', 'one-to-one'], ['majority', 'majority']]} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {cl && cl.error && <Refusal r={cl} />}
      {m && m.error && <Refusal r={m} />}
      {m && !m.error && (
        <>
          <Tbl head={['cluster', ...m.faciesLabels]} rows={m.contingency.map((r, i) => [String(m.clusterLabels[i]), ...r.map(String)])} />
          <Tbl head={['cluster', 'facies', 'rows of that facies', 'rows in the cluster']} rows={m.mapping.map((x) => [String(x.cluster), x.facies, String(x.rows), String(x.clusterSize)])} />
          <TileGrid>
            <Tile label="Rows matched" value={String(m.matchedRows)} />
            <Tile label="Accuracy over these rows" value={six(m.report.accuracy)} />
            <Tile label="Macro F1" value={six(m.report.macro.f1)} />
            <Tile label="Adjusted Rand index" value={six(m.ari)} />
          </TileGrid>
          <Declared title="THE MATCHING, in the engine's words">{m.basis.mode}</Declared>
        </>
      )}
      <Note>Precision, recall and F1 are the machine learning course&apos;s ratios, read here from the mapped facies.</Note>
    </>
  );
};

export const AriMode = ({ a0 }) => {
  const [aText, setA] = useState('0, 0, 0, 1, 1, 1');
  const [bText, setB] = useState('p, p, q, q, r, r');
  const a = parseLabels(aText);
  const b = parseLabels(bText);
  const r = a.error || b.error ? null : ariOf({ a: a.values, b: b.values });
  return (
    <>
      <FieldGrid>
        <TextField label="Labelling a" value={aText} onChange={setA} rows={2} />
        <TextField label="Labelling b" value={bText} onChange={setB} rows={2} />
      </FieldGrid>
      {(a.error || b.error) && <Note>{a.error || b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid><Tile label="Adjusted Rand index" value={six(r.ari)} /></TileGrid>
          <Tbl head={['a \\ b', ...r.colLabels.map(String)]} rows={r.contingency.map((row, i) => [String(r.rowLabels[i]), ...row.map(String)])} />
          <Declared title="THE FORMULA, in the engine's words">{r.basis.formula}</Declared>
          <Declared title="THE EDGE, in the engine's words">{r.basis.special}</Declared>
        </>
      )}
      <Note>Renaming the clusters of either labelling leaves the index unchanged.</Note>
      {a0 && <Note>Ekene cored rows against core: k-means {six(a0.kmeans)}, complete linkage {six(a0.complete)}, the well names {six(a0.wells)}.</Note>}
    </>
  );
};

const JudgeExplorer = ({ initialMode = 'elbow' }) => {
  const [mode, setMode] = useState(initialMode);
  const a0 = useMemo(() => safe(ariReader), []);
  return (
    <PanelShell
      title="Judge explorer"
      subtitle="A cluster is worth something only when it is checked against the rock."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'elbow' && <ElbowMode />}
        {mode === 'silhouette' && <SilhouetteMode />}
        {mode === 'tree' && <TreeMode />}
        {mode === 'match' && <MatchMode />}
        {mode === 'ari' && <AriMode a0={a0} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored clustering engine. No single figure chooses k.
      </Note>
    </PanelShell>
  );
};

export default JudgeExplorer;
