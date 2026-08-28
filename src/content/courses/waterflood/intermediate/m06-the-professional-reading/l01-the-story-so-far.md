# The story so far

The Associate tier established that the Ekene flood replaces its voidage. This tier asked where the water goes, and got four answers, three of which are uncomfortable.

## The split

On an allocation matrix built from well distances and rounded to 0.05, with row sums of 0.90 and 0.85:

$$\text{field } 1.034899536109 \;=\; \text{North } 1.2024353717815623 \;\text{and}\; \text{South } 0.6097477559533482$$

The two elements produce almost identical voidage, 112596.66438357021 rb against 109139.77242556904 rb, and receive 135390.21199942206 rb against 66547.73132174983 rb of injection. Fifty nine percent of the water goes to half the production and twenty nine percent to the other half, with twelve percent out of zone.

The North element has been in surplus since the first month of record, so its fill-up marker reports `startedAbove: true`. The South element has never reached a cumulative VRR of 1.0 at any point, so its marker is null, and its cumulative deficit stands at 42592.04110381921 reservoir barrels.

## The correction

At the field target of 1.05, the two elements converge on nearly the same injection rate, 2810.2915494395775 and 2817.2043370935 barrels per period, because they produce nearly the same voidage. Reaching that costs a 15.358338556978579 percent cut in the north and a 72.6255853400599 percent increase in the south, netting to a 13.636363636363624 percent increase in total allocated injection.

Most of the correction is redistribution rather than volume, which is the general reason pattern analysis pays for itself.

## The injectivity finding

Ekene-4 lost thirty percent of its injectivity index on 2025-01-01, from 0.5 to 0.35 barrels per day per psi, and kept hitting its volume target by pushing harder. The volume ledger shows nothing at all.

The Hall plot on pressure above the 2050 psia reference recovers the planted parameter exactly: slopes of 2.0000000000000013 and 2.857142857142859, a ratio of 1.4285714285714286, and one alert raised.

The Hall plot on absolute wellhead pressure gives a ratio of 1.0669369155108472, below the 1.2 threshold, and raises nothing. Same data, same engine, same well, and the pressure convention decides whether a thirty percent degradation is visible.

That matters for the correction above, because the South element's increase falls mainly on Ekene-4, which is the degraded well.

## The water arrival finding

Both wet producers classify as channelling: Ekene-6 at a late-time slope of 2.348281726147951 and Ekene-3 at 1.6028659409443355, against a threshold of 0.4. Two producers return nothing at all, and the two absences mean opposite things: Ekene-5 has never made water because it is barely flooded, and Ekene-1 has only six wet months, not enough to classify.

The classifications should be held loosely. The fixture's water histories are designed ramps, and a rising ramp read on its rising limb produces a steep derivative whether or not a channel exists.

## The negative result

The injector-producer lag table is the most instructive failure in the course. It reports lags in rows and calls them days, so monthly data yields months labelled as days. It returns the same lag and the same correlation to fifteen digits for both injectors against every producer, because the fixed 0.6 to 0.4 split makes the two injection series exact scalar multiples and correlation is scale invariant. And its lag values come out about half the planted response times.

It gets the ORDERING of response times right. That is all it gets right, and no amount of additional data would fix the injector attribution, because the information is not in the data.

## What all of this is conditional on

Every pattern number rests on eight allocation fractions that came from a map and a judgement call. Every conclusion in this tier should carry that condition explicitly. The Hall and Chan findings do not depend on the allocation, which makes them the more robust half of the tier.

## Exercise

First, sort the five findings above by how much they depend on the allocation matrix, from most to least, and say for each what evidence would strengthen it.

Second, write the six-sentence executive summary of this tier's work on Ekene, with one sentence per finding and one for the caveat.
