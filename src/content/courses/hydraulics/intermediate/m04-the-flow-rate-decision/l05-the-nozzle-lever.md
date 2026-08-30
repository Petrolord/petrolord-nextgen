# The nozzle lever

The one input that changes the pump constraint without touching the others.

{{panel:hy-rheology-explorer}}

## The situation

The flow rate needed for cleaning is known. The equivalent circulating density it produces is acceptable. The pump pressure it needs is not.

## The lever

Larger nozzles. The bit pressure drop is inversely proportional to the square of the total flow area, so opening the nozzles up cuts it sharply.

At 0.025 m3/s on the slant well: 0.0003 m2 of nozzle area needs 5540166.204986151 Pa across the bit, and 0.0007 m2 needs 1017581.5478545991 Pa.

A factor of 2.33 in area buys a factor of 5.4 in bit pressure.

## What it does not touch

The pipe loss and the annulus loss are unchanged, because the flow rate and the geometry outside the bit are unchanged.

So the equivalent circulating density is exactly unchanged, and the cleaning is exactly unchanged. Only the pump pressure moves.

That is what makes it a clean lever: it relieves one constraint and touches neither of the others.

## What it costs

Bit hydraulics. The jet velocity falls from 83.33333333333334 m/s to 35.714285714285715 m/s over that range, and the hydraulic power at the bit falls from 138504.1551246538 W to 25439.53869636498 W.

Whether that matters depends on the formation. In a hard rock where the bit is cutting-structure limited, it matters very little. In a soft sticky formation where the bit balls up, it matters a great deal.

## The order to try things in

**Nozzles first**, because they are free, they are changed at the rig floor and they touch nothing else.

**Then the string's bore**, which is the biggest lever and needs a different bottom hole assembly.

**Then the mud**, which affects everything at once and is the hardest to reverse.

**Then the flow rate**, which means accepting worse cleaning.

## The trap

Optimising the nozzles for bit hydraulics and then discovering the flow rate cannot be achieved.

The order matters: the flow rate is set by the annulus, and the nozzles are then chosen to make that rate achievable. Choosing nozzles first and the rate second gets it backwards, and it is how a bit hydraulics optimisation produces a well that cannot be cleaned.

## Exercise

On the slant well at a flow rate of 0.035 m3/s, find the total flow area that brings the pump pressure to 15 MPa.

Then report what the jet velocity and the bit hydraulic power are at that area, and say whether you would accept them.
