# The price royalty and its anchors

A second royalty rides on the oil price, its benchmarks rise 2 percent a year, and it is capped at 10 percent. Which year the rise starts from is one of the questions the texts leave open.

{{panel:ec-fiscal-explorer}}

## The 2021 shape

derivePriceRoyaltyRate for shallow water in 2021:

| price USD/bbl | 50 | 55 | 60 | 75 | 80 | 100 | 110 | 125 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rate | 0.000000 | 0.005000 | 0.010000 | 0.025000 | 0.030000 | 0.050000 | 0.060000 | 0.075000 | 0.100000 | 0.100000 |

Nothing at 50 or below. From 50 the rate climbs in a straight line to 0.050000 at 100, then at the same slope to 0.100000 at 150, and from there it is flat: 160 and 200 both read 0.100000. That flat is the ceiling, the only part the years do not erode. Frontier acreage pays none at any price.

## The benchmarks move

The benchmarks rise every 1 January by 2 percent of the previous year's figure, rounded to whole cents. The engine follows the Petroleum Royalty Regulations 2022, which set 50, 100 and 150 USD/bbl at 2021 levels; the Act sets the same levels at 2020, one year earlier. The engine defaults to the Regulations and names the Act's reading in its own statements, and every figure this course grades is on the Regulations (2021) base. On that base the same nominal price earns a smaller rate every year:

| price | 2021 | 2025 | 2030 | 2035 |
| --- | --- | --- | --- | --- |
| 60 | 0.010000 | 0.005432 | 0.000209 | 0.000000 |
| 80 | 0.030000 | 0.023910 | 0.016946 | 0.010632 |
| 100 | 0.050000 | 0.042387 | 0.033682 | 0.025788 |
| 150 | 0.100000 | 0.088581 | 0.075514 | 0.063676 |
| 200 | 0.100000 | 0.100000 | 0.100000 | 0.100000 |

At 60 the royalty is gone by 2035 because the low benchmark has risen past it; in 2026 a price of 55 already reads 0.000000 and 60 reads 0.004348. At 200 the ceiling holds in every year. An escalating price keeps a steady rate: AKATA sells at 82.000000 in 2029 and pays 3606152.270399 on 186032000.00 of gross revenue, and at 92.345318 in 2035 pays 1421219.023426 on 73325786.51. Price and benchmarks both rise 2 percent a year, so the rate barely moves, 0.019990 in 2029 and 0.019987 in 2035, and the royalty falls with the barrels.

## Three published prices in 2025

The worked example at 80.000000 pays 34908351.810791 on 1460000000.00 of gross revenue, the 0.023910 in the table. pia_high_price_royalty_tiers at 140.000000 pays 202719327.420547 on 2555000000.00, a rate of 0.079342 between the escalated middle and high benchmarks. pia_price_royalty_ceiling at 200.000000 pays 365000000.000000 on 3650000000.00, exactly 10 percent. AKATA at an oil price of 120 pays 13839836.15 in 2029; at 45 it pays 0.00.

## It is a liquids royalty

pia_gas_only_hct_zero sells 20000000.00 Mscf and no oil for 90000000.00 of gross revenue, and its price_royalty column reads 0.000000 beside a production royalty of 4500000.00, the gas at 5 percent. Crude and condensate each pay at their own price: the engine's Ekene case with crude at 95 and condensate at 88 USD/bbl in 2025 charges each stream on its own benchmark reading.

## The open question

On the Act's base the worked example's royalties are 197047101.45 against 199158351.81, and its NPV 142018072.46 against 141236909.83. The texts do not settle it, so no answer in this course depends on the choice.

## The mistake

Using the 2021 rates in a later year. A reader who prices the worked example at 0.030000 rather than 0.023910 overstates the royalty and understates both tax bases downstream, and the error grows every year the field runs.

## Exercise

Read the rate at 80 USD/bbl in 2021, 2025, 2030 and 2035 and say what a flat oil price does to the price royalty over a field's life. Then find the year in which a price of 60 stops paying it.
