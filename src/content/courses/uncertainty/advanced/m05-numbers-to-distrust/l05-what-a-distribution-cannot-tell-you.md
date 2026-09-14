# What a distribution cannot tell you

A Monte Carlo reports the spread of a model under the ranges it was given. Whatever the model holds fixed, samples independently or never models lies outside that spread, however many iterations are run.

{{panel:ec-risk-explorer}}

## The low tail it cannot see

ISIALA through the Scenario Builder's Monte Carlo, 1000 iterations with price, capex and reserves each plus or minus 20 percent, beside the deterministic Low scenario:

| quantity | NPV, million USD |
| --- | --- |
| Low case P90, engine key `p10` | 48.7439 |
| lowest of the sample | 16.3054 |
| Low scenario | -72.1531 |

The Low scenario multiplies price and production by 0.8 and capex and fixed opex by 1.2 all at once, and loses 72.1531 million USD. Not one iteration of the sample loses money. The sampler draws each value once per year per array, independently, so a whole life of prices at the bottom of the range almost never occurs, and price, reserves and capex never move against the project together. The distribution is narrow because its draws are independent, and it cannot give the probability of the Low scenario.

## What is never sampled

The Scenario Builder never samples opex, royalty or tax, whatever ranges are typed. The breakeven engine samples capex, opex and efficiency and never price. Neither lets one uncertainty lean on another: a high capex draw says nothing about the draw that follows it.

## What is never modelled

There is no economic limit. OKPOMA produces through 2046, when its net cash flow is -0.5576 on gross revenue of 4.4603 and opex of 4.5718, and every iteration carries that year. The quick form fixes the 20 year life, the decline, the flat price and the TaxRoyalty terms, and no range reaches them. There are no PIA terms, no working interest and no inflation basis.

## What the cases do say

A Low case P90 of 48.7439 says that roughly nine in ten of these model runs sit at or above 48.7439 under uniform, independent ranges of 20 percent. It is a statement about the sample. Whether ISIALA itself has that chance depends on whether the ranges, the independence and the fixed parts are right, and the distribution has no way to test any of them. The emv of 80.1707 is the mean of the same model runs, a little below the Best case P50 of 81.1835.

## The mistake

The careful mistake is widening the ranges until the Low case P90 looks cautious enough and calling the result a risk assessment. The missing risk is correlated, structural or never modelled, and a wider uniform range only fattens independent noise.

## Exercise

State ISIALA's Low case P90, its lowest sampled NPV and its Low scenario NPV, and explain why no iteration comes near the Low scenario. Then name three things the Scenario Builder's distribution holds fixed or never models.
