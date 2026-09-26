import React, { useState } from 'react';
import {
  parseNumber, parseNumbers, parseNames, TEACHING, DEFAULTS, DATASET, JUDGMENTS, runsOf, evaluateOf,
  kappaOf, calibrationOf, bootstrapOf, perQueryValues, metricsOf, extractionOf,
} from './evaluateLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, eX, Tbl, TextField, Refusal, Declared,
} from './panelBits';

// The trust explorer (Expert): agreement, calibration and the engine's rules.
// Measure two raters' agreement with Cohen's kappa, unweighted or weighted;
// calibrate a set of probabilities against their outcomes with the Brier
// score, the reliability table, ECE and MCE; decompose the Brier score with
// the within-bin terms; put a seeded bootstrap interval on a mean; and probe a
// boundary rule either side. Every figure is a return value of the vendored
// evaluation engine through evaluateLab. Paste your own ratings, outcomes,
// probabilities and values as lists.

export const MODES = [
  ['kappa', "Cohen's kappa"],
  ['calibration', 'Calibration: Brier, reliability table, ECE and MCE'],
  ['murphy', 'The Murphy decomposition'],
  ['bootstrap', 'A seeded bootstrap of a mean'],
  ['bounds', 'A boundary rule, probed'],
];

const annotators = () => {
  const a = []; const b = [];
  DATASET.queries.queries.forEach((q) => Object.keys(q.judgments).sort().forEach((d) => { a.push(q.judgments[d]); b.push(q.secondAnnotator[d]); }));
  return [a.join(', '), b.join(', ')];
};
const CAL_Y = DATASET.calibration.rows.map((r) => r.relevant).join(', ');
const CAL_P = DATASET.calibration.rows.map((r) => r.probability).join(', ');

/** Ratings as numbers when every entry is a number, as words otherwise. */
const ratings = (text) => {
  const n = parseNumbers(text);
  return n.error ? parseNames(text) : n.values;
};

export const KappaMode = () => {
  const [a0, b0] = annotators();
  const [aText, setAText] = useState(a0);
  const [bText, setBText] = useState(b0);
  const [labels, setLabels] = useState('');
  const [weights, setWeights] = useState('none');
  const lab = labels.trim() === '' ? undefined : ratings(labels);
  const r = kappaOf({ a: ratings(aText), b: ratings(bText), weights, ...(lab ? { labels: lab } : {}) });
  return (
    <>
      <FieldGrid>
        <TextField label="Rater a, one rating an item" value={aText} onChange={setAText} rows={3} />
        <TextField label="Rater b, the same items in the same order" value={bText} onChange={setBText} rows={3} />
        <TextField label="Labels in order (blank: the ratings sorted)" value={labels} onChange={setLabels} rows={1} />
        <SelectField label="Weights" value={weights} onChange={setWeights} options={[['none', 'none (unweighted)'], ['linear', 'linear'], ['quadratic', 'quadratic']]} />
      </FieldGrid>
      {r.error && <Refusal r={r} />}
      {!r.error && (
        <>
          <Tbl head={['a \\ b', ...r.labels.map(String), 'row total']} rows={r.confusion.map((row, i) => [String(r.labels[i]), ...row.map(String), String(r.rowTotals[i])])} />
          <TileGrid>
            <Tile label="Items" value={String(r.n)} />
            <Tile label="Observed agreement" value={six(r.observedAgreement)} />
            <Tile label="Expected agreement" value={six(r.expectedAgreement)} />
            <Tile label="Kappa" value={six(r.kappa)} />
          </TileGrid>
          {r.note && <Note>{r.note}</Note>}
          <Declared title="KAPPA, in the engine's words">{r.basis.kappa}</Declared>
          <Declared title="THE WEIGHTS, in the engine's words">{r.basis.weights}</Declared>
        </>
      )}
      <Note>Weighted kappa uses the label positions, so words need their order given in the labels box.</Note>
    </>
  );
};

