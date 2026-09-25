#!/usr/bin/env python3
"""THE EIGHTEEN GRADED D5 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/dataai/oracle_evaluate.py (python
standard library only: tokens by a character loop, BM25 and TF-IDF in
Decimal(50) dense loops, the 12-digit tie key by Decimal quantize, every
retrieval metric, extraction tally, kappa and calibration term in exact
Fractions, SQuAD normalisation and the claim grammar by hand-written character
scanners, mulberry32 in 32-bit integers with exact replicate means), which was
written independently of the engine from the published definitions.

THE RUNS ARE RE-RETRIEVED, NOT TRUSTED. The capstone hands the learner each
system's retrieved lists. The oracle re-ranks every capstone query itself with
the stated settings and REFUSES unless its lists equal the given ones; the
metrics are then computed on the oracle's own lists.

ONE KIND OF FIELD, ONE AGREEMENT. No D5 field rests on a search: every one is
arithmetic on stated inputs or a seeded bootstrap quantile the oracle replays
exactly. Each must agree to 1e-10 relative AND to a thousandth of its own
grading tolerance absolute.

The oracle's ambiguity guard is kept ON: where a float program could branch
differently from the exact one (a score near a 12-digit tie boundary, a
bootstrap quantile index whose wholeness differs, a probability within 1e-12
of a bin edge it does not equal) the oracle raises, and this check REFUSES
rather than compare.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
import time

HERE = os.environ.get('D5_WAVE_DIR', '/root/dai-wip-appliedai')
ENG = os.environ.get('D5_ENGINES', '/root/wt-dai-d5-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'dataai'))
try:
    import oracle_evaluate as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}).')
    sys.exit(2)

PLANT = '--plant' in sys.argv
PLANTED_KEY = 'nnewi_q_ndcg_at5_exponential'
T0 = time.time()
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ, D5_ENGINES=ENG)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'd5_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=env).stdout)
OR, NN, AW = inp['ORLU'], inp['NNEWI'], inp['AWKA']

got = {}
try:
    # ---- ORLU
    s = OR['stated']
    docs = OR['documents']
    run = O.o_retrieve(docs, OR['queries'], 'bm25', k=s['k'], k1=s['k1'], b=s['b'])
    for a in OR['answers']:
        if run['runs'][a['query']] != a['retrieved']:
            print(f'REFUSED: the oracle ranks ORLU {a["query"]} as {run["runs"][a["query"]]}, the capstone hands {a["retrieved"]}')
            sys.exit(2)
    got['orlu_bm25_idf_pressure'] = O.o_bm25(docs, s['idfTerm'], k=1)['queryTerms'][0]['idf']
    qtext = {q['id']: q['text'] for q in OR['queries']}
    got['orlu_o1_bm25_top_score'] = O.o_bm25(docs, qtext[s['topQuery']], k=s['k'], k1=s['k1'], b=s['b'])['ranking'][0]['score']
    got['orlu_o4_tfidf_top_cosine'] = O.o_tfidf(docs, qtext[s['cosQuery']], k=s['k'])['ranking'][0]['score']
    ev = O.o_evaluate(run['runs'], OR['judgments'], k=s['k'])
    got['orlu_bm25_mean_recall_at3'] = ev['mean']['recall']
    got['orlu_bm25_mrr_at3'] = ev['mean']['mrr']
    g = O.o_answers([{k: a[k] for k in ('query', 'text', 'citations')} for a in OR['answers']], docs,
                    runs={a['query']: a['retrieved'] for a in OR['answers']})
    got['orlu_answers_supported_fraction'] = g['supportedFraction']

    # ---- NNEWI
    s = NN['stated']
    docs = NN['documents']
    rP = O.o_retrieve(docs, NN['queries'], 'bm25', k=s['k'], k1=s['P']['k1'], b=s['P']['b'])['runs']
    rQ = O.o_retrieve(docs, NN['queries'], 'tfidf', k=s['k'], sub=True)['runs']
    if rP != NN['runs']['P'] or rQ != NN['runs']['Q']:
        print('REFUSED: the oracle re-ranks the NNEWI runs differently from the lists the capstone hands the learner')
        sys.exit(2)
    got['nnewi_p_map_at5_grade2'] = O.o_evaluate(rP, NN['judgments'], k=s['k'], t=s['mapGrade'])['mean']['map']
    got['nnewi_q_ndcg_at5_exponential'] = O.o_evaluate(rQ, NN['judgments'], k=s['k'], gain='exponential')['mean']['ndcg']
    f1s = [O.o_answer(x['answer'], x['reference'])['f1'] for x in NN['shorts']]
    got['nnewi_short_mean_token_f1'] = sum(f1s) / len(f1s)
    x = NN['extraction']
    got['nnewi_extraction_macro_f1'] = O.o_extraction(x['labels'], x['predictions'], x['fields'])['overall']['macroF1']
    eP = O.o_evaluate(rP, NN['judgments'], k=s['k'])['perQuery']
    eQ = O.o_evaluate(rQ, NN['judgments'], k=s['k'])['perQuery']
    b = O.o_paired([r['ndcg'] for r in eP], [r['ndcg'] for r in eQ], s['nBoot'], s['bootSeed'], s['level'])
    got['nnewi_paired_ndcg_upper'] = b['upper']
    got['nnewi_q_supported_fraction'] = O.o_answers(NN['answers'], docs, runs=rQ)['supportedFraction']

    # ---- AWKA
    s = AW['stated']
    ra, rb = AW['ratings']['a'], AW['ratings']['b']
    got['awka_kappa_unweighted'] = O.o_kappa(ra, rb, labels=s['labels'])['kappa']
    got['awka_kappa_linear'] = O.o_kappa(ra, rb, labels=s['labels'], weights='linear')['kappa']
    c = O.o_calibration(AW['calibration']['yTrue'], AW['calibration']['probabilities'], M=s['bins'])
    got['awka_brier'] = c['brier']
    got['awka_reliability_bins8'] = c['murphy']['reliability']
    got['awka_resolution_bins8'] = c['murphy']['resolution']
    got['awka_wbc_bins8'] = c['murphy']['withinBinCovariance']
except O.Ambiguous as e:
    print(f'REFUSED: the oracle met an ambiguous case and will not write it ({e}); a graded value there would rest on rounding')
    sys.exit(2)

if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

worst = 0.0
bad = []
print(f'{"field":38s} {"engine (fields.json)":>22s} {"oracle":>22s} {"relative":>10s} {"abs/tol":>9s}  within')
for _, k, v, tol in fields:
    o = got[k]
    rel = abs(o - v) / max(abs(v), 1e-300)
    worst = max(worst, rel)
    ok = rel <= 1e-10 and abs(o - v) <= tol / 1000
    if not ok:
        bad.append(k)
    print(f'{k:38s} {v:22.15g} {o:22.15g} {rel:10.2e} {abs(o - v) / tol:9.2e}  {"yes" if ok else "NO"}')
print(f'oracle_check: 18 graded values replayed through the stdlib oracle in {time.time() - T0:.0f} s; '
      f'the capstone runs re-retrieved and equal; worst relative difference {worst:.2e}; disagreements: {len(bad)}')
if PLANT:
    print(f'NEGATIVE CONTROL: {PLANTED_KEY} was moved by ten tolerances; {"caught" if bad == [PLANTED_KEY] else "NOT CAUGHT as planted"}')
    sys.exit(1 if bad == [PLANTED_KEY] else 2)
sys.exit(1 if bad else 0)
