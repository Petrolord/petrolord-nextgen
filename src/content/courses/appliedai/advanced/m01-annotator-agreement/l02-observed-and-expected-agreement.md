# Observed and expected agreement

{{panel:ae-trust-explorer}}

Two annotators who agree on most pairs have not yet shown that they agree for a reason. If most passages are graded 0 by both, they will agree often even when neither is reading closely. Agreement has to be measured against the agreement that the two raters' own habits would produce by chance, and that is what the expected agreement is.

## Observed agreement

The engine's basis states both figures in one line:

> agreement: observedAgreement = diagonal / n and expectedAgreement = sum row x column / n^2, both unweighted

The observed agreement is the share of items on the diagonal. On the Ekene annotators that is 132 of 183 pairs, 0.721311. It needs no model of chance: it is a count divided by a count.

## Expected agreement

The expected agreement asks what two raters would agree on if each kept their own mix of grades and chose them independently. The primary annotator gave grade 0 to 101 pairs and the second annotator gave grade 0 to 77. If the two were independent, the share of pairs where both say 0 would be 101 / 183 times 77 / 183. Do the same for each grade and add:

| grade | row total (a) | column total (b) | row x column |
| --- | --- | --- | --- |
| 0 | 101 | 77 | 7777 |
| 1 | 44 | 63 | 2772 |
| 2 | 13 | 29 | 377 |
| 3 | 25 | 14 | 350 |

The products sum to 11276, and dividing by 183 squared, 33489, gives the engine's expected agreement, 0.336708. Two raters labelling at random with these same row and column totals would agree on about a third of the pairs.

## Why the margins matter

The expected agreement is large when both raters lean on the same grade. Here the two annotators both lean on grade 0, so a good part of their observed agreement was always going to happen. Set the two figures side by side:

| figure | value |
| --- | --- |
| observed agreement | 0.721311 |
| expected agreement | 0.336708 |
| observed disagreement | 0.278689 |
| expected disagreement | 0.663292 |

The disagreements are the complements when every off-diagonal cell counts the same: 1 minus 0.721311 is 0.278689 and 1 minus 0.336708 is 0.663292. Kappa, in the next lesson, is built from these two disagreements.

## Agreement on the relevant or not decision

A metric at grade 1 or more only needs the annotators to agree on one line: relevant or not. The course reduces each grade to 1 or 0 at a threshold and measures agreement on the result. At grade 1 or more the observed agreement is 0.814208; at grade 2 or more it is 0.928962. Both are higher than on the four grades, because a two-way decision has fewer ways to disagree. A high observed agreement on a coarse decision is easy to reach, which is exactly why it has to be read beside its expected agreement.

## Exercise

Open the trust explorer on "Cohen's kappa" with the Ekene annotators loaded. Read the observed and expected agreement from the tiles and check them against the table above. Then work the expected agreement by hand from the row and column totals the panel prints. Finally, edit the first ten ratings in rater b's box so they equal rater a's first ten, and write down which of the two tiles moved and why the other one moved too.
