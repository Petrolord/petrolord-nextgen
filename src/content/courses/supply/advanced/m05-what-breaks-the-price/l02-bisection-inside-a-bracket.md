# Bisection inside a bracket

The sweep shows the invented cap covering the BADAGRY chain at 1500.0000 naira to the dollar and failing at 1650.0000. The exchange rate at which it stops covering lies between them. `solveCrossing` finds it by bisection inside that bracket.

{{panel:supply-price-explorer}}

## What bisection does

Bisection needs two things: a bracket, a low and a high value of the driver, and an outcome whose sign differs at the two ends. Here the outcome is the shortfall, the price less the cap. At the low end the cap covers the chain and the shortfall is negative. At the high end it does not and the shortfall is positive.

The engine prices the chain at the midpoint of the bracket. If the shortfall there has the same sign as the low end, the crossing is in the upper half, and the midpoint becomes the new low end. Otherwise it becomes the new high end. Each step halves the bracket, and the engine reports the value where the price meets the cap together with the number of steps it took.

Every price along the way is a full re-pricing of the chain, and each asks only which side of the cap the price is on.

## The BADAGRY breakeven

Every rate on the BADAGRY record is invented for this course, and so are the cap of 1150.0000 naira a litre and the exchange rates swept. priceSensitivity hands solveCrossing the bracket from the lowest to the highest value swept, 1200.0000 to 2100.0000 naira to the dollar. The sweep rows at 1500.0000 and 1650.0000 show where the crossing lies; the bracket the engine halves is the whole swept range. Against the cap, the engine reports:

breakeven: found true, at 1641.7105 naira to the dollar, after 18 bisection steps.

That is the exchange rate at which the invented chain's pump price meets the invented cap. Every sweep row above it reads false and every sweep row below it reads true.

## Two methods for one breakeven

The oracle that checks this engine solves the breakeven in closed form. The engine bisects instead. The course records that split and no reason for it.

What the course does record is how the engine's search behaves. priceSensitivity re-prices the whole chain at each value of the driver and hands solveCrossing the bracket from the lowest to the highest value swept. If the price does not cross the cap inside that range, the engine says so and returns no value.

The two methods reaching the same exchange rate is what the oracle's check is for.

## What the answer assumes

The breakeven is one driver moved with everything else held. At 1641.7105 naira to the dollar, the freight, the insurance, the import duty, every margin, the levies and the tax are the invented BADAGRY values. If any of them changes, the breakeven changes, and it has to be found again. It is a property of an invented record.

## Exercise

Record the bracket the engine searched, the two sweep rows either side of the crossing with their shortfalls and verdicts, then the breakeven exchange rate and the number of bisection steps the engine reports. Say what the breakeven, read against the two bracketing rows, shows about what bisection does between the values a sweep prints.
