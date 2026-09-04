# Gas volume fraction

Every well in this module carries two gas volume fractions, and they are compared against different things. Confusing them changes the equipment you buy.

{{panel:pd-lift-explorer}}

## Two fractions, one well

The gas volume fraction of the whole stream is the free gas at depth over the total stream at depth. The fraction through the pump is what survived venting, over the liquid plus what survived. A separator moves the second and never touches the first.

| Case | Separator efficiency | Stream GVF | Through the pump |
| --- | --- | --- | --- |
| gassyOffshore, published | 0.7000 | 0.0975609756 | 0.0314136126 |
| highWaterCut, published | 0.0000 | 0.0035135663 | 0.0035135663 |
| QUA-IBOE-4, teaching | 0.4500 | 0.2587677725 | 0.1610792254 |

On the published golden design highWaterCut the two are identical, because nothing was vented. On gassyOffshore, 201.600000 bbl/d of the 288.000000 bbl/d goes up the annulus and 86.400000 bbl/d arrives at the impellers.

## The two published thresholds

The defaults are a standard maximum of 0.10 and a handler maximum of 0.25. Below the first, a standard pump swallows the gas. Between the two, a gas handler is normal practice. Above the second, a separator or a different lift method is called for. Both are configurable inputs, so a user with vendor limits sets their own. They are ordinary operating guidance, which is why they are exposed and not buried.

## Which fraction is compared

The one through the pump, always. The published golden design gassyOffshore makes the point on its own: its stream fraction is 0.0975609756, close enough to 0.10 to be uncomfortable, while the pump sees 0.0314136126 and the verdict is standard.

The teaching well QUA-IBOE-4, which is not a published case, exists because both published designs come back standard. Its stream fraction of 0.2587677725 sits above 0.25 and would read as separatorRequired. Its pump sees 0.1610792254 and the verdict is gasHandler. Reading the wrong fraction here does not shade an answer, it buys different equipment.

## The mistake

Applying the separator twice. It is tempting to take the vented gas out, get 0.1610792254, and then also treat the stream fraction as the thing a gas handler must cope with. The venting is already in the number. The gas volume fraction through the pump is the complete statement of what the impellers see, and the stream fraction has no consumer at all past the point the separator is applied.

## What it refuses

The verdict is not a correlation. It names a class of equipment and stops. No gas handler performance is modelled, no separator efficiency is predicted, and nothing about a pump degrades in the arithmetic when the fraction rises: the head, the efficiency and the power per stage are read off the stage curve at the mixture rate exactly as they would be for a single phase liquid. The separator efficiency itself is a vendor or measured number that the module accepts and never questions.

## Exercise

Read the two gas volume fractions for all three cases in the panel and record which threshold each of the six numbers falls between.

Then say what QUA-IBOE-4 would be specified as on each of its two fractions, and which of the two answers is the one the module returns.
