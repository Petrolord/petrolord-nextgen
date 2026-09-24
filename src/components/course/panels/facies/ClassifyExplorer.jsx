import React, { useMemo, useState } from 'react';
import {
  parseTable, parseNumber, matrixOf, coredTableText, uncoredTableText, TEACHING, DEFAULTS,
  predictHeldOut, rangeCheck, cartFitOf, cartPredictOf, knnOf, knnReader,
} from './faciesLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, WordField, Refusal, Declared, names, safe,
} from './panelBits';

// The classify explorer (Expert): predicting facies, and the engine's own
// rules. k nearest neighbours with a stated held-out cored well, the CART tree
// and its printed form, the uncored wells with a min-max range check, and the
// tie rules on small tables a learner can check by hand. Every figure is a
// return value of the vendored clustering engine (and, for a score, the
// machine learning engine's classification report) through faciesLab.

export const MODES = [
  ['knn', 'k nearest neighbours on a held-out well'],
  ['cart', 'A classification tree and its printed form'],
  ['ties', 'Ties: a tied vote, equidistant rows, a tied root'],
  ['uncored', 'An uncored well: predict and check the range'],
  ['bounds', 'Boundaries and caps, read from the engine'],
];

const useTable = (initial) => {
  const [text, setText] = useState(initial);
  const t = useMemo(() => parseTable(text), [text]);
  return [text, setText, t];
};

const SCALES = [['standard', 'standard, fitted on the training rows'], ['minmax', 'min-max, fitted on the training rows'], ['none', 'none (raw logs)']];
const CHANNELS = 'GR, RHOB, NPHI, PEF, CALI';

const Score = ({ r }) => (r.report ? (
  <TileGrid>
    <Tile label="Training rows" value={String(r.trainRows)} />
    <Tile label="Held-out rows" value={String(r.testRows)} />
    <Tile label="Accuracy on the held-out rows" value={six(r.report.accuracy)} />
    <Tile label="Macro F1 on the held-out rows" value={six(r.report.macro.f1)} />
  </TileGrid>
) : <Note>The held-out rows carry no core facies, so there is no accuracy to show.</Note>);

export const KnnMode = ({ k0 }) => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [held, setHeld] = useState(TEACHING.heldOut);
  const [k, setK] = useState(String(TEACHING.knnK));
  const [scale, setScale] = useState('standard');
  const features = names(feats);
  const r = t.error ? null : predictHeldOut({ rows: t.rows, features, heldWells: names(held), k: parseNumber(k), scale });
  const m = r && !r.refusal ? r.model : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (with a FACIES column)" value={text} onChange={setText} rows={4} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <WordField label="Held-out wells" value={held} onChange={setHeld} />
        <NumField label="k" value={k} onChange={setK} />
        <SelectField label="Scaling" value={scale} onChange={setScale} options={SCALES} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {m && (
        <>
          <Score r={r} />
          <Tbl head={['neighbour of held-out row 0', 'training row', 'distance (scaled units)']} rows={m.neighbours[0].map((j, q) => [String(q + 1), String(j), six(m.distances[0][q])])} />
          <Note>Votes for held-out row 0: {m.votes[0].map((v) => `${v.label} ${v.count}`).join(', ')}.</Note>
          <TileGrid><Tile label="Tied votes" value={String(m.tiedVotes)} /><Tile label="Held-out row 0 predicted" value={String(m.predictions[0])} /></TileGrid>
          <Declared title="SCALING, in the engine's words">{m.basis.scaling}</Declared>
          <Declared title="THE VOTE, in the engine's words">{m.basis.vote}</Declared>
        </>
      )}
      <Note>The held-out well is stated. Choosing which wells to hold out, and scoring each in turn, is the machine learning course&apos;s subject.</Note>
      {k0 && <Note>Ekene, {TEACHING.heldOut} held out, k {TEACHING.knnK}: accuracy on its rows {six(k0.accuracy)}.</Note>}
    </>
  );
};

