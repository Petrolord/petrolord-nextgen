# When to redesign

{{panel:lp-worksheet}}

{{panel:lp-sif-builder}}

Most verification work ends in a schedule or a specification. Some of it ends in a finding that more of the same hardware will never close the gap, and recognising that moment early is one of the most valuable things an Expert does. The engine does not make the call. It reports states and dominant terms, and three of those reports are the standing signals that the design itself has to change.

## Signal one: the requirement is beyond the table

When the required risk reduction factor climbs past SIL 3 the engine returns the state BEYOND_SIL3_REDESIGN and keeps the required PFDavg intact.

| required RRF, stated | outcome | required PFDavg | in the SIL 4 band |
| --- | --- | --- | --- |
| 10000 | SIL3 | 0.000100000000 | |
| 50000 | BEYOND_SIL3_REDESIGN | 0.000020000000 | true |
| 500000 | BEYOND_SIL3_REDESIGN | 0.000002000000 | false |

The state is never clipped to a band, so a worksheet shows how far beyond the table the row sits. At an RRF of 50000 the required figure of 0.000020000000 lies in the SIL 4 band, and the process sector treats a demand for SIL 4 as a signal to redesign the process or add layers outside the safety instrumented system. At 500000 the required 0.000002000000 is below the SIL 4 band entirely, and the engine says plainly that no function can supply it.

## Signal two: the target is below a coverage floor

Imperfect proof test coverage puts a floor under the PFDavg that no interval reaches. The OBAGI valve at a coverage of 0.7 has a floor of 0.011847600000, so any target below that comes back as UNACHIEVABLE however short the interval. Shortening the test is a scheduling response to a design problem. Only a better test procedure or a shorter lifetime moves the floor, and both are changes to the design of the maintenance regime.

## Signal three: common cause dominates every architecture on offer

On the EKULAMA channel common cause dominates the 1oo2 from a beta factor of 0.02 and the 2oo3 from 0.05. Once the common cause term dominates, a second or third channel buys little, because a common cause failure is a single failure that redundancy cannot vote out. Adding channels to a function in that condition spends money and moves the answer barely at all. The response is diversity, separation or a different technology, and each of those is a redesign.

## What the engine does and what you do

The engine reports each signal as a state, a floor or a dominant term. It does not weigh the cost of a redesign against the cost of a tighter tolerable mitigated event likelihood, and it has no opinion on whether a non instrumented layer is available. The decision is the analyst's, and the verification note carries the signal, the figure behind it and the recommendation together.

## Exercise

Take the two BEYOND_SIL3_REDESIGN rows, at required PFDavg values of 0.000020000000 and 0.000002000000. Work out how many times below the SIL 3 requirement of 0.000100000000 each of them sits. Then pick one of the three signals and write the short paragraph you would put to a project team, naming the figure, the state and the change you are asking for.
