# Sorting by swing

The tornado orders its bars by swing, the full width from low side to high side, with the widest at the top. That order ranks beliefs as much as it ranks inputs.

{{panel:ec-breakeven-explorer}}

## The ranking on ISIALA

| rank | variable | low side | high side | swing |
| --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 |
| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 |
| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 |

The engine insight names the top two: "Breakeven is most sensitive to Total CAPEX and Annual OPEX." On ISIALA the order would survive a sort by either side alone, because capex has both the largest low side, -7.0202, and the largest high side, 9.4067.

## When the sides disagree

They need not agree. With the narrow opex belief 16 / 17 / 26 the bars become Total CAPEX -7.0493 and 9.4442, Annual OPEX -1.4602 and 13.2707, and Prod. Efficiency -3.5016 and 4.7457. Sort by high side and opex leads. Sort by low side and opex trails both capex and efficiency. The swing folds both directions into one width.

## A ranking of beliefs

The swing measures how far the stated 10th and 90th percentiles move the price. Widen a belief and its bar grows with the project unchanged. Opex ranks second on ISIALA because 16 / 20 / 26 million USD a year is a wide belief about a cost charged in every year. Capex ranks first on 150 / 180 / 220 million USD spent once. A narrower capex belief would move capex down the chart without making the project any less exposed to capex.

## The same field, another chart

The screening engine's sensitivity on ISIALA ranks differently. It scales each input by 0.7 and 1.3 around an NPV of 81.0464 million USD:

| input | NPV at 0.7 | NPV at 1.3 | swing, high minus low |
| --- | --- | --- | --- |
| Oil Price | -17.3893 | 175.8952 | 193.2845 |
| CAPEX | 126.2382 | 32.7547 | -93.4835 |
| OPEX | 85.3696 | 76.7233 | -8.6463 |

There OPEX is the smallest bar, because it scales fixed opex only, 2.5 million USD a year, and leaves variable opex untouched. On the breakeven tornado opex is the whole 20 million USD a year. Different cases, different quantities, different scaling rules: neither ranking carries across.

## What the ranking refuses

It has no price bar, because price is what the breakeven solves for, no interaction between bars, and no probability: rank 1 is only the widest bar at single stated percentiles.

## The mistake

The careful mistake is reading rank as importance to the decision. Rank 1 answers one question only: which stated belief, swung end to end with the others held, moves the breakeven furthest. Tighten the widest belief on paper and its bar shrinks, whether or not the cost became any more certain.

## Exercise

Write ISIALA's three bars in rank order with their swings. On the narrow opex belief, say which variable leads a sort by high side and which trails a sort by low side. Then give one reason the screening sensitivity makes OPEX its smallest bar while the breakeven tornado ranks opex second.
