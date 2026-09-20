# Zero events is still a measurement

{{panel:ss-intervals-explorer}}

The ABO crew worked 41300 hours with 0 recordables. The observed rate is 0. The interval is not:

| what | value |
| --- | --- |
| hours | 41300 |
| recordables | 0 |
| observed rate | 0 |
| 95 percent lower limit per 200,000 | 0.000000 |
| 95 percent upper limit per 200,000 | 17.863823 |

A crew with no recordables on those hours cannot, at 95 percent, rule out a true rate as high as 17.863823 per 200,000 hours.

## What a zero is evidence of

A zero is a count like any other. Under the Poisson count model it is one draw from a distribution with some mean, and a small mean makes zero likely while a large mean makes it rare. Zero on 41300 hours is quite likely under a modest true rate and still plausible under a surprisingly high one. The interval is the list of true rates for which a zero would not be unusual at the stated confidence. That list starts at 0 and runs up to 17.863823.

So the zero measured something. It bounds the rate from above, and the bound is the useful output. It says how bad the crew's true rate could be and still be consistent with a clean record.

## Why the bound is so high here

41300 hours is a small exposure. On the IMO ladder, the most thinly supported rung was 1 event in 100000 hours, and the ABO crew has well under half of that. With so few hours, even a crew with a genuinely poor true rate could get through without a recordable. The upper limit reports that plainly.

For comparison, the whole of UGHELLI's year reads 0.776317 per 200,000 hours on 9 recordables in 2318640 hours. The ABO crew's clean record cannot show it is safer than that. Its upper limit is many times higher.

## The observed FAR works the same way

UGHELLI's 0 fatalities in 2318640 hours give an observed FAR of 0.000000. The Associate tier noted that a zero FAR on a few million hours says little. This module is where that sentence gets its figure: the same zero events arithmetic, applied to fatalities on the base of 100,000,000 hours, bounds the observed FAR from above in exactly the way it bounds the ABO recordable rate.

## What a zero is used for

A zero is often reported as a success, and on its hours it may be one. The honest form of the claim is the upper limit. Reporting 0 with an upper limit of 17.863823 tells a reader that the crew's record is clean and that its exposure is too thin to call the crew safe on the record alone. Reporting 0 by itself says only the first half.

## Exercise

Open the intervals explorer and enter 0 recordables in 41300 hours on the 200,000 base at confidence 0.95. Confirm the upper limit of 17.863823. Then enter UGHELLI's 0 fatalities in 2318640 hours on the 100,000,000 base at the same confidence, record the upper limit the engine returns, and write one sentence that reports UGHELLI's observed FAR with that limit beside it.
