# Rising to EVPI

Once a dry reading switches the EKPAN lottery to the farm-out, the symmetric survey's value climbs in equal steps from 0.7250 at accuracy 0.650000 to 52.0000 at 1.000000, exactly the EVPI, and never passes it.

{{panel:ec-information-explorer}}

## The climb

| accuracy | posterior Success after reads success | posterior Success after reads dry | evii | evpi |
| --- | --- | --- | --- | --- |
| 0.650000 | 0.500000 | 0.224771 | 0.7250 | 52.0000 |
| 0.700000 | 0.556818 | 0.187500 | 8.0500 | 52.0000 |
| 0.750000 | 0.617647 | 0.152174 | 15.3750 | 52.0000 |
| 0.800000 | 0.682927 | 0.118644 | 22.7000 | 52.0000 |
| 0.850000 | 0.753165 | 0.086777 | 30.0250 | 52.0000 |
| 0.900000 | 0.828947 | 0.056452 | 37.3500 | 52.0000 |
| 0.950000 | 0.910959 | 0.027559 | 44.6750 | 52.0000 |
| 1.000000 | 1.000000 | 0.000000 | 52.0000 | 52.0000 |

Subtract 0.7250 from 8.0500, then 8.0500 from 15.3750: the two differences are the same, and so is every later step of 0.050000 in accuracy.

## Why the steps are equal

Across these rows the actions are fixed: Drill after a success reading, Farm out after a dry one. The value with information then adds up four joint events, each paying its action's money: a success read as success pays 365.0000, a dry hole read as success pays -80.0000, a success read as dry pays the farm-out's 95.0000, and a dry hole read as dry pays 0.0000.

0.350000 x a x 365.0000 + 0.650000 x (1 less a) x -80.0000 + 0.350000 x (1 less a) x 95.0000

Every term is a straight line in a, so their sum is too. At a = 1.000000 only the first term survives, 0.350000 x 365.0000 = 127.7500, which is evWithPerfect, and 127.7500 less 75.7500 is the EVPI of 52.0000. Run the same line the other way and it reaches zero at 0.645051, the accuracy at which a dry reading first changes the action.

## Why EVPI is the ceiling

EVPI does not depend on the survey; the lottery fixes it at 52.0000 in every row. A survey of accuracy 1.000000 reads the outcome itself, and its Bayes tree becomes the perfect-information table. No survey beats knowing, so 0 <= evii <= evpi holds on every row.

The CSEM survey quoted on the EKPAN lottery, with likelihoods 0.850000 and 0.250000, is worth 24.8250. That sits between the symmetric rows at 0.800000 and 0.850000, 22.7000 and 30.0250.

## The published sweep

The accuracySweep cases run a symmetric survey on the drillFarmOut prospect at a prior of 0.300000: `accuracySweep_0p5` returns 0.0000, `accuracySweep_0p7` 6.5000, `accuracySweep_0p9` 25.5000 and `accuracySweep_1p0` 35.0000, matching the evpi of 35.0000 the published prospect case records. A different lottery, the same shape: nothing at a coin, the EVPI at a perfect reading.

## The mistake

The careful mistake is taking value as proportional to accuracy. Accuracy 0.750000 is halfway from a coin to a perfect survey and is worth 15.3750, well under half of 52.0000, because the stretch up to 0.645051 buys nothing. The second mistake is extending the straight line back past the flip. Continued to 0.600000 it would go negative, but information derived by Bayes is never worth less than 0, and that row reads 0.0000.

## Exercise

Show that the evii step from 0.700000 to 0.750000 equals the step from 0.950000 to 1.000000. Then write the four-term line at a = 1.000000, give the evWithPerfect and EVPI it produces, and explain why accuracy 0.750000 is worth less than half the EVPI.
