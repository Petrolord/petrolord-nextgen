# A reading that never happens

A survey can list a reading that no outcome ever produces. Bayes cannot divide by a chance of zero, so the engine keeps the priors as that reading's posterior, and the reading adds nothing to the value of the survey.

{{panel:ec-judgement-explorer}}

## The published impossibleSignal case

Two outcomes with priors 0.300000 and 0.700000 and a best action at the prior worth 43.0000. The survey lists three readings.

| reading | likelihoods | pSignal | posterior | best action index | emv |
| --- | --- | --- | --- | --- | --- |
| Positive | 0.800000 / 0.300000 | 0.450000 | 0.533333 / 0.466667 | 0 | 115.3333 |
| Negative | 0.200000 / 0.700000 | 0.550000 | 0.109091 / 0.890909 | 1 | 6.5455 |
| Never | 0.000000 / 0.000000 | 0.000000 | 0.300000 / 0.700000 | 0 | 43.0000 |

Each outcome's likelihood column still sums to 1, because Never contributes 0 to both. evii is 12.5000.

## Why the posterior is the prior

A posterior is a joint chance over the chance of the reading. For Never both joints are 0 and the chance of the reading is 0.000000, so the division has no answer. The engine neither refuses the survey nor returns a failed number. It reports the priors, 0.300000 / 0.700000, as the posterior, the prior best action, index 0, and the prior's emv, 43.0000.

## Why it adds nothing

EV with information weights every reading's emv by its chance:

0.450000 x 115.3333 + 0.550000 x 6.5455 + 0.000000 x 43.0000 = 55.5000

The Never term is multiplied by zero. The published seismicBayes case is the same survey without Never, and it returns the same evWithInfo 55.5000 and the same evii 12.5000. The extra row changes the table and not the value.

## What the row does not mean

The Never row prints a posterior, an action and an emv that look like a forecast. They are a fallback: no outcome produces the reading, so it is never observed, and the row records what the engine reports when it cannot compute a posterior. The engine gives no separate warning that a reading is impossible; a pSignal of 0.000000 is the only sign.

A reading with a small chance that is not zero is different. Its posterior is real and can swing a long way, but its weight is still its chance, so its contribution to evii is small however far the posterior moves.

## The mistake

The careful mistake is to read the Never row literally and report that on a Never reading the action is worth 43.0000. That sentence describes an event with probability 0.000000. The second mistake runs the other way: seeing likelihoods of 0.000000 / 0.000000 and expecting a refusal. The engine accepts the survey, because the columns still sum to 1, and nothing but that pSignal marks the row.

## Exercise

Write the weighting line for EV with information on impossibleSignal and give evii. Then explain why the Never reading's posterior equals the prior, and why seismicBayes, without that reading, returns the same evii.
