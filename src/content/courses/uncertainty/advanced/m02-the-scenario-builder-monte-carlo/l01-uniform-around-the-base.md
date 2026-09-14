# Uniform around the base

The Scenario Builder's Monte Carlo draws each sampled value uniformly within its range, above and below the base case value. It takes one draw per year for each array.

{{panel:ec-risk-explorer}}

## The rule

Each value v with a range r is drawn uniformly on [v(1 - r), v(1 + r)]. The app's settings give price, capex and reserves a range of plus or minus 20 percent. So every sampled value lands between 0.8 and 1.2 times its base value. Every point in that interval is equally likely, and nothing lands outside it.

The draws come from mulberry32(20260829) in a fixed order within each iteration: oil volume, gas volume, oil price, gas price, capex, one draw for each year of each array. A falsy range consumes no draw. The generator's first draw is 0.936239. It goes to ISIALA's 2027 oil volume of 1606000.0000 bbl and puts that year near the top of its range.

## A uniform range is not a belief

A uniform range has no mode. A value just inside the upper edge is exactly as likely as the base value, and a value just outside is impossible. Compare the Breakeven Analyzer. It fits a triangular through three stated percentiles: ISIALA's capex belief of 150 / 180 / 220 becomes 127.2260 / 168.6738 / 252.3607. That shape has a peak, and its tails reach past the stated 10th and 90th percentiles. Plus or minus 20 percent is neither a percentile nor a pair of believed endpoints. It is only a width.

## Independent in every year

Every year's price is drawn on its own. An iteration with a 2027 price near 0.8 times base can have a 2028 price near 1.2 times. No draw is shared between years or between variables. Twenty independent yearly draws partly cancel each other out. The sample ends up much narrower than any single move applied to the whole life.

| quantity | NPV, million USD |
| --- | --- |
| scenario Low | -72.1531 |
| Monte Carlo lowest of 1000 | 16.3054 |
| Low case P90 | 48.7439 |
| Best case P50 | 81.1835 |
| High case P10 | 109.8980 |
| Monte Carlo highest of 1000 | 149.3540 |
| scenario High | 237.8860 |

The scenarios move price and production to 0.8 times base, and capex and fixed opex to 1.2 times, in every year at once, then do the mirror image. Not one of the 1000 random iterations came near either scenario.

## The mistake

The careful mistake is reading plus or minus 20 percent on price as "the price could stay 20 percent lower for the life of the field". That is a scenario. The Monte Carlo's price range applies to each year separately. Independence across years and variables is why its Low case P90 of 48.7439 sits so far above the scenario Low of -72.1531. If you want a price that stays low, build it as a scenario.

## What it refuses

It has no correlation between years or between variables, and no shape inside the range. It never samples opex, royalty, tax or the discount rate.

## Exercise

Write the interval ISIALA's 2027 oil volume is drawn from at the app's settings, in the form [v(1 - r), v(1 + r)] with v and r filled in. Say which draw of seed 20260829 that volume takes and roughly where in the interval it lands. Then explain why the lowest sampled NPV, 16.3054, sits above the scenario Low.
