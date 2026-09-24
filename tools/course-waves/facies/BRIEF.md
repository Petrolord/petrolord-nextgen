# D3 Electrofacies: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the third course of the academy's `data_ai` module (path order 68), after D1
Oilfield Data Quality and D2 Machine Learning on Well Data.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-cluster.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (the iris explained variance ratios scikit-learn publishes, the iris k-means inertia) the digest recomputes it through the engine; quote the digest line. |
| `oracle_cluster.py` and `pin_cluster.py` | PROVENANCE. The standard library oracle that wrote the golden and the library pins beside it. |
| `d3_fields.mjs` | the generator of the Ekene facies wells. Its values reach you through the digest, which prints what a lesson may quote. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

An electrofacies is a group of depth samples whose logs look alike, and it is
worth something only when it is checked against the rock, so the course
teaches how to scale the logs, find their main directions and group them with
k-means (Associate), how to choose the number of groups, build a tree of merges
and score groups against core facies (Professional), and how to predict facies
in uncored wells with neighbours and trees, where the engine breaks ties and
draws its boundaries, and how to write a predicted facies back honestly
(Expert), and grades each tier on its own question with numbers the engine
returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | GROUPING LOGS INTO ELECTROFACIES | what electrofacies are, scaling before distance, principal components, k-means, reading clusters, one field clustered end to end | 1 to 13 |
| Professional | JUDGING GROUPS AGAINST CORE | the elbow, the silhouette, agglomerative clustering, matching clusters to core facies, the adjusted Rand index, electrofacies against core end to end | 14 to 20 |
| Expert | PREDICTING FACIES, AND THE ENGINE'S OWN RULES | k nearest neighbours, classification trees, ties and exact comparisons, predicting uncored wells, boundaries bands and caps, reading the engine honestly | 21 to 27 |

Section 28 is the vocabulary, and every tier owns it. Every section heading
names its owner modules; section 3 (the refusals) is owned across all three
tiers. Section 7 (loadings) is also owned by Expert m05 l03, because the sign
rule a learner meets there is taught in full in section 26.

## THE DATASET

One generator, `d3_fields.mjs`, draws the Ekene field's facies wells through the
canonical mulberry32 of lib/stats on one stated seed, 20260924. Eight wells,
EKENE-1 to EKENE-8, 30 samples each, 240 rows: GR, RHOB, NPHI, PEF and CALI,
and the core facies. Six wells are cored (180 rows); EKENE-7 and EKENE-8 have
no core, and the generator keeps the facies it drew for them as `withheld`,
which a real field never has. Four facies come in blocky runs: limestone,
sandstone, shale, shaly-sand (in the order the engine sorts them), 54, 50, 29
and 47 cored rows. Digest section 2 tables all 6 planted structures with the
method that finds each, and the build fails if any is not found: four blocky
facies that k-means recovers, GR in larger units than the other logs,
limestone isolated exactly by NPHI and by PEF, a caliper that carries no facies
signal, the two uncored wells, and EKENE-8 logged with a gamma ray tool reading
30 gAPI high.

**The teaching clustering** is `kmeans` with k 4, seed 3, the default 10
starts and standard scaling on the 180 cored rows: inertia 58.289042. **The
held-out cored well** for kNN and the tree is EKENE-6, 30 rows; the other five
cored wells train.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Clustering scales with the POPULATION standard deviation** (section 5), the
   machine learning course's scaler; the sample SD is larger by the factor
   1.002789 on the 180 cored rows. **The correlation PCA uses the SAMPLE SD**
   (section 6), so its eigenvalues sum to 4.000000, the number of logs. Say
   which, every time.
2. **k-means++ draws from one mulberry32(seed) stream and runs 10 starts**; the
   lowest inertia wins and a tie within the band keeps the earlier start
   (section 9). With ten starts, 9 of the 10 seeds shown reach 58.289042 and
   one stops at 58.297079.
3. **A cluster number is a name** (section 10): seed 1 finds the same partition
   as seed 3 with other numbers.
4. **The elbow picks nothing** (section 14); `bestSilhouetteK` is 3 while the
   core describes 4 facies (section 15).
5. **A kNN scaler is fitted on the training rows only** (section 21): EKENE-6
   scores 0.833333 that way, 0.466667 when scaled on its own statistics.
6. **A tied vote goes to the facies of the nearer neighbour**, where scikit-learn
   takes the facies that sorts first (section 21).
7. **CART compares splits exactly and breaks a tie by the lower column index**
   (section 23): NPHI and PEF split the root with the same decrease, and the
   order the logs are passed in decides the printed tree.
8. **Distances and merge heights within 1e-12, relative, are tied** (section 26).

## THE REFUSALS

Digest section 3 tables 58 refusals across 13 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A k-means that stops at maxIter, a PCA with a
repeated eigenvalue and an elbow whose inertia rises are results with a
`warning`, never refusals.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `d3_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone fields, their wells, their datasets and their answers are NOT in
the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.** Where a capstone value depends on a
seed, the capstone brief states the seed; the lessons teach that a seeded
number is quoted with its seed and its number of starts.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 28 carries the rule for each.

1. **"cluster"** is a group the engine made without core, numbered from 0; the
   number is a name.
2. **"facies"** is a core facies, or one predicted from core and called
   predicted. An electrofacies takes a facies name only after matching.
3. **"standard deviation"** names its divisor.
4. **"distance"** is on the scaled logs unless the text says raw.
5. **"accuracy"** names its rows.
6. **"machine learning"** names the method: k-means, agglomerative clustering,
   k nearest neighbours, a CART tree. No lesson calls a method artificial
   intelligence, and no P label is used.

## SCOPE SEAMS

Splits by whole wells, cross-validation, precision, recall and F1 belong to the
machine learning course (D2), named with a pointer; log conditioning, outliers
and gamma ray normalisation to the data quality course (D1); porosity,
saturation and net pay to petrophysics; forecasting a rate series to D4.
`wave.json` records each seam.

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
