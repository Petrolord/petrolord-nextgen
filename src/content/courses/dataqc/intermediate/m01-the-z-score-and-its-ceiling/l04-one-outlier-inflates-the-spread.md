# One outlier inflates the spread

{{panel:dq-outliers-explorer}}

The ceiling explains why ten gauge readings cannot produce a flag at 3. It does not explain the next case, where the sample is large enough and the rule still stays silent. EKENE-7's fourteen core plugs carry porosity in v/v, and entry 8 is a fractured plug.

| plugs | mean | sample SD | largest absolute z | flags |
| --- | --- | --- | --- | --- |
| all fourteen | 0.221714 | 0.019859 | 2.985356 | 0 |
| entry 8 left out | 0.217154 | 0.010574 | 2.066042 | 0 |

Entry 8 reads 0.281000. The other thirteen plugs run from 0.201000 to 0.239000.

## Why fourteen plugs still flag nothing

At fourteen values the largest possible z with the sample standard deviation is 3.474396, which is above 3, so the threshold can be reached. Entry 8 reaches 2.985356 and stops just short of it. The rule was able to fire and did not.

The reason is in the second column of numbers. With all fourteen plugs the sample standard deviation is 0.019859. Leave entry 8 out and it is 0.010574. The fractured plug is part of the spread it is being measured against. A single value far from the rest enlarges the standard deviation, and a larger standard deviation shrinks every z, including the z of the value that caused it.

The mean moves as well, from 0.217154 without the plug to 0.221714 with it. The plug drags the centre towards itself and widens the yardstick at the same time, so it is measured from a nearer point with a longer ruler.

## Measured against the others

The course also derives the distance the other way round. Measured against the mean and sample standard deviation of the other thirteen plugs, entry 8 sits at 6.038080. Measured against a spread that includes itself, it reads 2.985356 and is not flagged. Both figures are correct. They answer different questions, and only the second is what `zScores` computes.

With entry 8 left out, the largest absolute z among the remaining thirteen is 2.066042. Nothing in that set stands out by this rule either.

## What this means for the z-score

The z-score is a fair measure when the series is mostly well behaved and the value in question is one of many. It weakens exactly when it is most needed: when one or two values are far enough out to set the spread themselves. Short series make it worse, because the ceiling of the last lesson sits lower there, and core plug sets, gauge checks and daily test sheets are often short.

There are two ways forward, and this tier teaches both. One is a centre and a spread that an outlier barely moves: the median and the median absolute deviation, in the next module, and the quartiles behind Tukey's fences after that. The other is a formal test that is built around this very effect: Grubbs' test in module five measures the same largest z, 2.985356 on these plugs, against a critical value derived for it.

## Exercise

Load the core plugs in the explorer's z view and confirm the mean of 0.221714, the sample standard deviation of 0.019859 and the largest absolute z of 2.985356. Delete entry 8 and confirm 0.010574 and 2.066042. Then write one sentence stating how much the sample standard deviation changed when the plug was removed, quoting both figures, and what that did to the z of entry 8.
