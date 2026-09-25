import React, { useMemo, useState } from 'react';
import {
  parseNumber, parseJson, parseDocuments, documentsText, TEACHING, DEFAULTS, DOCS, STOP_WORDS, QUERY_LIST, JUDGMENTS,
  runsOf, answersOf, tokenizeOf, vectorsOf, tfidfOf, bm25Of, retrieveOf, evaluateOf, answersCheckOf,
} from './evaluateLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, WordField, Refusal, Declared, pretty, YES_NO,
} from './panelBits';

// The retrieval explorer (Associate): retrieval and cited answers, by hand.
// Tokenise a text, rank passages by TF-IDF cosine or by BM25 and read each
// score term by term, run a set of queries and score each ranking at a cutoff,
// and check an answer's numbers, dates and quotes against the passages it
// cites. Every figure is a return value of the vendored evaluation engine
// through evaluateLab. Paste your own passages, one "id: text" a line or a
// JSON array of { id, text }; paste queries, judgments and answers as JSON.

export const MODES = [
  ['tokens', 'Tokens of a text'],
  ['tfidf', 'TF-IDF, ranked by cosine'],
  ['bm25', 'BM25, read term by term'],
  ['run', 'Run queries and score them at a cutoff'],
  ['claims', 'Claims in cited answers'],
];

const HAND_TEXT = TEACHING.hand.map((d) => `${d.id}: ${d.text}`).join('\n');
const bool = (s) => s === 'true';

const useDocs = (initial) => {
  const [text, setText] = useState(initial);
  const d = useMemo(() => parseDocuments(text), [text]);
  return [text, setText, d];
};

export const TokensMode = () => {
  const [text, setText] = useState('Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.');
  const [stop, setStop] = useState('false');
  const r = tokenizeOf({ text, stopWords: bool(stop) });
  return (
    <>
      <FieldGrid>
        <TextField label="Your text" value={text} onChange={setText} rows={2} />
        <SelectField label="Stop list" value={stop} onChange={setStop} options={YES_NO} />
      </FieldGrid>
      {r.error && <Refusal r={r} />}
      {!r.error && (
        <>
          <TileGrid>
            <Tile label="Tokens" value={String(r.count)} />
            <Tile label="Removed by the stop list" value={String(r.removed)} />
          </TileGrid>
          <Tbl head={['position', 'token']} rows={r.tokens.map((t, i) => [String(i + 1), t])} />
          <Declared title="THE TOKENS, in the engine's words">{r.basis.tokens}</Declared>
          <Declared title="THE STOP LIST, in the engine's words">{r.basis.stopWords}</Declared>
        </>
      )}
      <Note>{`The stop list is off by default. Switched on, it removes the ${STOP_WORDS.length} words of the scikit-learn English list, among them well, top, bottom, fire and system.`}</Note>
    </>
  );
};

