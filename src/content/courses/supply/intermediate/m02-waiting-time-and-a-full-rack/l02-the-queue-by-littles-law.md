# The queue by Little's law

The mean wait is a figure for the driver. The yard manager needs a different one: how many trucks are standing in the line on average. That decides how much hardstanding the depot needs, whether trucks back up onto the public road, and how the gate is staffed. The engine prints it as the mean queue length, and it reaches it by one of the most general rules in queueing.

{{panel:supply-depot-explorer}}

## Little's law

Little's law says that the average number of items in a system equals the rate at which they arrive multiplied by the average time each spends there. It holds for almost any queue in a steady state, which makes it a useful check.

Applied to the waiting line alone, it reads:

queue length = arrivals per hour x mean wait in hours

The engine prints the check for IBAFO beside its own figure:

9 x 47.2652 / 60 = 7.0898, the engine's queue length is 7.0898.

The division by 60 turns the mean wait from minutes into hours, so that it matches the arrivals, which are per hour. The two figures agree to the four decimals the engine prints for a queue. The point is that the engine reaches the queue length through its Erlang C chain, and a one-line rule that holds for any stable queue lands on the same figure.

## What the queue counts

The mean queue length counts trucks waiting for a bay. It does not include the trucks on the bays. At IBAFO it is 7.0898 trucks, the average over the whole day, quiet hours and busy ones together. On a real morning the yard will hold more than that at some moments and none at others. A yard sized to the average will overflow for part of the time, and the engine prints no figure for how often.

The unit is trucks, and the figure prints to four decimals. A fraction of a truck is meaningful here in a way it was not for bays: it is an average, and averages of whole counts need not be whole.

## The queue across the bay sweep

At 9 arrivals an hour and 24 minute loads:

| bays | mean wait minutes | mean queue trucks |
| --- | --- | --- |
| 3 | none | none |
| 4 | 47.2652 | 7.0898 |
| 5 | 7.0353 | 1.0553 |
| 6 | 1.9657 | 0.2948 |
| 7 | 0.6088 | 0.0913 |

Each row satisfies Little's law with the same arrivals, 9 an hour, because the arrivals do not change as the bays change. At 3 bays both columns print none. A queue that grows without limit has no average length, just as it has no average wait.

## Why print a check at all

A figure that can only be computed one way is hard to trust. Little's law gives a second route to the queue length that shares nothing with the Erlang recursion except the arrival rate and the printed wait. When the two agree, the chain from inputs to wait is confirmed at the one point where the rule applies. When they disagree, something between the inputs and the wait is wrong. This course states the IBAFO check only where the engine prints it.

## Exercise

Read the Little's law line for IBAFO and the engine's queue length. Say what each of the three figures on the left of the equation is, with its unit, and why the division by 60 is there. Then read the 5 bay row of the sweep and say what its mean wait and mean queue describe for the yard manager, and why neither needs to be a whole number.
