# The price royalty and its anchors

A second royalty rides on the oil price, its anchors drift upward at 2 percent a year from 2021, and it is capped at 10 percent.

{{panel:ec-fiscal-explorer}}

## The 2021 shape

derivePriceRoyaltyRate for shallow water in 2021:

| price USD/bbl | 50 | 55 | 60 | 75 | 80 | 100 | 110 | 125 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rate | 0.000000 | 0.005000 | 0.010000 | 0.025000 | 0.030000 | 0.050000 | 0.060000 | 0.075000 | 0.100000 | 0.100000 |

Nothing at 50 or below. From 50 the rate climbs in a straight line to 0.050000 at 100 (55 reads 0.005000, 60 reads 0.010000, 80 reads 0.030000), then twice as steeply to 0.100000 at 150 (110 reads 0.060000, 125 reads 0.075000), and from there it is flat: 160 and 200 both read 0.100000. That flat is the ceiling, and it is the only part of the curve that the years do not erode.

## The anchors move

The anchor prices escalate at 2 percent a year from 2021, so the same nominal price earns a smaller rate every year:

| price | 2021 | 2025 | 2030 | 2035 |
| --- | --- | --- | --- | --- |
| 60 | 0.010000 | 0.005431 | 0.000205 | 0.000000 |
| 80 | 0.030000 | 0.023908 | 0.016940 | 0.010630 |
| 100 | 0.050000 | 0.042385 | 0.033676 | 0.025788 |
| 150 | 0.100000 | 0.088577 | 0.075513 | 0.063681 |
| 200 | 0.100000 | 0.100000 | 0.100000 | 0.100000 |

At 60 the royalty is gone by 2035 because the 50 anchor has escalated past it; in 2026 a price of 55 already reads 0.000000 and 60 reads 0.004344, and by 2030 the 60 rate is 0.000205, a royalty in name only. At 200 the ceiling holds in every year. Between them a flat price is a falling royalty, and an escalating price can still be one: AKATA sells at 82.000000 in 2029 and pays a price royalty of 3605512.362941 on 186032000.00 of gross revenue, and at 92.345318 in 2035 pays 1421137.383868 on 73325786.51. The price rose, the revenue fell, and the rate did not move: the anchors escalate at the same 2 percent as the price, so the royalty fell exactly as the barrels did.

## Three published prices in 2025

The worked example at 80.000000 pays 34905145.759897 on 1460000000.00 of gross revenue, the 0.023908 in the table. pia_high_price_royalty_tiers at 140.000000 pays 202709508.889684 on 2555000000.00, in the upper tier between the escalated 100 and 150 anchors. pia_price_royalty_ceiling at 200.000000 pays 365000000.000000 on 3650000000.00, exactly 10 percent, the ceiling. AKATA at an oil price of 120 pays 13838574.96 in 2029; at 45 it pays 0.00.

## It is an oil royalty

pia_gas_only_hct_zero sells 20000000.00 Mscf and no oil for 90000000.00 of gross revenue, and its price_royalty column reads 0.000000 beside a production royalty of 6300000.00. The price royalty reads the oil price and charges the oil; gas does not carry it. Frontier is exempt outright: 0.000000 at 200 USD/bbl in 2025, and pia_frontier_exempt shows 0.000000 beside 21900000.00 of production royalty.

## The mistake

Using the 2021 anchors in a later year. A reader who prices the worked example at the 2021 rate of 0.030000 rather than 0.023908 overstates the royalty and understates both tax bases downstream, and the error grows every year the field runs. The second mistake is applying the rate to gross revenue on a field with gas; the gas-only case says the base is oil.

## What it refuses

The rate is read from the year's applied oil price, escalator included, not from a deck average or a flat assumption, and nothing above the 150 anchor earns more than the ceiling.

## Exercise

Read the rate at 80 USD/bbl in 2021, 2025, 2030 and 2035 and say what a flat oil price does to the price royalty over a field's life. Then find the year in which a price of 60 stops paying it.