export const TfidfMode = () => {
  const [text, setText, d] = useDocs(HAND_TEXT);
  const [query, setQuery] = useState(TEACHING.hQuery);
  const [k, setK] = useState(String(TEACHING.k));
  const [stop, setStop] = useState('false');
  const [sub, setSub] = useState('false');
  const args = { documents: d.documents, query, k: parseNumber(k), stopWords: bool(stop), sublinearTf: bool(sub) };
  const r = d.error ? null : tfidfOf(args);
  const v = d.error ? null : vectorsOf({ documents: d.documents, stopWords: bool(stop), sublinearTf: bool(sub) });
  const qTerms = r && !r.error ? Object.keys(r.queryVector) : [];
  return (
    <>
      <FieldGrid>
        <TextField label="Passages (id: text, one a line, or JSON)" value={text} onChange={setText} rows={5} />
        <WordField label="Query" value={query} onChange={setQuery} />
        <NumField label="k (cutoff)" value={k} onChange={setK} />
        <SelectField label="Stop list" value={stop} onChange={setStop} options={YES_NO} />
        <SelectField label="Sublinear tf" value={sub} onChange={setSub} options={YES_NO} />
      </FieldGrid>
      {d.error && <Note>{d.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && v && !v.error && (
        <>
          <Tbl head={['query term', 'df', 'idf', 'query weight']} rows={qTerms.map((t) => [t, String(v.df[v.vocabulary.indexOf(t)]), six(v.idf[v.vocabulary.indexOf(t)]), six(r.queryVector[t])])} />
          {r.droppedTerms.length > 0 && <Note>{`Dropped, outside the vocabulary: ${r.droppedTerms.join(', ')}.`}</Note>}
          <Tbl head={['rank', 'passage', 'cosine', 'term: query weight x passage weight']} rows={r.ranking.map((x) => [String(x.rank), x.id, six(x.score), x.terms.map((t) => `${t.term}: ${six(t.query)} x ${six(t.document)}`).join('; ')])} />
          <TileGrid>
            <Tile label="Passages ranked" value={String(r.ranking.length)} />
            <Tile label="Passages matching a term" value={String(r.matched)} />
            <Tile label="Tie at the cutoff" value={String(r.tieAtCutoff)} />
          </TileGrid>
          {r.note && <Note>{r.note}</Note>}
          <Declared title="THE IDF, in the engine's words">{r.basis.idf}</Declared>
          <Declared title="THE SCORE, in the engine's words">{r.basis.score}</Declared>
        </>
      )}
    </>
  );
};

export const Bm25Mode = () => {
  const [text, setText, d] = useDocs(HAND_TEXT);
  const [query, setQuery] = useState(TEACHING.hQuery);
  const [k, setK] = useState(String(TEACHING.k));
  const [k1, setK1] = useState(String(DEFAULTS.K1));
  const [b, setB] = useState(String(DEFAULTS.B));
  const [stop, setStop] = useState('false');
  const r = d.error ? null : bm25Of({ documents: d.documents, query, k: parseNumber(k), k1: parseNumber(k1), b: parseNumber(b), stopWords: bool(stop) });
  return (
    <>
      <FieldGrid>
        <TextField label="Passages (id: text, one a line, or JSON)" value={text} onChange={setText} rows={5} />
        <WordField label="Query" value={query} onChange={setQuery} />
        <NumField label="k (cutoff)" value={k} onChange={setK} />
        <NumField label="k1" value={k1} onChange={setK1} />
        <NumField label="b" value={b} onChange={setB} />
        <SelectField label="Stop list" value={stop} onChange={setStop} options={YES_NO} />
      </FieldGrid>
      {d.error && <Note>{d.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="N (passages)" value={String(r.N)} />
            <Tile label="avgdl (mean tokens)" value={six(r.avgdl)} />
            <Tile label="Tie at the cutoff" value={String(r.tieAtCutoff)} />
          </TileGrid>
          <Tbl head={['query term', 'df', 'BM25 idf']} rows={r.queryTerms.map((t) => [t.term, String(t.df), six(t.idf)])} />
          <Tbl head={['rank', 'passage', 'length', 'score', 'term: tf, contribution']} rows={r.ranking.map((x) => [String(x.rank), x.id, String(x.length), six(x.score), x.terms.map((t) => `${t.term}: ${t.tf}, ${six(t.contribution)}`).join('; ')])} />
          {r.ties.length > 0 && <Note>{`Tied groups in the top k: ${r.ties.map((g) => g.join(' and ')).join('; ')}.`}</Note>}
          {r.note && <Note>{r.note}</Note>}
          <Declared title="THE SCORE, in the engine's words">{r.basis.score}</Declared>
          <Declared title="THE RANKING, in the engine's words">{r.basis.ranking}</Declared>
        </>
      )}
      <Note>Type a single word as the query to read that word's df and idf on your passages.</Note>
    </>
  );
};

const defaultQueries = pretty(QUERY_LIST.slice(0, 4));
const defaultJudgments = pretty(Object.fromEntries(QUERY_LIST.slice(0, 4).map((q) => [q.id, JUDGMENTS[q.id]])));

export const RunMode = () => {
  const [text, setText, d] = useDocs(documentsText());
  const [qText, setQText] = useState(defaultQueries);
  const [jText, setJText] = useState(defaultJudgments);
  const [method, setMethod] = useState('bm25');
  const [k, setK] = useState(String(TEACHING.k));
  const [grade, setGrade] = useState(String(DEFAULTS.RELEVANT_GRADE));
  const q = parseJson(qText);
  const j = parseJson(jText);
  const run = d.error || q.error ? null : retrieveOf({ documents: d.documents, queries: q.value, method, k: parseNumber(k) });
  const ev = run && !run.error && !j.error ? evaluateOf({ runs: run.runs, judgments: j.value, k: parseNumber(k), relevantGrade: parseNumber(grade) }) : null;
  return (
    <>
      <FieldGrid>
        <TextField label="Passages (id: text, one a line, or JSON)" value={text} onChange={setText} rows={4} />
        <TextField label="Queries (JSON array of { id, text })" value={qText} onChange={setQText} rows={4} />
        <TextField label="Judgments (JSON: query id to { passage id: grade })" value={jText} onChange={setJText} rows={4} />
        <SelectField label="Method" value={method} onChange={setMethod} options={[['bm25', 'BM25'], ['tfidf', 'TF-IDF']]} />
        <NumField label="k (cutoff)" value={k} onChange={setK} />
        <NumField label="relevant at grade" value={grade} onChange={setGrade} />
      </FieldGrid>
      {d.error && <Note>{d.error}</Note>}
      {q.error && <Note>{q.error}</Note>}
      {j.error && <Note>{j.error}</Note>}
      {run && run.error && <Refusal r={run} />}
      {ev && ev.error && <Refusal r={ev} />}
      {run && !run.error && (
        <Tbl head={['query', 'ranked passages', 'tie at the cutoff']} rows={run.perQuery.map((p) => [p.id, p.ranking.map((x) => x.id).join(', ') || '(none)', String(p.tieAtCutoff)])} />
      )}
      {ev && !ev.error && (
        <>
          <Tbl head={['query', 'relevant judged', 'precision', 'recall', 'hit', 'reciprocal rank']} rows={ev.perQuery.map((r) => [r.query, String(r.nRelevant), six(r.precision), six(r.recall), String(r.hit), six(r.reciprocalRank)])} />
          <TileGrid>
            <Tile label="Queries in the means" value={`${ev.nIncluded} of ${ev.nQueries}`} />
            <Tile label="Mean precision" value={six(ev.mean.precision)} />
            <Tile label="Mean recall" value={six(ev.mean.recall)} />
            <Tile label="Hit rate" value={six(ev.mean.hitRate)} />
            <Tile label="MRR" value={six(ev.mean.mrr)} />
          </TileGrid>
          {ev.excluded.map((x) => <Note key={x.query}>{`${x.query} excluded: ${x.reason}.`}</Note>)}
          <Declared title="THE MEANS, in the engine's words">{ev.basis.mean}</Declared>
        </>
      )}
    </>
  );
};

const defaultAnswers = pretty(answersOf('A').slice(0, 6).map((a) => ({ ...a, retrieved: runsOf('A')[a.query] })));

export const ClaimsMode = () => {
  const [text, setText, d] = useDocs(documentsText());
  const [aText, setAText] = useState(defaultAnswers);
  const [tol, setTol] = useState('0');
  const [useRetrieved, setUseRetrieved] = useState('true');
  const a = parseJson(aText);
  const answers = a.error ? null : a.value;
  const runs = answers && bool(useRetrieved) ? Object.fromEntries(answers.map((x) => [x.query, x.retrieved || []])) : undefined;
  const r = d.error || !answers ? null : answersCheckOf({
    answers: answers.map((x) => ({ query: x.query, text: x.text, citations: x.citations })),
    documents: d.documents,
    ...(runs ? { runs } : {}),
    numericRelTol: parseNumber(tol),
  });
  return (
    <>
      <FieldGrid>
        <TextField label="Passages (id: text, one a line, or JSON)" value={text} onChange={setText} rows={4} />
        <TextField label="Answers (JSON array of { query, text, citations, retrieved })" value={aText} onChange={setAText} rows={6} />
        <NumField label="numericRelTol" value={tol} onChange={setTol} />
        <SelectField label="Use the retrieved lists" value={useRetrieved} onChange={setUseRetrieved} options={YES_NO} />
      </FieldGrid>
      {d.error && <Note>{d.error}</Note>}
      {a.error && <Note>{a.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Claims" value={String(r.nClaims)} />
            <Tile label="Supported" value={String(r.nSupported)} />
            <Tile label="Pooled supported fraction" value={six(r.supportedFraction)} />
            <Tile label="Mean per-answer fraction" value={six(r.meanAnswerSupportedFraction)} />
          </TileGrid>
          <Tbl head={['query', 'claim', 'kind', 'supported', 'reason']} rows={r.perAnswer.flatMap((p) => p.claims.map((c) => [p.query, c.text, c.kind, String(c.supported), c.reason || `found in ${c.foundIn.join(', ')}`]))} />
          {r.perAnswer.flatMap((p) => p.flags.map((f) => <Note key={`${p.query}${f}`}>{`${p.query}: ${f}.`}</Note>))}
          <Declared title="WHAT A CLAIM IS, in the engine's words">{r.basis.claims}</Declared>
          <Declared title="SUPPORT, in the engine's words">{r.basis.support}</Declared>
        </>
      )}
      <Note>An unsupported claim is a figure the check could not find in a cited passage that was retrieved. The reason says where the figure is.</Note>
    </>
  );
};

const RetrievalExplorer = ({ initialMode = 'tokens' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Retrieval explorer"
      subtitle="Tokens, TF-IDF and BM25 rankings, metrics at a cutoff, and the claims in a cited answer."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'tokens' && <TokensMode />}
        {mode === 'tfidf' && <TfidfMode />}
        {mode === 'bm25' && <Bm25Mode />}
        {mode === 'run' && <RunMode />}
        {mode === 'claims' && <ClaimsMode />}
      </div>
      <Note>
        {`Every number on this panel is a return value of the vendored evaluation engine, which runs no language model. The Ekene passages (${DOCS.length}) are synthetic.`}
      </Note>
    </PanelShell>
  );
};

export default RetrievalExplorer;
