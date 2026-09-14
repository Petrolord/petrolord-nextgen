# The units that travel

Every number in a screening case carries a unit, and the quick form changes some of them on the way into the ledger. Production goes from a daily rate to a yearly volume, cost per barrel becomes millions, and every rate stays a percent.

{{panel:ec-screening-explorer}}

## Money is millions

Money is millions of USD, written in the engine as volume times price divided by 1e6. ISIALA's first year is 1606000.0000 bbl at 70.0000 USD per bbl, and grossRevenue reads 112.4200, meaning 112.4200 million USD. The published hand case makes the scale easy to hold: 1 million bbl a year at 100 USD per bbl gives grossRevenue of 100.0000.

## Barrels a day become barrels a year

The quick input is 4400 bopd. The case holds oil volume in bbl a year, and the first year is 1606000.0000 bbl, the daily rate over a whole year with no decline taken yet. OKPOMA's 6800 bopd at 78 USD per bbl gives a first year grossRevenue of 193.5960.

## Cost per barrel becomes millions

Variable opex is typed as 13 USD per bbl and stored as oil volume times 13 divided by 1e6, which is 20.8780 in 2027. Fixed opex is typed as 2.5 million USD a year and stored unchanged. The ledger's opex column adds them.

| year | oil bbl | opexFixed | opexVariable | ledger opex |
| --- | --- | --- | --- | --- |
| 2027 | 1606000.0000 | 2.5000 | 20.8780 | 23.3780 |
| 2046 | 141552.0984 | 2.5000 | 1.8402 | 4.3402 |

## Rates are percent

Royalty, tax and discount rates are percent from 0 to 100. ISIALA's royalty of 15 means 15 percent, and the discount rate of 12 enters as (1 + 12/100), giving a 2027 factor of 1.058301.

## The mistake

The careful mistake is carrying a unit from one engine into the other. The Probabilistic Breakeven Analyzer runs ISIALA with opex of 20 million USD a year, flat, where the screening case uses 2.5 million USD fixed plus 13 USD per bbl. It states efficiency as a percent belief, a 10th percentile of 85, a median of 91 and a 90th percentile of 96, and runs its base case at an efficiency of 0.91, a fraction. A reader who types 91 where 0.91 belongs has changed the field, and nothing complains.

The second is dropping the 1e6. A grossRevenue built from bbl and USD per bbl without it is a million times too large, and so is every royalty computed from it.

## What the units refuse

They refuse a currency year. There is no inflation basis in the screening engine, and the oil price is 70.0000 in 2027 and in 2046.

## Exercise

Convert ISIALA's 4400 bopd, 13 USD per bbl and 70 USD per bbl into the 2027 values the ledger holds for oil volume, variable opex and grossRevenue. Then say which of 20, 2.5, 91 and 0.91 belongs to which engine, and in what unit.
