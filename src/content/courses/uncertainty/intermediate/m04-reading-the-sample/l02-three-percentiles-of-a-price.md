# Three percentiles of a price

ISIALA's breakeven over 5000 seeded iterations reads 62.1713, 73.3297 and 85.5912 USD per bbl. Those are the 10th percentile, the median and the 90th percentile of a price, and they take no other name.

{{panel:ec-breakeven-explorer}}

## The three numbers

| statistic | breakeven price |
| --- | --- |
| 10th percentile of breakeven price | 62.1713 |
| 50th percentile of breakeven price | 73.3297 |
| 90th percentile of breakeven price | 85.5912 |
| base case at the stated medians | 71.6277 |

Each is a plain cumulative percentile. One iteration in ten broke even at or under 62.1713, half at or under 73.3297, nine in ten at or under 85.5912. The engine stores them under the keys `p10`, `p50` and `p90`, and the keys mean exactly that.

The engine writes its own reading of the run: "The median breakeven oil price is 73.33 per barrel, and its 90th percentile is 85.59: a 90 percent chance the breakeven price is below that."

## Why a breakeven takes no P-label

A P-label under the exceedance meaning states a 90 percent probability that the actual quantity meets or exceeds the value. That convention is built for outcomes where more is better, such as NPV, where the low case is the one you are fairly sure to beat. A breakeven price is a quantity where more is worse. Put an exceedance label on it and the sentence reverses: the price the breakeven stays under nine times in ten is 85.5912, and the price it meets or exceeds nine times in ten is 62.1713. So the insight, the panel and this course use percentile words only.

The inputs follow the same rule. A belief of capex 150 / 180 / 220 million USD is a 10th percentile, a median and a 90th percentile of capex.

## Which of the three to quote

The 90th percentile answers the question a sanction meeting usually asks: at what oil price is this project safe against most of what we believe about its costs? On ISIALA that is 85.5912 USD per bbl. The 10th percentile is the optimistic end, the price at which only the kindest tenth of the cost beliefs still break even. The median sits higher than the base case at the stated medians, 71.6277.

## What the three refuse to be

They are estimates from one sample. At the default seed, 100 iterations give 61.1861, 72.7058 and 86.3529, and 20000 iterations give 62.2724, 73.0302 and 85.4380. The seed pins the numbers without making them exact.

They carry no oil price uncertainty: price is what the engine solves for, and the spread comes from three independent draws.

Nor are they the breakevens at the input percentiles. Capex and opex at their 90th percentiles with efficiency at its 10th is one pessimistic corner, and three independent draws land beyond all three of those values together far less often than one iteration in ten.

## The mistake

The careful mistake is carrying the NPV convention onto a price because the NPV panel shows P-labels, and then quoting 62.1713 as the conservative breakeven. It is the least conservative of the three. The sentence to write is: the 90th percentile of ISIALA's breakeven price is 85.5912 USD per bbl.

## Exercise

Write ISIALA's three breakeven percentiles in percentile words, each with the engine key it is stored under in code font. Say which one a cautious reader quotes and why, and what a 90th percentile of 85.5912 USD per bbl means as a probability.
