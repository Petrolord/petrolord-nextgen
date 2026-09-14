# Efficiency runs backwards

Capex and opex raise the breakeven as they rise. Efficiency lowers it, so its tornado bar is built from the opposite ends of its belief, and a reader who labels the bar by habit reads it backwards.

{{panel:ec-breakeven-explorer}}

## The bar and where its ends come from

| variable | stated 10th / 50th / 90th | low side | high side | swing |
| --- | --- | --- | --- | --- |
| Total CAPEX | 150 / 180 / 220 | -7.0202 | 9.4067 | 16.4269 |
| Annual OPEX | 16 / 20 / 26 | -5.8578 | 8.8730 | 14.7308 |
| Prod. Efficiency | 85 / 91 / 96 | -3.7306 | 5.0561 | 8.7867 |

For capex and opex the low side comes from the 10th percentile and the high side from the 90th percentile. Efficiency runs backwards: its low-price end comes from the 90th percentile efficiency, 96 percent, and its high-price end from the 10th percentile, 85 percent.

## Why efficiency runs the other way

Efficiency scales the barrels. The price at which a year's tax switches on is (opex + capex expensed that year) / ((1 - royalty) x volume x efficiency) x 1e6, with efficiency in the denominator beside the volume. More efficiency puts more barrels under the same cost, so a lower price does the job. Capex and opex sit in the numerator and push the other way.

The published solve cases show both directions on one base case of capex 1000, opex 60 and efficiency 0.9, which breaks even at 175.1500. Capex 1300 raises the breakeven to 215.5109, opex 75 raises it to 185.3034, and efficiency 0.95 lowers it to 165.9316.

## Low side and high side describe the price

The two side names belong to the output. The low side is the end that lowers the breakeven, whatever input value made it: the cheaper capex on the capex bar, the better efficiency on the efficiency bar. Neither name says which percentile stands behind it.

## The sampled triangle agrees

Efficiency's fitted triangle is 80.1459 / 92.0352 / 99.9640, with the mode at 0.599919 of the range, leaning the opposite way to capex at 0.331225 and opex at 0.233597. Iteration 1 drew 0.952306 for it, in the upper branch, an efficiency of 97.2265 percent that pulls that breakeven down.

## What the bar refuses

It refuses to say which way operations will surprise. A shorter bar, 8.7867 against 16.4269 for capex, says only that the stated efficiency belief moves the price less. It also holds capex at 180 and opex at 20 while efficiency moves, so an efficiency shortfall that arrives with extra opex is nowhere on the chart.

## The mistake

The careful mistake is writing "the 90th percentile case" beside the high side of every bar. On the efficiency bar the high side, 5.0561, is the 10th percentile of efficiency, 85 percent. Carried into a sanction note, that label says the breakeven rises when the wells perform well. Name the input value beside each end, every time, and let the side name describe only the price.

## Exercise

For ISIALA's efficiency bar, write the low side and the high side and the efficiency each came from, in percentile words. Then use the published solve cases to show one input that raises the breakeven and one that lowers it, and say where efficiency sits in the price at which a year's tax switches on.
