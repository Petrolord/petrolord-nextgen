# What an observed rate estimates

{{panel:ss-intervals-explorer}}

UGHELLI recorded 9 recordable cases in 2318640 hours, and its recordable rate reads 0.776317 per 200,000 hours. The ABO crew recorded 0 in 41300 hours, and its rate reads 0. Both are observed rates. Neither is the true rate of the workforce it describes, and the rest of this tier is about how far the two might be apart.

| workforce | count | hours | observed rate per 200,000 | upper 95 |
| --- | --- | --- | --- | --- |
| BLS ABC Company | 7 | 400000 | 3.500000 | 7.211338 |
| IMO ladder, ten events | 10 | 1000000 | 2.000000 | 3.678071 |
| ABO crew | 0 | 41300 | 0 | 17.863823 |

## The estimate and its target

Under the Poisson count model the site has a true rate, and the true rate times the hours over the base is the mean count. The observed rate is the count times the base over the hours. Read that way, the observed rate is the site's best single guess at the true rate, and the interval is the range of true rates the count cannot rule out at the stated confidence.

The target is narrow. It is the true rate of this workforce, over these hours, with events classified the way this site classified them. It says nothing on its own about next year, a sister site or a contractor who did the same work somewhere else.

## A zero is an estimate too

The ABO crew's observed rate is 0, and nobody believes the crew's true rate is zero. At 95 percent its upper limit is 17.863823 per 200,000 hours, which is far above every other observed rate in the table. A zero on 41300 hours is a small amount of evidence, and the interval says exactly how small.

The same holds for an observed FAR. UGHELLI's observed FAR is 0.000000 on 0 fatalities in 2318640 hours. That figure describes what happened on those hours and places no floor under what could have happened.

## The count sets the certainty

The BLS company and the IMO row with ten events have similar counts, and their upper limits sit at roughly twice their rates. The ABO crew has no events at all, and its upper limit is the whole story. What the observed rate estimates is always the same kind of thing. How well it estimates it depends on the count underneath, and the hours only matter through the count they produced.

## What to carry forward

When you read an observed rate, ask three questions: how many events it rests on, over how many hours, and on which base. The first answer tells you how wide its interval will be before you compute it.

## Exercise

Open the intervals explorer and enter UGHELLI's 9 recordable cases in 2318640 hours on the 200,000 base at confidence 0.95. Record the limits the engine returns beside the observed 0.776317. Then state whether UGHELLI's interval is wider or narrower, relative to its own rate, than the BLS company's interval of 1.407182 to 7.211338 around 3.500000, and explain the answer by the counts.
