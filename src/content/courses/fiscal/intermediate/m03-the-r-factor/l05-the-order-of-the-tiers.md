# The order of the tiers

The walk keeps the LAST tier in list order whose threshold has been reached. That is the same thing as the highest threshold reached only while the list is sorted, and nothing in the engine checks that it is.

{{panel:ec-instrument-explorer}}

## What the walk actually does

`getTieredSplit` sets the split to the first tier's split, then walks the tier list from start to end. Every tier whose threshold the R factor has reached overwrites the split. It never compares one qualifying tier against another, so what survives the walk is whichever qualifying tier came last in the list, not whichever carried the highest threshold. `getSlidingScaleRoyalty` walks price tiers the same way.

On a sorted list the two rules agree. Every shipped template is sorted, ascending in threshold and descending in contractor split:

| template | tranche 1 | tranche 2 | tranche 3 |
| --- | --- | --- | --- |
| Nigeria - PIA (2021) | R 1 to 60 percent | R 1.6 to 40 percent | R 2.5 to 30 percent |
| Ghana - Deepwater | R 1 to 70 percent | R 1.25 to 50 percent | R 2 to 35 percent |
| Angola - Deepwater PSC | R 1 to 70 percent | R 1.5 to 50 percent | R 2 to 30 percent |

So nothing is wrong today, and the Designer's defaults are sorted too.

## Where it would go wrong

Take the PIA tranches on the Designer's default project. In year 11 the R factor is 2.581420, which has reached all three thresholds. The list ends on the 2.5 tier, so 0.300000 is what the walk keeps, and the implied split in that row reads 0.300000. Put the same three tranches in a different order and the walk would keep whichever of them appeared last, so 0.600000 or 0.400000 would be charged on that year's 80.0217 million USD of profit oil. No error is raised and every other column looks exactly as it should.

The initialisation carries the same exposure. The split before any threshold is reached is the first tier's split, which is why year 1 at an R factor of 0.512217 reads 0.600000. Reorder the list and the pre threshold default changes with it.

## The mistake

The error is to read a tier list as a set. It is a sequence, and its order is load bearing. A reader who checks that the thresholds and rates are right, without checking that the thresholds ascend, has verified the values and not the instrument. The symptom is quiet: a lifetime total that is plausible, a ledger with no zeros or negatives out of place, and a split that is simply the wrong one from the right list.

## What it refuses

The engine does not sort the list at load, does not validate that thresholds ascend, does not reject duplicate thresholds, and does not warn when a later tier carries a higher split than an earlier one. No gate in the app checks the order. Checking it is the reader's job, and it takes one glance at the threshold column.

## Exercise

State the rule the walk applies and the rule a reader assumes, and say when the two agree. Then name the year 11 R factor on the default project under the PIA tranches, the split it selects, and which tier would be selected instead if the 2.5 tranche were listed first.
