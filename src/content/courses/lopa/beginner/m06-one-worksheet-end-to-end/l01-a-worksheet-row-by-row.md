# A worksheet, row by row

{{panel:lp-worksheet}}

Everything in this tier is one chain, and this lesson runs it once from end to end on the ORONI separator overfill row. Each step is one multiplication or one division, and each produces a figure the engine returns with a name, so the whole row can be checked a line at a time by somebody who did not build it.

## The chain, in order

| step | quantity | value |
| --- | --- | --- |
| 1 | initiating event frequency, per year | 0.45 |
| 2 | product of the enabling conditions | 0.300000000000 |
| 3 | product of the conditional modifiers | 0.100000000000 |
| 4 | unmitigated frequency, per year | 0.013500000000 |
| 5 | product of the credited IPL PFDs | 0.001000000000 |
| 6 | mitigated frequency without a SIF, per year | 0.000013500000 |
| 7 | TMEL, per year | 0.000001000000 |
| 8 | required RRF | 13.500000 |
| 9 | outcome | SIL1 |
| 10 | required SIF PFDavg | 0.074074074074 |

Steps one to four are the scenario. Steps five and six are the layers already in place. Steps seven to ten are the tolerance and the gap.

## Reading each step as a claim

Every line is a claim somebody has to defend. The 0.45 per year is a claim about a valve. The 0.300000000000 is a claim about how much of the year the separator spends on the high pressure manifold. The 0.100000000000 is two claims, one about ignition at 0.5 and one about occupancy at 0.2. The 0.001000000000 is two credited layers, the alarm at 0.1 and the relief valve at 0.01, and it is also two layers set aside with reasons, one not flagged independent and one flagged not auditable.

The 0.000001000000 per year is the organisation's claim about what it will tolerate for this consequence. Only the last three lines are the engine's own arithmetic, and each of them is a single operation on the lines above.

## What the row asks the plant for

The required risk reduction factor is 13.500000 and the required SIF PFDavg is 0.074074074074, in the SIL1 band. That is the specification: a function that fails on demand less often than 0.074074074074, verified as such, and managed for the life of the plant. The band goes into the specification with it, and the number is what the verification has to beat.

There is one more figure worth writing beside it. The row's frequency with a proposed function in place is the mitigated frequency multiplied by that function's PFDavg, and it is the number a reader compares directly with the tolerable frequency of 0.000001000000 per year. Until a function is proposed the row reports that it does not meet the tolerance, because the outcome is not NO_SIF_REQUIRED, and that reading means the row is unfinished as often as it means the row fails.

## Where the row can go wrong quietly

| what slips | what it costs |
| --- | --- |
| a modifier claimed without an argument | the demand is understated and the function is undersized |
| an enabling condition forgotten | the demand is overstated and the plant buys reduction it does not need |
| a layer credited without independence | the demand can fall by a whole decade per layer |
| the tolerable frequency taken from the wrong criterion | every band on the sheet moves together |

None of these produces an error. Each produces a clean worksheet with a different answer, which is why the engine returns every intermediate figure with its name and why a review reads the chain before it reads the outcome.

## Exercise

Run the chain yourself from 0.45 per year down to 0.074074074074, writing each of the ten figures above in order. Then take step five back to a credited product of 0.01 alone, with the alarm no longer credited, and work out the required risk reduction factor and the band the row would report.
