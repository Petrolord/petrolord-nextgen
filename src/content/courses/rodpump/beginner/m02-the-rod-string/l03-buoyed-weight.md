# Buoyed weight

The factor is one minus the fluid specific gravity over 7.85, and there is nothing else in it.

{{panel:pd-string-explorer}}

## What it does to the published taper

9940.000000 lb of steel in air. Hang it in fluid of specific gravity 1.00 and the factor is 0.872611464968, the buoyed weight is 8673.757961783 lb, and the fluid is carrying 1266.242038 lb of the string that the polished rod does not have to.

That buoyed figure is the load on the polished rod at rest, before a fluid load, before any motion, and it is the number every dynamic load is measured against.

## The factor belongs to the fluid, not the string

| Fluid specific gravity | Buoyancy factor | Buoyed weight, lb |
| --- | --- | --- |
| 0.00 | 1.000000000000 | 9940.000000 |
| 0.70 | 0.910828025478 | 9053.630573 |
| 0.80 | 0.898089171975 | 8927.006369 |
| 0.85 | 0.891719745223 | 8863.694268 |
| 0.95 | 0.878980891720 | 8737.070064 |
| 1.00 | 0.872611464968 | 8673.757962 |
| 1.05 | 0.866242038217 | 8610.445860 |
| 1.15 | 0.853503184713 | 8483.821656 |

The published uniform string in the same fluid at specific gravity 1.00 gets exactly the same factor, 0.872611464968, applied to 13344.000000 lb in air for a buoyed weight of 11644.127388535 lb. Rod size, taper design and depth change none of it. The teaching well ODUMA-4 sits in lighter fluid, specific gravity 0.9, so its factor is 0.885350318471 and its 10692.200000000 lb becomes 9466.342675159 lb.

## The mistake, priced

Putting a coefficient in the factor. The predecessor used one minus 1.2 times the fluid specific gravity over 7.85. At specific gravity 1.00 that gives 0.847133757962 and a buoyed weight of 8420.509554 lb, removing 253.248408 lb, which is 2.919708 percent of the weight the polished rod carries at rest. At 1.15 it removes 291.235669 lb, or 3.432836 percent.

That error is small enough to read as rounding and it is on the wrong side: it makes the string look lighter than it is, and every load computed from it starts low.

## What buoyancy is not

It is not the fluid load. The weight of the column standing on the plunger is a differential times an area, computed separately, and buoyancy neither includes it nor knows it exists. It is not friction, it does not know whether the pump is on the up or the down stroke, and it is not reduced by the tubing.

Archimedes is a statement about a body at rest in a fluid, and that is all this number is.

## Exercise

Take the buoyancy factors at specific gravity 0.85 and 1.15 and apply each to the published taper and to the published uniform string, then say what the four answers have in common.

Then write what the predecessor factor removes at specific gravity 1.00 in both pounds and percent, and say why an error of that size is harder to catch than a large one.
