# Onward

The Professional tier read one breakeven price in percentile words. The Expert tier puts an NPV beside it, where the labels change meaning, and asks which printed numbers deserve trust at all.

## One meaning of a P-label

An NPV is a quantity where more is better, so it takes P-labels under the exceedance meaning. Run ISIALA through the Scenario Builder's Monte Carlo at the app's own settings, 1000 iterations with price, capex and reserves each plus or minus 20 percent at seed 20260829, and the Low case P90 is 15.6063 million USD, the Best case P50 78.5315 and the High case P10 152.0653. The engine stores the low case under the key `p10`. The panel that shipped before the repair printed the `p90` key under "P90 (Conservative)", which on ISIALA is 152.0653, so the card called conservative held the larger number.

## A second sampler and a second rule

That Monte Carlo draws one factor for each uncertain variable per iteration, uniform around the base value and applied to every year. Reserves carries the variable opex its barrels earn, while fixed opex, royalty and tax are never sampled at all. It reads percentiles by its own rule too: on the same 1000 NPVs the screening rule gives a 10th percentile of 15.6063 and the breakeven rule gives 15.6619. Two rules live in one module, each correct by its own definition.

## How much a percentile wobbles

The seed makes a run repeatable and promises nothing about accuracy. At 5000 iterations the breakeven medians of seeds 1 to 10 span 72.6338 to 73.1287, a range of 0.4949, and the default seed's 73.3297 sits outside that span.

## Numbers to distrust

NTEJE is worth -123.9923 million USD, and the engine says plainly what it cannot find: irr null with irrStatus no-root, payback null with paybackStatus not-recovered. OKPOMA's cumulative is 9.2498 after year 1 and -2.2287 after year 2, so its payback reads 0.0000 with paybackStatus recrossed and paybackLast 2.0385. Before the 2026-09-15 repair both reported an IRR of 1000 percent, the Newton clamp, which is finding S1, and OKPOMA's payback carried no status. ISIALA's mid-year NPV over its year-end NPV is 1.058301, the square root of 1.12.

## What to carry

Three habits survive the move. State every belief as percentiles and read the beliefs line before quoting a base case. Write the seed and the excluded count beside every percentile you quote. And keep percentile words on a price and on every input, with P-labels reserved for an NPV.

## Exercise

Write ISIALA's Scenario Builder Low, Best and High cases with their P-labels and the NPV of each, and the label the old panel printed above 152.0653. Then say why ISIALA's breakeven price from the breakeven engine takes no P-label at all.
