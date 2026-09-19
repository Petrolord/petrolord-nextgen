# Bisection inside a bracket

The sweep shows the invented cap covering the BADAGRY chain at 1500.0000 naira to the dollar and failing at 1650.0000. The exchange rate at which it stops covering lies between them. `solveCrossing` finds it, and the way it finds it is worth understanding, because the method is what makes the answer trustworthy on a chain as long as this one.

{{panel:supply-price-explorer}}

## What bisection does

Bisection needs two things: a bracket, a low and a high value of the driver, and an outcome whose sign differs at the two ends. Here the outcome is the shortfall, the price less the cap. At the low end the cap covers the chain and the shortfall is negative. At the high end it does not and the shortfall is positive.

The engine prices the chain at the midpoint of the bracket. If the shortfall there has the same sign as the low end, the crossing is in the upper half, and the midpoint becomes the new low end. Otherwise it becomes the new high end. Each step halves the bracket, and the engine reports the value where the price meets the cap together with the number of steps it took.

Every price along the way is a full re-pricing of the chain, the same as each row of the sweep. It only asks the chain, at each midpoint, which side of the cap it is on.

## The BADAGRY breakeven

Every rate on the BADAGRY record is invented for this course, and so is the cap of 1150.0000 naira a litre. Against that cap, the engine reports:

breakeven: found true, at 1641.7105 naira to the dollar, after 18 bisection steps.

That is the exchange rate at which the invented chain's pump price meets the invented cap. Every sweep row above it reads false and every sweep row below it reads true.

## Why the engine bisects

This chain could be written as one formula in the exchange rate. The oracle that checks this engine does exactly that: it solves the breakeven in closed form. The engine bisects instead, and the difference is the point.

A closed form is written for one shape of chain. Add an element, move the tax to a different basis or insert a percentage line in the middle, and the formula must be rederived by hand. Bisection needs none of that. It asks the chain for its price and reads the sign. Whatever the build-up contains, as long as the price at the two ends of the bracket lies on opposite sides of the cap, bisection finds where it crosses.

The two methods reaching the same exchange rate is what the oracle's check is for. The final module of this tier reads that agreement as evidence.

## What the answer assumes

The breakeven is one driver moved with everything else held. At 1641.7105 naira to the dollar, the freight, the insurance, the import duty, every margin, the levies and the tax are the invented BADAGRY values. If any of them changes, the breakeven changes, and it has to be found again. It is a property of the record, and the record is invented.

## Exercise

Record the two sweep rows that bracket the crossing, with their shortfalls and verdicts, then the breakeven exchange rate and the number of bisection steps the engine reports. Say what the breakeven, read against the two bracketing rows, shows about what bisection does between the values a sweep prints.
