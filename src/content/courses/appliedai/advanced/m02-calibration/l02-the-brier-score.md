# The Brier score

{{panel:ae-trust-explorer}}

The Brier score is the simplest summary of how good a set of probabilities is: the mean squared distance between each probability and what happened. Low is good. A system that says 1 for every relevant passage and 0 for every other scores 0.

## The definition

The engine's basis gives it in one line:

> brier: `mean (p - y)^2`

Each row contributes the square of its miss. A probability of 0.9 on a row whose outcome is 1 misses by 0.1 and adds 0.01; the same probability on a row whose outcome is 0 misses by 0.9 and adds 0.81. The square makes a confident miss cost far more than a hesitant one, which is the property that makes the score useful: a system cannot do well by being bold and wrong.

## The Ekene calibration set

On the 200 rows the Brier score is 0.168382. On its own that figure is hard to read, which is why the next lesson breaks the rows into bins and the module after this one breaks the score itself into parts. One thing can be read now. The Brier score uses no bins at all: it is a mean over rows. The course checked it at three bin counts:

| bins | Brier |
| --- | --- |
| 5 | 0.168382 |
| 10 | 0.168382 |
| 15 | 0.168382 |

Whatever bin count you choose for the reliability table, the Brier score does not move. That makes it the steadiest single figure in a calibration report, and the one to quote first.

## What the score mixes together

A Brier score mixes two separate things. One is calibration: whether the probabilities mean what they say. The other is resolution: whether the probabilities tell relevant rows from the others at all. A system that gives every row the base rate, 0.190000, is perfectly honest about the average and useless for ranking. A system with sharp, separating probabilities that are all too high is useful for ranking and dishonest about its numbers. The Brier score alone cannot say which weakness it is measuring. The decomposition later in this tier pulls the two apart, with the exact identity the engine closes.

## Brier beside log loss

The calibration call returns log loss beside the Brier score, imported from the machine learning engine and taught in the last lesson of the next module. On this set log loss is 0.503184. The two rank a confident miss differently: the Brier score caps each row's cost at 1, and log loss grows without limit as a wrong probability approaches 0 or 1, which is why it clips. Quote each by name, and never quote one as the other.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE" with the Ekene set loaded. Read the Brier score. Change the bin count to 5, then 15, and confirm that it stays at 0.168382 while the MCE tile moves. Then clear both boxes and type four rows of your own: outcomes 1, 0, 1, 0 with probabilities 0.9, 0.1, 0.9, 0.1. Work the Brier score by hand before reading it, then change one 0.1 to 0.9 and explain the new figure row by row.
