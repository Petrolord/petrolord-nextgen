# Capped at the lifetime

{{panel:lp-proof-test}}

A search for the longest interval usually ends at a crossing, where the PFDavg rises to meet the target and the engine reports the interval at which it got there. Sometimes there is no crossing to find, because the subsystem still meets its target even when the interval is stretched as far as it can go. The engine does not report an unbounded interval and it does not report the last value it happened to try. It reports the lifetime, and the state CAPPED_AT_LIFETIME, which says in one word why the number is the number.

## The case the engine returns it on

| state | subsystem, stated | target | longest T1 hours | PFDavg reported |
| --- | --- | --- | --- | --- |
| CAPPED_AT_LIFETIME | 1oo1, lambdaDU 2e-8, lambdaDD 0, coverage 0.9, T2 87600 | 0.01 | 87600.000000 | 0.000876000000 |

The undetected rate here is 2e-8 per hour, which is low, and the target of 0.01 is loose. At the lifetime of 87600 hours the subsystem achieves 0.000876000000, comfortably inside the target. Stretching further is not a question the engine will answer, because the item is restored as new at 87600 hours and an interval beyond that describes a test that never happens.

## Why the cap is the honest answer

The engine already refuses a lifetime shorter than the proof test interval, in its own words: the lifetime must be at least the proof test interval. A search that returned an interval past the lifetime would be returning a combination the same engine declines to evaluate. Capping at the lifetime keeps the two halves consistent, and the state word tells the reader that the target did not decide this answer. Change the target and the number will not move. Change the lifetime and it will.

## Reading a capped answer in a plan

A capped answer is not a licence to stop testing until the overhaul. It says that the target does not constrain the interval on this subsystem, so the interval will be set by something else: a regulatory schedule, a turnaround window, a manufacturer's requirement, or the simple wish to find a failure before it has been there for ten years. The engine has answered the question it was asked and has left the rest of the decision where it belongs. A verification note records the state alongside the number, so a later reader can see that 87600.000000 hours was the boundary of the model, which says nothing about good practice.

## Exercise

The capped row achieves 0.000876000000 at the lifetime against a target of 0.01. Work out how many times below the target that achieved figure sits. Then decide what would have to happen to the target for this same subsystem to return the state FOUND with a finite interval shorter than 87600.000000 hours, and write one sentence describing the state you would expect if the target were tightened all the way past the floor that its coverage of 0.9 creates.
