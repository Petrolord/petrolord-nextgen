# Exceedance on outcomes

A P-label in the Suite is a probability of exceedance. It belongs only on an outcome where more is better, such as an NPV or an EMV.

{{panel:ec-risk-explorer}}

## The sentence

Every probabilistic outcome the Suite publishes carries one definition, imported from `lib/conventions/percentile.js`:

"P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS."

The cases follow from it, shown low to high: Low case = P90, Best case = P50, High case = P10. A value that 90 percent of outcomes meet or exceed has to sit near the bottom of the range. So P90 is the smallest of the three numbers and P10 the largest.

## ISIALA's three cases

Here is ISIALA through the Scenario Builder's Monte Carlo at the app's own settings: 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.

| case | P-label | engine key | NPV, million USD |
| --- | --- | --- | --- |
| Low case | P90 | `p10` | 48.7439 |
| Best case | P50 | `p50` | 81.1835 |
| High case | P10 | `p90` | 109.8980 |

Read the Low case row the way the definition says: 90 percent of the sampled NPVs meet or exceed 48.7439 million USD. Read the High case row the same way: only 10 percent meet or exceed 109.8980 million USD.

## Why the keys and the labels disagree

The engine returns `p10`, `p50` and `p90` as plain percentiles of the sorted NPVs. The `p10` key is the value with 10 percent of the sample below it. That is the same value 90 percent of the sample meets or exceeds. So the Low case reads the `p10` key and prints P90.

## Why only outcomes

Exceedance is clear only when more is better. Meeting or exceeding 48.7439 million USD is good news, so P90 is the cautious number. On a quantity where more is worse, the same sentence flips. The breakeven price that 90 percent of iterations meet or exceed is a low, comfortable price. The convention's answer is to refuse the label there. ISIALA's breakeven price is quoted as 10th percentile of breakeven price 62.1713, median 73.3297 and 90th percentile of breakeven price 85.5912, all in USD per bbl.

## The mistake

The careful mistake is reading P90 as "the 90th percentile". It is the habit arithmetic teaches, and it lands on the wrong row. A reader who does this quotes 109.8980 as the P90 and calls the High case cautious. The check is the order. Under the exceedance meaning, P90 is at or below P50 and P50 is at or below P10. ISIALA's three numbers pass, and the swapped reading fails.

## What the label refuses

A P90 describes the sample the model drew and nothing more. The Scenario Builder never samples opex, royalty or tax. It draws every year and every variable independently. The 90 percent in the sentence is therefore 90 percent of a model with no correlation between its uncertainties. The label does not make 48.7439 a floor either: the lowest of the 1000 NPVs is 16.3054.

## Exercise

Copy the definition sentence. Then give ISIALA's three cases from low to high, with the P-label and the engine key for each. Say why the Low case prints P90 while reading the `p10` key. Finally, say why a breakeven price of 85.5912 USD per bbl carries no P-label.
