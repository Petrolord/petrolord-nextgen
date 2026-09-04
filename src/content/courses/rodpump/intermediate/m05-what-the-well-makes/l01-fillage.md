# Fillage

Fillage is a number the caller types, and it is not a knob on the outside of the answer. It goes into the march and changes the stroke.

{{panel:pd-card-explorer}}

## What the engine is told

ODUMA-4 runs at a fillage of 0.9 and a pump efficiency of 1. Neither is computed. The engine is not given an inflow, a fluid level or a gas fraction, so it has no way to work out how full the barrel is. It is told, and it believes what it is told.

## What fillage does inside the march

The pump has a state the march calls POUND_DOWN. When the barrel is not full, the fluid load stays on the plunger while it travels down through the empty part of the barrel, and that travel is part of the plunger stroke the march reports. So the stroke moves when the fillage moves.

| Fillage | Plunger stroke, in | Produced, bbl/d |
| --- | --- | --- |
| 1.0000 | 95.508351 | 340.964016 |
| 0.9800 | 96.875542 | 338.927978 |
| 0.9600 | 97.273932 | 333.376440 |
| 0.9400 | 97.775603 | 328.114602 |
| 0.9200 | 98.192446 | 322.502515 |
| 0.9000 | 98.526653 | 316.565396 |

Six contiguous teaching rows on ODUMA-4. The stroke gets longer as the barrel empties, which is the opposite of what most people expect, and it happens because the string stays loaded into the downstroke instead of unloading at the top of it.

## And it is not monotone

Over the whole sweep the longest plunger stroke is 100.412132 in at a fillage of 0.8200 and the shortest is 93.281671 in at 0.5500, against 95.508351 in at a full barrel. The stroke rises, turns and comes back. A design at 0.5500 has a shorter plunger stroke than a full barrel, and one at 0.8200 has a longer one, so no single sentence about direction is true across the range.

The warnings are no tidier. incompleteFillage stays on below 0.85, but rodOverstressed appears at fillages of 0.7200 and 0.7000 and is gone again by 0.6500, on the same design with only the fillage moved.

## The mistake

Treating a design at 0.9000 as the same machine as one at 1.0000 making less oil. It is a different card. The plunger stroke is 98.526653 in rather than 95.508351 in, and the load transfer that the loads are read off has moved with it.

## What it refuses

It refuses to tell you the fillage. There is no gas interference model in this engine, no valve slippage beyond the pump efficiency the caller types, and no inflow relation anywhere in it. Fillage arrives as an assumption and leaves as an assumption, and everything the design says about production stands on it.

## Exercise

Set the fillage to 1.0000 and then to 0.9000 in the panel and write both plunger strokes.

Then explain in one sentence why the shorter stroke belongs to the fuller barrel, and name the state in the march that causes it.
