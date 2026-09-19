# No crossing in the range

Bisection finds a crossing only inside a bracket that contains one. Hand it a bracket where the outcome has the same sign at both ends and there is nothing to halve towards. `solveCrossing` does not search outside the bracket it was given, and it does not return the nearer end as if it were an answer. It says there is no crossing in the range and returns no value.

{{panel:supply-price-explorer}}

## A bracket that misses

Every rate on the BADAGRY record is invented for this course, and so is the cap of 1150.0000 naira a litre. The course runs the search against that cap over a bracket from 1300 to 1500 naira to the dollar. The engine answers found false, and refuses:

> REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.

It then prints the evidence: the shortfall at the two ends, -211.7551 and -87.8167 naira a litre. Both are negative. At both ends the invented cap covers the chain, so the price does not meet the cap anywhere the engine was asked to look.

The second of those figures is a row of the sweep. At 1500.0000 naira to the dollar the sweep prints a shortfall of -87.8167 naira a litre and a verdict of true. The first figure, at 1300, is not a sweep row. It is the search's own evaluation at the low end of the bracket it was handed.

## Why the engine refuses

A search that returned the nearer end would print 1500 as if it were a breakeven. It is not one. At 1500 the cap covers the chain. A reader who saw that value on a report would conclude the chain breaks there, and the chain does not. Returning nothing, with the two end shortfalls and the reason, gives the reader what is needed to fix the bracket: both ends are on the covered side, so the bracket has to move.

The breakeven the previous lesson found, 1641.7105 naira to the dollar, lies outside this bracket. The engine does not find it because it is not asked to look there, and it says so.

## Two more ways the search refuses

A bracket written backwards, from 2100 to 1200, is not an interval at all, and the engine refuses it:

> REFUSED: The search bracket is not a valid interval.

The engine does not swap the ends. The bracket goes back to the person who typed it.

And with no cap there is nothing to cross, so the breakeven is none. The engine does not invent a cap to search against, and none is not zero.

## What these refusals have in common

Each is a case where a number could have been produced and would have been wrong: the nearer end of a bracket, a crossing found by silently reversing the ends, a breakeven against a cap nobody set. The engine produces none of them. It reports what it searched, what it found and why there is no value.

## Exercise

Quote the engine's refusal for the bracket from 1300 to 1500 and record the two end shortfalls it prints. Then record the shortfall the sweep prints at 1500.0000 naira to the dollar and the breakeven the engine finds against the same cap. Say what the two end shortfalls, read against the breakeven, show about why the search over 1300 to 1500 returns no value.
