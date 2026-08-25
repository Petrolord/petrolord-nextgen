# A fifth of the west block

The previous lesson claimed that wells on one side of the fault set depths on the other. This lesson measures it, and the measurement is the strongest result in this tier.

## The experiment

Ekene-6 sits at an easting of 1900 m. That is 100 m east of the fault, so it belongs to the east block. It is also the only eastern well that found oil at the capstone contact.

Remove it from the control set entirely, regrid both surfaces from the remaining five wells, apply the same contact and the same fault, and book the west block again.

## The result

With all six wells, the west block holds 117 cells and 9.855617 MMstb.

With Ekene-6 removed, the west block holds 117 cells and 7.865728 MMstb.

The west block lost 1.989889 MMstb, which is 20.2 percent of its booking, because a well on the far side of a sealing fault was taken out of the map.

## What that means

Say it in the plainest available form. If the fault seals, then the rock Ekene-6 drilled is not in fluid communication with the western compartment, and a well in the west cannot produce it. Yet a fifth of the western compartment's booked oil exists in the model only because Ekene-6 was there to pull the mapped surface up on that side.

The partition and the map are telling two different stories. The partition says the two blocks are separate. The map says the two blocks share their control, because the interpolator used every well within reach for every node.

Both cannot be right, and the volume that sits on the contradiction is 1.989889 MMstb.

## Why the number is so large

Two features of the geometry make it large here.

The first is proximity. Ekene-6 is 100 m from the fault, which is one grid cell. Its influence on the nodes immediately west of the fault is very strong, and those nodes are close to the crest, so their columns are tall and their volume contribution is high.

The second is that Ekene-6 is a shallow pick. At 1546 m its TOP_SAND is the second shallowest in the field. Removing a shallow control point lets the fitted surface sag over a wide area, which reduces columns not just at the fault but well into the western block.

The general lesson is that the cost is highest where a well sits close to the fault and carries a value unlike its neighbours, which is exactly the situation in which somebody is most likely to argue that the fault matters.

## Reading it off the panel

The panel cannot remove a well, so this experiment is not one you can run there. What the panel does show is the geometry that makes the result plausible.

{{panel:rc-block-explorer}}

Set the capstone configuration and find Ekene-6, the eastern well posted immediately right of the fault trace. Look at the strongly coloured blue cells to its west, on the other side of the line. Those cells are within a few hundred metres of it, and there is no western well nearby to compete for influence: Ekene-1 is 900 m to the south west and Ekene-3 is 900 m to the north west.

Those blue cells are the ones that lose their column when Ekene-6 is removed.

## Worked example

Work out how much of the west block's booking the experiment leaves standing, and compare it against the tier's other uncertainties.

The west block books 9.855617 MMstb with the full control set and 7.865728 MMstb without Ekene-6. The difference of 1.989889 MMstb is larger than the entire east block's booking of 2.283591 MMstb by only a small margin, so the two are comparable in size.

It is more than twice the 0.901423 MMstb that the boundary column convention was worth, and it is three times the 0.656868 MMstb that the Expert tier's property model is worth on the whole field.

Rank them: cross fault control is the largest of the three, the tie break convention is second, and the property model is third. Only one of those three usually appears in a report.

## Exercise

A field has a sealing fault with two wells 200 m either side of it and no other control within 2 km. State what you would expect to happen to each block's booking if the surfaces were rebuilt with each block gridded from its own wells only, and say which block's number you would trust less.

Self check: each block would be gridded from a single well, so each surface would be close to flat at that well's depth, and both bookings would change substantially. You would trust the block whose well sits lower on the structure less, because a flat surface at a low pick removes the crestal relief that the cross fault control had been supplying, and that relief is where the volume is.
