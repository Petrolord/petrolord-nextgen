# What a production network is

A well does not have a rate. It has an inflow curve, and what it makes is settled by a header pressure that every other well tied into that header is also pushing against.

## The same well, solved three times

The published `wells_fight` case is one header against a separator at 180 psia, solved with one well on it, then two, then three. Nothing about W-0 changes across the ladder. Same reservoir, same inflow curve, same flowline, three times.

| Wells on the header | Header, psia | W-0 rate, lb/d |
| --- | --- | --- |
| 1 | 253.813945361 | 3522.516744485 |
| 2 | 370.837866311 | 3421.411637345 |
| 3 | 670.128002137 | 3137.891322295 |

Those are the values the independent oracle committed. Re-running the shipped engine on the same published ladder, W-0 loses 384.625422 lb/d going from one well on the header to three, which is 10.919052 percent of itself, and the header climbs by 416.314057 psi.

## The total is not the sum

On that same re-run, total delivered rises from 3522.516744 lb/d to 9076.922229 lb/d, so the two wells that joined bought 5554.405485 lb/d between them. The shortfall is not a loss anyone can repair. It is what a shared header costs.

## Mass is the currency

Every flow in this module is a mass rate in lb/d, because surface volumes do not add across pressures and mixing two of them hides for a long time. Pressures are absolute, psia, never gauge. A drop along a branch is a difference in psi. No node is allowed below MIN_PRESSURE_PSIA, which is 14.7 psia.

## The mistake

Reading a tested rate as a property of the well. Every single-well study is run against a wellhead pressure somebody typed in, so it says what that well would do at that pressure and nothing about where the system will sit once a neighbour is opened. Both columns of that ladder come out of a solve of the whole system.

## What it refuses to call a network

A drawing with no delivery point is refused: "A network needs a delivery point: a node with a pressure the system is flowing against." One with no wells is refused: "A network needs at least one well. Nothing else puts anything into it." Neither is repaired and neither is solved anyway.

## Exercise

Write down the header pressure in the `wells_fight` case with one well on it and with three, and the rate W-0 makes in each.

Then say in one sentence why W-0 making 3137.891322295 lb/d rather than 3522.516744485 lb/d is not a problem with W-0.
