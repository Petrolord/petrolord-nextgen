# Dangerous undetected failures

{{panel:lp-sif-builder}}

Not every failure of a safety function matters to PFDavg, and the ones that do split in two. A failure is dangerous when it leaves the function unable to act on demand. A dangerous failure is detected when diagnostics reveal it while the plant runs, and undetected when nothing reveals it until a proof test. The two behave completely differently in time, and the engine keeps them in two separate rates.

## Two rates, one channel

The engine takes lambdaDU, the dangerous undetected failure rate per hour, and lambdaDD, the dangerous detected rate per hour. Both are per hour, both may be zero, and they may never both be zero at once: with neither there is no dangerous failure to average. A dangerous undetected failure is down for a share of the whole proof test interval. A dangerous detected failure is down only for the time it takes to restore it.

## lambdaDU times T

The single most useful number to have in your head for a channel is lambdaDU multiplied by the proof test interval. For the EKULAMA channel, at 1.2e-6 per hour over 8760 hours, that product is 0.010512000000. It is dimensionless, it is small, and almost every simplified form in this module is built from it.

| quantity | value |
| --- | --- |
| lambdaDU, per hour | 1.2e-6 |
| T1, hours | 8760 |
| lambdaDU T | 0.010512000000 |
| PFDavg, one out of one | 0.005256000000 |

## Why the product has to stay small

The low demand equations are linearised. They assume that the probability of a failure inside one interval is small enough that second order terms can be dropped, which is the rare event assumption. When lambdaDU times T climbs above 0.1 the engine still answers and warns that the answer overstates the PFDavg. When the linearised value reaches one it is no longer a probability at all, and the engine refuses and says so. Keeping the product small is a design constraint as much as a modelling one.

## Failure rates here are illustrative

Every failure rate in this course is a stated teaching input or a value read from the vendored golden. None of them is a recommendation, and no licensed reliability table is reproduced anywhere in this engine. In real work the rate comes from a justified source and the source is recorded in the verification note. The engine carries no failure rate data of its own, so a PFDavg is only ever as defensible as the rates typed into it.

## What a proof test is for

A proof test exists to find what diagnostics cannot. It is the only event in the life of a channel that clears the dangerous undetected population, and the interval between tests is therefore the single largest lever an analyst holds over a PFDavg. Everything in this module is a statement about what happens between two tests, and every figure printed here is tied to the interval it was computed on.

## Exercise

Using lambdaDU of 1.2e-6 per hour, compute lambdaDU times T for a proof test interval of 4380 hours and again for a span of 87600 hours. Compare both products with the 0.010512000000 that the 8760 hour interval gives, say which of the three sits closest to the 0.1 warning threshold, and state what that means for a design that wants a long interval.
