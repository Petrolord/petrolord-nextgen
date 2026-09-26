# Two readings of the base year

{{panel:pia-royalty-calculator}}

The Act and the Regulations agree on the three benchmarks and the 2 percent escalation, and disagree on the year the benchmarks start. The texts do not settle it, so this course teaches it as an open reading: two readings side by side, each with its text, and neither graded against the other.

## The Act's reading

The Act fixes the levels to 2020, Seventh Schedule para 11(1):

> "as an example, if in 2020 the price is US $75 per barrel, the royalty by price shall be 2.5%, and the price levels mentioned in sub-subparagraphs (a), (b) (c) and (d) shall apply to the year 2020,"

and it escalates "at the beginning of 2021 and of each succeeding calendar year". The engine calls this reading `act_2020`.

## The Regulations' reading

The Regulations' Schedule applies the same levels to 2021 and escalates "commencing 1st January 2022". The engine calls this reading `regulations_2021`, and it is the engine default.

## The two tables side by side

| year | low, Regulations | middle | high | low, Act | middle | high |
| --- | --- | --- | --- | --- | --- | --- |
| 2020 | 50.000000 | 100.000000 | 150.000000 | 50.000000 | 100.000000 | 150.000000 |
| 2021 | 50.000000 | 100.000000 | 150.000000 | 51.000000 | 102.000000 | 153.000000 |
| 2024 | 53.060000 | 106.120000 | 159.180000 | 54.120000 | 108.240000 | 162.360000 |
| 2025 | 54.120000 | 108.240000 | 162.360000 | 55.200000 | 110.400000 | 165.610000 |
| 2026 | 55.200000 | 110.400000 | 165.610000 | 56.300000 | 112.610000 | 168.920000 |

Read down the table: the Act base in any year equals the Regulations base one year later. Before its base year each base keeps 50, 100 and 150.

## Where the readings agree and where they differ

The Act's own example holds on both bases. At 75 USD/bbl in 2020 the engine returns 0.025000 on the Act base and 0.025000 on the Regulations base, because the Regulations keep the 2021 levels for 2020.

In 2025 the two readings give these rates:

| price USD/bbl (stated) | Regulations base | Act base |
| --- | --- | --- |
| 54.120000 | 0.000000 | 0.000000 |
| 75.000000 | 0.019290 | 0.017935 |
| 108.240000 | 0.050000 | 0.048043 |
| 162.360000 | 0.100000 | 0.097057 |
| 170.000000 | 0.100000 | 0.100000 |

At or below the low benchmark of both bases, and at or above the high benchmark of both, the readings agree. Between them they differ, and the Act base, with its higher benchmarks, charges less. On the case with crude at 95 and condensate at 88 USD/bbl in 2025 the royalty by price is 20694235.033259 USD on the Regulations base and 19738586.956522 USD on the Act base.

## How the engine says which it used

The engine states the reading in a note on every ledger. On the Act base it prints:

> Royalty by price uses the Act's reading (PIA Seventh Schedule para 11(1)): 50, 100 and 150 USD/bbl apply to 2020 and rise by 2% of the previous year's benchmark every 1 January from 2021, rounded to whole cents. The Petroleum Royalty Regulations 2022 Schedule starts the same levels one year later, in 2021.

## How this course handles an open reading

A figure that depends on the royalty by price is quoted with its base year, and every graded figure in this course reads the Regulations base, the engine default, and says so. That is a stated reading for the purpose of a run. It is never presented as the law, and the Act base is taught beside it.

## Exercise

Open the royalty calculator and choose "Royalty by price and its benchmarks". Set the year to 2025 and the price to 75, read the rate on the Regulations base, then switch the base year to the Act base and read it again. The note under the tiles prints the other base's benchmarks. Repeat at 2020 and confirm both bases return the Act's example. Then find one price in 2026 at which the two bases agree, and one at which they differ, and explain each from the benchmarks.
