# What a deferment number overstates

Shut a well in and the survivors pick some of it up, because the header they share falls. The rate the shut well was reported to be making is therefore not the rate the field lost, and quoting it as though it were is the standard way a deferment number is overstated.

{{panel:pd-network-explorer}}

## Four shut-ins on the teaching network

A derived sweep on AGBADA WEST, taking one well off the system at a time and re-solving. These are sweep points and not published cases.

| Well taken off | Rest of the system, lb/d | Survivors gained, lb/d | Reported rate, lb/d | True deferment, lb/d |
| --- | --- | --- | --- | --- |
| AGBADA-2 | 8290.169036003 | 994.366002145 | 6004.874117054 | 5010.508114909 |
| AGBADA-6 | 11451.346557099 | 469.025752507 | 2318.356346320 | 1849.330593813 |
| AGBADA-9 | 10075.309781275 | 767.079317902 | 3992.446687538 | 3225.367369636 |
| AGBADA-12 | 12504.659991952 | 188.982841040 | 985.000000000 | 796.017158960 |

Every reported rate is larger than the deferment beside it. On AGBADA-2 the two differ by 994.366002145 lb/d, production that a report claiming 6004.874117054 lb/d of deferment counted as lost when it was never lost.

## Where the gain comes from

Nothing was done to the survivors. Taking a well off drops the mass through the shared header and the trunk, so the header falls and every remaining well flows against a lower wellhead and moves up its own inflow curve. It is a well losing rate to a new neighbour, run backwards.

## The gain is not proportional to the well

AGBADA-9 was reported at 3992.446687538 lb/d and hands the survivors 767.079317902 lb/d. AGBADA-6 was reported at 2318.356346320 lb/d and hands them 469.025752507 lb/d. What the survivors gain depends on the margin they have left over the header, not on what the departing well was making.

## The row you have to read twice

AGBADA-12 is held to an allocation of 985 lb/d on a flowline capped at 640 lb/d. Its true deferment of 796.017158960 lb/d is measured against the 985.000000000 lb/d the engine reports, and its flowline only ever passed 640.000000000 lb/d. So that row is overstated twice over: once by ignoring the survivors' gain, and again by starting from a reported rate that the network never delivered.

## What was checked

The system this is measured against reported converged = true at a residual of 1.546141e-11 lb/d with pinned = t4, and `checkConservation`, which the solver never calls, reports a gap of 345.000000000 lb/d, 2.593852900 percent of what the engine says was produced. A deferment quoted off that baseline inherits the whole gap.

## Exercise

Shut in one well in the panel, record the total before and after, and write the true deferment. Then say what you would have to know to trust it.
