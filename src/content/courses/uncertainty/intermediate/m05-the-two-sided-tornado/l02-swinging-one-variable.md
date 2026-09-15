# Swinging one variable

Each tornado bar holds two inputs at their medians and moves the third to the 10th percentile and then to the 90th percentile in its beliefs. The bar's two ends are the breakevens at those two settings, measured from the base.

{{panel:ec-breakeven-explorer}}

## Three bars on ISIALA

| rank | variable | low side | high side | swing |
| --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 |
| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 |
| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 |

For capex, 150 million USD gives a low side of -7.0202 from the base breakeven of 71.6277 USD per bbl, 220 gives a high side of 9.4067, and the swing, high side minus low side, is 16.4269.

## Why the bars lean up

On all three bars the high side is the longer, and the beliefs are why. Capex's 90th percentile of 220 sits further from its median of 180 than its 10th percentile of 150 does, and opex's 26 and 16 around a median of 20 lean the same way. For efficiency the high side comes from the 10th percentile, 85 percent.

## The percentiles and the fitted ends

Capex's fitted triangle runs from 127.2260 to 252.3607, and neither end enters the chart. The fitted minimum and maximum exist only to pass a triangle through three points. Swinging to them would stretch every bar.

## One belief behind both ends

Replace ISIALA's opex belief with the narrow one, 16 / 17 / 26, whose median sits too near its 10th percentile for any triangle to honour. The fit clamps, and the run reports the opex beliefs it used, 16.0000 / 19.8197 / 26.0000, fitted. The base moves to 71.3621 and the opex bar reads a low side of -5.5922 and a high side of 9.1387, ends and base alike standing on one triangle. Before the 2026-09-15 repair the base was solved at the stated median of 17 while the ends came from the fitted triangle, and the bar printed -1.4602 and 13.2707: a lopsidedness that belonged to the mismatch.

## When a side is missing

On the published mc_with_unreachable case the base breakeven is 498.0372, just short of the 500 USD per bbl bracket top, and no variable reaches a breakeven at its adverse end. The low sides read -80.7218, -6.7689 and -26.2125, every high side reads null, and every bar carries `unreachable` true, which sorts it to the top of the chart. Before the 2026-09-15 repair those ends were drawn at 0.0000 and the bar sorted last, which is finding B1: a zero looked exactly like a variable that does not matter.

## What one variable at a time refuses

It refuses interaction: no bar moves capex and opex together. It refuses probability too: each end is a breakeven at one stated percentile, never a percentile of the sample.

## The mistake

The careful mistake is treating the bar as symmetric and quoting half the swing as a plus or minus. Half of 16.4269 each way puts the low end too low and the high end too short, on a bar whose message is that the overrun hurts more than the saving helps.

## Exercise

Write ISIALA's capex bar: its low side, high side and swing, and the stated capex belief each end came from. Then write the opex beliefs the narrow 16 / 17 / 26 produces and the bar that comes out of them, and say why a null high side on mc_with_unreachable does not mean the variable is unimportant.
