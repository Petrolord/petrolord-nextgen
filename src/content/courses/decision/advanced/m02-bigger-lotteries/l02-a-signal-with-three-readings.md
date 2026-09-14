# A signal with three readings

A survey with three readings on a lottery with three outcomes is still one application of Bayes per reading. The published threeByThree case shows how little such a survey can be worth when two of its three readings leave the decision where it was.

{{panel:ec-judgement-explorer}}

## The likelihoods

The lottery is the published three-outcome, four-action one: Large 0.200000, Medium 0.500000, Dry 0.300000, with Drill alone best at the prior at 109.0000 and an EVPI of 24.0000. The survey costs 12.0000. Each cell is the chance of a reading given an outcome.

| reading | given Large | given Medium | given Dry |
| --- | --- | --- | --- |
| Bright | 0.700000 | 0.300000 | 0.100000 |
| Flat | 0.200000 | 0.500000 | 0.300000 |
| Dim | 0.100000 | 0.200000 | 0.600000 |

Each outcome's column sums to 1: whatever the outcome, the survey returns some reading. The rows do not sum to 1 and have no reason to.

## Bayes, one reading at a time

The chance of Bright weights its row by the priors: 0.200000 x 0.700000 + 0.500000 x 0.300000 + 0.300000 x 0.100000 = 0.320000. The posterior chance of Large after Bright is its joint over that sum, 0.200000 x 0.700000 over 0.320000, which is 0.437500. The same two steps give every cell.

| reading | pSignal | posterior Large | posterior Medium | posterior Dry | best action | emv |
| --- | --- | --- | --- | --- | --- | --- |
| Bright | 0.320000 | 0.437500 | 0.468750 | 0.093750 | Drill alone | 227.1875 |
| Flat | 0.380000 | 0.105263 | 0.657895 | 0.236842 | Drill alone | 86.5789 |
| Dim | 0.300000 | 0.066667 | 0.333333 | 0.600000 | Farm out | 15.3333 |

The three pSignal values sum to 1, a check worth doing by hand before trusting any posterior.

## Weighting the readings

EV with information weights each reading's best value by its chance:

0.320000 x 227.1875 + 0.380000 x 86.5789 + 0.300000 x 15.3333 = 110.2000

Less emvPrior 109.0000, evii is 1.2000. Less the survey cost 12.0000, netEvii is -10.8000. The published threeByThreeCost12 information tree agrees: its root branches are 98.2000 for acquiring and 109.0000 for no further information, and it chooses "No further information". The survey's gross value is 1.2000 against a ceiling of 24.0000.

## Why so little

Bright and Flat both lead to Drill alone, the action the prior already chose. Those readings move the posteriors a long way, Large from 0.200000 to 0.437500 after Bright, and change nothing that is done. Only Dim moves the decision, to Farm out, and all 1.2000 of the value comes from the 0.300000 of cases that read Dim. Information is worth what it changes, and here it changes one reading's action.

## What the engine checks and refuses

The engine refuses a likelihood column that does not sum to 1 and names it, in the published form "Likelihoods P(signal | "Success") sum to 0.900000, expected 1". It does not check rows, because rows are not distributions. It values one survey bought once before one decision: there is no second survey and no sequence of readings.

## The mistake

Two careful mistakes. The first is to "fix" the Bright row because 0.700000, 0.300000 and 0.100000 do not add to 1; rescaling it breaks three columns the engine would then refuse. The second is to value the survey by its best reading: an emv of 227.1875 after Bright looks like a reason to pay 12.0000, but the survey is worth 1.2000 gross, because Bright leads to the same well the prior would drill anyway.

## Exercise

Compute pSignal for Bright by hand and the posterior chance of Large after Bright. Then write the weighting line for EV with information, give evii and netEvii at a cost of 12.0000, and explain why the Bright and Flat readings add nothing to evii.
