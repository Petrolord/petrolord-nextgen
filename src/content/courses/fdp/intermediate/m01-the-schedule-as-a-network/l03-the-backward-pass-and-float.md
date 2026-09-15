# The backward pass, and float

The backward pass walks the same network from its end and asks the opposite question: what is the latest day an activity can finish without moving the end of the project. Float is the gap between that answer and the earliest.

{{panel:ec-schedule-explorer}}

## Two rules, read backwards

The last activity's late finish is the network duration, 870 days, and its late start is that figure less its duration. Every other activity takes a late finish equal to the earliest late start among its successors, and a late start of late finish less duration.

## EGINA, backwards

| activity | duration | early start | late start | late finish | float |
| --- | --- | --- | --- | --- | --- |
| a1 Project sanction | 0 | 0 | 0 | 0 | 0 |
| a2 Detailed engineering | 210 | 0 | 180 | 390 | 180 |
| a3 Long lead procurement | 300 | 0 | 0 | 300 | 0 |
| a4 Hull conversion | 420 | 300 | 300 | 720 | 0 |
| a5 Topsides fabrication | 330 | 210 | 390 | 720 | 180 |
| a6 Subsea installation | 180 | 210 | 690 | 870 | 480 |
| a7 Integration and commissioning | 150 | 720 | 720 | 870 | 0 |
| a8 First oil | 0 | 870 | 870 | 870 | 0 |

a8 finishes at 870 and, at 0 days of work, starts there too. a6 and a7 both feed a8, so both take a late finish of 870: a7 has a late start of 720 and a6 of 690. a4 and a5 both feed a7 and take its late start of 720 as their late finish, giving a4 a late start of 300 and a5 one of 390. a3 feeds a4 and takes 300, giving a late start of 0. a2 feeds a5 and a6 and takes the earlier of their late starts, 390, which puts its own at 180.

## Float is a subtraction

Float is late start less early start. a2: 180 less 0 is 180. a5: 390 less 210 is 180. a6: 690 less 210 is 480. Every other activity has a late start equal to its early start, so float 0.

Three activities carry float on EGINA: detailed engineering 180 days, topsides fabrication 180 and subsea installation 480. An activity with float can slip by that much without moving the end date. One without it cannot slip at all.

## The float on a chain is one float

a5 cannot begin until a2 has finished, and a5's early start of 210 is a2's early finish. The 180 days on a2 and the 180 on a5 are the same 180 days seen from two rows. Let detailed engineering run 180 days late and it lands on its late start of 180 and its late finish of 390; topsides then starts at 390, its own late start, and its float is gone.

Total float is what an activity can absorb if nothing else on its chain absorbs any first. It is not an allowance the activity owns.

## Why the pass has to be run at all

Float cannot be read off a network by eye. Subsea installation is 180 days of work, the smallest piece of real work here, and it carries 480 days of room because what waits on it waits on a far longer chain too. No such figure exists until both passes have run.

## The mistake

Adding the three floats together and calling the sum the slack in the plan. Two of those numbers are the same 180 days counted twice, and none is spare time for anything off its own chain. Subsea installation may start as late as day 690 and still land on 870, and that says nothing about the hull.

## Exercise

Work the backward pass for a7, a6, a5, a4 and a2, naming the successor each late finish came from. Then compute the float of a2, a5 and a6, and explain why a 180 day slip on a2 leaves a5 with none.
