# The capstone brief

{{panel:lp-worksheet}}

The Associate capstone asks one question: how much risk reduction is missing. It gives you a scenario with its initiating event frequency, its enabling conditions, its conditional modifiers, its protection layers with their flags, and a tolerable frequency. You produce the chain. Nothing in it asks you to compute a function's PFDavg from failure rates, and nothing in it asks for a proof test interval.

## What you will be asked to produce

| step | what you return |
| --- | --- |
| 1 | the product of the enabling conditions |
| 2 | the product of the conditional modifiers |
| 3 | the unmitigated frequency, per year |
| 4 | the product of the credited IPL PFDs |
| 5 | the mitigated frequency without a SIF, per year |
| 6 | the required RRF, the outcome and the required PFDavg |

Every one of those is a step you have already run on ORONI, where the chain goes from 0.45 per year to 0.013500000000 per year, then to 0.000013500000 per year, and against a tolerable frequency of 0.000001000000 per year gives 13.500000, SIL1 and 0.074074074074.

## Three things that decide most marks

The first is the credit decision. Read every layer's flags before multiplying anything. A layer is credited only when it is flagged independent as exactly true and is not flagged not auditable, and one layer takes one credit. Getting that wrong moves the answer by a whole decade for each layer, as ORONI shows when all four of its layers are credited and the required risk reduction factor falls from 13.500000 to 0.135000.

The second is precision. Frequencies, probabilities and PFDavg values are carried to twelve decimals and risk reduction factors to six. Do the whole chain in one pass and quote what comes out, because a figure rounded at step three cannot be recovered at step six.

The third is the boundary rule. An exact decade belongs to the lower SIL, so a required risk reduction factor of exactly 100 is SIL1 and one of exactly 10 is below SIL1. Check whether your answer is sitting on a decade before you name a band.

A fourth habit helps more than it looks. Write the chain down in the order the engine runs it and keep each intermediate figure beside the name the engine gives it, so a step you doubt can be rechecked without rebuilding the row.

## How to check your own answer

Divide your unmitigated frequency by the initiating event frequency and confirm it equals the two products multiplied together. Divide your mitigated frequency by your unmitigated frequency and confirm it equals the credited product. Then confirm the required PFDavg is one over the required risk reduction factor. Three divisions catch almost every arithmetic slip, and they need nothing beyond the figures you already wrote down.

## Exercise

Take ORONI's chain and rebuild it from the two products alone: multiply 0.300000000000 by 0.100000000000 by 0.45 per year, apply a credited product of 0.001000000000, and divide by a tolerable frequency of 0.000001000000 per year. Confirm you reach 13.500000, then state the outcome and write the required PFDavg to twelve decimals.
