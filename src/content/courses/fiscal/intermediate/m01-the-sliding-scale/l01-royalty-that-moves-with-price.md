# Royalty that moves with price

A sliding-scale royalty charges one rate on the whole of gross revenue, and the rate it charges is picked by the oil price of that year and by nothing else.

{{panel:ec-instrument-explorer}}

## Two kinds of royalty in one field

A regime's royalty is either flat, carrying a single rate, or sliding on price, carrying a list of tiers keyed on the oil price. Both are charged on gross revenue, before any cost. "USA - Gulf of Mexico" is the flat case at 18.75 percent, and its implied rate, royalty over gross revenue, reads 0.187500 in year 1 and 0.187500 in year 25 on the Designer's default project and on the teaching field ODIDI alike. On the default project year 1 that is a royalty of 50.9979 million USD on gross revenue of 271.9889.

The sliding case replaces the single rate with a selection. `getSlidingScaleRoyalty` sorts a copy of the tier list by threshold and keeps the rate of the highest threshold the oil price has reached, falling back to the lowest tier's rate when the price has reached none of them. The price it reads is the applied oil price for that year, after any price multiplier, so a price sweep moves the tier as well as the revenue.

## The rate the price chooses

The "Nigeria - PIA (2021)" template's royalty has two tiers, 0 USD/bbl at 7.5 percent and 50 USD/bbl at 10 percent. Swept across the price multiplier on the default project, whose year 1 deck price is 70 USD per bbl:

| price multiplier | applied year 1 oil price | year 1 grossRevenue | year 1 royalty | implied rate |
| --- | --- | --- | --- | --- |
| 0.500000 | 35.000000 | 144.2389 | 10.8179 | 0.075000 |
| 0.700000 | 49.000000 | 195.3389 | 14.6504 | 0.075000 |
| 0.720000 | 50.400000 | 200.4489 | 20.0449 | 0.100000 |
| 1.000000 | 70.000000 | 271.9889 | 27.1989 | 0.100000 |
| 1.200000 | 84.000000 | 323.0889 | 32.3089 | 0.100000 |

Inside a tier the rate does not move at all. At an applied price of 50.400000 the implied rate is 0.100000, and at 84.000000 it is still 0.100000. Between tiers it jumps. Gross revenue climbs from 195.3389 to 200.4489 across those two swept points, a modest move, while the royalty climbs from 14.6504 to 20.0449. That is a step, not a ramp, and nothing between two thresholds is interpolated.

## The mistake

The careful reader who knows income tax reaches for marginal brackets: some of the revenue at 7.5 percent, the rest at 10. The engine does no such thing. At a multiplier of 1.200000 the royalty is 32.3089 on gross revenue of 323.0889, every dollar of it at 0.100000 and none of it at 0.075000. A blended answer will land between the two printed royalties and look reasonable, which is exactly why it is dangerous.

The second mistake is to charge the rate on something net. Royalty is taken off gross revenue in the row that also carries 500.0000 million USD of capex, and the 50.9979 the flat regime charges in year 1 is unmoved by it.

## What it refuses

Only the oil price selects the tier. Gas and NGL revenue is taxed at whatever rate the oil price chose, and neither gas nor NGL price can move it. The instrument cannot see cost, cumulative revenue, production rate, terrain or water depth. There is no cap and no relief when the price falls.

## Exercise

Read the implied rate at multipliers 0.500000, 0.720000 and 1.200000 and say which two share a rate and why. Then name the royalty the flat 18.75 percent regime charges in default project year 1, and say which instrument charges more there.
