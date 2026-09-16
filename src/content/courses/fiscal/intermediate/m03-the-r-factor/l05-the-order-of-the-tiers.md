# The order of the tiers

A tranche is selected by its threshold, read off a sorted copy of the list, so the order the tranches were typed in cannot change the answer. That was not always true, and a published case proves it.

{{panel:ec-instrument-explorer}}

## What the selection actually does

`getTieredSplit` sorts a copy of the tranche list by threshold, then keeps the split of the highest threshold the R factor has reached. Where the ratio has reached no threshold at all it keeps the lowest tranche's split. Two tranches sharing one threshold are refused by name rather than resolved quietly. `getSlidingScaleRoyalty` reads price tiers the same way.

Every shipped template is written sorted already, ascending in threshold and descending in contractor split:

| template | tranche 1 | tranche 2 | tranche 3 |
| --- | --- | --- | --- |
| Nigeria - PIA (2021) | R 1 to 60 percent | R 1.6 to 40 percent | R 2.5 to 30 percent |
| Ghana - Deepwater | R 1 to 70 percent | R 1.25 to 50 percent | R 2 to 35 percent |
| Angola - Deepwater PSC | R 1 to 70 percent | R 1.5 to 50 percent | R 2 to 30 percent |

Take the PIA tranches on the Designer's default project. In year 11 the R factor is 2.581420, which has reached all three thresholds, so the highest of them is 2.5 and 0.300000 is the split on that year's 80.0217 million USD of profit oil. Type the same three tranches in any other order and the row is unchanged.

## What it used to do

Until the 2026-09-15 repair the list itself was the rule. The walk kept the last tranche in list order whose threshold had been reached, which matches the highest threshold only while the list is sorted, and an unsorted list selected the wrong split in silence.

`tiers_unsorted_selected_by_threshold` is the case built to pin the repair. It types the Nigeria PIA tranches out of order, the royalty tier keyed at 50 USD/bbl before the one keyed at 0 and the splits at 2.5, then 1.0, then 1.6. Every row equals the sorted case, closing at contractor net cash flow of 279.5803 million USD, government cash flow of 1174.9793, tax of 136.4182 and an NPV of 168.2190 at 10 percent. Under the retired rule that same regime would have charged 7.5 percent royalty at 80 USD per bbl and handed back a 40 percent split once the ratio passed 2.5.

## The mistake

The error to retire with the rule is reading a tier list as a sequence whose order is load bearing. It is a set of thresholds, and the engine reads it as one. The error that replaces it is quieter. A repeated threshold now stops the run instead of silently picking, so a regime that once produced a plausible ledger produces a refusal with the threshold named in it. Read that message rather than nudging a rate until the run completes.

## What it refuses

The engine will not choose between two tranches at one threshold and interpolates nothing between them. It does not ratchet and keeps no memory of the highest tranche reached, so a ratio that falls back below a threshold returns the split above it. And it keys a tranche on the R factor and on nothing else.

## Exercise

State the rule the selection applies and the rule it replaced, and say when the two agree. Then name the year 11 R factor on the default project under the PIA tranches and the split it selects, and say what the published unsorted case shows.
