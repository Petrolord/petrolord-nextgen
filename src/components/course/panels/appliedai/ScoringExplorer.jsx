import React, { useState } from 'react';
import {
  parseNumber, parseJson, parseDocuments, documentsText, parseNumbers, TEACHING, DEFAULTS, JUDGMENTS,
  runsOf, answersOf, shortsOf, evaluateOf, matchList, extractionOf, answersCheckOf, pairedOf, perQueryValues,
  DATASET,
} from './evaluateLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, Declared, pretty, YES_NO,
} from './panelBits';

// The scoring explorer (Professional): scoring retrieval and answers honestly.
// Score a set of rankings with MAP and nDCG at a stated cutoff, threshold and
// gain; short answers by SQuAD exact match and token F1; field extraction by
// outcome class; groundedness over a set of cited answers; and two systems
// against each other with a seeded paired bootstrap. Every figure is a return
// value of the vendored evaluation engine through evaluateLab. Paste your own
// runs, judgments, answers, labels and predictions as JSON.

export const MODES = [
  ['evaluate', 'MAP and nDCG over a set of queries'],
  ['answers', 'Short answers: exact match and token F1'],
  ['extraction', 'Field extraction by outcome'],
  ['grounded', 'Groundedness of a set of answers'],
  ['compare', 'Two systems and the paired bootstrap'],
];

const bool = (s) => s === 'true';
const EXT = DATASET.extraction;

export const EvaluateMode = () => {
  const [rText, setRText] = useState(pretty(runsOf('A')));
  const [jText, setJText] = useState(pretty(JUDGMENTS));
  const [k, setK] = useState(String(TEACHING.k));
  const [grade, setGrade] = useState(String(DEFAULTS.RELEVANT_GRADE));
  const [gain, setGain] = useState('linear');
  const [noRel, setNoRel] = useState('exclude');
  const r = parseJson(rText);
  const j = parseJson(jText);
  const ev = r.error || j.error ? null : evaluateOf({ runs: r.value, judgments: j.value, k: parseNumber(k), relevantGrade: parseNumber(grade), gain, noRelevant: noRel });
  return (
    <>
      <FieldGrid>
        <TextField label="Runs (JSON: query id to ranked passage ids, best first)" value={rText} onChange={setRText} rows={4} />
        <TextField label="Judgments (JSON: query id to { passage id: grade })" value={jText} onChange={setJText} rows={4} />
        <NumField label="k (cutoff)" value={k} onChange={setK} />
        <NumField label="relevant at grade" value={grade} onChange={setGrade} />
        <SelectField label="Gain" value={gain} onChange={setGain} options={[['linear', 'linear (the grade)'], ['exponential', 'exponential (2^grade - 1)']]} />
        <SelectField label="A query with no relevant passage" value={noRel} onChange={setNoRel} options={[['exclude', 'excluded and listed'], ['zero', 'kept, scored 0']]} />
      </FieldGrid>
      {r.error && <Note>{r.error}</Note>}
      {j.error && <Note>{j.error}</Note>}
      {ev && ev.error && <Refusal r={ev} />}
      {ev && !ev.error && (
        <>
          <Tbl head={['query', 'relevant', 'unjudged retrieved', 'AP', 'DCG', 'ideal DCG', 'nDCG']} rows={ev.perQuery.map((x) => [x.query, String(x.nRelevant), String(x.unjudgedRetrieved), six(x.averagePrecision), six(x.dcg), six(x.idcg), six(x.ndcg)])} />
          <TileGrid>
            <Tile label="Queries in the means" value={`${ev.nIncluded} of ${ev.nQueries}`} />
            <Tile label="MAP" value={six(ev.mean.map)} />
            <Tile label="Mean nDCG" value={six(ev.mean.ndcg)} />
            <Tile label="MRR" value={six(ev.mean.mrr)} />
          </TileGrid>
          {[...ev.excluded, ...ev.zeroed].map((x) => <Note key={x.query}>{`${x.query}: ${x.reason}.`}</Note>)}
          <Declared title="AVERAGE PRECISION, in the engine's words">{ev.basis.averagePrecision}</Declared>
          <Declared title="nDCG, in the engine's words">{ev.basis.ndcg}</Declared>
          <Declared title="THE NO-RELEVANT RULE, in the engine's words">{ev.basis.noRelevant}</Declared>
        </>
      )}
      <Note>State the cutoff, the threshold and the gain with every figure: the same runs give a different MAP at another threshold.</Note>
    </>
  );
};

