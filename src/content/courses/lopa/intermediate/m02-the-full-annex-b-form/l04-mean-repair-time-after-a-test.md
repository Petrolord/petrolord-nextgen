# Mean repair time after a proof test

{{panel:lp-sif-builder}}

Two restoration times appear in the Annex B equations and they are easy to confuse. The MTTR is the restoration time of a failure that diagnostics detected while the plant was running. The MRT is the mean restoration time after a proof test reveals a dangerous undetected failure. They answer different questions, they enter different terms, and on many plants they are different numbers.

## Where each one enters

The engine adds the mean repair time after a test to every undetected down time, so the undetected share of a channel waits half the proof test interval plus that repair time, and a group waits a third of the interval plus it. The MTTR sits on the detected share alone, and it also carries the detected common cause term. The mean repair time after a test appears in the undetected common cause term too, as the beta factor multiplied by lambdaDU and by the interval over two plus that repair time.

## What it costs, measured

The EKULAMA channel with diagnostics as a one out of two, with the MTTR held at 8 hours and the repair time after a test swept.

| MRT hours | tCE hours | tGE hours | PFDavg | over the MRT of zero |
| --- | --- | --- | --- | --- |
| 0 | 1319.600000 | 881.600000 | 0.000298347613 | 1.000000 |
| 8 | 1322.000000 | 884.000000 | 0.000298987176 | 1.002144 |
| 24 | 1326.800000 | 888.800000 | 0.000300267345 | 1.006435 |
| 72 | 1341.200000 | 903.200000 | 0.000304116193 | 1.019335 |
| 168 | 1370.000000 | 932.000000 | 0.000311851427 | 1.045262 |

A repair time of 168 hours, which is a week, adds 4.53 percent to this PFDavg against a repair time of zero. That is a modest effect on a one year interval, and it grows as the interval shortens, because the repair time is a fixed addition to a down time that the interval otherwise sets.

## Why the two times have to differ somewhere

Until the two restoration times are given different values, a calculation that swapped them would return exactly the same answer, and nobody would ever see the mistake. The vendored golden therefore keeps a case with a repair time after a test of 168 hours against an MTTR of 8 hours, where the engine returns 0.000255485341 and the golden expects 0.000255485341. That case exists to make a swap visible.

## Choosing the numbers honestly

A repair time after a proof test is often longer than an MTTR, because a hidden failure found at a test may need a spare that is not on site, a permit, or a shutdown window. A team that types its detected restoration time into both fields is claiming a maintenance response it may not have. The engine takes what it is given, and the verification note is where both numbers are defended.

## The repair time enters every undetected term

Notice that both equivalent down times move together across the sweep, from 1319.600000 and 881.600000 hours at a repair time of zero to 1370.000000 and 932.000000 hours at a week. The addition is the same in both, because the repair time after a test is added once to each undetected down time whatever the voting factor divides the interval by. That is also why its effect on the total is close to linear across this sweep.

## Exercise

Using the table above, compute how much of the PFDavg at a repair time of 168 hours is accounted for by the move from 1319.600000 to 1370.000000 hours in the channel equivalent down time. Then state which interval, a quarter year or two years, would make a week long repair time matter more, and say why.
