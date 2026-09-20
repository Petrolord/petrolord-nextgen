# Stretching an interval

{{panel:lp-proof-test}}

{{panel:lp-sif-builder}}

The request arrives on every operating plant. The turnaround has moved, the isolation is not available, the test crew is short, so may the proof test interval be stretched? The honest answer is an arithmetic one, and the arithmetic has a trap in it. A safety instrumented function that is stretched loses PFDavg smoothly, and it loses its SIL band in a jump. Watching the band is therefore a way of missing the moment the function stopped meeting its requirement.

## The IDU function re-verified at five intervals

Every proof test interval in the function stretched together, against the ORONI requirement.

| interval, years | SIF PFDavg | RRF | SIL | meets the ORONI TMEL |
| --- | --- | --- | --- | --- |
| 1 | 0.001792971954 | 557.733208 | 2 | true |
| 2 | 0.004062218645 | 246.170895 | 2 | true |
| 3 | 0.006819960176 | 146.628422 | 2 | true |
| 3.5 | 0.008382016506 | 119.303034 | 2 | false |
| 4 | 0.010066196546 | 99.342388 | 1 | false |

## The row that matters

Stretched to 3.5 years the teaching function misses its tolerable mitigated event likelihood while it is still SIL 2. It drops to SIL 1 only at 4 years. Read the SIL column alone and nothing happens between one year and 3.5 years: four rows all say 2. Read the last column and the function failed somewhere between three years and 3.5 years, because 0.008382016506 is above the required 0.007407407407 while 0.006819960176 is below it.

A SIL band is a decade wide. The required PFDavg is one number inside that decade, and every value in the band above that number misses the requirement. A SIL that holds is no evidence that the requirement holds.

From one year to two years the PFDavg grows from 0.001792971954 to 0.004062218645, which is more than double, because the redundant subsystems are turning quadratic in the interval. From three years to four years it grows from 0.006819960176 to 0.010066196546. The achieved risk reduction factor falls from 557.733208 to 99.342388 across the whole stretch, which is more than a factor of five for a factor of four in interval.

## Stretching everything together

Notice what was stretched. Every proof test interval in the function moved at once, which is what a deferred turnaround actually does. That is a harsher change than stretching one subsystem, because all three shares of the sum grow together, and the share that grows fastest is the one that was already largest. A planner who asks about the valves alone is asking a narrower question, and the answer to it will be longer than the answer above. Both questions are legitimate and they have different answers, so a note records which one was asked.

## How to answer the request

Recompute the whole function at the proposed interval and compare the achieved PFDavg with the required PFDavg. Report the achieved figure, the required figure and the verdict in that order, with the band as a label beside them. If the verdict is false, say what the longest acceptable interval is, because the longest interval search will give it and a planner can work with a date. A stretch that is refused with a number attached is a conversation. A stretch refused with a band is an argument.

## Exercise

Take the three year row at 0.006819960176 and the 3.5 year row at 0.008382016506, with the requirement of 0.007407407407 between them. Work out how much of the requirement each row uses, as a percentage. Then estimate where between the two intervals the crossing falls, and write the two sentence reply you would send to the planner who asked for 3.5 years.
