# Free gas

Free gas is a difference of two numbers that are usually close together, and a difference of close numbers is the most fragile arithmetic in any design.

{{panel:pd-lift-explorer}}

## What comes out of solution

The oil rate at the tank multiplied by the producing gas oil ratio less the solution gas at intake conditions gives the free gas at standard conditions. That result is floored at zero, so an undersaturated intake liberates nothing. The gas formation volume factor then turns the standard volume into barrels at depth.

| Case | Oil, stb/d | GOR, scf/stb | Rs, scf/stb | Free gas, scf/d | Bg, rb/scf | Free gas, bbl/d |
| --- | --- | --- | --- | --- | --- | --- |
| gassyOffshore, published | 1200.0 | 500.0 | 300.0 | 240000.00 | 0.001200 | 288.000000 |
| highWaterCut, published | 400.0 | 200.0 | 180.0 | 8000.00 | 0.001800 | 14.400000 |
| QUA-IBOE-4, teaching | 1400.0 | 700.0 | 250.0 | 630000.00 | 0.001400 | 882.000000 |

## The fragility, priced

On the published golden design highWaterCut the producing gas oil ratio is 200.0 scf/stb and the solution gas is 180.0 scf/stb. Almost all of the gas the well makes stays dissolved, and the free gas is 8000.00 scf/d, which becomes 14.400000 bbl/d at depth. A revision to either input of a size nobody would argue about moves the free gas by a large fraction of itself, because the answer is what survives the cancellation.

Compare the teaching well QUA-IBOE-4, which is not a published case: 700.0 scf/stb against 250.0 scf/stb, and 882.000000 bbl/d of gas arriving at the intake against 776.461538 bbl/d of water.

## Only free gas is a problem

Gas in solution is already inside the oil volume, counted by the oil formation volume factor. It is not a separate stream, it does not occupy its own space in an impeller and nothing about it needs handling. Only the gas that has broken out is gas as far as a pump is concerned.

## The mistake

Using the producing gas oil ratio where the difference belongs. On gassyOffshore that replaces 240000.00 scf/d with the volume implied by the full 500.0 scf/stb, and every downstream quantity inherits it: the rate at depth, the mixture density, the gradient and the verdict.

## What it refuses

There is no flash calculation and no bubble point search anywhere in this. The solution gas and the gas formation volume factor are caller inputs evaluated at intake conditions, and the module cannot tell whether they were. When the solution gas exceeds the producing gas oil ratio it returns zero free gas rather than a negative volume, which is a floor and not a diagnosis.

## Exercise

Compute the free gas at standard conditions and at depth for all three cases, then read the same values in the panel.

Then raise the solution gas on highWaterCut toward its producing gas oil ratio and record what happens to the free gas at depth as the two numbers close.
