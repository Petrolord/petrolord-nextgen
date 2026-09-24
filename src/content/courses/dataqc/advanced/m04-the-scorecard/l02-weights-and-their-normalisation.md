# Weights and their normalisation

{{panel:dq-monitor-explorer}}

The scorecard total is the weighted mean of the dimension scores, with the weights normalised by their sum. On EKENE-3, with stated weights of 3, 2, 2, 1 and 1 for completeness, validity, consistency, uniqueness and plausibility, the normalised weights are 0.333333, 0.222222, 0.222222, 0.111111 and 0.111111, and the total is 0.927390. With no weights, every listed dimension weighs 0.200000 and the total is 0.889531.

| dimension | score | weight, stated | normalised weight | contribution, weighted | weight, equal |
| --- | --- | --- | --- | --- | --- |
| completeness | 0.966667 | 3 | 0.333333 | 0.322222 | 0.200000 |
| validity | 0.977011 | 2 | 0.222222 | 0.217114 | 0.200000 |
| consistency | 0.988506 | 2 | 0.222222 | 0.219668 | 0.200000 |
| uniqueness | 0.538462 | 1 | 0.111111 | 0.059829 | 0.200000 |
| plausibility | 0.977011 | 1 | 0.111111 | 0.108557 | 0.200000 |

| scorecard | total | weakest |
| --- | --- | --- |
| equal weights | 0.889531 | uniqueness |
| stated weights 3, 2, 2, 1, 1 | 0.927390 | uniqueness |

## Normalised by their sum

A caller writes weights in whatever scale is convenient, and the engine divides each weight by the sum of all of them. With the weights 3, 2, 2, 1 and 1, completeness carries a normalised weight of 0.333333. The basis block states the rule verbatim: weights "caller weights, normalised by their sum". Any set of weights with the same proportions gives the same total. The contribution column is the score times its normalised weight, and the five contributions add to the total.

## Equal weights

Without weights, every listed dimension weighs the same. Five dimensions each weigh 0.200000, and the total is the plain mean of the five scores, 0.889531. Equal weights are a choice as well: they say every dimension matters as much as every other, which is itself a claim about the data's use. The engine applies them only when no weights are passed at all, and a note that used them says so in the same sentence as the total.

## A weight is a statement about use

The stated weights put 3 on completeness and 1 on uniqueness. That says the plan cares more about missing production days than about duplicated well names, which may be right for a daily surveillance report and wrong for a database merge. On EKENE-3 the weighting moves the total from 0.889531 to 0.927390, and the weakest score, uniqueness at 0.538462, carries a normalised weight of 0.111111 there in place of 0.200000. The data did not change. The weights say what the scorecard is for, and they belong in the note beside the total.

## Every dimension, or none

A weight must be given for every listed dimension, or for none. The engine refuses a partial set and names the missing one. Its own words:

> weights.validity is missing: give every listed dimension a weight, or none for equal weights

A missing weight has no honest default. Taking it as zero would drop the dimension silently, and taking it as the mean of the others would invent a weight nobody chose.

## Exercise

In the panel's scorecard view, confirm the total of 0.927390 at the stated weights. Then double every weight, to 6, 4, 4, 2 and 2, and confirm the total does not move. Set every weight to 1 and compare the total with the equal weights run. Finally, set the uniqueness weight to 3 and the completeness weight to 1, and write one sentence on the kind of use that weighting describes.
