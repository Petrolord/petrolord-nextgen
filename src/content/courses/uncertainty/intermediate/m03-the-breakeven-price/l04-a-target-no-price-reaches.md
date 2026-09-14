# A target no price reaches

When NPV at 500 USD/bbl is still below the target, the solver returns null instead of a price, and the Monte Carlo counts that iteration out.

{{panel:ec-breakeven-explorer}}

## Null from the top check

`solveBreakevenPrice` prices the top of its bracket before it searches. If NPV there is below the target, it returns null. Two published cases take that path:

- solve_unreachable asks for a target of 500000 million USD. No price up to 500 reaches it, so the engine returns null, and so does the golden.
- solve_zero_production_null has no production at all. NPV is flat and negative at every price, so the answer is null again.

ISIALA at the stated medians is worth 1552.6414 million USD at the bracket top, so for that case any target above 1552.6414 returns null.

## Excluded, and counted

In the Monte Carlo a null is not a price. The iteration has already consumed its three draws; it is left out of the sample and counted in `excludedIterations`. The published mc_with_unreachable run sets capex so large that part of its sample cannot break even:

| case | seed | iterations | excluded | 10th percentile | median | 90th percentile | base |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mc_with_unreachable | 5 | 120 | 55 | 397.3404 | 449.5729 | 486.6757 | 498.0372 |

55 of 120 iterations are gone, and the three percentiles are read off the rest. When every iteration is unreachable, as in mc_all_unreachable_throws, the engine throws instead: "No iteration broke even below 500 dollars a barrel. Check the production profile, the cost ranges and the target NPV." ISIALA's own run of 5000 iterations excludes 0.

## What it refuses

It refuses to widen the bracket. A price of 500 USD/bbl is the edge of its world, so a case that would break even just above it looks exactly like one that never breaks even. It refuses to place the excluded iterations anywhere in the distribution: they are not set to 500, not stacked at the top, simply absent from every statistic except the count.

## The mistake

The mistake is reading mc_with_unreachable's percentiles as percentiles of the whole belief. Every excluded iteration needed a price above 500, so each one sits beyond every survivor, and removing them drags the reported distribution down. Count them back in as prices above 500 and the whole sample's median lands among the most expensive survivors, well above 449.5729, while its 90th percentile falls among the excluded, beyond any price the engine reports. The tell is in the row itself: the base case at the stated medians breaks even at 498.0372, above the sample's 90th percentile of 486.6757. A second mistake is letting a spreadsheet turn null into 0, which reads a project that cannot break even as one that is free.

## Exercise

Name the two published solve cases that return null and the reason for each. State how many of mc_with_unreachable's 120 iterations were excluded, and give its three percentiles. Then explain why its base case of 498.0372 sitting above its 90th percentile shows the percentiles are biased, and in which direction.
