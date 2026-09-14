# What the ranges scale

The Scenario Builder offers three ranges, and each one scales a fixed set of arrays. Reserves scales volumes, price scales prices and capex scales capex. Nothing else is ever sampled.

{{panel:ec-risk-explorer}}

## Three ranges, five arrays

| range | arrays it scales, every year | ISIALA base values |
| --- | --- | --- |
| reserves | oil volume and gas volume | oil 1606000.0000 bbl in 2027; gas volume 0 |
| price | oil price and gas price | oil 70.0000; gas 3.5000 |
| capex | capex | 90.0000 in 2027 and 2028; 0.0000 after |

## Draws that change nothing

ISIALA has no gas. Every gas volume draw scales 0 and returns 0, and every gas price draw scales a price that no volume is sold at. Those draws are still consumed, because the range is not falsy. The eighteen capex years at 0.0000 consume draws too. The stream is spent on these arrays whether they matter or not.

What does move the stream is switching a range between zero and nonzero. In the published case mc_seed3_price_only, the reserves and capex ranges are falsy and consume no draws. The price draws therefore take stream positions the volume draws would have used.

## What is never sampled

Opex, royalty, tax and the discount rate keep their case values in every iteration: fixed opex 2.5000 million USD a year, royalty 15 percent, tax 35 percent, discount rate 12 percent. The variable opex array stays fixed too. It was computed from the base volumes when the quick inputs were expanded, so 2027 carries 20.8780 million USD. It still carries 20.8780 in an iteration whose 2027 volume is drawn near 0.8 times base. Variable opex does not follow the sampled volume.

## Reserves is not a reserves total

The range called reserves draws each year's volume on its own. In the base case, year 2 over year 1 is 0.880000. An iteration that draws 2027 near the bottom of its range and 2028 near the top gets a profile that rises from one year to the next. The sampled profile has no decline of its own, no total anyone believed, and no link to price. Set reserves to plus or minus 20 percent expecting recoverable volume to move by up to 20 percent, and you get twenty separate yearly draws that largely cancel.

## The mistake

The careful mistake is assuming the Monte Carlo covers every input the sensitivity and scenario tools move. The sensitivity sweep scales fixed opex by 0.7 and 1.3, which moves ISIALA's NPV from 85.3696 to 76.7233. The scenario Low scales fixed opex by 1.2. The Monte Carlo leaves opex alone. Its spread from the Low case P90 of 48.7439 to the High case P10 of 109.8980 therefore holds no opex uncertainty at all. A reader who calls that spread "the uncertainty in ISIALA" is describing three inputs out of many.

## What it refuses

It has no range for opex, royalty, tax, decline or discount rate. It does not scale variable opex with volume. It does not preserve a profile's shape from one year to the next.

## Exercise

List the arrays each of ISIALA's three ranges scales, and name four quantities that stay fixed in every iteration. Then give ISIALA's 2027 variable opex in an iteration whose 2027 oil volume is drawn low, and explain why it has that value.
