# A price that never moves

The quick form takes one oil price and writes it into every year of the life. Revenue falls only because volume falls, and the price assumption carries the whole NPV with it when it changes.

{{panel:ec-screening-explorer}}

## One price, twenty rows

ISIALA's oil price is 70 USD per bbl, and the case holds 70.0000 in every row from 2027 to 2046. The gas price is 3.5000 in every row too, at a gas volume of 0, so it earns nothing. Gross revenue is 112.4200 million USD in 2027 and 9.9086 in 2046, and the ratio between them is the volume ratio, 0.088140, because the price did not move.

## What a flat price does to value

Every year is priced the same, so scaling the price scales every year's revenue together.

| input | NPV at 0.7 | base NPV | NPV at 1.3 | swing |
| --- | --- | --- | --- | --- |
| Oil Price | -17.3893 | 81.0464 | 175.8952 | 193.2845 |
| CAPEX | 126.2382 | 81.0464 | 32.7547 | -93.4835 |

The price bar swings 193.2845 million USD, the largest on ISIALA and far wider than the capex bar. A 0.7 price turns the field negative. The Low scenario, with price, production and variable opex all times 0.8, returns -57.8151.

## The mistake

The careful mistake is to put this price beside a breakeven from the other engine. The Probabilistic Breakeven Analyzer solves ISIALA's base breakeven at the stated medians as 71.6277 USD per bbl. A reader sees 70 under 71.6277 and concludes the field is uneconomic at its own price, while the screening engine reports an NPV of 81.0464 at that same 70.

Both engines are right about their own cases. The breakeven engine places all capex in year 1, charges opex of 20 million USD a year flat and applies an efficiency of 0.91. Through that engine the NPV at 70 is -6.5653. The screening case splits capex over two years and charges 2.5 million USD fixed plus 13 USD per bbl. A price from one case does not test the other.

The sampled breakeven says the same thing more carefully. Over 5000 iterations its 10th percentile of breakeven price is 62.1713, its median 73.3297 and its 90th percentile 85.5912. These are prices, so they take percentile words and never a P-label, and they describe the breakeven engine's case, not the quick form's.

## What a flat price refuses

It refuses a price deck, escalation, inflation, a quality differential and any link between price and time. There is no inflation basis in the screening engine, so 70.0000 in 2046 is the same number of USD as 70.0000 in 2027. The Scenario Builder's Monte Carlo can scale the whole flat deck up or down by one factor an iteration, and it never draws a trend.

## Exercise

State ISIALA's oil price in 2027 and 2046, its gross revenue in both years, and the ratio between the two revenues. Then explain why 70 USD per bbl sitting under the breakeven engine's 71.6277 does not contradict the screening NPV of 81.0464, naming two differences between the cases.
