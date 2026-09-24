# Masking

{{panel:dq-outliers-explorer}}

Grubbs' test rejected the fractured plug. Now add a second high plug. EKENE-7's core set has a copy with a second high value at entry 2, stated 0.279000, beside the fractured plug at entry 8, still fourteen plugs in all.

| core plugs | n | sample SD | G | critical at alpha 0.05 | reject | suspect entry |
| --- | --- | --- | --- | --- | --- | --- |
| one fractured plug | 14 | 0.019859 | 2.985356 | 2.507321 | true | 8 |
| two high plugs | 14 | 0.024800 | 2.275359 | 2.507321 | false | 8 |

With two high plugs the test no longer rejects. G falls from 2.985356 to 2.275359, below the unchanged critical value, and the test reports no outlier in a set that now holds two.

## Why the second plug hides the first

The critical value did not move: it depends only on n, alpha and the side, and all three are the same. What moved is G. The sample standard deviation rose from 0.019859 to 0.024800 with the second plug in it, and the second plug sits in the mean as well. Entry 8 is still the suspect, still the value farthest from the mean, but it is now measured against a wider spread, and its G is smaller.

This is masking. One outlier is hidden by another, because both of them help set the mean and standard deviation that the test measures against. It is the effect of module one again, with two values instead of one, and a formal test does not escape it. A test designed to find one outlier can be defeated by the presence of a second.

## What the robust rules see on the same data

The rules built on the median and the quartiles are much harder to mask, because two values out of fourteen barely move a median, a MAD or a quartile. At their defaults on the two-plug copy:

| method, at its defaults | entries flagged on the two high plugs |
| --- | --- |
| z beyond 3 | none |
| modified z beyond 3.5 | 2, 8 |
| Tukey fences, R7 k 1.5 | 2, 8 |
| Hampel, halfWindow 3 | 2, 8 |
| Grubbs rejects | none |

The two rules that measure from the mean and the sample standard deviation both miss both plugs. The three that measure from the median, the quartiles or a window median flag both.

## The test the engine does not build

NIST points to the generalised extreme studentised deviate test for a sample that may hold several outliers. The engine does not build it, and says so in its list of what is not built: Grubbs for one, with the masking it suffers shown here.

Running Grubbs repeatedly, removing the suspect each time, is not a substitute either. On the two-plug copy the first run does not reject, so the procedure would stop before removing anything.

## What to do

On a small set where more than one value may be wrong, run a robust screen first, the modified z-score or the fences, and read its flags. Use Grubbs' test when a single suspect is the question, and state that the test is for one outlier. A report that quotes a Grubbs result of no outlier should say whether a second extreme value was present that could have masked the first.

## Exercise

Open the explorer's Grubbs view with the two high plugs copy, two-sided, alpha 0.05. Confirm G of 2.275359, the critical value of 2.507321 and reject false. Then switch to the modified z view on the same data and confirm that entries 2 and 8 are both flagged. Write one sentence for a core report that explains why Grubbs found no outlier.
