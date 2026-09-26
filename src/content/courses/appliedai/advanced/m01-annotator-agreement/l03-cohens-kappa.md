# Cohen's kappa

{{panel:ae-trust-explorer}}

Cohen's kappa puts the observed agreement on a scale that starts at the agreement chance would give. A kappa of 1 is complete agreement. A kappa of 0 is agreement no better than two raters with the same grade habits choosing independently. A negative kappa is agreement worse than that.

## The engine's formula

The engine writes kappa in terms of disagreement, which is the form that carries over to the weighted versions in the next lesson:

> kappa: 1 - sum w O / sum w E, O the observed counts (rows rater a, columns rater b), E = row total x column total / n

For the unweighted kappa the weight is 0 on the diagonal and 1 off it, so sum w O counts the disagreements and sum w E counts the disagreements chance would give. On the Ekene annotators the two shares are 0.278689 and 0.663292:

kappa = 1 - 0.278689 / 0.663292 = 0.579841

The two annotators remove a little over half of the disagreement that chance alone would leave. That is the figure to quote, with its weighting: unweighted kappa 0.579841 on 183 pairs.

## Kappa at a relevance threshold

The same pairs, reduced to relevant or not, give a different kappa for each threshold:

| ratings | observed agreement | kappa |
| --- | --- | --- |
| four grades, unweighted | 0.721311 | 0.579841 |
| relevant at grade 1 or more | 0.814208 | 0.634430 |
| relevant at grade 2 or more | 0.928962 | 0.794115 |

The annotators agree best on the line between grade 1 and grade 2. The default threshold of every retrieval metric in this course is grade 1, which is the line they agree on less well. The default can stay where it is, provided every figure states its threshold and the report gives the kappa at the threshold the metrics use.

## How the engine reads the labels

The basis states the label order:

> labels: the distinct ratings sorted ascending

Pass labels yourself and the engine checks them. A label listed twice is refused with the field named:

> labels[2] repeats 1

A rating that is not among the labels you gave is refused:

> a[1] is 3, which is not one of labels

A list that mixes a word into number ratings is refused:

> a[1] must be a finite number, like a[0]

and a weighting the engine does not offer is refused:

> weights must be 'none', 'linear' or 'quadratic'

## What kappa does not tell you

Kappa measures agreement between two raters. It says nothing about which rater is right or how good either system is. A high kappa on a judged set says the key is stable enough to rank systems on; a low kappa says a small difference between two systems may be the annotators talking.

## Exercise

Open the trust explorer on "Cohen's kappa" with the Ekene annotators loaded and weights set to none. Confirm the kappa of 0.579841. Type the labels 0, 1, 2, 3 in the labels box and check that nothing changes. Then type 0, 1, 1, 2, 3 and read the refusal. Finally, build your own small case: six items that two raters grade 0 or 1, agreeing on four. Read the kappa, then change one agreement into a disagreement and explain the new value from the observed and expected tiles.
