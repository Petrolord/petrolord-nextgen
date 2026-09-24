# The modified z-score

{{panel:dq-outliers-explorer}}

Put the median and the MAD where the mean and the standard deviation were, and you have the modified z-score of Iglewicz and Hoaglin. The engine's `modifiedZScores` computes it exactly as NIST/SEMATECH 1.3.5.17 prints it:

M = 0.6745 (x - median) / MAD

with the raw MAD from the last lesson. A value whose absolute M is strictly beyond 3.5 is labelled a potential outlier, which is the source's own word and the engine's.

| series | median | MAD | largest absolute M | entries flagged |
| --- | --- | --- | --- | --- |
| EKENE-3 gauge | 212.500000 | 0.100000 | 186.162000 | 7 |
| EKENE-7 core | 0.215500 | 0.007500 | 5.890633 | 8 |

## The gauge glitch, measured twice

Module one measured entry 7 on the gauge with the ordinary z-score and got 2.845783, below the threshold of 3 and below the ceiling of 2.846050 that ten readings allow. The modified z-score of the same reading is 186.162000, far beyond 3.5, and entry 7 is the only entry flagged.

The reading is the same; the yardstick changed. The ordinary z divides by a standard deviation the glitch inflated to 8.732220. The modified z divides by a MAD of 0.100000 that the glitch could not reach. The ceiling in module one came from the outlier sitting inside its own mean and standard deviation. Here the median and the MAD are set by the nine ordinary readings, so the glitch is measured from outside the statistics that describe the rest, and 186.162000 is the result.

## The core plugs

On EKENE-7's fourteen plugs the largest absolute M is 5.890633, at entry 8, the fractured plug, and it is the only entry flagged. The ordinary z of the same plug was 2.985356 and flagged nothing. The two rules disagree on the same data because they ask different questions: how far is this plug from the mean in a spread it helped set, and how far is it from the median in a spread it could not touch.

## Why 3.5 and why the label

The threshold 3.5 is Iglewicz and Hoaglin's recommendation as NIST prints it, and the engine exports it as `MODIFIED_Z_THRESHOLD`. It is a choice, open to the caller. A flag says the value is far from the median by this rule, and that is a reason to look at the value. It does not say the value is wrong.

## Reading the flag

Each flag carries a `statistic` field and a reason sentence. The reason prints every digit of the computed M, so for the gauge it carries a long string of decimals. This course quotes the `statistic` field at six decimals, 186.162000, and reasons from that. Quote the reason only as the engine's own words, in full.

A report should name the rule and its settings together: the modified z-score with the raw MAD, 0.6745 as printed, threshold 3.5.

## When to use it

The modified z-score suits short series where one or two values may be wild, which is where the ordinary z-score fails. Its blind spot, a MAD of zero, closes this module.

## Exercise

Open the explorer's modified z view with the gauge readings. Confirm the median of 212.500000, the MAD of 0.100000 and the modified z of entry 7, 186.162000. By hand, subtract the median from 240.100000, multiply by 0.6745 and divide by the MAD, and check your result against the explorer. Then load the core plugs, confirm 5.890633 at entry 8, and write one sentence comparing it with the ordinary z of the same plug, 2.985356.
