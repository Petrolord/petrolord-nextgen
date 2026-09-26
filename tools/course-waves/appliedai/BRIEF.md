# D5 Applied AI and Language Models: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the fifth course of the academy's `data_ai` module (path order 70), after D1
Oilfield Data Quality, D2 Machine Learning on Well Data, D3 Electrofacies and
D4 Data-Driven Production Forecasting.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-evaluate.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (the headline MAP, nDCG, exact match, extraction, kappa and calibration figures) the digest recomputes it through the engine; quote the digest line. |
| `oracle_evaluate.py` and `pin_evaluate.py` | PROVENANCE. The standard library oracle that wrote the golden and the library pins beside it. |
| the fixture README under `test-data/dataai/ekene-docs` | PROVENANCE. Its list of planted defects is tabled in the digest with the engine behaviour that finds each. |
| `make_evaluate_fixtures.py` | the writer of the Ekene document fixtures. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A language-model copilot is only as good as the passages it retrieves and the
claims it can support from them, and every part of that can be measured
without running a model, so the course teaches how TF-IDF and BM25 rank
passages and how a ranking and a cited answer are scored at a cutoff
(Associate), how to score retrieval with average precision and nDCG, short
answers with SQuAD exact match and token F1, field extraction by outcome,
groundedness and its limits, and two systems against each other with a paired
bootstrap (Professional), and how to measure agreement between annotators,
calibrate a relevance probability, govern a judged set and read every rule the
engine applies (Expert), and grades each tier on its own question with numbers
the engine returns.

## WHAT IS GRADED, AND WHAT NEVER IS

**No capstone field, question key or engine output in this course depends on
language-model output.** The engine runs no model; the two fixed systems'
answers are fixture text written once and committed; the only random draws are
the engine's seeded bootstrap replicates. Digest section 4 says so and says why:
a model's output is an INPUT to be scored, never a key. A question whose key
would change when a model changes is never written.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | RETRIEVAL AND CITED ANSWERS, BY HAND | what copilots and retrieval do, tokens, TF-IDF, BM25, ranking and metrics at a cutoff, answers that cite their sources | 1 to 10 |
| Professional | SCORING RETRIEVAL AND ANSWERS HONESTLY | average precision and MAP, graded relevance and nDCG, short answers, field extraction, groundedness and its limits, comparing two systems | 11 to 16 |
| Expert | AGREEMENT, CALIBRATION AND GOVERNANCE | annotator agreement, calibration, decomposing the Brier score, judged sets and leakage, boundaries ties and caps, reading the engine honestly | 17 to 23 |

Section 24 is the vocabulary, and every tier owns it. Every section heading
names its owner modules; section 3 (the refusals) is owned across all three
tiers. Section 8 (the ranking) is also owned by Expert m05 l02, section 16 (the
comparison) by Expert m05 l03, and section 20 (judged sets) by Professional m02
l04.

## THE DATASET

The Ekene document set is five vendored fixture files under
`packages/engines/test-data/dataai/ekene-docs`, written by a stated script and
labelled SYNTHETIC in every file: 60 passages (EKD-058 an exact copy of
EKD-046), 24 queries with 183 judged pairs on a four-grade scale and a second
annotator's grades on every pair (Q24 has no relevant passage), two fixed
systems (A retrieves by BM25, B by TF-IDF, each its top 5, with an answer text,
citations and a short answer per query), 30 labelled extraction records over 6
fields, and 200 calibration rows. Digest section 2 tables the 22 planted
defects with the engine behaviour that finds each, and the build fails if any
is not found.

**The teaching settings** are stated in the digest: cutoff k 5, relevant at
grade 1 or more, linear gain, the bootstrap on seed 7 with 2000 replicates at
level 0.95, and a numericRelTol of 0.002 where a rounded figure is taught. **The
hand set** is five stated passages d1 to d5 (d5 empty) scored for the query
"oil rate".

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Tokens** (section 5): ASCII letters lowercased, text split on every run
   outside [a-z0-9], single characters kept, no stemming; the stop list is OFF,
   because it removes well, top, bottom, fire and system.
