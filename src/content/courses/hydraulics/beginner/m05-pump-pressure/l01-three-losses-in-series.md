# Three losses in series

The sum, and what it does not include.

{{panel:hy-rheology-explorer}}

## The sum

    pump pressure = pipe loss + bit loss + annulus loss + surface loss

The surface loss covers the standpipe, the kelly hose, the swivel and the kelly or top drive. It is usually quoted as an equivalent length of pipe and it is set to zero in this course, so the three named losses add to the total exactly.

## The numbers

Slant well, kcl_polymer, 0.025 m3/s:

| element | pressure | share |
|---|---|---|
| inside the pipe | 7998453.767490401 Pa | 67.9500 percent |
| across the bit | 2337927.902432598 Pa | 19.8616 percent |
| up the annulus | 1434707.6543385487 Pa | 12.1884 percent |
| total at the pump | 11771089.324261548 Pa | 100 percent |

## Why a sum and not something more complicated

Because the elements are in series and the fluid is treated as incompressible.

The same flow rate passes through every element, and the pressure at any point is the pressure at the pump less everything upstream of it. There is no branching, no accumulation and no storage.

That is a strong assumption and it is a good one for a steady state. It fails during transients, when the mud's compressibility and the string's elasticity matter, and that is the Expert tier's subject.

## The one that is not a friction loss

The bit. Everything else is friction against a wall; the bit is an inertial loss with no wall involved.

That is why it has a different exponent and why its share behaves differently from the other two.

## What is NOT in the pump pressure

The hydrostatic column. The mud in the string weighs the same as the mud in the annulus, so their static pressures cancel exactly and the pump only has to supply the friction.

That cancellation is why a pump pressure is a few tens of bar rather than the hundreds of bar of hydrostatic head at total depth. It fails the moment the two columns are different, which is what happens during a kick and what a driller's kill sheet is about.

## The reading

A pump pressure is a system property, not a well property. Change the string, the bit or the mud and it changes; change the formation and it does not.

That is the opposite of the equivalent circulating density, which is a formation property.

## Exercise

Confirm the three shares add to 100 percent on the table above.

Then say what the pump pressure would be if the surface equipment were modelled as an equivalent 50 m of drill pipe, using the pipe loss per metre from the table.
