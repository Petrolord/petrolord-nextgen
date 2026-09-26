# Price, year and terrain side by side

{{panel:pia-ledger-calculator}}

Three stated terms decide more of a PIA outcome than any others: the price, the year and the terrain. Each is read by a different provision, and each can move the royalty, the tax or both. This lesson sets the three side by side so that a reader can tell, from which lines move, which of them changed.

## Price: the royalty by price and its base year

The royalty by price reads the price against three benchmarks that escalate each year. The rate at stated prices in 2025, onshore:

| price USD/bbl (stated) | rate, Regulations base | rate, Act base |
| --- | --- | --- |
| 54.120000 | 0.000000 | 0.000000 |
| 75.000000 | 0.019290 | 0.017935 |
| 95.000000 | 0.037768 | 0.036051 |
| 162.360000 | 0.100000 | 0.097057 |
| 170.000000 | 0.100000 | 0.100000 |

The base year is an open reading. The Act applies the starting benchmarks to 2020 and the Petroleum Royalty Regulations 2022 to 2021; the engine follows the Regulations unless told otherwise. The two agree at and below the low benchmark of both and at and above the high benchmark of both, and differ between. Frontier acreage pays no royalty by price at any price: on the Ekene frontier case at 120 USD/bbl in 2026 the rate is 0.000000.

## Year: two effects in one term

The year enters a ledger twice. It escalates the benchmarks, so the same price pays a lower royalty by price in a later year: on Alpha's rows the oil rate at 75 USD/bbl falls from 0.017935 in 2026 to 0.010320 in 2032 on the Regulations base. And it decides the framework, so the same profit pays the education tax before 2026 and the development levy from 2026. A change of year can therefore move the royalty by price and the tax lines at once, for two separate reasons.

## Terrain: tranches and classes

The terrain decides the royalty tranches and, with the licence and the year, the hydrocarbon tax rate. At a stated daily rate:

| liquids bopd (stated) | onshore | shallow_water | deep_offshore | frontier |
| --- | --- | --- | --- | --- |
| 7500 | 0.058333 | 0.058333 | 0.050000 | 0.075000 |
| 20000 | 0.106250 | 0.093750 | 0.050000 | 0.075000 |
| 60000 | 0.135417 | 0.114583 | 0.054167 | 0.075000 |

At or below 10,000 bopd onshore and shallow water pay the same rate; above it the terrain rate enters. Deep offshore changes the hydrocarbon tax too: none in a year under the Act alone, and a stated reading in a year under the Nigeria Tax Act 2025.

## Telling them apart on a ledger

| a change in | the lines it moves first |
| --- | --- |
| price | the royalty by price, between the benchmarks, then every profit line |
| year | the benchmarks, and the framework lines when the year crosses 2026 |
| terrain | the royalty rate above 10,000 bopd, and the hydrocarbon tax class |

Read a ledger difference against this table before reaching for a cause. A difference that starts in the royalty by price and runs through the profit lines points at the price or the base year. A difference in the education tax and the levy points at the year and its framework. A change in the production royalty rate with the royalty by price flat points at the terrain, and only for a field above 10,000 bopd. A change in the hydrocarbon tax line alone, with royalty flat, points at the class: the terrain, the licence, the lease status or, in deep offshore, the stated reading.

## Exercise

Open the ledger calculator on "Which provision moved" with ekene_alpha_shallow_converted_nta loaded. Enter {"oil_price_usd_bbl": 95, "pia_price_royalty_base": "act_2020"} and compare with the price row of the previous lesson. Then enter {"pia_terrain": "deep_offshore"} and read the refusal; add a stated deep offshore reading and run it under each of the two named readings, and say which lines each reading moves. Finally enter {"pia_terrain": "frontier"} and explain the royalty and hydrocarbon tax rows from the texts.
