# One out of one, and the half

{{panel:lp-sif-builder}}

A one out of one subsystem is a single channel with no redundancy. It is the simplest architecture the engine knows and the one every other architecture is measured against. Its simplified form carries a factor of one half, and that half is worth understanding on its own, because it is the difference between the time a channel is failed and the time it is failed when a demand happens to arrive.

## Where the half comes from

A dangerous undetected failure arrives at a random moment in the proof test interval and stays until the next test. If it arrives early the channel is failed for nearly the whole interval. If it arrives late the channel is failed for only a little of it. Averaged over the interval, the channel is failed for half of it. That is why the simplified 1oo1 form reads lambdaDU T divided by two.

## The half, measured

The EKULAMA channel again, at lambdaDU 1.2e-6 per hour and T1 of 8760 hours, with no detected failures and no mean repair time after a test.

| quantity | value |
| --- | --- |
| lambdaDU T | 0.010512000000 |
| PFDavg, one out of one | 0.005256000000 |
| RRF | 190.258752 |
| SIL band | 2 |

The 1oo1 PFDavg of 0.005256000000 is exactly half of lambdaDU T, which is 0.010512000000. Dropping the half doubles the answer. Doubling a PFDavg moves it a factor of two toward the next band down, and on this channel it is the difference between a band that holds and one that does not.

## The half is an average over the interval

The half is an average over the interval, so it is the right number for a demand whose arrival time is unknown. It is the wrong number for a demand you already know is coming at the end of an interval. A LOPA scenario assumes a demand rate that is low and a demand time that is random, which is exactly the assumption the half encodes. When the demand rate is high the whole low demand method is the wrong quantity, and this engine has no high demand mode at all.

## A linear architecture

A 1oo1 channel with no detected failures is linear in the proof test interval. Double the interval and the PFDavg doubles. That is simpler behaviour than any redundant architecture shows, and it makes the 1oo1 the easiest subsystem to budget: the PFDavg you can afford tells you directly the interval you may run.

## What the engine carries beyond the half

The simplified form is the whole story only when there are no detected failures and no repair time after a test. The engine still carries its full bookkeeping on a 1oo1 call, and on this channel that bookkeeping collapses exactly onto the half. When diagnostics or a repair time are added, the engine keeps a channel equivalent down time in place of the plain half of the interval, and the next module is about that quantity.

## Exercise

A colleague hands you a one out of one calculation for the EKULAMA channel and reports 0.010512000000 as its PFDavg. Say which term they dropped, give the figure the engine returns, and compute what the mistake does to the reported RRF of 190.258752.
