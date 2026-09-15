# A sum of low cases

The oil column sums to 80.0000 MMbbl at P90, 130.0000 at P50 and 205.0000 at P10. The middle one is a reasonable field total. The outer two are not what their labels suggest.

{{panel:ec-plan-explorer}}

## What the engine actually adds

| fluid | unit | rows | sum of P90 | sum of P50 | sum of P10 |
| --- | --- | --- | --- | --- | --- |
| Oil | MMbbl | 2 | 80.0000 | 130.0000 | 205.0000 |
| Gas | Bcf | 1 | 40.0000 | 70.0000 | 110.0000 |

The oil P90 of 80.0000 MMbbl is 60.0000 from Egina Main plus 20.0000 from Egina Deep, and the oil P10 of 205.0000 MMbbl is 145.0000 plus 60.0000. Each column is summed within one fluid, and the engine says so in its own note: "Each column is the arithmetic sum of that column within one fluid. A sum of P90s is not the P90 of the sum: add low cases only if every reservoir disappoints together. Aggregate the distributions to get a portfolio P90."

## Why the low case is too low

P90 is the low case of a distribution: a volume the reservoir is likely to beat. Egina Main comes in at or above 60.0000 MMbbl most of the time, and Egina Deep at or above 20.0000 MMbbl. For the field to deliver only 80.0000 MMbbl, both have to go badly in the same world.

Two reservoirs disappointing together is less likely than either one disappointing alone, unless they share whatever causes the disappointment. So the true field low case, the volume the field itself is likely to beat, sits above 80.0000 MMbbl. The sum of the low cases is pessimistic by construction. The same logic runs the other way at the top: 205.0000 MMbbl requires both reservoirs to deliver their high cases at once, so the true field high case sits below it.

## When the sum is right

The condition is correlation. If both reservoirs are the same play, charged from the same kitchen and sharing one structural interpretation, they really may disappoint together, and the sum of the low cases is close to honest. Independent reservoirs pull the field distribution inwards. Perfectly correlated ones do not. The engine cannot know which EGINA is, so it adds the columns and says what it did.

## The middle column survives

The P50 of 130.0000 MMbbl is the one to lean on. A P50 is a median rather than a mean, so it is not perfectly additive either, but it is by far the best behaved of the three columns. The plan's headline reserves figure is 130.0000 MMbbl of oil and 70.0000 Bcf of gas, and it is the P50 for a reason.

## P-labels belong to reserves

P90 and P10 label a reserves distribution, one fluid at a time, and nothing else in the plan. There is no P90 capex, no P10 schedule, no P50 rate and no P90 of an index. A capex of 2250.0000 million USD carries its own uncertainty, and that uncertainty is not written in P-labels anywhere in this studio.

## The mistake

The mistake is writing 80.0000 MMbbl on a slide as the field low case and defending a decision with it. It is a sum of two low cases, too low unless the reservoirs fail together, and the fix is to aggregate the distributions rather than the percentiles.

## Exercise

Show which rows make up the oil P90 of 80.0000 MMbbl and the oil P10 of 205.0000 MMbbl. Then give the one condition under which 80.0000 MMbbl would be a fair field low case.
