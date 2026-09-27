# Size caps and refusals

{{panel:materials-spares-calculator}}

The engine holds twelve figures of its own, and none of them is a policy. One is its tie convention, two govern the criticality weights, and nine are caps: the largest call it will accept. This lesson reads the caps, the refusals that enforce them and one courtesy the engine extends when it prints a limit.

## The caps

| cap | value | what it limits |
| --- | --- | --- |
| MAX_ITEMS | 5000 | items in one criticality, ABC or slow-moving call |
| MAX_CRITERIA | 20 | criteria in one criticality call |
| MAX_CLASSES | 10 | criticality classes in one call |
| MAX_BREAKS | 20 | price bands in one quantity discount call |
| MAX_BANDS | 10 | slow-moving bands in one call |
| MAX_DECIMALS | 6 | decimals a safety factor may be read to |
| MAX_ITERATIONS | 200000 | Monte Carlo draws in one lead-time risk call |
| MAX_POISSON_MEAN | 500 | the Poisson mean of one call |
| MAX_SPARES | 1000 | the largest search limit for insurance spares |

Each is refused by name with the cap in the message. An ABC call with 5001 items is refused, verbatim:

> items has 5001 entries; the cap is 5000

A call with exactly 5000 items is accepted and ranked.

## A cap on a mean

Two caps bind a mean, and the engine refuses the input that would push the mean over, telling you the largest value it accepts. For insurance spares, the mean orders outstanding may not pass 500, verbatim:

> leadTimeDays must be at most 260.714285 (rounded down at the sixth decimal so that it is accepted) so that the mean number of orders outstanding is at most 500; got 365

## A printed limit is accepted when typed back

Where the largest accepted value has more than six decimals, the engine prints it rounded toward the accepted side and says so. At a demand of 3 a period, a Poisson lead time of 170 is refused, verbatim:

> leadTime must be at most 166.666666 (rounded down at the sixth decimal so that it is accepted) so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 170

Type 166.666666 back, and the engine accepts it and returns a level of 500. A limit the engine prints is one a learner can use.

## Why caps, and what lies beyond them

A cap keeps a call finite and its figures meaningful. Above a Poisson mean of 500, demand over the protection period is large enough for the normal safety stock of the Professional tier, and the refusal says so in its own words.

## Exercise

Open the spares calculator on the view "A slow-moving spare on Poisson demand" and start from "The PSV kits on the Ekene register". Set "Demand rate a period (stated)" to 3, "Lead time, periods (stated)" to 170 and "Service level (stated)" to 0.5, and compare the refusal with the quotation above. Set the lead time to 166.666666 and read the level. Then switch to the view "Insurance spares", start from "The ESP motor on the Ekene register", set "Search limit, the most spares (stated)" to 1001, and read which cap the refusal names.
