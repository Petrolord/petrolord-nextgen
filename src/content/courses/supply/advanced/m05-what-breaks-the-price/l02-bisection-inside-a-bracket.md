# Bisection inside a bracket

The sweep shows the invented cap covering the BADAGRY chain at 1500.0000 naira to the dollar and failing at 1650.0000. The exchange rate at which it stops covering lies between them. `solveCrossing` finds it, and the method is what makes the answer trustworthy on a chain this long.

{{panel:supply-price-explorer}}

## What bisection does

Bisection needs two things: a bracket, a low and a high value of the driver, and an outcome whose sign differs at the two ends. Here the outcome is the shortfall, the price less the cap. At the low end the cap covers the chain and the shortfall is negative. At the high end it does not and the shortfall is positive.

The engine prices the chain at the midpoint of the bracket. If the shortfall there has the same sign as the low end, the crossing is in the upper half, and the midpoint becomes the new low end. Otherwise it becomes the new high end. Each step halves the bracket, and the engine reports the value where the price meets the cap together with the number of steps it took.

Every price along the way is a full re-pricing of the chain, and each asks only which side of the cap the price is on.

## The BADAGRY breakeven

Every rate on the BADAGRY record is invented for this course, and so are the cap of 1150.0000 naira a litre and the exchange rates swept. priceSensitivity hands solveCrossing the bracket from the lowest to the highest value swept, 1200.0000 to 2100.0000 naira to the dollar. The sweep rows at 1500.0000 and 1650.0000 show where the crossing lies; the bracket the engine halves is the whole swept range. Against the cap, the engine reports:

breakeven: found true, at 1641.7105 naira to the dollar, after 18 bisection steps.

That is the exchange rate at which the invented chain's pump price meets the invented cap. Every sweep row above it reads false and every sweep row below it reads true.

## Why the engine bisects

The oracle that checks this engine solves the breakeven in closed form. The engine bisects instead, and the difference is the point.

A closed form is written for one shape of chain. Add an element, move the tax to a different basis or insert a percentage line in the middle, and the formula must be rederived by hand. Bisection needs none of that. It asks the chain for its price and reads the sign. Whatever the build-up contains, as long as the price at the two ends of the bracket lies on opposite sides of the cap, bisection finds where it crosses.

The two methods reaching the same exchange rate is what the oracle's check is for.

## What the answer assumes

The breakeven is one driver moved with everything else held. At 1641.7105 naira to the dollar, the freight, the insurance, the import duty, every margin, the levies and the tax are the invented BADAGRY values. If any of them changes, the breakeven changes, and it has to be found again. It is a property of an invented record.

## Exercise

Record the bracket the engine searched, the two sweep rows either side of the crossing with their shortfalls and verdicts, then the breakeven exchange rate and the number of bisection steps the engine reports. Say what the breakeven, read against the two bracketing rows, shows about what bisection does between the values a sweep prints.
