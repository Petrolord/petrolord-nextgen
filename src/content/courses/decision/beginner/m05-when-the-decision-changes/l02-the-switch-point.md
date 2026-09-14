# The switch point

The switch point is the probability at which two branches are worth the same, and it can be found exactly when each branch is a straight line in that probability. On the EKPAN lottery Drill and Farm out cross at 80 / 350 = 0.228571.

{{panel:ec-tree-explorer}}

## Two straight lines

Write the success probability as p, so the dry hole is 1 less p. The drill branch pays 420.0000 on success and -25.0000 on a dry hole, less its cost of 55.0000. Collected, the slope is 420.0000 less -25.0000, which is 445, and the intercept is -25.0000 less 55.0000, which is -80.0000:

Drill = 445 p - 80

The farm-out pays 95.0000 on success and 0.0000 on a dry hole, with no cost:

Farm out = 95 p

Set them equal: 445 p - 80 = 95 p, so 350 p = 80 and p = 80 / 350 = 0.228571.

| success probability | Drill | Farm out | best action |
| --- | --- | --- | --- |
| 0.200000 | 9.0000 | 19.0000 | Farm out |
| 0.228571 | 21.7143 | 21.7143 | Farm out |
| 0.250000 | 31.2500 | 23.7500 | Drill |

Below 0.228571 the farm-out is worth more; above it the drill is.

## What the engine says at the crossing

At 0.228571 the engine prints Drill 21.7143 and Farm out 21.7143 and names Farm out as best. That looks like a tie, and a tie would go to the branch listed first, which is Drill. It does not, because 80 / 350 has no exact binary image: Drill less Farm out comes out at -7.11e-15, so Drill is smaller by rounding residue and the engine's strictly greater comparison keeps Farm out. The choice exactly at the switch belongs to binary arithmetic and says nothing about either branch. Report the switch point; do not report a winner at it.

## A second crossing that does not matter

Drill also crosses Walk away, at 80 / 445 = 0.179775. That crossing lies below the farm-out switch, where Farm out already beats both, so walking away is never the best EKPAN action at a success probability above 0.

## The mistake

The careful mistake is reading the switch off the sweep grid. The first row where Drill wins is 0.250000, and quoting it as the switch overstates the probability the drill needs. The mirror error takes the last Farm out row, 0.200000. The switch lies between them and must be solved from the lines.

The other mistake is solving the wrong pair: Drill against Walk away gives 0.179775, yet at 0.200000 the drill is worth 9.0000 and the farm-out still 19.0000.

## Why the stated prior sits where it does

At the stated 0.350000 the drill is worth 75.7500 against 33.2500 for the farm-out. A decision near its switch is fragile, and the Professional tier shows it is also where knowing the outcome first is worth most, 61.7143 at 0.228571 against 52.0000 at 0.350000.

## What it refuses

The engine does not return a switch point. It rolls back one set of probabilities at a time and the reader solves for the crossing. The lines are straight only because the payoffs stay fixed as p moves, and the rollback is risk neutral on both sides.

## Exercise

Derive the Drill and Farm out lines from the EKPAN lottery's payoffs and cost, solve for the switch point, and check it against the engine's 21.7143. Then find where Drill crosses Walk away and explain why that crossing never decides anything on this lottery.
