# The series sum

{{panel:lp-sif-builder}}

Once each subsystem has its own PFDavg, the function's PFDavg is their sum. That is all the combination there is, and the engine states it plainly in its method string as a series sum of subsystem PFDavg values. The sum holds because the function fails on demand if any link is failed, and because each subsystem's PFDavg is small enough for the chance of two being failed at once to be a second order effect.

## The method, in the engine's words

> series sum of subsystem PFDavg (IEC 61508-6 Annex B.3.2.1: PFD_SYS = PFD_S + PFD_L + PFD_FE)

The three letters in the published equation are the sensor, the logic solver and the final element. The engine does not fix the list at three. It takes any non empty list of subsystems and sums what it computes for each, so a function with two sensor groups or two final elements is verified the same way.

## The IDU function, added up

Each subsystem computed from the stated inputs of the previous lesson, then summed.

| part | architecture | PFDavg | share of the function |
| --- | --- | --- | --- |
| transmitters | 2oo3 | 0.000369505528 | 20.61 percent |
| logic solver | 1oo1 | 0.000136440000 | 7.61 percent |
| valves | 1oo2 | 0.001287026426 | 71.78 percent |
| function | | 0.001792971954 | 100 percent |

## The weakest link is usually mechanical

The valves carry 71.78 percent of this function on their own, and they are a redundant pair while the logic solver is a single channel. That pattern is common in practice. The final element has no diagnostics, so its whole dangerous rate waits for a proof test, and it carries the highest beta factor because two valves in one line share a great deal. The lesson for a designer is that the first lever on this function is the valve proof test interval, and the second is anything that lowers the valve beta factor.

## What the sum leaves out

The sum ignores a small overlap term, the probability that two subsystems are failed at the same moment, which the engine's validation record names openly. For PFDavg values of this size the overlap is second order: the product of two figures near a thousandth is near a millionth, which is below the last digit that matters here. The engine does refuse a list of subsystems whose summed PFDavg reaches one, because at that point the sum is no longer a probability and the approximation has left the range it is good for.

## Reading the shares

The share column is the most useful output of a function level verification. It says where the next hour of engineering effort should go, and it says what a proposed change is worth before anyone prices it. Halving the logic solver figure of 0.000136440000 would move the function by less than four percent of itself. Halving the valve figure would move it by more than a third.

## Exercise

Add the three subsystem PFDavg values by hand and check your total against the engine's 0.001792971954. Then compute what the function's PFDavg becomes if the valve subsystem alone is halved, and state which band that new total falls in.
