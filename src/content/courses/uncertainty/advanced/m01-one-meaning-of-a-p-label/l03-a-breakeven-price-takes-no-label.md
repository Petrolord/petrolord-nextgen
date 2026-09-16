# A breakeven price takes no label

For a breakeven price, more is worse. So the Suite describes it in percentile words and never gives it a P-label.

{{panel:ec-risk-explorer}}

## Why exceedance flips

The definition sentence says a P90 is met or exceeded with 90 percent probability. On an NPV that value is the cautious one. On a breakeven price it is not. The price that 90 percent of iterations meet or exceed is a low price, and a low breakeven is the comfortable end. Under exceedance, that label would name the good news. A reader trained to see P90 as the cautious case would read it as the bad news. One label would carry two opposite readings, so the convention drops the label.

## ISIALA's breakeven in its own words

The Probabilistic Breakeven Analyzer runs 5000 iterations at seed 20260829 and excludes none:

| statistic | sorted index (derived, min(n - 1, floor(q n))) | breakeven price, USD per bbl |
| --- | --- | --- |
| 10th percentile of breakeven price | 500 | 62.1713 |
| 50th percentile of breakeven price | 2500 | 73.3297 |
| 90th percentile of breakeven price | 4500 | 85.5912 |
| mean | all | 73.6242 |
| base case at the beliefs' medians | none | 71.6277 |

The engine's own insight sentence uses the same words: "The median breakeven oil price is 73.33 per barrel, and its 90th percentile is 85.59: a 90 percent chance the breakeven price is below that."

The 90th percentile, 85.5912 USD per bbl, is the price that 90 percent of iterations break even below.

## The keys are percentiles

The engine returns these values under the keys `p10`, `p50` and `p90`. Here keys and words agree, because each key is a plain percentile of the price. The only error left is reading a key aloud as a label.

## One label, two prices

Imagine a report that puts the exceedance label for 90 percent on ISIALA's breakeven. Read with the definition, that label points at 62.1713. Read with the arithmetic habit, it points at 85.5912. Those are the two ends of the band, and nothing on the page says which one the author meant. Percentile words have no such gap: 10th percentile of breakeven price means 62.1713 to every reader.

## The mistake

The careful mistake is carrying cases across from the NPV. A Low case NPV and a high breakeven price both describe a poor project. It is tempting to give 85.5912 the Low case NPV's label because the two seem to go together. They do not. They come from different engines and different samples. The breakeven engine draws fitted triangulars for capex, opex and efficiency, and it puts all capex in year 1. The Scenario Builder draws uniform ranges on price, capex and reserves. No iteration links 85.5912 to 15.6063, and a shared label would invent a link.

## What the price refuses

The breakeven distribution leaves out any iteration that cannot break even below the 500 USD per bbl top of its bracket. It excludes those iterations and counts them, and ISIALA has none. It also has no correlation between its three variables. The base case, 71.6277, is a single solve at the beliefs' medians, which for ISIALA are the stated ones, and it is not a percentile of the sample.

## Exercise

Give ISIALA's three breakeven percentiles in percentile words, with their sorted indices, and quote the engine's insight sentence. Then say which of 62.1713 and 85.5912 the exceedance label for 90 percent would name, and why that is the reason the label is refused.
