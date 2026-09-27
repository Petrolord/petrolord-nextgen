# Cover and excess

{{panel:materials-register-calculator}}

Months since the last issue catches stock nobody is using. It misses a second kind of trouble: stock that is used, but far too much of it. A bin that still sees a few units issued every month passes the first test, yet it may hold years of supply. The engine's second measure, cover, finds that.

## Cover in months

Cover is the stock on hand divided by the monthly usage: how many months the stock would last at the stated rate of use. The engine's basis states it with the Ekene limit, verbatim:

> bands active from 0 months (0%), slow from 12 months (25%), very slow from 24 months (50%), obsolete from 36 months (100%), a band reached at or above its minimum; cover = onHand / monthlyUsage, excess above 24 months; compared at 12 significant digits

The O-ring kit holds 400 kits and uses 5 a month, a cover of 80.000000 months. That is well beyond the Ekene cover limit of 24 months, so the item carries excess stock.

## The excess quantity

Excess is the stock above what the cover limit allows. For the O-ring kit, 24 months at 5 a month is 120 kits, so the excess is 280.000000 kits. The engine's reason, verbatim:

> ORING-KIT: 20 months since the last issue is at or above 12, band slow (below 24), written down 25% of 38000 = 9500; cover 80 months is above 24, excess 280 units

The ring joint gasket has 30.000000 months of cover and an excess of 24.000000 units. The heat tracing controller has no usage at all, so its cover has no meaning; the engine reports all 5.000000 units on hand as excess. Three items on the Ekene register carry excess stock.

| id | cover, months | excess | excess quantity |
| --- | --- | --- | --- |
| ORING-KIT | 80.000000 | yes | 280.000000 |
| GASKET-RJ | 30.000000 | yes | 24.000000 |
| HEAT-TRC | no usage | yes | 5.000000 |
| PT-XMTR | 16.800672 | no | 0.000000 |

## Strictly above the limit

A band minimum is reached at or above it, but the cover limit works the other way round: stock is excess only strictly above the limit. On the stated boundary items, an item with exactly 24.000000 months of cover is inside the limit, and one with 25.000000 months carries 1.000000 unit of excess. An item with no stock and no usage has nothing to call excess. The alternative a policy could state is excess at or above the limit; the engine states its choice in the basis, and no graded figure in this course moves under the alternative.

## Two measures, two questions

Months since the last issue asks whether an item is still used. Cover asks whether the store holds more than it needs. The two can disagree. The casing is band slow with only 3.000000 months of cover; the O-ring kit (band slow) and the gasket (band very slow) carry excess besides. A write-down follows the band; excess marks stock a policy might sell, return or stop reordering.

The cover limit must be above 0:

> excessCoverMonths must be a finite number above 0; got 0

## Exercise

Open the register calculator in "Slow-moving and obsolete stock" on "The Ekene register, its stated bands". Work the cover and excess quantity of GASKET-RJ by hand from the box, and check both. Lower the Cover limit control to 12 and list the items that now carry excess. Then start from "The band and cover boundaries" and copy the cover and excess of COVER24, COVER25 and EMPTY.