const useCal = () => {
  const [yText, setYText] = useState(CAL_Y);
  const [pText, setPText] = useState(CAL_P);
  const [bins, setBins] = useState(String(DEFAULTS.BINS));
  const y = parseNumbers(yText); const p = parseNumbers(pText);
  const r = y.error || p.error ? null : calibrationOf({ yTrue: y.values, probabilities: p.values, bins: parseNumber(bins) });
  const fields = (
    <FieldGrid>
      <TextField label="Outcomes, 0 or 1, one a row" value={yText} onChange={setYText} rows={3} />
      <TextField label="Probabilities, the same rows in the same order" value={pText} onChange={setPText} rows={3} />
      <NumField label={`bins (1 to ${DEFAULTS.MAX_BINS})`} value={bins} onChange={setBins} />
    </FieldGrid>
  );
  return { r, fields, err: y.error || p.error };
};

export const CalibrationMode = () => {
  const { r, fields, err } = useCal();
  return (
    <>
      {fields}
      {err && <Note>{err}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Rows" value={String(r.n)} />
            <Tile label="Base rate" value={six(r.baseRate)} />
            <Tile label="Brier score" value={six(r.brier)} />
            <Tile label="ECE" value={six(r.ece)} />
            <Tile label="MCE" value={six(r.mce)} />
            <Tile label="Log loss" value={six(r.logLoss)} />
            <Tile label="Probabilities clipped" value={String(r.logLossClipped)} />
          </TileGrid>
          <Tbl head={['bin', 'lower', 'upper', 'rows', 'mean probability', 'observed frequency', 'gap']} rows={r.table.map((t) => [String(t.bin), six(t.lower), `${six(t.upper)}${t.closedRight ? ' (closed)' : ''}`, String(t.n), six(t.meanPredicted), six(t.observedFrequency), six(t.gap)])} />
          <Declared title="THE BINS, in the engine's words">{r.basis.bins}</Declared>
          <Declared title="LOG LOSS, in the engine's words">{r.basis.logLoss}</Declared>
        </>
      )}
      <Note>A probability exactly on an interior edge opens the upper bin. Quote ECE and MCE with their bin count.</Note>
    </>
  );
};

export const MurphyMode = () => {
  const { r, fields, err } = useCal();
  return (
    <>
      {fields}
      {err && <Note>{err}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['term', 'value']} rows={[
            ['reliability REL', six(r.murphy.reliability)], ['resolution RES', six(r.murphy.resolution)],
            ['uncertainty UNC', six(r.murphy.uncertainty)], ['within-bin variance WBV', six(r.murphy.withinBinVariance)],
            ['within-bin covariance term WBC (twice the pooled within-bin covariance)', six(r.murphy.withinBinCovariance)], ['REL - RES + UNC + WBV - WBC', six(r.murphy.sum)],
            ['Brier', six(r.brier)], ['closure', eX(r.murphy.closure)],
          ]} />
          <Declared title="THE DECOMPOSITION, in the engine's words">{r.basis.murphy}</Declared>
        </>
      )}
      <Note>Without the two within-bin terms the three classic terms do not add up to the Brier score whenever probabilities in a bin differ.</Note>
    </>
  );
};

const ndcgA = () => perQueryValues(evaluateOf({ runs: runsOf('A'), judgments: JUDGMENTS, k: TEACHING.k }), 'ndcg').join(', ');

