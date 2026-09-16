# An NPV low case

On an NPV, the Low case is the P90. It reads the engine's `p10` key and it is shown first.

{{panel:ec-risk-explorer}}

## Which percentile a low case takes

The convention module asks one question about a quantity: does more of it help? More NPV helps, so the low case takes its 10th percentile. Its header carries the direction with it: "Low case NPV (low value)".

Here is ISIALA's Scenario Builder run at seed 20260829, with 1000 iterations:

| case | P-label | engine key | NPV, million USD |
| --- | --- | --- | --- |
| Low case | P90 | `p10` | 15.6063 |
| Best case | P50 | `p50` | 78.5315 |
| High case | P10 | `p90` | 152.0653 |

The order never changes: low, best, high. The convention module also has a gate helper that flags any case set where the P90 is larger than the P50, or the P50 larger than the P10.

## Two numbers called low

`generateScenarios` builds a scenario Low: price and production at 0.8 times base, capex and fixed opex at 1.2 times, all at once and in every year. It reports -57.8151 million USD. That is one deterministic case at a chosen corner. The Low case P90 is a statistic of 1000 random cases, and it reads 15.6063 million USD.

The two share a word and nothing else. The scenario Low even sits below the lowest sampled NPV, -46.1564. The Monte Carlo draws its three factors independently of one another and never samples fixed opex, so it rarely pushes everything to its bad end at once.

## Three numbers near the middle

ISIALA's deterministic case is 81.0464, its Best case P50 is 78.5315, and its EMV is 80.9836. The EMV is the plain mean of the 1000 NPVs. It is not a case, it takes no P-label, and it is not a third name for the P50. On this sample it sits above the Best case and below the deterministic case, because the sampled NPVs lean to the high side of their median.

## The mistake

The careful mistake is taking the scenario Low for the P90. Put -57.8151 under a P90 heading and you have told a board there is a 90 percent chance of doing better than -57.8151 million USD. Not one of the 1000 iterations reached that value, and the lowest of them stops at -46.1564.

The opposite mistake is printing the `p10` key under a heading that reads P10. That puts the Low case number beside the High case label. Both errors take a label from a word or a key instead of from the definition.

## What the low case refuses

The P90 is not a floor and not a worst case. By definition, 10 percent of the sample sits below it, and here that tail reaches down to -46.1564. It does not hold still under a new seed either. Seed 43 gives a Best case P50 of 80.2233 against 78.5315 at the default seed, and the Low case comes from that same shifted sample. It also ignores everything the model does not sample. Fixed opex, royalty and tax stay fixed in every iteration, so none of their uncertainty is in 15.6063.

## Exercise

Give ISIALA's Low case with its P-label, engine key and value, and say which percentile of NPV it takes and why. Then put the scenario Low, the Low case P90 and the lowest sampled NPV in order. Say in one sentence why the scenario Low is not a P90.
