# Linear and quadratic weights

{{panel:ae-trust-explorer}}

The unweighted kappa treats every disagreement alike. Grade 2 against grade 3 is charged exactly as much as grade 0 against grade 3, although on an ordered scale a one-grade slip and a three-grade reversal are different events. Weighted kappa charges each disagreement by how far apart the two grades are.

## The weights, in the engine's words

The basis gives both weightings on the label positions:

> weights, linear: w = |i - j| on the label positions (linear)

> weights, quadratic: w = (i - j)^2 on the label positions (quadratic)

With the labels 0, 1, 2, 3 the positions are the grades themselves. Under linear weights a disagreement of one grade costs 1 and a disagreement of three grades costs 3. Under quadratic weights the same two cost 1 and 9. The formula is the one from the last lesson, 1 - sum w O / sum w E, with the new weights in both sums.

## The Ekene annotators, three ways

| weights | observed agreement | expected agreement | observed disagreement | expected disagreement | kappa |
| --- | --- | --- | --- | --- | --- |
| none | 0.721311 | 0.336708 | 0.278689 | 0.663292 | 0.579841 |
| linear | 0.721311 | 0.336708 | 0.338798 | 1.045478 | 0.675940 |
| quadratic | 0.721311 | 0.336708 | 0.459016 | 2.009257 | 0.771549 |

First, the observed and expected agreement columns are the same in all three rows. The engine reports those two unweighted whatever the weighting, as its basis says; the weights act on the disagreement columns only. Second, the weighted disagreements can exceed 1, because a weight can exceed 1. Only their ratio enters kappa.

## Why the weighted figures are higher here

Count the off-diagonal cells in the confusion table: 40 of the 51 disagreements are one grade apart. Chance, by contrast, spreads its disagreements over every pair of grades, including the far ones. Weighting charges chance for its far disagreements more heavily than it charges these annotators for their near ones, so the ratio falls and kappa rises: linear 0.675940, quadratic 0.771549.

A weighted kappa is a different statistic from the unweighted one. Quote it with its weighting, and never compare a quadratic kappa from one study with an unweighted kappa from another.

## Words need their order

Weights use label positions, so the labels must be in the order the scale means. Numbers sort into that order by themselves. Words do not: sorting the labels none, related, relevant and answers alphabetically would put "answers" before "none", which is the wrong end of the scale. So the engine refuses linear or quadratic weights on word ratings unless the labels are given, with the field `labels` named:

> labels must be given in order for linear weights on string ratings (the weights use the label positions)

Give the labels in order and the call succeeds. On six stated pairs rated with the words none, related, relevant and answers, labels given in that order, linear weights, kappa is 0.608696.

## Exercise

Open the trust explorer on "Cohen's kappa" with the Ekene annotators loaded. Switch the weights from none to linear to quadratic and confirm the three kappas above, then note which tiles stayed still. Next, clear both boxes and type six word ratings of your own for each rater from the labels none, related, relevant and answers. Choose linear weights with the labels box blank and read the refusal. Type the labels in order and read the kappa. Then type them in alphabetical order and explain why the value changes.
