# Log loss from the machine learning engine

{{panel:ae-trust-explorer}}

The calibration call returns one more figure beside the Brier score: log loss. This engine does not compute it. It imports the function from the platform's machine learning engine, engines/dataai/ml.js, and calls it on the same rows, so the figure here is exactly the one the machine learning course teaches.

## The definition, in the engine's words

> engines/dataai/ml.js logLoss: -(1/n) sum [y ln p + (1 - y) ln(1 - p)], natural log; p clipped to [eps, 1 - eps], eps = 1e-15

Each row contributes the negative logarithm of the probability it gave to what actually happened: ln p for a relevant row, ln(1 - p) for the others. A probability near 1 on a relevant row costs almost nothing. A probability near 0 on a relevant row costs a great deal, and a probability of exactly 0 would make the logarithm infinite. That is why the function clips every probability into [eps, 1 - eps] first.

## On the Ekene calibration set

Log loss is 0.503184, with eps 1e-15 and 5 probabilities clipped. The course checked that this is exactly what engines/dataai/ml.js logLoss returns on the same rows. A clipped probability means the set holds a 0 or a 1, whose cost is set by eps.

| figure | value |
| --- | --- |
| Brier score | 0.168382 |
| log loss | 0.503184 |
| probabilities clipped | 5 |

## Why import it

One definition on the platform means one answer: a second copy could drift in its clipping or its logarithm base, and two courses would then teach two figures for the same rows. The machine learning course teaches log loss as a training loss, the thing a classifier is fitted to reduce. This course uses it only as a second summary of probabilities it was handed.

## The refusal on eps

The calibration call passes eps straight through to the imported function, and the refusal comes back with the field `eps` named. An eps of 0.5 would clip every probability to 0.5:

> eps must be a number above 0 and below 0.5

Leave eps out and it is 1e-15.

## Brier score and log loss, side by side

Both summarise a set of probabilities, and lower is better for each. The Brier score caps each row's cost at 1. Log loss does not: one confident miss can outweigh many good rows. The two can disagree about which of two systems is better when one of them makes a few very confident errors. Report both, each by name, and say how many probabilities log loss clipped.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE" with the Ekene set loaded. Read log loss and the clipped count. Then clear both boxes and type three rows of your own: outcomes 1, 0, 1 with probabilities 0.9, 0.2, 0.8. Read both figures. Change the last probability to 0 and read them again; note which figure jumped, by how much, and what the clipped count now says.
