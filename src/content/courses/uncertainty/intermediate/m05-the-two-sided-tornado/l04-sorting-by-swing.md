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

## When an open bar decides the order

A bar with an end that has no breakeven below 500 USD per bbl is placed before any swing is compared. On the published mc_one_bar_unreachable case only Total CAPEX has such an end, so its high side reads null, its `unreachable` flag reads true, and it sorts first, ahead of Prod. Efficiency at -20.6267 and 23.0534 and Annual OPEX at -6.7689 and 10.1534. Before the 2026-09-15 repair the missing end was drawn at 0, so that bar read -53.8145 and 0.0000, its swing looked modest, and it sorted last under both complete bars. That is finding B1: the bar the run knew least about sat at the bottom of the chart.

## A ranking of beliefs

The swing measures how far the stated 10th and 90th percentiles move the price. Widen a belief and its bar grows with the project unchanged. Opex ranks second on ISIALA because 16 / 20 / 26 million USD a year is a wide belief about a cost charged in every year. Capex ranks first on 150 / 180 / 220 million USD spent once.

## The same field, another chart

The screening engine's sensitivity on ISIALA ranks differently. It scales each input by 0.7 and 1.3 around an NPV of 81.0464 million USD:

| input | NPV at 0.7 | NPV at 1.3 | swing, high minus low |
| --- | --- | --- | --- |
| Oil Price | -17.3893 | 175.8952 | 193.2845 |
| CAPEX | 126.2382 | 32.7547 | -93.4835 |
| OPEX | 85.3696 | 76.7233 | -8.6463 |
| Production | 4.1176 | 156.4596 | 152.3420 |

There OPEX is the smallest bar, because it scales fixed opex only, 2.5 million USD a year, and leaves variable opex untouched. Production scales the barrels and the variable opex those barrels carry, which is why its bar reads 4.1176 at 0.7 against 156.4596 at 1.3. On the breakeven tornado opex is the whole 20 million USD a year. Different cases, different quantities, different scaling rules: neither ranking carries across.

## What the ranking refuses

It has no price bar, because price is what the breakeven solves for, no interaction between bars, and no probability: rank 1 is only the widest bar at single stated percentiles.

## The mistake

The careful mistake is reading rank as importance to the decision. Rank 1 answers one question only: which stated belief, swung end to end with the others held, moves the breakeven furthest. Tighten the widest belief on paper and its bar shrinks, whether or not the cost became any more certain.

## Exercise

Write ISIALA's three bars in rank order with their swings. On mc_one_bar_unreachable, name the bar that sorts first and the two readings that put it there. Then give one reason the screening sensitivity makes OPEX its smallest bar while the breakeven tornado ranks opex second.
