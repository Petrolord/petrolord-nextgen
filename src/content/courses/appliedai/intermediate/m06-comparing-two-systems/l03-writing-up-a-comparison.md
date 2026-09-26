# Writing up a comparison

{{panel:ae-scoring-explorer}}

Every figure in this tier changes with a setting. MAP changes with the threshold, nDCG with the gain, groundedness with the tolerance and the retrieved lists, and a bootstrap interval with its seed, its replicate count and its level. A comparison written without its settings cannot be checked, and on the Ekene set it can name either system the winner. This lesson assembles the Professional findings on A and B into one honest write-up.

## What the numbers say, with their settings

| finding | system A | system B | settings |
| --- | --- | --- | --- |
| MAP | 0.600278 | 0.593007 | k 5, grade 1 or more, 23 queries, Q24 excluded |
| MAP | 0.750362 | 0.771014 | k 5, grade 2 or more |
| mean nDCG | 0.762753 | 0.764137 | k 5, linear gain |
| exact matches | 20 of 24 | 13 of 24 | SQuAD normalisation |
| mean token F1 | 0.921507 | 0.712004 | over the 24 short answers |
| micro F1, extraction | 0.966825 | 0.895238 | 180 cells, filled cells |
| pooled supported fraction | 0.959184 | 0.731707 | retrieved lists used, numericRelTol 0 |

And the comparison of retrieval, seeded:

| paired bootstrap, seed 7, 2000 replicates, level 0.95 | difference A minus B | lower bound | upper bound | share at or below 0 |
| --- | --- | --- | --- | --- |
| nDCG at 5, linear gain | -0.001384 | -0.068015 | 0.058726 | 0.511000 |
| AP at 5, grade 1 or more | 0.007271 | -0.054879 | 0.064758 | 0.418500 |

The bounds are the 2.5th and 97.5th percentiles of the bootstrap difference.

## Reading it honestly

On retrieval the two systems cannot be told apart on these 23 queries. MAP favours A at grade 1 and B at grade 2; mean nDCG favours B by a difference the course derives as 1.38e-3; and both paired intervals, on nDCG and on AP, cross 0. A write-up that picks one of these figures and calls a winner has chosen its conclusion before its evidence.

On answers every score points the same way, and by wide margins. No interval was computed on any answer score, so the write-up reports these as scores and stops short of calling them a tested difference. A matches more short answers exactly, earns more partial credit, extracts more fields correctly on filled cells, and supports more of its claims. Those are separate checks with separate settings, and the write-up names each. It also names the planted defects behind them: B's rounded pressure, its unit change, its figures from uncited passages and its fabricated event on Q24 are fixture text written to carry those defects, and no model produced them.

## What the write-up must name

The course lists what an evaluation report names. For the part this tier covers:

- the corpus and its size, and that it is synthetic: 60 passages;
- the queries and how their judgments were pooled, the threshold and the gain;
- each system's retriever and its settings: method, k, k1, b and the stop list;
- every metric with its cutoff, and the queries excluded and why;
- the unjudged passages each system retrieved;
- the answer scores and the groundedness figures, with numericRelTol and whether the retrieved lists were used;
- the comparison with its seed, replicate count, level and whether it was paired.

Judges disagree too. A second annotator graded every judged Ekene pair, and a difference between two systems smaller than the difference between two annotators is no finding. Measuring that agreement is the Expert tier's question.

## Exercise

Open the view for two systems and the paired bootstrap. Replace both lists with each system's per-query AP at 5, grade 1 or more, in query order with Q24 left out: read them from the view for MAP and nDCG, with A's runs and then B's retrieved lists from the groundedness view. Run the paired bootstrap at seed 7 and compare it with the AP row above; the values you typed are rounded to six decimals, so a last digit may differ. Then write a three-sentence summary of the comparison that states every setting a reader would need to reproduce it.