2. **TF-IDF** (section 6) is scikit-learn's default and **BM25** (section 7)
   uses the Lucene idf, k1 1.2 and b 0.75, with a repeated query word counted
   once.
3. **The ranking** (section 8): only a score above 0 ranks; two scores tie when
   they agree to 12 significant digits and the id ascending decides;
   `tieAtCutoff` says when the cut falls inside a tie.
4. **Metrics at k** (sections 9, 11, 12): relevant means grade 1 or more by
   default; precision divides by k; average precision divides by every
   relevant judged passage; the ideal DCG uses every judged grade; a query with
   no relevant passage is excluded from every mean and listed. The ideal DCG
   is 0 in exactly two cases, and nDCG is then returned as null with a note
   naming the case (section 3 prints all three wordings): the query has no
   judged documents, or every judged document has grade 0 ("the 1 judged
   document has grade 0", "the 8 judged documents all have grade 0" on Q24).
   Quote the note for the case at hand, verbatim.
5. **Short answers** (section 13) use SQuAD normalisation, so "45.0 percent"
   and "45 percent" do not match.
6. **Extraction** (section 14) has four outcomes; a cell with both sides empty
   is correct; a number matches within an inclusive tolerance.
7. **Groundedness** (section 15): a claim is supported only by a passage the
   answer cites AND retrieved. Grounded is not correct.
8. **Calibration** (sections 18 and 19): an interior edge opens the upper bin
   (scikit-learn's library closes the lower one); the Murphy decomposition
   carries the within-bin terms and closes; log loss is imported from the
   machine learning engine. **WBC is taught as the paper labels it**
   (section 19): Stephenson, Coelho and Jolliffe (2008) write the Brier score
   out in their eq. 7, and WBC names the whole fifth term, factor 2 included,
   so WBC is TWICE the pooled within-bin covariance. The engine's WBC is the
   paper's. Call it "the within-bin covariance term WBC"; when a lesson names
   the covariance itself, it says WBC is twice it (six stated rows: pooled
   covariance 0.003333, WBC 0.006667). The identity is Brier = REL - RES +
   UNC + WBV - WBC with no further 2. Never present the factor 2 as an engine
   choice or an engine error: it is the source's own labelling.
9. **The bootstrap** (sections 16 and 22) is one seeded stream, labelled as
   parameter percentiles, never with a P label; its share at or below 0 is not
   a p-value.

## THE REFUSALS

Digest section 3 tables 76 refusals across 16 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A metric returned as null with its reason (recall and
AP on Q24, kappa when both raters use one label) is a result, never a refusal;
section 3 tables every such note the course meets.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `d5_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstones run SEEDED VARIANTS of the Ekene fixture with their own passage
ids, their own worded queries, their own answers and their own rating and
calibration draws. The capstone names, ids, queries, answers and values are NOT
in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.** A bootstrap value is quoted with its
seed and replicate count; every capstone states its settings (method, k, k1, b,
threshold, gain, seed, replicates, bins).

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 24 carries the rule for each.

1. **"relevant"** is a judged grade at or above the stated threshold, grade 1
   by default; "related" is grade 1 itself.
2. **"hallucination"** is an unsupported claim, named with the engine's reason.
3. **"grounded"** is supported by a cited and retrieved passage, and never a
   statement about truth.
4. **"accuracy"** names its denominator.
5. **"score"** is a BM25 score or a TF-IDF cosine, never a probability.
6. **"AI"** names the system being evaluated, never a method this engine runs.

## SCOPE SEAMS

Logistic regression, log loss as a training loss and classifiers belong to D2
mlcore; data quality and near-duplicate identifiers to D1 dataqc; the bootstrap
as a general method and P labels for outcomes to the uncertainty course and
D4; forecasting to D4; clustering to D3. `wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The engine's review changes landed before its merge and before any lesson was
written. They are provenance. A sentence about former engine behaviour anywhere
in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