export const BootstrapMode = () => {
  const [text, setText] = useState(ndcgA());
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [nBoot, setNBoot] = useState(String(TEACHING.nBoot));
  const [level, setLevel] = useState(String(DEFAULTS.LEVEL));
  const v = parseNumbers(text);
  const r = v.error ? null : bootstrapOf({ values: v.values, seed: parseNumber(seed), nBoot: parseNumber(nBoot), level: parseNumber(level) });
  return (
    <>
      <FieldGrid>
        <TextField label="Values, one a query" value={text} onChange={setText} rows={3} />
        <NumField label="seed" value={seed} onChange={setSeed} />
        <NumField label="replicates (nBoot)" value={nBoot} onChange={setNBoot} />
        <SelectField label="level" value={level} onChange={setLevel} options={DEFAULTS.LEVELS.map((l) => [String(l), String(l)])} />
      </FieldGrid>
      {v.error && <Note>{v.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Mean" value={six(r.mean)} />
            <Tile label={r.labels.lower} value={six(r.lower)} />
            <Tile label={r.labels.upper} value={six(r.upper)} />
            <Tile label="Standard error" value={six(r.standardError)} />
          </TileGrid>
          {r.note && <Note>{r.note}</Note>}
          <Declared title="THE RESAMPLING, in the engine's words">{r.basis.resampling}</Declared>
        </>
      )}
      <Note>The interval is a percentile of a statistic and is labelled as one. The platform keeps its low, best and high case labels for outcomes.</Note>
    </>
  );
};

const RULES = [
  ['grade', 'relevant: a grade against the threshold'],
  ['tolerance', 'a number field: the tolerance is inclusive'],
  ['edge', 'a calibration bin edge'],
  ['cutoff', 'a relevant passage at rank k and at rank k + 1'],
];

export const BoundsMode = () => {
  const [rule, setRule] = useState('edge');
  const [x, setX] = useState('0.3');
  const [bins, setBins] = useState(String(DEFAULTS.BINS));
  let rows = [];
  let refusal = null;
  const v = parseNumber(x);
  if (rule === 'grade') {
    const r = metricsOf({ ranking: ['p'], judgments: { p: Number.isInteger(v) ? v : 0 }, k: 1, relevantGrade: 2 });
    if (r.error) refusal = r; else rows = [[`grade ${x} at relevantGrade 2`, `hit ${r.hit}`]];
  } else if (rule === 'tolerance') {
    const r = extractionOf({ labels: [{ id: 'r', fields: { q: 100 } }], predictions: [{ id: 'r', fields: { q: v } }], fields: [{ name: 'q', type: 'number', absTol: 1 }] });
    if (r.error) refusal = r; else rows = [[`prediction ${x} against the label 100, absTol 1`, r.perRecord[0].fields.q.outcome]];
  } else if (rule === 'edge') {
    const r = calibrationOf({ yTrue: [1], probabilities: [v], bins: parseNumber(bins) });
    if (r.error) refusal = r; else rows = [[`probability ${x}, ${bins} bins`, `bin ${r.table.findIndex((t) => t.n === 1)}`]];
  } else {
    const k = Number.isInteger(v) ? v : 1;
    const r1 = metricsOf({ ranking: ['n1', 'n2', 'rel'], judgments: { rel: 3 }, k });
    if (r1.error) refusal = r1; else rows = [[`the relevant passage at rank 3, k ${k}`, `reciprocal rank ${six(r1.reciprocalRank)}`]];
  }
  return (
    <>
      <FieldGrid>
        <SelectField label="Rule" value={rule} onChange={setRule} options={RULES} />
        <NumField label="Value to probe" value={x} onChange={setX} />
        {rule === 'edge' && <NumField label="bins" value={bins} onChange={setBins} />}
      </FieldGrid>
      {refusal && <Refusal r={refusal} />}
      {!refusal && <Tbl head={['probe', 'what the engine returned']} rows={rows} />}
      <Note>Probe a value at the boundary, then one just across it. Each rule has its own boundary.</Note>
    </>
  );
};

const TrustExplorer = ({ initialMode = 'kappa' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Trust explorer"
      subtitle="Agreement, calibration, the Brier decomposition, a seeded interval and the engine's boundary rules."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'kappa' && <KappaMode />}
        {mode === 'calibration' && <CalibrationMode />}
        {mode === 'murphy' && <MurphyMode />}
        {mode === 'bootstrap' && <BootstrapMode />}
        {mode === 'bounds' && <BoundsMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored evaluation engine, which runs no language model.
      </Note>
    </PanelShell>
  );
};

export default TrustExplorer;
