# The weighted average

A curve of six measures can be summarised by one cost per tonne, and there are two ways to take it. The lab prints the one the engine returns, the weighted average, and computes the other, the plain mean, marked computed here. Every AGBOR figure here is invented for this course, and the money is in US dollars.

{{panel:carbon-abatement-explorer}}

## The engine's figure

| output | value |
| --- | --- |
| totalAbatementTonnes | 15460.000 |
| netAnnualCostOfAll USD | 290443.84 |
| weightedAverageCostPerTonne USD | 18.7868 |

The course defines it: the weighted average is the net annual cost of all the measures over the total tonnes. So 290443.84 USD a year over 15460.000 t a year is 18.7868 USD a tonne.

## Where the net annual cost of all comes from

Each measure's net annual cost is printed in the lab: -127251.65, -179904.83, -48447.11, 484221.51, 96300.31 and 65525.62 USD. The net annual cost of all is their sum. This lesson carries a rounding note on it: the six figures as printed sum to 290443.85 USD, and the engine sums the net annual costs it holds to four decimals, which gives 290443.84 USD. Quote 290443.84 USD, which is the engine's figure. The one-cent difference is rounding in the printed rows.

## The plain mean, computed here

The lab also computes the plain mean of the six costs per tonne: -29.7913 USD. The course prints it with one clause: "which weights a small measure the same as a large one." Tune the fired heaters counts once at -167.4364 USD a tonne on its 760.000 t, and Flare gas recovery counts once at 78.1002 USD a tonne on its 6200.000 t.

The two summaries carry different signs. The weighted average is 18.7868 USD a tonne and the plain mean is -29.7913 USD a tonne. The plain mean is computed here by the lab, and no engine output in the curve carries it.

## Why the weights are tonnes

A tonne from Flare gas recovery and a tonne from Tune the fired heaters are each one tonne. The weighted average treats them so: each measure's cost counts in proportion to its tonnes, because the average is built from money over tonnes.

## What the average does not say

The weighted average is a summary. It does not say that every tonne costs 18.7868 USD. The first three steps print costs below zero, and the last three print costs above it. It also rests on the total 15460.000 t, and the lab prints additive false for this curve: two measures act on the same source, and the interaction note calls the cumulative curve an upper bound. Module three reads that note.

## Where the sum comes from, measure by measure

Of the six net annual costs, three are negative and three positive, and the net annual cost of all is what is left when they are added: 290443.84 USD a year. The three measures that pay for themselves bring the sum down, and the three that do not bring it up. The weighted average of 18.7868 USD a tonne is that sum spread over every tonne on the axis.

## Exercise

Read netAnnualCostOfAll, totalAbatementTonnes, weightedAverageCostPerTonne and the plain mean the lab computes. Say what the weighted average and the plain mean, read together, show about how a small measure and a large measure count in each.
