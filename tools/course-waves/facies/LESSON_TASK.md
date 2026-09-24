# D3 Electrofacies: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle, the library
pins, the dataset generator's source and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every log value, centre, scale, distance, eigenvalue, ratio,
loading, score, inertia, silhouette, merge height, index, accuracy, impurity,
importance and threshold to SIX decimals; counts, row numbers, cluster numbers,
passes, depths, seeds and well numbers as whole numbers; very small magnitudes
and tie bands in exponent form; an engine message verbatim, figures and all.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. Run `python3 lengths.py --tier <tier>` on your own tier only.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and one
`{{panel:...}}` line per panel tag. Keep both exactly (`scaffold.py --check`
reports any drift). An opening paragraph under the H1, then short `##`
sections ending in `## Exercise`. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something in the panel with the
Ekene rows or their own, never to recall a number.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's methods. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows an elbow, a silhouette, a
tree of merges, a match against core or an adjusted Rand index; a Professional
lesson never shows a neighbour rule, a classification tree, the withheld facies
of an uncored well, a tie band or a row cap. The kit's `leakage.mjs` judges a
reach by which digest section owns the figure: sections 1 to 13 are Associate,
14 to 20 Professional, 21 to 27 Expert.

An Associate lesson may name that a PCA component's sign is fixed by a stated
rule (section 7 prints the basis); the banded rule itself is Expert (section 26).

## ROWS, WELLS, CLUSTERS AND SEEDS

The engine counts rows and clusters from 0. Say "row 24 of the 180 cored rows,
counted from 0" when you name one. A cluster number is a name: never write
"cluster 0 is the shale" without the seed and the matching that made it so. A
seeded result is quoted WITH its seed and its number of starts: the teaching
clustering is k 4, seed 3, 10 starts. Facies names sort by character, so every
list the engine returns reads limestone, sandstone, shale, shaly-sand.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

Every refusal and warning carries figures inside a sentence, printed as the
shortest decimal that reads back to the number. The printed CART tree does the
same with its thresholds: a midpoint that is not exact in binary prints with
its tail. THE RULE: a lesson quotes a NUMERIC FIELD at the digest's precision,
as the digest prints it. A message, a basis string or a line of the printed
tree may appear only verbatim, in double quotation marks, a `> ` blockquote, a
backtick span or a four-space indented block, exactly as the digest prints it,
and never as the source of a figure the lesson then reasons with.

HOW THE GATE KNOWS. `numsweep_facies.mjs` exempts a quoted span only when its
text is EXACTLY a message, a basis or a printed tree line the digest prints. A
quote that differs by one character is swept like any other text, and any
figure of more than fifteen significant figures outside such a quote fails as
FLOAT NOISE even where the truth file would resolve it.

## THE REFUSALS, BY NAME

Digest section 3 tables 61 refusals across 13 functions. **Quote the engine's
message in a blockquote.** The wording changed at engines ef4058f; quote the
digest as rebuilt, never an older copy:

* A constant log says "has zero variance on the N rows passed" (min-max: "zero
  range on the N rows passed") in pca, kmeans, silhouette, elbow and
  agglomerative, and "on the N training rows" ONLY in knnClassify. Never write
  "training rows" of a clustering or PCA call.
* pca warnings: "Jacobi did not converge in N sweeps (the last sweep still
  rotated): ..." and "eigenvalues k and k+1 differ by at most 1e-10 times the
  largest eigenvalue, ...". When both apply, both are kept, non-convergence
  first, joined by "; ". The repeated test is exactly abs(lambda_k -
  lambda_(k+1)) <= 1e-10 x lambda_1 (lambda_1 the largest eigenvalue),
  adjacent eigenvalues in sorted order, INCLUSIVE, relative to the largest and
  never to the pair (section 26 and the boundary table, section 25). Do not
  say "equal to within 1e-10" or "within 1e-10 of each other".
* pca takes maxSweeps (default 50, whole number 1 or more; 0 is refused).
* cutTree refuses a linkage matrix that merges any row or cluster id twice.

The ones each tier must teach:

* Associate m01 l05: a missing value in X, one row for a PCA, a seed left out.
* Associate m02 l04: a constant log (a caliper reading one value on every row
  of EKENE-1), refused by the scaler in the machine learning engine's words,
  which count "the 30 rows passed" (kNN alone says "training rows").
* Associate m03 and m04: too many components, too few distinct rows for k.
* Professional m01 to m04: kMax below kMin, a silhouette of one cluster, the
  agglomerative row cap, more clusters than facies in one-to-one matching.
* Expert m01, m02 and m05: more neighbours than training rows, the kNN pair
  cap, a negative depth, the silhouette row cap.
* Expert m05 teaches the WARNINGS (an inertia that rises, a repeated
  eigenvalue), which are no refusals.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **Scaling decides which rows are near, section 4.** On the raw logs 161 of
   the 180 cored rows have a nearest other row of their own facies; on the
   standardised logs, 173.
2. **A covariance PCA is a gamma ray PCA, section 11.** Its first component
   carries 0.998581 of the variance with a GR weight of 0.999905; the
   correlation PCA's first component carries 0.682351.
3. **One start is not enough, section 9.** With one start 8 of 10 seeds stop
   above 58.289042; with ten starts 9 of 10 reach it.
4. **The silhouette and the core disagree, section 15.** The highest mean
   silhouette is 0.690362 at k 3, and 0.545063 at k 4, where the core has its
   four facies.
5. **A facies the logs barely separate, section 20.** Shaly-sand has the lowest
   core-facies silhouette, 0.152252, and a recall of 0.808511 under the k-means
   mapping: 9 of its rows fall in the sandstone cluster.
6. **A range check sees only the rows that leave the range, section 24.** Min-max
   flags 10 rows of EKENE-8; kNN misses 3, all of them inside the GR range.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words (the
table is section 27): the population SD for clustering and the sample SD for
the correlation PCA, the correlation matrix by default, the sign rule, one-
candidate k-means++ from mulberry32, 10 starts, passes counted as assignment
passes, the silhouette on the scaled logs, scipy linkage ids and Ward heights,
the nearer-neighbour vote tie, the lower-index split tie, a zero-decrease split
refused, one-to-one matching by the optimum, and an adjusted Rand index of 1
for two one-cluster labellings. Say what the alternative is and why the engine
did not take it.

## HONESTY ABOUT THE SYNTHETIC FIELD

The Ekene field is synthetic, and section 2 says so. The withheld facies of the
uncored wells and the stated gamma ray offset of EKENE-8 exist only because the
generator drew them; a lesson that uses them says it is doing what no real
field allows, as section 24 does.

## THE VOCABULARY

Binding. Digest section 28: "cluster" is a numbered group with no rock name;
"facies" is core or predicted from core; "standard deviation" names its
divisor; "distance" names its scaling; "accuracy" names its rows; "machine
learning" names the method. No lesson calls a method artificial intelligence,
and no P label is used.

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_facies.mjs` (the kit's
`numsweep.mjs` against `truth-facies.json`, the harvest of the digest, with the
quoting rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone field name, dataset, stated input or
answer; and `gate_claims.mjs` for every number in every brief. Read the counts
rather than the exit code.
