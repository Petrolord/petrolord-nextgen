# Vacuum is the case that destroys tanks

Outbreathing is the case people design for, because it is the one with vapour in it. Inbreathing is the case that flattens tanks. This lesson is the sweep that shows when the second one takes over, and the warning the engine writes when it does.

## The sweep

Holding everything else at its stated value and moving only the draw rate, the engine returns:

| draw rate, bbl/hr | inbreathing, scfh | outbreathing, scfh | governing |
| --- | --- | --- | --- |
| 0.0000 | 19608.4845 | 25689.2574 | pressure (outbreathing) |
| 200.0000 | 20731.4012 | 25689.2574 | pressure (outbreathing) |
| 400.0000 | 21854.3178 | 25689.2574 | pressure (outbreathing) |
| 640.0000 | 23201.8178 | 25689.2574 | pressure (outbreathing) |
| 900.0000 | 24661.6095 | 25689.2574 | pressure (outbreathing) |
| 1200.0000 | 26345.9845 | 25689.2574 | vacuum (inbreathing) |
| 1600.0000 | 28591.8178 | 25689.2574 | vacuum (inbreathing) |
| 2400.0000 | 33083.4845 | 25689.2574 | vacuum (inbreathing) |

The outbreathing column never moves, because the draw rate does not appear in it. The inbreathing column climbs, because movement inbreathing is set by the draw rate. Somewhere between the row at 900.0000 bbl/hr and the row at 1200.0000 bbl/hr the governing word changes, and bisecting that word gives the crossover:

> vacuum takes the case above a draw rate of, bbl/hr 1083.0319

> found by bisecting the engine's own governing word

Above a draw rate of 1083.0319 bbl/hr, on this tank at its stated fill rate, vacuum governs.

## The warning, in the engine's own words

When it does, the engine says why:

> vacuum governs. A tank is a thin-walled vessel designed for inches of water column, and an undersized vacuum vent will pull it flat during a cold rainstorm on a draining tank. This is the case that destroys tanks

Every clause in that sentence is doing work. A vessel designed for inches of water column has almost no capacity to resist external pressure. A cold rainstorm is the thermal term going hard inward, and a draining tank is the movement term going inward with it, on the same tank at the same time.

## Why the failure is asymmetric

Over-pressure on a fixed-roof tank usually finds relief, because the roof-to-shell seam is built to be the weak point and it lifts. Under-pressure has no such path. The shell buckles inward, and the crew may have no warning at all, because nothing about a tank being emptied on a cold day looks like an emergency.

So the two directions deserve different attention, and the maximum draw rate the facility can achieve is the input to sweep.

## What to do with the crossover

A crossover found this way is an operating limit expressed in an operating variable, which makes it directly useful. It says that on this tank, at this fill rate, a draw above 1083.0319 bbl/hr puts the vent into the direction with the unforgiving failure mode. That is a sentence a shift supervisor can act on, in a way that a pair of scfh figures is not.

It is also a sentence with a stated basis, and every part of that basis is an input somebody chose. Change the fill rate and the outbreathing total moves, which moves the crossover. Insulate the tank and the thermal terms move. The crossover is not a property of tanks in general and quoting it as though it were is the error this lesson exists to prevent.

## Exercise

Take the draw rate sweep in this lesson and name the two adjacent rows the crossover draw rate lies between. Then say what happens to that crossover if the fill rate rises, and which column of the table tells you.
