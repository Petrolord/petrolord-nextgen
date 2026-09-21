# Small exposure and wide swings

{{panel:ss-intervals-explorer}}

The IMO ladder holds the observed rate at 2.000000 per 200,000 hours and grows the exposure, pairing each event with 100000 hours. Every row reads the same rate. The limits tell seven different stories.

| count | hours | lower 95 | upper 95 | upper over lower | width over rate |
| --- | --- | --- | --- | --- | --- |
| 1 | 100000 | 0.050636 | 11.143287 | 220.068159 | 5.546326 |
| 2 | 200000 | 0.242209 | 7.224688 | 29.828286 | 3.491239 |
| 5 | 500000 | 0.649395 | 4.667333 | 7.187207 | 2.008969 |
| 10 | 1000000 | 0.959078 | 3.678071 | 3.835008 | 1.359497 |
| 20 | 2000000 | 1.221652 | 3.088838 | 2.528411 | 0.933593 |
| 50 | 5000000 | 1.484439 | 2.636751 | 1.776261 | 0.576156 |
| 100 | 10000000 | 1.627280 | 2.432536 | 1.494848 | 0.402628 |

## Reading down the ladder

At 1 event the upper limit is 220.068159 times the lower. At 100 events it is 1.494848 times. The width of the interval, measured against the rate itself, falls from 5.546326 to 0.402628 across the same climb. A hundred times the exposure buys a great deal of certainty, and most of it arrives early: the step from 1 event to 2 takes the ratio of the limits from 220.068159 to 29.828286, while the step from 50 to 100 takes it only from 1.776261 to 1.494848.

The lesson for a small workforce is plain. A crew that logs a few hundred thousand hours a year will spend most of its life on the top three rows. Its rate can be honest and still carry almost no information about its true rate.

## What a short month does

Small exposure does not only happen to small crews. It happens to ordinary crews in short periods. In the Associate AKASO stream, month 11 was a short month of 18240 hours with 1 recordable, and its monthly rate reads 10.964912 per 200,000 hours. The month after it logged 222150 hours with no recordable and reads 0.000000. Nothing about the site changed between those two months that the rates can show. One event landed in very few hours, and then no event landed in many.

A monthly table on a thin denominator will swing like this as a matter of course. The swings are the Poisson distribution at work on a small mean, and the first row of the ladder above is what one of those months looks like once an interval is put beside it.

## Pooling is the Associate answer

Associate taught sum then divide, and it is also the first defence against wide swings. AKASO's first rolling window pools twelve months and reads 1.208038, where the short month alone read 10.964912. Pooling moves the reading down the ladder, because the window carries 13 events rather than 1. The interval on that window would still have to be computed, and the explorer will do it for you.

## Why a manager should care

A rate that jumps from one month to the next invites a response: a stand down, a campaign, a new procedure. When the jump comes from a thin denominator, the response is aimed at chance. Checking the count and the hours before reacting is the cheapest safety tool this course teaches.

## Exercise

Take the ladder rows for 2 events and 20 events. For each, subtract the lower limit from the upper limit and divide by the rate of 2.000000, and confirm that you reproduce the width over rate column. Then state how many times wider, relative to the rate, the 2 event interval is than the 20 event interval.
