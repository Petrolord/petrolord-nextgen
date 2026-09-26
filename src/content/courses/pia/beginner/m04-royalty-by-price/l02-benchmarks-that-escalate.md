# Benchmarks that escalate every year

{{panel:pia-royalty-calculator}}

The texts do not leave the benchmarks fixed. They escalate the three benchmarks by 2 percent a year, each on the previous year's value, and round to the cent. This lesson reads the escalation in the text, the table the engine builds from it, and a misprint in the Regulations' own table.

## The escalation in the text

The Act escalates from the start of 2021, Seventh Schedule para 11(1):

> "and at the beginning of 2021 and of each succeeding calendar year these price levels shall be increased by 2% relative to the values of the previous year."

The Regulations' Schedule states the same rule with its own start date and a rounding step:

> "shall be adjusted by applying an adjustment figure of 2% per year, every 1st January, commencing 1st January 2022 in such a way as to achieve a 2% escalation of the previous year benchmark. The results shall be rounded to entire US $ cents."

The two texts start the escalation one year apart. That difference is one of the course's open readings, and the next lesson reads it in full. This lesson uses the Regulations base, the engine default.

## The table the engine builds

Each benchmark is last year's benchmark raised by 2 percent and rounded to whole cents, year by year. Because each year rounds before the next escalates, the table has to be built one year at a time.

| year | low | middle | high |
| --- | --- | --- | --- |
| 2021 | 50.000000 | 100.000000 | 150.000000 |
| 2022 | 51.000000 | 102.000000 | 153.000000 |
| 2023 | 52.020000 | 104.040000 | 156.060000 |
| 2024 | 53.060000 | 106.120000 | 159.180000 |
| 2025 | 54.120000 | 108.240000 | 162.360000 |
| 2026 | 55.200000 | 110.400000 | 165.610000 |
| 2027 | 56.300000 | 112.610000 | 168.920000 |

All on the Regulations base. Before its base year the base keeps 50, 100 and 150.

## A misprint in the Regulations' table

The Regulations' Schedule also prints its benchmarks as a table for 2021 to 2026. Its low and high rows follow the 2 percent rule and match the engine's table above. Its middle row does not: the Schedule prints the middle column as 102.00, 104.00, 106.00, 108.00 and 110.00 for 2022 to 2026, which does not follow its own 2 percent rule. From 2023 the printed row rises by the same step each year and falls behind the rule, while the engine's middle benchmark is 104.040000 in 2023.

The course quotes the printed row as it stands and says it is a misprint. The engine applies the rule, and it says so in a note on every ledger with a year of 2023 or later, so a reader of any ledger in the calculator sees the conflict named beside the figures. Where a text and its own rule disagree, the engine follows the rule and the course names the disagreement.

## Why the escalation matters

A constant price pays less royalty by price every year, because the benchmarks climb away from it. Ekene Alpha sells oil at a flat 75 USD/bbl, and its rate on the Regulations base falls from 0.017935 in 2026 to 0.010320 in 2032 with no change in price.

## Exercise

Open the royalty calculator and choose "Royalty by price and its benchmarks". Keep the Regulations base and a price of 75. Step the year from 2021 to 2027 and copy the three benchmarks the panel prints each year. Compare your middle column with the Regulations' printed middle row above and mark each year where they differ. Then set the year to 2032 and confirm the rate 0.010320, and explain in one sentence why the rate fell at a constant price.