export const CartMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [feats, setFeats] = useState(CHANNELS);
  const [depth, setDepth] = useState('');
  const [leaf, setLeaf] = useState('');
  const [held, setHeld] = useState(TEACHING.heldOut);
  const features = names(feats);
  const d = parseNumber(depth);
  const l = parseNumber(leaf);
  const opts = { ...(d === undefined ? {} : { maxDepth: d }), ...(l === undefined ? {} : { minSamplesLeaf: l }) };
  const tree = t.error ? null : cartFitOf({ X: matrixOf(t.rows, features), y: t.rows.map((r) => r.FACIES), names: features, ...opts });
  const h = t.error ? null : predictHeldOut({ rows: t.rows, features, heldWells: names(held), method: 'tree', ...opts });
  return (
    <>
      <FieldGrid>
        <TextField label="Your table (with a FACIES column)" value={text} onChange={setText} rows={4} />
        <WordField label="Channels" value={feats} onChange={setFeats} />
        <NumField label="maxDepth (blank for the default)" value={depth} onChange={setDepth} />
        <NumField label="minSamplesLeaf (blank for 1)" value={leaf} onChange={setLeaf} />
        <WordField label="Held-out wells, for the score" value={held} onChange={setHeld} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {tree && tree.error && <Refusal r={tree} />}
      {tree && !tree.error && (
        <>
          <pre className="mt-3 text-xs text-slate-300 overflow-x-auto">{tree.printed}</pre>
          <TileGrid>
            <Tile label="Nodes" value={String(tree.nNodes)} />
            <Tile label="Leaves" value={String(tree.nLeaves)} />
            <Tile label="Accuracy on the rows it was grown on" value={six(tree.trainingAccuracy)} />
          </TileGrid>
          <Tbl head={['channel', 'importance']} rows={features.map((f, j) => [f, six(tree.featureImportances[j])])} />
          <Declared title="THRESHOLDS, in the engine's words">{tree.basis.thresholds}</Declared>
          <Declared title="STOPPING, in the engine's words">{tree.basis.stopping}</Declared>
        </>
      )}
      {h && h.refusal && <Refusal r={h.refusal} />}
      {h && !h.refusal && <Score r={h} />}
      <Note>The tree grown on every row prints above; the score is a second tree grown without the held-out wells.</Note>
    </>
  );
};

const TIE_VOTE = { X: [[0], [1], [3], [4], [10]], y: ['b', 'a', 'a', 'b', 'c'], Xnew: [[0.2]], k: 4, scale: 'none' };
const TIE_EQUAL = { X: [[0], [2], [4], [9]], y: ['a', 'b', 'c', 'c'], Xnew: [[2]], k: 2, scale: 'none' };

export const TiesMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [order, setOrder] = useState('GR, RHOB, NPHI, PEF');
  const features = names(order);
  const v = knnOf(TIE_VOTE);
  const e = knnOf(TIE_EQUAL);
  const root = t.error ? null : cartFitOf({ X: matrixOf(t.rows, features), y: t.rows.map((r) => r.FACIES), names: features, maxDepth: 1 });
  return (
    <>
      <Tbl head={['case', 'neighbours (row: label)', 'votes', 'predicted']} rows={[
        ['a tied vote', list(v.neighbours[0].map((j) => `${j}: ${TIE_VOTE.y[j]}`)), v.votes[0].map((x) => `${x.label} ${x.count}`).join(', '), String(v.predictions[0])],
        ['equidistant rows', list(e.neighbours[0].map((j) => `${j}: ${TIE_EQUAL.y[j]}`)), e.votes[0].map((x) => `${x.label} ${x.count}`).join(', '), String(e.predictions[0])],
      ]} />
      <Declared title="THE NEIGHBOURS, in the engine's words">{v.basis.neighbours}</Declared>
      <FieldGrid>
        <TextField label="Your table (with a FACIES column)" value={text} onChange={setText} rows={3} />
        <WordField label="Logs, in column order" value={order} onChange={setOrder} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {root && root.error && <Refusal r={root} />}
      {root && !root.error && !root.nodes[0].leaf && (
        <TileGrid>
          <Tile label="Root split" value={`${root.nodes[0].feature} <= ${six(root.nodes[0].threshold)}`} />
          <Tile label="Weighted impurity decrease" value={six(root.nodes[0].impurityDecrease)} />
        </TileGrid>
      )}
      {root && !root.error && <Declared title="THE SPLIT TIE, in the engine's words">{root.basis.ties}</Declared>}
      <Note>Swap NPHI and PEF in the column order and watch the root change log with the same decrease.</Note>
    </>
  );
};