export const AnswersMode = () => {
  const [text, setText] = useState(pretty(shortsOf('A')));
  const j = parseJson(text);
  const r = j.error ? null : matchList(j.value);
  return (
    <>
      <FieldGrid>
        <TextField label="Short answers (JSON array of { query, answer, reference })" value={text} onChange={setText} rows={8} />
      </FieldGrid>
      {j.error && <Note>{j.error}</Note>}
      {r && r.refusal && <Refusal r={r.refusal} />}
      {r && !r.refusal && (
        <>
          <Tbl head={['query', 'answer normalised', 'reference normalised', 'exact', 'F1']} rows={r.rows.map((x) => [x.query, x.r.normalizedPrediction || '(empty)', x.r.normalizedTruth || '(empty)', x.r.exactMatch ? '1' : '0', six(x.r.f1)])} />
          <TileGrid>
            <Tile label="Exact matches" value={`${r.exact} of ${r.rows.length}`} />
            <Tile label="Mean token F1 (derived)" value={six(r.meanF1)} />
          </TileGrid>
          {r.rows.length > 0 && <Declared title="NORMALISATION, in the engine's words">{r.rows[0].r.basis.normalize}</Declared>}
          {r.rows.length > 0 && <Declared title="TOKEN F1, in the engine's words">{r.rows[0].r.basis.f1}</Declared>}
        </>
      )}
      <Note>Each row is one answerMatch call; the mean is the arithmetic mean of the F1 column.</Note>
    </>
  );
};

export const ExtractionMode = () => {
  const [fText, setFText] = useState(pretty(EXT.fields));
  const [lText, setLText] = useState(pretty(EXT.labels.slice(0, 8)));
  const [pText, setPText] = useState(pretty(EXT.predictions.B.slice(0, 8)));
  const f = parseJson(fText); const l = parseJson(lText); const p = parseJson(pText);
  const r = f.error || l.error || p.error ? null : extractionOf({ fields: f.value, labels: l.value, predictions: p.value });
  return (
    <>
      <FieldGrid>
        <TextField label="Fields (JSON array of { name, type, absTol, relTol })" value={fText} onChange={setFText} rows={3} />
        <TextField label="Labels (JSON array of { id, fields })" value={lText} onChange={setLText} rows={4} />
        <TextField label="Predictions (JSON array of { id, fields })" value={pText} onChange={setPText} rows={4} />
      </FieldGrid>
      {[f, l, p].filter((x) => x.error).slice(0, 1).map((x) => <Note key="e">{x.error}</Note>)}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['field', 'correct', 'wrong', 'missed', 'unsupported', 'accuracy', 'F1']} rows={r.perField.map((x) => [x.field, String(x.correct), String(x.wrong), String(x.missed), String(x.unsupported), six(x.accuracy), six(x.f1)])} />
          <TileGrid>
            <Tile label="Micro accuracy" value={six(r.overall.microAccuracy)} />
            <Tile label="Macro accuracy" value={six(r.overall.macroAccuracy)} />
            <Tile label="Micro F1" value={six(r.overall.microF1)} />
            <Tile label="Macro F1" value={six(r.overall.macroF1)} />
            <Tile label="Correct because both empty" value={String(r.overall.correctEmpty)} />
          </TileGrid>
          <Tbl head={['record', 'field', 'outcome', 'reason']} rows={r.perRecord.flatMap((x) => Object.entries(x.fields).filter(([, c]) => c.outcome !== 'correct').map(([fn, c]) => [x.id, fn, c.outcome, c.reason]))} />
          <Declared title="THE OUTCOMES, in the engine's words">{r.basis.outcomes}</Declared>
          <Declared title="MICRO AND MACRO, in the engine's words">{r.basis.f1}</Declared>
        </>
      )}
    </>
  );
};

