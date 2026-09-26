# A probability and an outcome

{{panel:ae-trust-explorer}}

A retrieval score orders passages and says nothing about how likely a passage is to be relevant. Some systems go further and attach a probability to each passage, the chance it is relevant. A probability makes a promise a score never makes, and calibration is the check on whether that promise is kept.

## The Ekene calibration set

The calibration set is 200 (query, passage) rows. Each row carries a probability that the passage is relevant, given to 2 decimals, and an outcome: 1 when the judged grade is 2 or 3, and 0 otherwise. Note the threshold. For calibration an outcome of 1 means grade 2 or more, which is stricter than the grade 1 default of the retrieval metrics. The share of outcomes that are 1, the base rate, is 0.190000.

The fixture states where the probabilities came from. Each probability is 1 / (1 + exp(-(0.6 x bm25 - 3.0))) rounded to 2 dp, a curve fitted elsewhere, so it is not calibrated here. A BM25 score went in, and a number between 0 and 1 came out through a stated curve.

## A given input

This engine reads no probability of its own. The calibration set's probabilities are given inputs, and fitting the classifier that made them is the machine learning course's subject. Here you take the probabilities as a system handed them over and ask one question of them: when this system says 0.7, is the passage relevant about seven times in ten?

## What the engine refuses

The `calibration` function takes `yTrue`, the outcomes, and `probabilities`, one per outcome. Each input is checked and a refusal names its field. No outcomes at all:

> yTrue must be a non-empty array of 0 and 1 outcomes

A grade typed where an outcome belongs, here an outcome of 2:

> yTrue[1] must be 0 or 1

Paste judged grades straight in and this is what you meet; reduce them to 0 and 1 at a stated threshold first. Two outcomes and one probability:

> probabilities must be an array of 2 numbers, one per outcome

A probability outside 0 to 1, here 1.2:

> probabilities[1] must be a number from 0 to 1

A BM25 score pasted into the probabilities box is the usual way to meet that last one: a BM25 score can run above 1, and a probability never does.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE". It loads the Ekene calibration set. Read the rows and base rate tiles and confirm the base rate of 0.190000. Then replace the outcomes with three grades of your own, such as 0, 2, 3, and read the refusal. Restore two outcomes and type one probability; read that refusal. Finally type a probability of 1.2 and note the field the engine names.
