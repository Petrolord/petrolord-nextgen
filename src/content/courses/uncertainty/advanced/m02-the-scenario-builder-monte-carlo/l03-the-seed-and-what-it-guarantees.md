# The seed and what it guarantees

A seed makes a Monte Carlo sample repeat exactly. That is the whole of its promise.

{{panel:ec-risk-explorer}}

## What the seed is

`runMonteCarlo` draws from mulberry32(settings.seed). A run with no seed takes DEFAULT_MC_SEED 20260829, the same value as the breakeven engine's DEFAULT_SEED. The seed travels with the result. Two runs of ISIALA at seed 20260829 repeat every value; the check reads true. The engine used to call an unseeded generator. The same inputs then gave a different answer on every run, and no number on a slide could be checked.

## A different seed, a different sample

| seed | Best case P50, million USD |
| --- | --- |
| 20260829 | 81.1835 |
| 43 | 79.0624 |

Both runs use the same field, 1000 iterations and the same plus or minus 20 percent ranges. Neither median is more correct than the other. Each is one sample of 1000, and the gap between them shows how much a single seed hides.

## What the seed does not hold fixed

The seed fixes the stream of draws. It does not fix which value each draw goes to. A falsy range consumes no draw. In the published case mc_seed3_price_only, reserves and capex are falsy, so the price draws take positions the volume draws would otherwise have used. Switch one range from zero to nonzero at the same seed, and the later draws land on different values.

The same holds across engines. The breakeven engine at the same seed takes three draws per iteration, in the order capex, opex, efficiency, through a triangular inverse CDF. Its first draw is 0.936239, as in the Scenario Builder, but there it becomes a capex of 226.5205 million USD, not a 2027 oil volume. Samples from the two apps at one seed have nothing to do with each other.

## Reproducible is not accurate

The Breakeven Analyzer shows how far a sample moves with its seed. At 5000 iterations, ISIALA's median breakeven price across seeds 1 to 10 spans 72.6338 to 73.1287, a range of 0.4949 (derived). The default seed's median, 73.3297, falls outside that span. Nothing is wrong with seed 20260829. It drew a sample near one edge of what the model produces, and every run at that seed will faithfully repeat the same edge.

## The mistake

The careful mistake is seed shopping without meaning to. An analyst runs ISIALA and sees a Best case P50 of 79.0624 at seed 43. They try the default seed and report 81.1835 because it is closer to the deterministic 81.0464. Both results are reproducible, and the choice between them puts a thumb on the scale. Fix the seed before the first run and record it beside every number. Treat the difference between seeds as part of the uncertainty. Do not tune it away as though it were an error.

## What it refuses

The engine reports no confidence interval and no standard error. It gives no warning when a case is sensitive to the seed.

## Exercise

Give ISIALA's Best case P50 at seed 20260829 and at seed 43, and say which one is accurate. Then explain why the same seed gives unrelated samples in the Scenario Builder and the Breakeven Analyzer, and why the default seed's median breakeven of 73.3297 is not a reason to distrust that seed.
