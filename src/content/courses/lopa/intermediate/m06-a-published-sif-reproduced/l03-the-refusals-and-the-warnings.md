# The refusals and the warnings

{{panel:lp-sif-builder}}

The engine has two ways of telling an analyst that something is wrong with a call. A warning comes back with a result: the number is computed and the engine says something about it. A refusal replaces the result: there is no number, only an error and the name of the field that caused it. Both are quoted here in the engine's own words, because a paraphrase teaches a message no learner will ever see on screen.

## An architecture the engine does not know

> architecture: must be one of 1oo1, 1oo2, 2oo2, 2oo3, 1oo3

Five architectures are implemented and nothing else. A call naming any other arrangement is refused, and the refusal lists what is available.

## Three inputs the engine will not guess

> mttrHours: is required when lambdaDD is above zero: detected failures are down for the restoration time

> beta: is required for a redundant 1oo2 and must lie in [0, 1]: beta = 0 is a claim of no common cause and has to be typed

> betaD: is required when lambdaDD is above zero in a redundant architecture and must lie in [0, 1]

The first names the restoration time of a detected failure, the second the beta factor of a redundant architecture, and the third betaD where detected failures meet redundancy. Each exists because the answer genuinely depends on the missing input, and the engine will not choose a value on the analyst's behalf. The last two are the strongest statement the engine makes anywhere: a claim that no single cause reaches every channel has to be typed by a person.

## Coverage below one with no lifetime

> lifetimeHours: is required when proofTestCoverage is below 1: the uncovered failures stay until the item is restored as new

## The lambda T refusal

> proofTestIntervalHours: the simplified equations give 4.38 here, which is not a probability: lambda x T is far outside the rare-event range they assume; use an exact (Markov) model

This is the boundary of the method itself. The low demand equations are linearised, and far outside the rare event range they return a value above one, which no probability can be. The engine declines and names the model that would answer.

## The warnings, which come with an answer

| call | PFDavg | warning |
| --- | --- | --- |
| 1oo1, lambdaDU 2e-5, T1 8760 | 0.087600000000 | lambdaDU x T = 0.1752 exceeds 0.1: the linearised (rare-event) equations overstate PFDavg noticeably here |
| 1oo1 with a beta factor of 0.1 typed | 0.004380000000 | beta does not apply to 1oo1 and was ignored |
| 2oo2 with a beta factor typed | 0.010576000000 | beta does not apply to 2oo2 and was ignored |

The first is the approach to the refusal above: past a product of 0.1 the engine answers and tells you the answer reads high. The other two report an input that was ignored, so that nobody leaves a review believing a beta factor was credited when it was not.

## Exercise

Take the warned call with a dangerous undetected rate of 2e-5 per hour over 8760 hours, which returns 0.087600000000. Compute the product of that rate and the interval, compare it with the 0.1 threshold in the warning, and work out roughly how much longer an interval would have to be before the engine refused the call.
