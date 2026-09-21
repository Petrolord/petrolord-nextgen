# The longest interval for a target

{{panel:lp-proof-test}}

A sensitivity table answers the question the wrong way round for planning. A maintenance planner does not want the PFDavg at six intervals someone chose; the planner wants the longest interval at which the subsystem still meets its target. The engine's `maxProofTestInterval` answers that question directly. It takes a subsystem and a target PFDavg, and it returns the longest T1 that still meets the target, in hours and in years, together with the PFDavg achieved at that interval.

## How the engine finds it

The engine's method, in its own words, is bisection on T1 of the Annex B PFDavg, which is non-decreasing in T1. Two things in that sentence do the work. Bisection needs only that the function can be evaluated, so no algebra is inverted and no closed form has to exist for a particular architecture. Non-decreasing is what makes the answer unique: because the PFDavg never falls as the interval grows, there is exactly one crossing of the target, and the search converges on it to one part in a trillion.

## The IDU valves against five targets

| target PFDavg, stated | state | longest T1 hours | longest T1 years | PFDavg at that T1 |
| --- | --- | --- | --- | --- |
| 0.0005 | FOUND | 3609.141022 | 0.412002 | 0.000500000000 |
| 0.001 | FOUND | 6953.661742 | 0.793797 | 0.001000000000 |
| 0.002 | FOUND | 12957.474301 | 1.479164 | 0.002000000000 |
| 0.005 | FOUND | 27640.443736 | 3.155302 | 0.005000000000 |
| 0.01 | FOUND | 46473.426980 | 5.305186 | 0.010000000000 |

The last column is the check on the first. At 3609.141022 hours the valves achieve 0.000500000000, which is the target itself: the engine has found the crossing and stopped there, and the PFDavg column confirms it by measurement.

## The target is the required figure, never the band

Notice what was typed into the search. A target of 0.005 gives 27640.443736 hours and a target of 0.01 gives 46473.426980 hours, so the answer moves by more than eighteen thousand hours between two targets only a factor of two apart. A SIL band is a decade wide, so a planner who searched against a band ceiling would be searching against the loosest number the band allows. The required PFDavg from the layer of protection analysis is the number that goes in, and the interval that comes out is only as defensible as the target that produced it.

## What the interval does not license

A longest interval is an upper bound under the stated inputs. It carries no claim that the failure rates hold that long, that the test at that interval reveals what the earlier test revealed, or that the architectural constraint is satisfied. It also carries no claim about a second subsystem. A safety instrumented function is a sum, so an interval chosen for one subsystem has to be checked against the requirement on the whole function.

## Exercise

Take the two rows at targets 0.002 and 0.005. Write down the ratio of their longest intervals in years, using 1.479164 and 3.155302, to three decimals. Then compare that ratio with the ratio of the two targets themselves and write one sentence explaining why a target two and a half times looser did not buy two and a half times the interval.
