# Three numbers you believe

The Probabilistic Breakeven Analyzer does not ask for a best guess. It asks for three stated percentiles of each uncertain input, and every price it later reports is only as honest as the reading of those three.

{{panel:ec-breakeven-explorer}}

## What ISIALA's engineer states

ISIALA carries three uncertain inputs, each written as a 10th percentile, a median and a 90th percentile:

| variable | stated 10th / 50th / 90th |
| --- | --- |
| capex, million USD | 150 / 180 / 220 |
| opex, million USD a year | 16 / 20 / 26 |
| efficiency, percent | 85 / 91 / 96 |

A 10th percentile of 150 million USD says one outcome in ten comes in cheaper than 150. The median of 180 says half do. The 90th percentile of 220 says nine in ten come in under 220, which leaves one in ten above it. Efficiency reads the same way: a tenth of outcomes produce less than 85 percent of the profile, and a tenth more than 96 percent.

None of the three is the smallest or largest thing that can happen, and a belief of 150 / 180 / 220 already promises that a fifth of all outcomes fall outside it.

## What the engine does with them

`fitTriangularToPercentiles` turns each belief into a triangular distribution whose cumulative curve passes through all three stated points:

| variable | min | mode | max | exact |
| --- | --- | --- | --- | --- |
| capex | 127.2260 | 168.6738 | 252.3607 | true |
| opex | 13.3201 | 17.4160 | 30.8541 | true |
| efficiency | 80.1459 | 92.0352 | 99.9640 | true |

The fitted capex runs from 127.2260 to 252.3607, well outside 150 and 220, because that is what it takes for a tenth of the draws to land beyond each stated percentile. The flag `exact` reads true for all three: each triangle honours its belief exactly.

The beliefs travel under the engine keys `p10`, `p50` and `p90`. Those keys are plain percentiles of the parameter and carry no P-label meaning. A screen that prints one says "10th percentile of capex".

## What it refuses to do

The Analyzer treats three inputs as uncertain and nothing else. The production profile keeps ISIALA's volumes and only efficiency scales them. Royalty stays at 15 percent, tax at 35 percent and the discount rate at 12 percent. The price is what it solves for, never what it samples. It fits a triangular and no other shape. It treats capex, opex and efficiency as independent, so a belief that expensive wells come with expensive operations has nowhere to go. And nothing in the fit caps efficiency at 100 percent: ISIALA's fitted maximum of 99.9640 stays under it only because its belief does.

## The mistake

The careful mistake is to call 220 million USD the high case and 150 the low case, then carry both into a report as the edges of the range. A capex of 220 is no ceiling. A tenth of outcomes exceed it, and on ISIALA's fit they run as far as 252.3607. The second mistake is reading the key `p90` aloud as a P-label. Under the exceedance meaning a P-label belongs to an outcome where more is better, and capex is an input where more is worse. It takes the words "90th percentile" and nothing else.

## Exercise

For ISIALA's opex belief, state in words what 16, 20 and 26 each claim about the fraction of outcomes. Give the fitted opex minimum and maximum, and say what fraction of outcomes the belief places above 26. Then name two relationships between the three inputs that the Analyzer cannot represent.
