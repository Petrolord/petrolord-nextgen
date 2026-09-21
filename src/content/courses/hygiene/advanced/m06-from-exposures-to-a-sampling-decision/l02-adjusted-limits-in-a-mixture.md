# Adjusted limits in a mixture

{{panel:hy-protection-chemicals}}

The teaching mixture is toluene at 72.500000 ppm against 200.000000, xylene at 31.200000 ppm against 100.000000 and acetone at 385.000000 ppm against 1000.000000. On those limits its index is 1.059500, with terms 0.362500, 0.312000 and 0.385000. On 10-hour shifts and 50 hours a week each limit is multiplied by the governing daily factor of 0.700000, giving 140.000000, 70.000000 and 700.000000 ppm, and the index on the adjusted limits is 1.513571.

## Two published steps

Each step has its own source. The additive index is the formula of 29 CFR 1910.1000(d)(2): the sum of each concentration over its own limit, which "shall not exceed unity". The engine reproduces the regulation's worked example, 500.000000 against 1000.000000, 45.000000 against 200.000000 and 40.000000 against 200.000000, giving an index of 0.925000. The adjustment is Brief and Scala, whose daily factor the BC regulation's printed values reproduce.

| substance | concentration, ppm | limit, ppm | adjusted limit, ppm |
| --- | --- | --- | --- |
| toluene | 72.500000 | 200.000000 | 140.000000 |
| xylene | 31.200000 | 100.000000 | 70.000000 |
| acetone | 385.000000 | 1000.000000 | 700.000000 |

## The composition is a judgement

Putting the two together is a choice. The adjusted index applies each limit's own reduction factor and then adds the terms. Neither source prints that combination, so a hygienist who uses it states it in the report. Here every substance takes the same daily factor, because the schedule is one schedule, so every term grows by the same proportion. That is why the adjusted index is the unadjusted index divided by the factor.

A different choice is possible where substances differ. If one component had a substance-specific shift adjustment, its term would use that, and the index would then scale term by term. The engine computes what it is given: `mixtureExposureIndex` takes each component's concentration and limit, and whatever adjustment was made to the limit happens before the call.

## Unity passes

The regulation says the index shall not exceed unity, so an index of exactly 1 passes. That is judgement J7: the golden's case at 1.000000 gives exceeds false, and its over-unity case at 1.100000 gives exceeds true. No capstone input lands exactly on unity. The teaching mixture sits well clear of it on both sets of limits.

## When additivity is the wrong model

The index assumes the components act on the same organ by the same mechanism. Where they act independently, each is compared against its own limit and the sum means nothing. Where they potentiate each other, the sum understates the hazard. The engine computes the additive index only and cannot tell which case a mixture is in. The teaching mixture's largest single term is 0.385000, so every component is under its own limit while the mixture exceeds: the whole argument rests on additivity being the right model for these three solvents, and a report says so.

## Exercise

Divide each concentration by its adjusted limit to find the three adjusted terms, add them, and confirm 1.513571. Then divide 1.059500 by 0.700000 and compare. Write one sentence explaining why the two routes agree for this crew, and one naming the condition under which they would not.
