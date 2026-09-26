# Boundaries, rule by rule

{{panel:ae-trust-explorer}}

Every rule in the engine has a boundary, and a value that lands exactly on it has to go one way or the other. There is no global convention such as "every limit is exclusive". Each rule states its own boundary, and the course probed each one with two engine calls: one at the boundary, and one just across it.

## The boundaries that decide scores

| function | rule | at the boundary | across it |
| --- | --- | --- | --- |
| `rankBm25, rankTfidf` | ranked | a score above 0 is ranked | a score of 0 (no query term) is never ranked |
| `retrievalMetrics` | relevant | a grade equal to relevantGrade is relevant | a grade one below is not |
| `retrievalMetrics` | precision at k | k ranked: relevant / k | fewer than k ranked: still divides by k |
| `retrievalMetrics` | reciprocal rank and AP | a relevant passage at rank k counts | at rank k + 1 it does not |
| `evaluateRetrieval` | no relevant | one judged passage at the threshold: the query is included | none: excluded (default) or zeroed |
| `scoreExtraction` | number match | \|p - l\| equal to the tolerance: correct (inclusive) | above it: wrong |
| `checkGroundedness` | number match | \|c - v\| equal to numericRelTol x \|v\|: supported | above it: unsupported; numericRelTol 0 means equal values |
| `calibration` | bin edge | p = i / M opens bin i | scikit-learn closes bin i - 1 at that value |
| `calibration` | last bin | p = 1 is in bin M - 1 (closed) | no bin above it |
| `cohenKappa` | expected disagreement | above 0: a kappa | 0: null with the reason |
| `pairedBootstrap` | share at or below 0 | a replicate exactly 0 is counted | only replicates above 0 are not |

## Reading the pattern

Some boundaries include the limit and some exclude it, and the reason is always in what the rule is for. A grade equal to the threshold is relevant, because the threshold names the lowest relevant grade. A tolerance is inclusive, because a tolerance names the largest difference still accepted: the Professional tier's extraction set has a prediction of 45.25 against a label of 45.2 that sits on the absTol 0.05 and is scored correct. A bin edge opens the upper bin, because the bins are half-open intervals with the lower edge closed. A paired replicate of exactly 0 counts toward the share at or below 0, because "a does not beat b" includes a draw.

Two boundaries shape the retrieval figures directly. Only a score above 0 is ranked, so a list can be shorter than k, and precision at k still divides by k: Q10 by BM25 ranks only 2 passages and scores precision 0.400000 at 5. A query is included in the means when one judged passage reaches the threshold; Q24 has none, so it is excluded from every mean and listed.

A rule stated for one function never carries to another. The extraction tolerance and the groundedness tolerance are both inclusive, but they are two rules with two parameters, and each is stated in its own basis.

## The boundaries that decide what text means

The claim reader has boundaries of its own, each probed the same way:

| rule | at the boundary | across it |
| --- | --- | --- |
| comma groups | exactly three digits after a comma join the number | four digits: "12,1234" reads as "12" and "1234" |
| minus sign | after a space: "-2" is a negative number | after a letter or digit: "Ekene-2" is an identifier |
| date | YYYY-MM-DD touching no letter or digit is a date | "2023-01-01x" is read as numbers |
| empty | null, absent or a blank string is empty | "the" is a value (it normalises to nothing) |

Each row matters in oilfield text. Well names such as Ekene-2 would otherwise produce negative numbers, and a figure like 2,096 psia must read as one number.

## The boundaries of what is accepted

The remaining rules set what the engine will run at all: numericRelTol from 0 up to just below 1, a grade from 0 to 10, k1 of 0 or more and b from 0 to 1, a seed from 0 to 4294967295, at least 2 bootstrap values, and one of four levels. Each is probed at the edge and one step beyond it. 23 rules in all, each probed by a call either side.

## Exercise

Open the trust explorer on "A boundary rule, probed". Choose "relevant: a grade against the threshold" and probe grades 2 and 1 at relevantGrade 2. Choose "a number field: the tolerance is inclusive" and probe 101, then 101.5, against the label 100 with absTol 1. Choose "a relevant passage at rank k and at rank k + 1" and probe k 3, then k 2. Last, choose "a calibration bin edge" and probe 0.5 and 0.49 at 10 bins. For each pair, write which side of the boundary each value fell on, the rule that put it there, and whether that rule includes or excludes its limit.
