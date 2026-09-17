# Creeping flow, and where it ends

Every gravity and centrifugal answer here comes out of one balance. A droplet rises because it is lighter than the water, and the drag on it balances that buoyancy. Stokes law is that balance written for CREEPING FLOW, and creeping flow is a condition rather than an assumption you get to make.

{{panel:pw-water-explorer}}

## The band, measured

Here is the UZERE water, at 0.000710553998 Pa.s with a density difference of 142.391799 kg per m3, asked the same question by two different routes.

| droplet micron | Stokes m/s | Reynolds | full drag balance m/s | Stokes over the balance | in band |
| --- | --- | --- | --- | --- | --- |
| 5 | 0.000002729456 | 0.000020 | 0.000002729215 | 1.000088 | yes |
| 20 | 0.000043671293 | 0.001273 | 0.000043604293 | 1.001537 | yes |
| 60 | 0.000393041638 | 0.034359 | 0.000387364475 | 1.014656 | yes |
| 120 | 0.001572166551 | 0.274873 | 0.001484057918 | 1.059370 | yes |
| 240 | 0.006288666203 | 2.198987 | 0.005136559522 | 1.224295 | no |
| 500 | 0.027294558174 | 19.883778 | 0.015286135319 | 1.785576 | no |

The fifth column is derived, the two velocities on the same row divided. The departure grows with the Reynolds number on every row of that table, and that is the whole content of the band.

## Three readings off the same column

At 5 micron and Reynolds 0.000020 the two routes agree to 8.83e-5. At 120 micron and Reynolds 0.274873 they already differ by 5.937008 percent. At 500 micron and Reynolds 19.883778 Stokes overstates the rise by 78.557612 percent.

The module states Stokes to Reynolds 1 and warns above it. That is where the band ends, and it is stated as a number rather than left to judgement.

## The direction of the error, which is the part that matters

An overstated rise velocity means an UNDERSTATED cut size. A device appears to catch finer droplets than it really does, and the removal computed from that cut size is too high.

That is the optimistic direction, and it is why the warning exists rather than being left to the reader. A pessimistic model gets questioned. An optimistic one gets approved.

## Why a band is stated at all

A fit with no stated band is a fit somebody will use everywhere. Stokes law is simple and familiar enough that it gets applied far outside the flow regime it was derived for, and it goes on returning reasonable looking velocities the whole way.

Stating the band converts a silent error into a visible one. The engine still answers outside it, and says on the same return that the answer is outside what the law is stated for.

## Every device carries its own

The band is not checked once for the water. Every device in this module reports the Reynolds number of its OWN cut droplet and warns the same way, so a cut size that has landed outside creeping flow says so on the same return that carries it.

A coarse basin on a light oil is exactly where this bites. The cut droplet is large, its Reynolds number climbs, and the number on the screen is the one the warning is about. The published basin group carries a row at a Reynolds number of 1.851949 for that reason, so the gate sees a case on the wrong side of the band as well as cases inside it.

## Exercise

In the water explorer, walk the droplet size up until the Reynolds number passes one and record where the warning appears.

Then take a device whose cut size carries the warning and say, in one sentence, whether the true removal is higher or lower than the reported one, and why.