export const GroundedMode = () => {
  const [text, setText] = useState(documentsText());
  const [aText, setAText] = useState(pretty(answersOf('B')));
  const [rText, setRText] = useState(pretty(runsOf('B')));
  const [useRuns, setUseRuns] = useState('true');
  const [tol, setTol] = useState('0');
  const d = parseDocuments(text); const a = parseJson(aText); const rr = parseJson(rText);
  const r = d.error || a.error || (bool(useRuns) && rr.error) ? null : answersCheckOf({
    answers: a.value, documents: d.documents, numericRelTol: parseNumber(tol), ...(bool(useRuns) ? { runs: rr.value } : {}),
  });
  return (
    <>
      <FieldGrid>
        <TextField label="Passages (id: text, one a line, or JSON)" value={text} onChange={setText} rows={3} />
        <TextField label="Answers (JSON array of { query, text, citations })" value={aText} onChange={setAText} rows={5} />
        <TextField label="Retrieved lists (JSON: query id to passage ids)" value={rText} onChange={setRText} rows={3} />
        <SelectField label="Use the retrieved lists" value={useRuns} onChange={setUseRuns} options={YES_NO} />
        <NumField label="numericRelTol" value={tol} onChange={setTol} />
      </FieldGrid>
      {[d, a].filter((x) => x.error).slice(0, 1).map((x) => <Note key="e">{x.error}</Note>)}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Claims" value={String(r.nClaims)} />
            <Tile label="Supported" value={String(r.nSupported)} />
            <Tile label="Pooled supported fraction" value={six(r.supportedFraction)} />
            <Tile label="Mean per-answer fraction" value={six(r.meanAnswerSupportedFraction)} />
            <Tile label="Citations not retrieved" value={String(r.notRetrievedCitations)} />
            <Tile label="Unknown citations" value={String(r.unknownCitations)} />
          </TileGrid>
          <Tbl head={['query', 'claim', 'supported', 'reason']} rows={r.perAnswer.flatMap((p) => p.claims.filter((c) => !c.supported).map((c) => [p.query, c.text, 'false', c.reason]))} />
          {r.perAnswer.flatMap((p) => p.flags.map((fl) => <Note key={`${p.query}${fl}`}>{`${p.query}: ${fl}.`}</Note>))}
          <Declared title="CITATIONS, in the engine's words">{r.basis.citations}</Declared>
          <Declared title="POOLED AND PER ANSWER, in the engine's words">{r.basis.pooled}</Declared>
        </>
      )}
      <Note>A supported claim is found in a passage the answer cites and retrieved. That says where the figure came from, and nothing about whether the answer is right.</Note>
    </>
  );
};

const ndcgList = (s) => perQueryValues(evaluateOf({ runs: runsOf(s), judgments: JUDGMENTS, k: TEACHING.k }), 'ndcg').join(', ');

export const CompareMode = () => {
  const [aText, setAText] = useState(ndcgList('A'));
  const [bText, setBText] = useState(ndcgList('B'));
  const [seed, setSeed] = useState(String(TEACHING.seed));
  const [nBoot, setNBoot] = useState(String(TEACHING.nBoot));
  const [level, setLevel] = useState(String(DEFAULTS.LEVEL));
  const [paired, setPaired] = useState('true');
  const a = parseNumbers(aText); const b = parseNumbers(bText);
  const r = a.error || b.error ? null : pairedOf({ a: a.values, b: b.values, seed: parseNumber(seed), nBoot: parseNumber(nBoot), level: parseNumber(level), paired: bool(paired) });
  return (
    <>
      <FieldGrid>
        <TextField label="System A, one score a query" value={aText} onChange={setAText} rows={3} />
        <TextField label="System B, the same queries in the same order" value={bText} onChange={setBText} rows={3} />
        <NumField label="seed" value={seed} onChange={setSeed} />
        <NumField label="replicates (nBoot)" value={nBoot} onChange={setNBoot} />
        <SelectField label="level" value={level} onChange={setLevel} options={DEFAULTS.LEVELS.map((l) => [String(l), String(l)])} />
        <SelectField label="Paired" value={paired} onChange={setPaired} options={YES_NO} />
      </FieldGrid>
      {[a, b].filter((x) => x.error).slice(0, 1).map((x) => <Note key="e">{x.error}</Note>)}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Mean A" value={six(r.meanA)} />
            <Tile label="Mean B" value={six(r.meanB)} />
            <Tile label="Difference A minus B" value={six(r.difference)} />
            <Tile label={r.labels.lower} value={six(r.lower)} />
            <Tile label={r.labels.upper} value={six(r.upper)} />
            <Tile label="Standard error" value={six(r.standardError)} />
            <Tile label="Share at or below 0" value={six(r.shareAtOrBelowZero)} />
          </TileGrid>
          <Declared title="THE RESAMPLING, in the engine's words">{r.basis.resampling}</Declared>
          <Declared title="THE INTERVAL, in the engine's words">{r.basis.interval}</Declared>
        </>
      )}
      <Note>Quote a bootstrap figure with its seed, its replicate count and its level. The share at or below 0 counts replicates; it is not a p-value.</Note>
    </>
  );
};

const ScoringExplorer = ({ initialMode = 'evaluate' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Scoring explorer"
      subtitle="MAP and nDCG, short answers, field extraction, groundedness and a paired comparison of two systems."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'evaluate' && <EvaluateMode />}
        {mode === 'answers' && <AnswersMode />}
        {mode === 'extraction' && <ExtractionMode />}
        {mode === 'grounded' && <GroundedMode />}
        {mode === 'compare' && <CompareMode />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored evaluation engine, which runs no language model. The two Ekene systems' answers are fixture text.
      </Note>
    </PanelShell>
  );
};

export default ScoringExplorer;
