# What depth buys

Depth is bought with surface pressure and spent on the transfer differential, and the module will not tell you what you got for it.

{{panel:pd-unloading-explorer}}

## The differential is the price

Holding the published case at 1014.7 psia of surface injection pressure and moving only the transfer differential:

| Transfer differential, psi | Depth, ft | Limited by |
| --- | --- | --- |
| 0.0 | 8000.000000000 | depth |
| 50.0 | 8000.000000000 | depth |
| 75.0 | 7949.755733309 | pressure |
| 100.0 | 7739.815725361 | pressure |
| 150.0 | 7319.935709464 | pressure |
| 200.0 | 6894.703876604 | pressure |

The differential is a margin the designer insists on keeping between the two curves, and insisting on more of it costs hole. Between 75.0 and 200.0 psi the cost runs at much the same feet per psi throughout. Below 75.0 psi it stops costing anything at all, because the answer has clamped to the bottom of the table at 8000.000000000 ft and the differential is no longer what is binding.

## What the deeper point is worth

Deeper injection puts gas into a longer column, and the production pressure at the point of injection rises with it. At 314.7 psia of surface pressure the crossing is at 538.553047921 ft with a production pressure of 218.555304792 psia. At 714.7 psia it is at 4703.296676249 ft with 695.315381207 psia. At 1014.7 psia it is at 7739.815725361 ft with 1109.233464452 psia.

Every one of those is a statement about pressures at a depth. None of them is a statement about rate.

## The mistake

Treating the deepest injection point as the design answer. It is a ceiling, not a recommendation. It says where gas can still get in on this injection pressure against this traverse, and a design that puts its bottom valve there has left itself nothing at all: no allowance for a heavier traverse, no allowance for a compressor that drifts, and none of the spacing rules that produce a real string are anywhere in this calculation.

## What it refuses

There is no inflow relation in the module, so extra depth cannot be turned into drawdown or rate here. There is no multiphase outflow either, so the traverse that fixed the answer was supplied from outside and is not rebuilt when the injection point moves. Strictly, the function answers one question: how deep gas gets, on one column, against one table, with one margin.

## Exercise

Walk the transfer differential from 0.0 to 200.0 psi in the panel and record the depth and the limitedBy value at each step.

Then name the range where the differential stops changing the answer, and say which field in the output tells you that the differential is no longer what is binding.
