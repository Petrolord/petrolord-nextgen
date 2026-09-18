# A time quantised to one step

An explicit march moves in whole steps. Two things can go wrong with that at the ends, and this engine handles both. One is overshooting the target. The other is a first step so large that the march is over before it has begun.

{{panel:fc-blowdown-explorer}}

## Landing on the target rather than past it

A march stepping in fixed time increments will in general arrive somewhere either side of the pressure it was aiming at. Reporting the time of the step that crossed the target quantises the answer to one step, which on a coarse step is a real error and on any step is a needless one.

This march lands on the end pressure. AFIESERE finishes at 145.000000000000 psia against a target of 145.000000 psia, a difference of -0.000000000000 psia.

That is easy to check on any march: compare the final pressure the route reports against the pressure you asked for, at full precision. A route that reports the target back to you rather than what it reached has hidden the question instead of answering it.

## The first step, which is where the real trouble is

The other end is harder. A small vessel through a large orifice can lose more mass in one step than it contains, and an explicit march that takes such a step produces nonsense with no arithmetic complaint.

The rule here is a budget: no step may remove more than a twentieth of the inventory. A step that would is subdivided until it does not, and the route reports how many steps it subdivided so the reader can see it happened. At the stated step AFIESERE subdivided 0 of its 2685 steps.

## Where the budget earns its keep

| case (stated) | time s | final pressure psia | final temperature degR | steps | substeps |
| --- | --- | --- | --- | --- | --- |
| 5.000000 ft3, 4.000000 in orifice | 0.167677 | 114.700000 | 338.611469 | 34 | 34 |
| 100.000000 ft3, 17.000000 in orifice | 0.185663 | 114.700000 | 338.611469 | 34 | 34 |
| 500.000000 ft3, 38.000000 in orifice | 0.185791 | 114.700000 | 338.611469 | 34 | 34 |

Read the substep column against the step column. Every step in all three cases was subdivided, and every one of the three reaches its end pressure and reports a time above zero. These are the geometries where a fixed step has the least to work with, and they are in the study on purpose.

## Why such a case belongs in a published set

The three rows above are not realistic designs. They are the shapes that break a march, and a validation set that contains only sensible vessels through sensible orifices cannot tell a march that works from a march that stops before it starts.

Two of the five published blowdown cases use an orifice of 4 in or larger and one sits at 10 ft3 or smaller, so the published set does reach into this corner. When you build a case set of your own, put the hardest geometry in it deliberately, and put it there because you know what it is hard for. A case chosen because it is typical checks that the arithmetic runs. A case chosen because it is extreme checks that the method holds, and only the second kind can fail in an informative way.

## Exercise

Record the final pressure AFIESERE reaches, the target it was given and the difference. State the inventory budget on a single step in words and record how many steps AFIESERE subdivided. Then record the three hard geometries with their times and substep counts, and write two sentences on why a published set needs cases like them.