export const UncoredMode = () => {
  const [text, setText, t] = useTable(coredTableText());
  const [newText, setNewText, tn] = useTable(uncoredTableText('EKENE-8'));
  const [feats, setFeats] = useState(TEACHING.logs.join(', '));
  const [k, setK] = useState(String(TEACHING.knnK));
  const features = names(feats);
  const ok = !t.error && !tn.error;
  const kn = ok ? knnOf({ X: matrixOf(t.rows, features), y: t.rows.map((r) => r.FACIES), Xnew: matrixOf(tn.rows, features), k: parseNumber(k), names: features }) : null;
  const tree = ok ? cartFitOf({ X: matrixOf(t.rows, features), y: t.rows.map((r) => r.FACIES), names: features }) : null;
  const tp = tree && !tree.error ? cartPredictOf({ model: tree, X: matrixOf(tn.rows, features) }) : null;
  const rc = ok ? rangeCheck({ trainRows: t.rows, newRows: tn.rows, features }) : null;
  const facies = kn && !kn.error ? kn.classes : [];
  const countOf = (p) => facies.map((f) => String(p.filter((x) => x === f).length));
  return (
    <>
      <FieldGrid>
        <TextField label="Training rows (with a FACIES column)" value={text} onChange={setText} rows={3} />
        <TextField label="The uncored well" value={newText} onChange={setNewText} rows={3} />
        <WordField label="Logs" value={feats} onChange={setFeats} />
        <NumField label="k" value={k} onChange={setK} />
      </FieldGrid>
      {(t.error || tn.error) && <Note>{t.error || tn.error}</Note>}
      {kn && kn.error && <Refusal r={kn} />}
      {tp && tp.error && <Refusal r={tp} />}
      {kn && !kn.error && tp && !tp.error && (
        <Tbl head={['method', ...facies]} rows={[[`kNN, k ${kn.k}`, ...countOf(kn.predictions)], ['tree', ...countOf(tp.predictions)]]} />
      )}
      {rc && rc.refusal && <Refusal r={rc.refusal} />}
      {rc && !rc.refusal && (
        <Tbl head={['log', 'lowest scaled value', 'highest scaled value', 'rows above 1', 'rows below 0']} rows={rc.features.map((f) => [f.feature, six(f.lowest), six(f.highest), String(f.above), String(f.below)])} />
      )}
      <Note>Agreement between two methods trained on the same rows is not a check against rock. A range check sees only the rows that leave the range; a whole well read hot inside it passes.</Note>
    </>
  );
};

export const BoundsMode = () => {
  const TEACHING_CAPS = {
    silhouette: DEFAULTS.SILHOUETTE_MAX_ROWS, agglomerative: DEFAULTS.AGGLOMERATIVE_MAX_ROWS, knn: DEFAULTS.KNN_MAX_PAIRS,
    nInit: DEFAULTS.KMEANS_N_INIT, depth: DEFAULTS.CART_MAX_DEPTH, tie: DEFAULTS.TIE_REL, sign: DEFAULTS.SIGN_TIE_REL,
  };
  const rows = [
    ['silhouette rows scored in full', String(TEACHING_CAPS.silhouette)],
    ['agglomerative rows accepted', String(TEACHING_CAPS.agglomerative)],
    ['kNN training rows x new rows', String(TEACHING_CAPS.knn)],
    ['k-means starts by default', String(TEACHING_CAPS.nInit)],
    ['tree depth by default (root 0)', String(TEACHING_CAPS.depth)],
    ['distance and height tie band, relative', TEACHING_CAPS.tie.toExponential(0)],
    ['sign rule band, relative', TEACHING_CAPS.sign.toExponential(0)],
  ];
  const [k, setK] = useState('2');
  const r = knnOf({ X: [[1], [2]], y: ['a', 'b'], Xnew: [[1]], k: parseNumber(k) });
  return (
    <>
      <Tbl head={['rule', 'value, read from the engine\'s DEFAULTS']} rows={rows} />
      <FieldGrid>
        <NumField label="k for two training rows (try 2, then 3)" value={k} onChange={setK} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : <Note>k {r.k} is accepted: predicted {String(r.predictions[0])}.</Note>}
      <Note>Each rule draws its own boundary. Above a row cap, sample with a stated seed or cluster with k-means.</Note>
    </>
  );
};


const ClassifyExplorer = ({ initialMode = 'knn' }) => {
  const [mode, setMode] = useState(initialMode);
  const k0 = useMemo(() => safe(knnReader), []);
  return (
    <PanelShell
      title="Classify explorer"
      subtitle="A predicted facies is only as good as the rows it was scaled and trained on."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'knn' && <KnnMode k0={k0} />}
        {mode === 'cart' && <CartMode />}
        {mode === 'ties' && <TiesMode />}
        {mode === 'uncored' && <UncoredMode />}
        {mode === 'bounds' && <BoundsMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored engines. A facies predicted for an uncored well is
        written back as a predicted channel, beside an empty core facies.
      </Note>
    </PanelShell>
  );
};

export default ClassifyExplorer;
