# What a distribution cannot tell you

A Monte Carlo reports the spread of a model under the ranges it was given. Whatever the model holds fixed, samples independently or never models lies outside that spread, however many iterations are run.

{{panel:ec-risk-explorer}}

## The tail it reaches and the one it cannot

ISIALA through the Scenario Builder's Monte Carlo, 1000 iterations with price, capex and reserves each plus or minus 20 percent, beside the deterministic Low scenario:

| quantity | NPV, million USD |
| --- | --- |
| Low case P90, engine key `p10` | 15.6063 |
| lowest of the sample | -46.1564 |
| Low scenario | -57.8151 |

Iterations do lose money here: the lowest of the thousand is -46.1564 million USD, because one factor per variable moves every year of the case together. The Low scenario still sits below all of them at -57.8151. It multiplies price, production and variable opex by 0.8 and capex and fixed opex by 1.2 in a single move, and the sampler cannot copy it. Its three factors are drawn independently, so all three landing near their bad ends at once is rare, and fixed opex is never drawn at all. The sample gives no probability for the scenario.

## What is never sampled

Fixed opex, royalty and tax keep their case values whatever ranges are typed. The breakeven engine samples capex, opex and efficiency and never price. Neither engine lets one uncertainty lean on another: a high capex factor says nothing about the price factor drawn beside it.

## What is never modelled

There is no economic limit. OKPOMA produces through 2046, when its net cash flow is -0.5576 on gross revenue of 4.4603 and opex of 4.5718, and every iteration carries that year. The quick form fixes the 20 year life, the decline, the flat price deck and the TaxRoyalty terms, and no range reaches them. There are no PIA terms, no working interest and no inflation basis.

## What the cases do say

A Low case P90 of 15.6063 says that roughly nine in ten of these model runs sit at or above 15.6063 under uniform, independent ranges of 20 percent. It is a statement about the sample. Whether ISIALA itself has that chance depends on whether the ranges, the independence and the fixed parts are right, and the distribution has no way to test any of them. The emv of 80.9836 is the mean of the same model runs, sitting above the Best case P50 of 78.5315 because the sample leans to the high side of its own median.

## The mistake

The careful mistake is widening the ranges until the Low case P90 looks cautious enough and calling the result a risk assessment. The missing risk is correlated, structural or never modelled, and a wider uniform range only fattens the three factors that were already drawn.

## Exercise

State ISIALA's Low case P90, its lowest sampled NPV and its Low scenario NPV, and explain why no iteration reaches the Low scenario although iterations do lose money. Then name three things the Scenario Builder's distribution holds fixed or never models.
