# The order of the tiers

A tranche is selected by its threshold, read off a sorted copy of the list, so the order the tranches were typed in cannot change the answer. A published case proves it.

{{panel:ec-instrument-explorer}}

## What the selection actually does

`getTieredSplit` sorts a copy of the tranche list by threshold, then keeps the split of the highest threshold the R factor has reached. Where the ratio has reached no threshold at all it keeps the lowest tranche's split. Two tranches sharing one threshold are refused by name rather than resolved quietly.

The two templates that split on the R factor, and this course's tiered teaching regime, are written sorted already, ascending in threshold and descending in contractor split:

| regime | tranche 1 | tranche 2 | tranche 3 |
| --- | --- | --- | --- |
| Tiered teaching regime | R 1 to 60 percent | R 1.6 to 40 percent | R 2.5 to 30 percent |
| Ghana - Deepwater | R 1 to 70 percent | R 1.25 to 50 percent | R 2 to 35 percent |
| Angola - Deepwater PSC | R 1 to 70 percent | R 1.5 to 50 percent | R 2 to 30 percent |

The "Nigeria - PIA (2021)" template has no R factor tranches. Its bands are cumulative crude production at the start of the year, with the government's minimum share of profit oil rising from 5 to 45 percent.

Take the tiered teaching regime's tranches on the Designer's default project. In year 11 the R factor is 2.581420, which has reached all three thresholds, so the highest of them is 2.5 and 0.300000 is the split on that year's 80.0217 million USD of profit oil. Type the same three tranches in any other order and the row is unchanged.

## A rule that reads the list in order

There is another rule a model could apply: walk the list in the order it was typed and keep the last tranche whose threshold has been reached. That matches the highest threshold only while the list is sorted. On an unsorted list it selects the wrong split in silence. The engine does not use it.

`tiers_unsorted_selected_by_threshold` is the published case that pins the rule the engine does use. It types the tiered teaching regime's tranches out of order, the royalty tier keyed at 50 USD/bbl before the one keyed at 0 and the splits at 2.5, then 1.0, then 1.6. Every row equals the sorted case, closing at contractor net cash flow of 279.5803 million USD, government cash flow of 1174.9793, tax of 136.4182 and an NPV of 168.2190 at 10 percent. A list-order walk on that same regime would charge 7.5 percent royalty at 80 USD per bbl and hand back a 40 percent split once the ratio passed 2.5.

## The mistake

The first error is reading a tier list as a sequence whose order is load bearing. It is a set of thresholds, and the engine reads it as one. The second error is quieter. A repeated threshold stops the run with the threshold named in the refusal, so a plausible regime produces no ledger. Read that message rather than nudging a rate until the run completes.

## What it refuses

The engine will not choose between two tranches at one threshold and interpolates nothing between them. It does not ratchet and keeps no memory of the highest tranche reached, so a ratio that falls back below a threshold returns the split above it.

## Exercise

State the rule the selection applies and the list-order rule it differs from, and say when the two agree. Then name the year 11 R factor on the default project under the tiered teaching regime's tranches and the split it selects, and say what the published unsorted case shows.
