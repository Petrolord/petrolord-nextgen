# The expected proportion from the hours

{{panel:ss-intervals-explorer}}

The ERHA comparison turns on two proportions, one read from the hours and one read from the events:

| side | events | hours |
| --- | --- | --- |
| east | 6 | 240500 |
| west | 11 | 902700 |
| together | 17 | hours summed |

| proportion | value |
| --- | --- |
| expectedProportion, east hours over all hours | 0.210374 |
| east share of the events, derived | 0.352941 |

If the two sides share one true rate, east should hold about 0.210374 of the events. It holds 0.352941.

## Where the expected proportion comes from

Under equal rates, every hour worked carries the same chance of an event. An event is then equally likely to fall in any hour, so the share of events a side should expect is its share of the hours. East worked 240500 of the hours and west 902700, and the engine returns east's share of the total as `expectedProportion`, 0.210374. It is the binomial probability the conditional test uses.

Nothing about the events enters this figure. It is fixed by the hours before a single event is counted, which is why it is called expected.

## What the observed share says

East recorded 6 of the 17 events, a share of 0.352941. That is well above 0.210374. On its face east looks worse: it has about a fifth of the hours and about a third of the events. The question the test asks is whether a gap of that size is unusual for a binomial on 17 trials with probability 0.210374.

The answer is the upper tail, 0.128104: the probability of east recording 6 or more of the 17 if the rates are equal. Roughly one comparison in eight would show a gap at least that large by chance alone. The gap is real in the data, and a gap of that size turns up often enough under equal rates to prove nothing on its own.

## Why hours and never headcount

This is the Associate rule about hours, carried into comparison. If the expected proportion were built from headcount, a side whose people worked longer rotations would be expected to hold too few of the events, and it would look worse than it is. The Associate day crew and rotation crew, with 1 recordable each, read the same per head, while per hour of exposure the day crew reads 1.456000 times the rotation crew. The conditional test inherits that lesson: `compareRates` takes hours and has no headcount input.

## When the proportion is extreme

When one side has a tiny share of the hours, its expected share of the events is tiny too, and even one event on that side can look large. The binomial handles that honestly, because the upper tail still accounts for how few events there were in total. What it cannot do is make a small total informative. Many of the zero events lessons apply here with the same force.

## Exercise

Compute east's share of the ERHA hours from 240500 and 902700 and confirm the engine's expectedProportion of 0.210374. Then multiply that proportion by the total of 17 events to find the number of events east would expect under equal rates, and state how many more than that east actually recorded.
