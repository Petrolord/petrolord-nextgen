# The capstone brief

{{panel:lp-proof-test}}

{{panel:lp-sif-builder}}

The Expert capstone asks the question this tier owns: how long may the proof test run, and what does the engine not know. It gives a facility, the PFDavg budget or target each part of a safety instrumented function has to meet, and every input stated, including the lifetime wherever coverage is below one. Nothing has to be inferred, and no figure from a published paper is carried in. The work is to compute, to band, to find the interval and to say what was not checked.

## The method, in order

Start with the row and get the required PFDavg, because every later step is measured against it. Then compute each subsystem from its own inputs and sum them, because the function is a series sum and a subsystem read in isolation answers nothing. Then compare the achieved figure with the required figure and write the verdict from that comparison. Only then look at the band, as a label beside the numbers. Finally take the interval question: either the longest interval that holds the target, or the effect of a proposed interval on the whole function.

## Where marks are lost

| the mistake | what it looks like |
| --- | --- |
| banding in place of comparing | the achieved SIL matches the required SIL and the verdict is called a pass |
| reading a subsystem alone | a valve meets the requirement and the summed function does not |
| dropping a state | an interval reported with no FOUND, UNACHIEVABLE, INTERVAL_INDEPENDENT or CAPPED_AT_LIFETIME beside it |
| shortening the test against a floor | a target below a coverage floor answered with a shorter interval |
| quoting a band as a target | a search run against a band edge in place of the required PFDavg |

The first of those is the one this tier exists to prevent. The teaching function stretched to 3.5 years misses its tolerable mitigated event likelihood while it is still SIL 2, and it drops to SIL 1 only at 4 years. A candidate who reads the band alone marks that row as passing.

## Precision and units

Frequencies per year, probabilities and PFDavg values are carried to twelve decimals. Risk reduction factors, hours and years are carried to six. Failure rates stay in the exponent form they were given. Intervals are in hours, and the years figure is the hours over 8760. Rounding early is the quiet way to lose a comparison that turns on the fourth figure.

## What to write down

Write the required PFDavg, the achieved PFDavg, the verdict, the interval with its state, and the limits. That is the verification note in miniature, and it is also exactly what the capstone asks for. The limits are part of the answer: the architectural constraint is not checked, the demand mode is assumed low, and every failure rate is an input that somebody has to justify.

## Exercise

Take the IDU function at a one year proof test, an achieved PFDavg of 0.001792971954 against a requirement of 0.007407407407, and the same function at 3.5 years, 0.008382016506. Write the verdict for each and the margin in each case. Then list, in the order above, the five things you would write down for the 3.5 year case.
