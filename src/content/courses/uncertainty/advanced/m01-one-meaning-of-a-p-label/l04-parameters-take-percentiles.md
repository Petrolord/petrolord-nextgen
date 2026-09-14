# Parameters take percentiles

Every input to an economic model is described in percentile words: capex, opex, efficiency, price and reserves. A P-label on a parameter points the wrong way for half of them.

{{panel:ec-risk-explorer}}

## The direction depends on the parameter

The convention module picks a case's percentile from one fact: does more of the quantity help the outcome? More efficiency helps an NPV, so a low case takes the 10th percentile of efficiency. More capex hurts, so a low case takes the 90th percentile of capex. A P-label carries no direction. That is why the module never prints one on a parameter and writes "10th percentile of capex" instead.

## ISIALA's beliefs

The Breakeven Analyzer takes three stated percentiles for each variable. Its input fields are keyed `p10`, `p50` and `p90`, and each key is a plain percentile.

| variable | stated 10th / 50th / 90th | min | mode | max |
| --- | --- | --- | --- | --- |
| capex, million USD | 150 / 180 / 220 | 127.2260 | 168.6738 | 252.3607 |
| opex, million USD a year | 16 / 20 / 26 | 13.3201 | 17.4160 | 30.8541 |
| efficiency, percent | 85 / 91 / 96 | 80.1459 | 92.0352 | 99.9640 |

The fitted triangle passes back through what was stated. Read at 0.1, 0.5 and 0.9, the capex fit returns 150.0000, 180.0000 and 220.0000.

## The direction shows in the tornado

Capex and opex push the breakeven price up at their 90th percentiles. Efficiency runs the other way. The low-price end of its bar comes from the 90th percentile of efficiency, 96. The high-price end comes from the 10th, 85. Percentile words let a reader follow that without a rule. A label would force them to recall which convention the author used, and then which way efficiency points.

## The mistake

There are two common mistakes. The first is copying beliefs from a sheet that labels its inputs with P-labels. Under the exceedance meaning, the label for ninety names the 10th percentile, 150. Under the arithmetic habit it names the 90th percentile, 220. Enter the wrong one and the ends of the fit swap.

The second is reading three percentiles as minimum, mode and maximum. Do that with 150, 180 and 220, then read the triangle at 0.1, 0.5 and 0.9, and you get 164.4914, 182.5834 and 203.2668. The tails are gone.

## What a belief refuses

Three percentiles fix one triangle and nothing more. There is no correlation between capex and opex and no second mode. Some beliefs no triangle can honour. ISIALA's narrow opex belief, 16 / 17 / 26, has a shape ratio of 0.100000, outside the band from 0.381966 to 0.618034. The engine clamps it and says so.

The Scenario Builder's inputs are not percentiles at all. Plus or minus 20 percent is a uniform range with hard edges.

## Exercise

Write ISIALA's capex belief in percentile words, with its fitted minimum, mode and maximum and the three values the endpoints reading gives instead. Then say which end of the efficiency belief gives the low breakeven price, and why a P-label could not have told the reader.
