# Onward

The Professional tier read one breakeven price in percentile words. The Expert tier puts an NPV beside it, where the labels change meaning, and asks which printed numbers deserve trust at all.

## One meaning of a P-label

An NPV is a quantity where more is better, so it takes P-labels under the exceedance meaning. Run ISIALA through the Scenario Builder's Monte Carlo at the app's own settings, 1000 iterations with price, capex and reserves each plus or minus 20 percent at seed 20260829, and the Low case P90 is 48.7439 million USD, the Best case P50 81.1835 and the High case P10 109.8980. The engine stores the low case under the key `p10`. The panel that shipped before the repair printed 109.8980 under "P90 (Conservative)", so the card called conservative held the larger number.

## A second sampler and a second rule

That Monte Carlo draws uniformly around each base value with no triangle, and it never samples opex, royalty or tax. It also reads percentiles by its own rule. On the same 1000 NPVs the screening rule gives a 10th percentile of 48.7439 and the breakeven rule gives 48.8335. Two rules live in one module, each correct by its own definition.

## How much a percentile wobbles

The seed makes a run repeatable and promises nothing about accuracy. At 5000 iterations the breakeven medians of seeds 1 to 10 span 72.6338 to 73.1287, a range of 0.4949, and the default seed's 73.3297 sits outside that span. A median printed to four decimals is moving in its first decimal from seed to seed.

## Numbers to distrust

NTEJE has an NPV of -123.9923 million USD, never pays back, and reports an IRR of 1000 percent, which is the Newton clamp, finding S1. OKPOMA's cumulative is 9.2498 after year 1 and -2.2287 after year 2, and its payback reads 0.0000 because the payback is never revisited. ISIALA's mid-year NPV over its year-end NPV is 1.058301, the square root of 1.12, a ratio fixed by the rate.

## What to carry

Three habits survive the move. State every belief as percentiles and check its fit before sampling. Write the seed and the excluded count beside every percentile you quote. And keep percentile words on a price and on every input, with P-labels reserved for an NPV.

## Exercise

Write ISIALA's Scenario Builder Low, Best and High cases with their P-labels and the NPV of each, and the label the old panel printed above 109.8980. Then say why ISIALA's breakeven price from the breakeven engine takes no P-label at all.
