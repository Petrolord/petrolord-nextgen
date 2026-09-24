# A centre that outliers barely move

{{panel:dq-outliers-explorer}}

Module one ended with a problem: an outlier helps set the mean and the standard deviation it is measured against. This module replaces both with statistics the outlier can barely touch. The first is the median, the middle value once the series is sorted.

EKENE-3's ten gauge readings, with and without the glitch at entry 7:

| gauge readings | mean, derived | median | sample SD | MAD |
| --- | --- | --- | --- | --- |
| all ten | 215.250000 | 212.500000 | 8.732220 | 0.100000 |
| entry 7 left out | 212.488889 | 212.500000 | 0.126930 | 0.100000 |

The mean column is lib/stats `mean`, the function the engine itself imports.

## What the glitch does to each column

Read the table across. Removing entry 7 moves the mean from 215.250000 to 212.488889 degF, and the sample standard deviation from 8.732220 to 0.126930. The median reads 212.500000 in both rows, and the last column, the median absolute deviation, reads 0.100000 in both. The next lesson defines it.

The reason is how the median is found. It depends on the order of the values and on the one or two in the middle, and a single value at the far end can change neither by much. Entry 7 could read 240.100000 or any higher figure and the middle of the sorted ten would be the same. The mean, by contrast, adds every value in, so one large value pulls it along in proportion to how large it is.

## The core plugs

The same holds for EKENE-7's fourteen core plugs. Their median is 0.215500 v/v. Module one showed their mean moving from 0.217154 to 0.221714 when the fractured plug at entry 8 was included. A centre that shifts with the outlier makes the outlier look nearer.

## What the median gives up

The median is not free. On a clean series it uses the data less efficiently than the mean, because it listens mostly to the middle values. The engine does not pick one for you. It offers both families of rule, names the centre each uses in its basis block, and leaves the choice of question to the analyst.

## The two families

From here on, this tier sorts its rules by the centre and spread each one measures from:

* the mean and the sample standard deviation: the z-score and, in module five, Grubbs' test;
* the median and the median absolute deviation: the modified z-score in this module, and the Hampel window in module four;
* the quartiles: Tukey's fences in module three.

A value that the first family misses can stand out clearly to the second, and the gauge glitch is the example the next two lessons follow.

## Exercise

Open the explorer's modified z view with the gauge readings and read the median, 212.500000, and the raw MAD, 0.100000. Delete entry 7 and confirm that both figures stay the same. Then switch to the z view, delete entry 7 there, and confirm the sample standard deviation of 0.126930. State in one sentence which of the two centres you would measure entry 7 from, and why.
