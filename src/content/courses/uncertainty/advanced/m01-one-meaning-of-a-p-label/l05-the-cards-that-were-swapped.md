# The cards that were swapped

Before EC3-0, the Scenario Builder's results panel printed the engine's `p90` key under "P90 (Conservative)". The card called conservative held the High case.

{{panel:ec-risk-explorer}}

## What the old panel printed

These are ISIALA's numbers at the app's settings: 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.

| engine key | old card | case now | NPV, million USD |
| --- | --- | --- | --- |
| `p10` | "P10 (Optimistic)" | Low case P90 | 15.6063 |
| `p90` | "P90 (Conservative)" | High case P10 | 152.0653 |

The card called conservative held the larger number. A reader who used it as the cautious case was given a value that only 10 percent of the sample meets or exceeds.

## How a swap like this happens

The keys look like labels. `p90` is the 90th percentile of the sorted NPVs, which is the high end. The engine's own documentation now says the keys are plain percentiles: `p10` is the low NPV and `p90` the high NPV. Print a key as though it were a P-label under the exceedance meaning, and both outer numbers land on the wrong cards.

The middle card never changed. The `p50` key is the Best case P50 under either reading, and it reads 78.5315. A panel whose middle number is right looks right at a glance.

## What EC3-0 changed

The panel now maps each key through `lib/conventions/percentile.js`. The cases are Low case = P90, Best case = P50, High case = P10, shown low to high, with the definition available: "P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS." The keys stayed as they were, for existing callers.

The same repair seeded the run. `runMonteCarlo` now draws from mulberry32 with a default seed of 20260829, so ISIALA's numbers repeat exactly.

## Reading an old report

Any saved screen or slide with a "P90 (Conservative)" card is showing a High case. Change its label, not its place in the ranking: the number on it is the value that 10 percent of that run's sample met or exceeded. Do not expect it to match 152.0653. The old engine called an unseeded generator, so that run's sample cannot be rebuilt. Only the direction of the error can be fixed.

## The mistake

The careful mistake is fixing the swap by exchanging the two numbers and keeping the old words. "Conservative" and "optimistic" are not part of the convention. They make readers look for a cautious card on every quantity. On a breakeven price that search goes wrong at once, because a price takes no P-label. ISIALA's high end there is the 90th percentile of breakeven price, 85.5912 USD per bbl, and it is the risky end.

## What the fix refuses

The repair changed words and added a seed. It did not change how an NPV is calculated. It cannot make a past unseeded run reproducible. It adds none of the uncertainty the Scenario Builder leaves out: fixed opex, royalty and tax are still never sampled.

## Exercise

Name what the old panel printed under "P90 (Conservative)" and under "P10 (Optimistic)" on ISIALA, with the engine key and value for each. Then give the three cases as the panel prints them now, from low to high, and say why the middle card never showed the swap.
