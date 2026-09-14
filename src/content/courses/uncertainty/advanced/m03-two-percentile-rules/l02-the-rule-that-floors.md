# The rule that floors

The Breakeven Analyzer reads its percentiles as `sorted[min(n - 1, floor(q n))]`. The answer is always one sorted value, never an average, and always a member of the sample.

{{panel:ec-risk-explorer}}

## The rule

Multiply the fraction by the count, round down, and take the value at that index, counting from zero. The `min(n - 1, ...)` guard keeps a fraction close to 1 inside the array. There is one branch and nothing to test.

Here is ISIALA's breakeven run: 5000 iterations at seed 20260829, none excluded.

| statistic | sorted index (derived) | breakeven price, USD per bbl |
| --- | --- | --- |
| 10th percentile of breakeven price | 500 | 62.1713 |
| 50th percentile of breakeven price | 2500 | 73.3297 |
| 90th percentile of breakeven price | 4500 | 85.5912 |

At index 4500, exactly 4500 iterations sit below the value. That is 90 percent, which matches the engine's insight sentence: "a 90 percent chance the breakeven price is below that."

## The same rule on NPVs

Apply the floor rule to the Scenario Builder's 1000 ISIALA NPVs and set it beside the averaging rule the Scenario Builder actually uses:

| case | averaging rule | floor rule | difference (derived) |
| --- | --- | --- | --- |
| Low case P90 (`p10`) | 48.7439 | 48.8335 | -0.0896 |
| Best case P50 (`p50`) | 81.1835 | 81.1952 | -0.0116 |
| High case P10 (`p90`) | 109.8980 | 109.9036 | -0.0056 |

Every difference is negative, and that is no accident. When n x q is whole, the averaging rule blends the value at that index with the one just before it. The floor rule takes the value at the index, which is the upper of the two. On this sample the floor rule cannot sit below the averaging rule.

## Why a breakeven engine floors

Iterations that cannot break even below the 500 USD per bbl top of the bracket are excluded and counted before the sort, so n is whatever survives. A rule with one branch behaves the same way at any surviving count. In the published case mc_with_unreachable, 55 of 120 iterations are excluded. The 10th percentile of breakeven price, 397.3404, is still a price that one real iteration produced.

## The mistake

The careful mistake is hearing "floor" as "the lower value". The floor applies to the index, not to the answer. When n x q is whole, the index it gives is the upper of the two middle positions. On a breakeven price that leans a percentile towards the risky end. On an NPV it leans towards the good end. A reader who assumes the floor rule is the cautious one has the direction backwards for NPV.

## What it refuses

The floor rule never interpolates and never averages. It gives no P-label either. The keys `p10`, `p50` and `p90` in its results are plain percentiles of a price, and the screens say 10th percentile, median and 90th percentile. Both rules share one more refusal: neither says how far its answer would move under another seed.

## Exercise

Write the floor rule. Give ISIALA's three breakeven percentiles in percentile words, with their sorted indices. Then use the three differences on the 1000 ISIALA NPVs to explain why the floor rule never reads below the averaging rule when n x q is whole.
