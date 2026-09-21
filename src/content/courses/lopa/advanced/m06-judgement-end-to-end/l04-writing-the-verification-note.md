# Writing the verification note

{{panel:lp-proof-test}}

{{panel:lp-sif-builder}}

Everything this tier teaches ends in a document. The verification note is what a reviewer reads in three years when the failure rates are being challenged, or what an inspector reads when a stretched interval has to be defended. A note that carries only a band and a verdict cannot be audited. A note that carries the inputs, the figures, the states and the limits can be recomputed by somebody who disagrees, which is the point of writing it.

## What the note carries

| section of the note | what goes in it |
| --- | --- |
| the row | the layer of protection analysis scenario and its tolerable mitigated event likelihood |
| the target | the required PFDavg as well as the band it falls in |
| the parts | each subsystem with its architecture, rates, interval, MTTR, MRT, beta factors and coverage, each rate with its source |
| the total | the summed PFDavg and the achieved risk reduction factor |
| the schedule | the proof test intervals and the state behind each |
| the caveats | any warning the engine returned |
| the limits | what the engine did not check |

## Why the target appears twice

The required PFDavg and the band are two different facts and the note carries both. The IDU function achieves 0.001792971954 with a risk reduction factor of 557.733208, which is SIL 2. The ORONI row at a tolerable mitigated event likelihood of 1e-7 per year requires 0.007407407407, which is also SIL 2. Writing only the two bands would say the function matches the requirement and would leave out the comparison that actually settles it. Writing both numbers lets a reader see that 0.001792971954 is comfortably below 0.007407407407 and by how much.

## Why every rate needs a source line

A failure rate with no source beside it cannot be challenged and cannot be defended. The engine carries no failure rate data of its own, so every lambda in the note arrived from somewhere: a reliability data handbook, a vendor certificate, the site's own maintenance history or an engineering judgement. Those four are defensible in very different degrees, and a reviewer who knows which was used can weigh the result. The same applies to a proof test coverage, which is a claim about a written procedure, and to a beta factor, which is a claim about how much two channels share. Write the source on the same line as the number and the note survives its first serious challenge.

## Why states and limits are written down

An interval with no state beside it is ambiguous. FOUND means a crossing exists and the number is the crossing. CAPPED_AT_LIFETIME means the target did not decide the number and the lifetime did. UNACHIEVABLE means there is no interval at all and the figure beside it is a floor. Three very different findings arrive in the same field of a report, and only the state tells them apart.

The engine does not check the architectural constraint and does not compute a high demand mode. It has no failure rate data and forms no judgement about whether a layer is truly independent. A note that does not say so invites the reader to assume the verification was complete. Naming the limits is also how the next analyst knows which questions are still open, and it is the difference between a calculation and a piece of assurance.

## Exercise

Take the IDU function at a one year proof test: an achieved PFDavg of 0.001792971954, a risk reduction factor of 557.733208, and a requirement of 0.007407407407 from the ORONI row. Work out what share of the requirement the function uses. Then write the note's target and total sections in full, and list the three limits you would name for this function under the limits heading.
