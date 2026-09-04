# What production cannot be read from

Four things on a rod pump design sheet look as though they carry the production. None of them does.

{{panel:pd-card-explorer}}

## Not from the rating

Rated displacement on ODUMA-4 is 380.874258458 bbl/d and the produced rate is 316.565396142 bbl/d. The design reports the ratio itself, 0.831154611, so the gap is not hidden. It is simply in a different field from the one people quote.

## Not from the fillage

At a nominal fillage of 0.9000 the effective factor the design actually applied is 0.928442245, which is 3.160249 percent above the number typed in. The fillage is a multiplier applied to a swept rate that the same fillage already moved, so multiplying a rating by a fillage by hand will not reproduce what the engine returned, and neither answer is the well.

## Not from the warning list

At a fillage of 0.8500 the design makes 301.389964 bbl/d and raises nothing. At 0.8499 it makes 301.354487 bbl/d and raises incompleteFillage. A warning is a comparison against a constant, and it carries no information about the size of the rate beside it.

## Not from the loads

The loads are the most conspicuous numbers a design returns and they move for reasons production does not share. Walk the fluid specific gravity across ODUMA-4 and the buoyed weight falls from 9670.652229 lb at 0.7500 to 9262.033121 lb at 1.0500, taking the peak polished rod load from 19750.187337 down to 19341.568229 lb. The plunger stroke is 98.526653 in on every one of those rows, so the produced rate does not move at all.

Heavier fluid, different card, same barrels. A design that looks harder worked is not a design making more oil.

## What it can be read from, and how far

One chain: the plunger stroke the march returned, times the plunger area, times the fillage and the pump efficiency the caller typed. Everything else in the return object is a load, a stress, a power or a ratio.

That chain stops at the barrel. The engine models no gas interference, no valve slippage beyond the pump efficiency, no tubing movement and no unanchored string, and it has no inflow relation in it anywhere. It cannot tell you whether the well can supply what the pump would lift, because it was never asked what the well has.

## Exercise

Read the produced rate on ODUMA-4 in the panel, then change the fluid specific gravity and read it again.

Write down which numbers on the sheet moved and which did not, and say in one sentence what that tells you about using a peak load as evidence of production.
