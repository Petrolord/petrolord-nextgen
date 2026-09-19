# The Poisson count model

{{panel:ss-intervals-explorer}}

Seven recordable cases in 400000 hours read 3.500000 per 200,000 hours. That is the BLS worked example, and at 95 percent the engine says the true rate behind it could lie anywhere from 1.407182 to 7.211338. The seven cases were one draw. Another year at the same site, with the same hours and the same true rate, could have drawn five cases or nine.

| count | hours | rate per 200,000 | lower 95 | upper 95 |
| --- | --- | --- | --- | --- |
| 7 | 400000 | 3.500000 | 1.407182 | 7.211338 |
| 1 | 100000 | 2.000000 | 0.050636 | 11.143287 |
| 100 | 10000000 | 2.000000 | 1.627280 | 2.432536 |

## The model in one sentence

The Poisson count model says three things. A workforce exposed for a known number of hours has a true rate. The true rate times the exposure gives a mean count. The count the site records is one draw around that mean. The true rate is what a manager wants to know, and the count is what the site actually has. Everything in this tier is about the distance between those two.

## What the model takes for granted

Events arrive one at a time and independently, and the chance of an event in any short stretch of work is in proportion to the hours in that stretch. Those two assumptions are why a count carries its own uncertainty with it. Once the mean is known, the Poisson distribution fixes how widely the counts scatter around it, so no second number for the spread has to be supplied. Where one bad job injures three people at once, those events are plainly dependent, and the scatter in real counts will be wider than the model says. Keep that in mind when a site's cases arrive in clusters.

## Why the engine starts here

Both of the functions this tier uses are built on the model. `rateConfidenceInterval` returns the Garwood exact interval for a Poisson count, scaled to the base. `compareRates` takes two counts and conditions on their total. Neither function asks you for a standard deviation, because the model supplies the spread from the count itself.

The base is still required. The interval is worked on the count first and then multiplied by the base over the hours, exactly as the Associate rate was, so the base you name moves the limits in step with the rate and changes nothing about how sure the figure is.

## Same rate, different certainty

The second and third rows of the table read the same rate, 2.000000 per 200,000 hours. One rests on 1 event in 100000 hours and its upper limit is 11.143287. The other rests on 100 events in 10000000 hours and its upper limit is 2.432536. The rate alone cannot tell those two apart. The count underneath it can, and the Poisson count model is the reason it can.

## A word on the name

The surname also belongs to an elastic property of rock that the geomechanics courses teach. This course therefore always writes Poisson count model or Poisson distribution in full, so that a reader moving between courses is never unsure which idea is meant.

## Exercise

Open the intervals explorer and enter 7 cases in 400000 hours on the 200,000 base at confidence 0.95. Record the rate and both limits. Then enter 1 event in 100000 hours and 100 events in 10000000 hours. For each of the three rows, divide the upper limit by the rate, and state which of the three rates a manager should lean on least.
