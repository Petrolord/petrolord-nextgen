# Swinging one variable

Each tornado bar holds two inputs at their medians and moves the third to its stated 10th percentile and then to its 90th percentile. The bar's two ends are the breakevens at those two settings, measured from the base.

{{panel:ec-breakeven-explorer}}

## Three bars on ISIALA

| rank | variable | low side | high side | swing |
| --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 |
| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 |
| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 |

For capex, 150 million USD gives a low side of -7.0202 from the base breakeven of 71.6277 USD per bbl, 220 gives a high side of 9.4067, and the swing, high side minus low side, is 16.4269.

## Why the bars lean up

On all three bars the high side is the longer, and the beliefs are why. Capex's 90th percentile of 220 sits further from its median of 180 than its 10th percentile of 150 does, and opex's 26 and 16 around a median of 20 lean the same way. For efficiency the high side comes from the 10th percentile, 85 percent, which sits further from its median of 91 than the 90th percentile of 96.

## The stated percentiles and the fitted ends

Capex's fitted triangle runs from 127.2260 to 252.3607, and neither end enters the chart. The fitted minimum and maximum exist only to pass a triangle through three points; the stated 10th and 90th percentiles are the belief. Swinging to the fitted ends would stretch every bar.

## A lopsided belief gives a lopsided bar

Replace ISIALA's opex belief with the narrow one, 16 / 17 / 26, whose median sits just past its 10th percentile. The base moves to 67.2301, and the opex bar reads a low side of -1.4602 and a high side of 13.2707. A step down to 16 barely moves the price, and the reach up to 26 moves it a great deal.

## When a side is missing

On the published mc_with_unreachable case the base breakeven is 498.0372, just short of the 500 USD per bbl bracket top. The low sides read -80.7218, -6.7689 and -26.2125, and every high side reads 0.0000. That is finding B1: a side that was never placed prints as a zero, and a zero looks exactly like a variable that does not matter.

## What one variable at a time refuses

It refuses interaction: no bar moves capex and opex together. It refuses probability too: each end is a breakeven at one stated percentile, never a percentile of the sample.

## The mistake

The careful mistake is treating the bar as symmetric and quoting half the swing as a plus or minus. Half of 16.4269 each way puts the low end too low and the high end too short, on a bar whose message is that the overrun hurts more than the saving helps.

## Exercise

Write ISIALA's capex bar: its low side, high side and swing, and the stated capex belief each end came from. Then explain why the opex bar on the narrow belief 16 / 17 / 26 has a high side so much longer than its low side, and why a 0.0000 high side on mc_with_unreachable does not mean the variable is unimportant.
