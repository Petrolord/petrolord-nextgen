# The card area

The area is a shoelace integral around a closed loop of load against position, so it is exactly as good as the loop it is given.

{{panel:pd-card-explorer}}

## A loop, not a curve

Load against position over one settled cycle returns to where it started, and the enclosed area is the work the polished rod did in that cycle. On ODUMA-4 at the shipped defaults that area is 750654.615621 in-lb per cycle, read around the 186 point card the function returns.

The loop has to close for the integral to mean anything, which is why the march runs until the cycle repeats. ODUMA-4 takes four cycles.

## The surface loop is not the pump loop

The same march produces a pump card, and its area is smaller.

| Card | Area, in-lb per cycle |
| --- | --- |
| surface | 750654.615621 |
| pump | 413225.894771 |
| difference | 337428.720850 |

The pump card is close to a parallelogram, because away from the valve transfers the pump load takes exactly two values: 4690.299657039 lb while lifting or pounding down, and 0 lb while falling. Its two vertical sides are the transfers themselves, where the plunger is held still and the rod above it stretches or relaxes.

The 337428.720850 in-lb per cycle between the two is work the rods and the damping absorb. It never reaches the fluid, and it is inside every polished rod horsepower anyone quotes.

## The area is only as good as the loop

The loop is a subsample of the march, so how much area a coarse card loses depends entirely on how sharply the real card turns. The published taper at 9 spm reads 323421.9269 in-lb per cycle on the default card against 323838.0408 in-lb per cycle over every one of its 6516 marched steps, which is 416.1138 in-lb per cycle low, or 0.128494 percent. The same string at 5 spm loses 63.3284 in-lb per cycle, or 0.023711 percent.

Same default, same string, and one costs several times the other.

## The mistake

Calling the surface card area the work done on the fluid, and then dividing it by a production to price a barrel. On ODUMA-4 that overstates the fluid work by 337428.720850 in-lb per cycle, and the overstatement is not a fixed fraction: it is whatever the rods and the damping happened to take on that design at that speed.

## What it refuses

It refuses to attribute itself. One number comes back for the whole loop, and nothing in it separates lifting from friction, or rod work from damping. The engine hands over that split only by returning a second loop at the pump, and comparing the two areas is the reader's job.

## Exercise

Read the surface and pump card areas on ODUMA-4 in the panel and write the difference between them.

Then find the two load values the pump card takes away from its transfers, and say in one sentence what a pump card with rounded corners instead of vertical sides would tell you.
