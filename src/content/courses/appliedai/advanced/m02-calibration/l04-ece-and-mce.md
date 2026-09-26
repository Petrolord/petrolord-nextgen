# Expected and maximum calibration error

{{panel:ae-trust-explorer}}

A reliability table has as many gaps as it has bins. Two summaries reduce it to one figure each, and they answer different questions. The expected calibration error, ECE, is the average gap a row meets. The maximum calibration error, MCE, is the worst gap in any bin.

## The definitions, in the engine's words

> ece: `sum over non-empty bins of n_k / N x |observed_k - mean p_k|`

> mce: `the largest |observed_k - mean p_k| over non-empty bins`

ECE weights each bin's gap by its share of the rows, n_k / N, so a bin holding many rows counts for more. That weighting follows Guo et al. (2017). A common alternative is the unweighted mean of the gaps over bins, which lets a bin of three rows count as much as a bin of thirty-nine.

## On the Ekene set

At 10 bins: Brier score 0.168382, ECE 0.209300, MCE 0.723333. The MCE is bin 7's gap, where 3 rows carry a mean probability of 0.723333 and none is relevant. Bin 7 holds 3 of the 200 rows, so its gap barely touches ECE and sets MCE outright: a small bin moves ECE little and MCE a lot.

## The bin count is a choice

| bins | Brier | ECE | MCE | empty bins |
| --- | --- | --- | --- | --- |
| 5 | 0.168382 | 0.209300 | 0.660556 | 0 |
| 10 | 0.168382 | 0.209300 | 0.723333 | 0 |
| 15 | 0.168382 | 0.209300 | 0.750000 | 0 |

The Brier score is the same at every bin count because it uses no bins. MCE changes with the bins: finer bins can isolate a smaller, worse group of rows, and at 15 bins the worst gap is 0.750000.

ECE does not change here, and the reason is particular to this set. Every non-empty bin is over-confident at 5, 10 and 15 bins alike, so each gap is the mean probability minus the observed frequency, with no absolute value to flip a sign. The weights n_k / N then add the bins back together, and ECE comes to the mean probability over all rows minus the base rate: 0.399300 minus 0.190000, 0.209300, whatever the bins. On a set with bins on both sides of the diagonal the gaps no longer add up this way, and ECE can move with the bin count too.

So quote ECE and MCE with their bin count, every time.

## Which one to report

Report both. ECE tells a reader how far off the probabilities are for a typical row. MCE warns that somewhere in the range the probabilities break down, and the table beside it says where and on how many rows. An MCE from a bin of 3 rows deserves a sentence of caution; the same MCE from a bin of 40 rows is a finding.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE" with the Ekene set loaded. Read ECE and MCE at 5, 10 and 15 bins and confirm the table above. Then build a small set of your own where one bin is over-confident and another under-confident: for example outcomes 0, 0, 1, 1 with probabilities 0.2, 0.2, 0.7, 0.7 is a start. Change the bin count and watch whether ECE now moves. Write each ECE and MCE with its bin count.
