# Grubbs for one outlier

{{panel:dq-outliers-explorer}}

Module one showed the z-score missing EKENE-7's fractured core plug: the largest absolute z among the fourteen plugs was 2.985356, below the threshold of 3. The trouble lay in the yardstick: a fixed threshold of 3 takes no account of the sample size or of the fact that the plug helped set the standard deviation measuring it. Grubbs' test asks a sharper question: is the most extreme value in this sample farther out than one value in a normal sample of this size would plausibly be?

The engine's `grubbsTest` on the fourteen plugs, two-sided, alpha 0.05:

| core plugs | n | sample SD | G | critical at alpha 0.05 | reject | suspect entry |
| --- | --- | --- | --- | --- | --- | --- |
| one fractured plug | 14 | 0.019859 | 2.985356 | 2.507321 | true | 8 |

## The statistic

Grubbs' G is the largest absolute deviation from the mean divided by the sample standard deviation:

G = max |Y - mean| / s

It is the largest absolute z-score of module one under another name. On the single-spike plugs G is 2.985356, and the largest absolute z in module one was 2.985356.

## The comparison

What is new is the line G is compared with. The z-score compared 2.985356 with a fixed 3 and flagged nothing. Grubbs' test compares it with a critical value derived for fourteen values at alpha 0.05, which the engine returns as 2.507321. G is above it, so the test rejects the hypothesis that the fourteen plugs contain no outlier, and it names entry 8 as the suspect.

The critical value is built for this sample size and alpha. The next lesson shows where it comes from and how it moves with n. The same 2.985356 fails one rule and passes the other, and both are correct answers to their own questions.

## What a rejection says

A rejection says that, if the plugs were a normal sample, a largest deviation this big would happen with probability below alpha. It names one suspect, the value farthest from the mean. It does not say that entry 8 is a bad measurement. In a real core set it is a reason to go back to the plug and its description.

Grubbs' test assumes the rest of the data are roughly normal. On fourteen plugs that is hard to check, so a report should say it was assumed.

## The test is for one outlier

Grubbs' test asks about the single most extreme value. NIST points to the generalised extreme studentised deviate test for several suspected outliers, and the engine does not build it. The third lesson of this module shows what two high values do to it.

## The settings

Three settings, each stated in the basis block:

* alpha, the significance level, 0.05 by default as NIST 1.3.5.17.1 uses it;
* the side: two-sided by default, or `max` or `min` for a one-sided test on the largest or smallest value;
* the standard deviation, always the sample one.

Alpha is a fraction. The engine refuses a percentage by name, naming the field `alpha`:

> alpha must be a significance level strictly between 0 and 1

## Exercise

Open the explorer's Grubbs view with the core plugs, two-sided, alpha 0.05. Confirm G of 2.985356, the critical value of 2.507321, reject true and the suspect entry 8. Then switch to the z view on the same plugs and confirm that the largest absolute z is the same 2.985356. State in one sentence why one rule rejects and the other flags nothing.
