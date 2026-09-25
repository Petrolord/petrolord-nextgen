# D5 Applied AI and Language Models: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins, the fixture README and writer, and the engine's source comments
are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/appliedai/` in the NextGen repository:

* `evaluateLab.js`, the ONE teaching lab. It imports the vendored Ekene
  document fixtures themselves (`packages/engines/test-data/dataai/ekene-docs`,
  deep-equal to the files on disk by test), carries thin routes to the engine
  for whatever a learner types, parsers for passages, JSON and number lists, a
  short-answer list helper (answerMatch per answer and the mean), and the
  teaching readers. It holds no graded answer, no tolerance and no capstone
  dataset, and it runs no language model.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `RetrievalExplorer.jsx` (`ae-retrieval-explorer`), `ScoringExplorer.jsx`
  (`ae-scoring-explorer`), `TrustExplorer.jsx` (`ae-trust-explorer`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/AppliedaiLearningPage.jsx`, routed at
`/dashboard/apps/appliedai`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own inputs, because that is how a capstone is
worked: passages one "id: text" a line or as a JSON array of { id, text },
queries, judgments, runs, answers, labels and predictions as JSON, and ratings,
outcomes, probabilities and values as lists. Every panel starts from the Ekene
documents and shows the engine's own refusal and reason, verbatim.

### `ae-retrieval-explorer` (Associate)

Tokenise a text with the stop list on or off; rank passages by TF-IDF cosine
with each term's query and passage weights (the hand set, "oil rate": d1 at
0.715911); rank by BM25 with k1 and b and read each term's tf and contribution
(d1 at 2.191027); run a set of queries by either method and score each ranking
at a cutoff with precision, recall, hit and reciprocal rank and their means
(system A's MRR at 5 is 0.880435); and check a set of cited answers' claims
against the passages each cites and retrieved.

### `ae-scoring-explorer` (Professional)

Score a set of runs with average precision, DCG, the ideal DCG and nDCG at a
stated cutoff, threshold, gain and no-relevant rule; score short answers by
exact match and token F1; score field extraction by outcome with micro and
macro figures; check a set of answers for groundedness with or without the
retrieved lists and at a stated numericRelTol (system B: 0.731707 pooled); and
compare two systems' per-query scores with the seeded paired or unpaired
bootstrap.

### `ae-trust-explorer` (Expert)

Cohen's kappa of two raters, unweighted or weighted, with the labels in order
(the Ekene annotators: 0.579841 unweighted); calibration with the Brier score,
the reliability table, ECE, MCE and log loss at a stated bin count (Brier
0.168382); the Murphy decomposition with its closure; the seeded bootstrap of
a mean with its parameter-percentile labels (system A's nDCG at seed 7: 0.653604
to 0.852644); and a boundary rule probed either side.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone name or
   id, no capstone query or capstone answer, no run of capstone probabilities
   and no capstone seed. `panelCapstoneGuard.test.js` sweeps the lab, the
   panels, the bits and the learning page, and plants each shape to prove the
   sweep catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`, and
   a reason as the engine returns it.
3. **No clock, no random number, no path under `/root`.** The only random
   draws are the engine's seeded bootstrap replicates.
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary**, digest section 24: no P label anywhere; a bootstrap
   bound carries the engine's parameter-percentile label; no panel says a
   model scored anything.
