# A negative row

The last row of the last lesson had a minus sign in front of it, and it was not an error.

{{panel:wi-annulus-explorer}}

## The case

Take the published fixture and set the far side to zero. Nothing else changes.

The rating term is 24000000 Pa. The head charged on the wall is 24104271.45154357 Pa. The allowable surface pressure the engine computes for that row is -104271.45154356956 Pa, and the row comes back with its negative flag raised.

Read what that says. Before anyone at surface applies anything at all, the fluid already standing in the annulus is pressing on that wall harder than the wall's factored rating allows. The allowable is not small. It is past the end.

## Nothing was applied

This is the part worth sitting with. Every other number in this tier has been an allowance for something you might do. This one is a statement about what has already been done.

There is no valve open, no pump lined up, no thermal expansion in the story. The well is simply standing there with 2048.29303343 m of 1200 kg/m3 fluid in the annulus and nothing behind the wall to push back, and that alone is 104271.45154356956 Pa more than the element is rated to take.

## The break-even

The engine's sensitivity for this element is 20086.892876286307 Pa per kg/m3 of far side density, so the density at which the row crosses zero is easy to name. It is 5.191019446649534 kg/m3.

Anything on the far side denser than that leaves a positive, usable allowable. Anything lighter leaves a negative row. Five kg/m3 is a very light gas, which is the uncomfortable point: the margin between this element working and this element being past its rating with no help at all is not measured in hundreds of kg/m3. On this fixture it is measured in single figures.

The same crossing exists on the other input. Hold the far side at the published 1030 kg/m3 and raise the annulus density instead, and the break-even is 2224.8089805533505 kg/m3. At 2200 kg/m3 the row still allows 498335.3347450197 Pa. At 2250 kg/m3 it reports -506009.3090692945 Pa.

## Two ways to reach the same place

Those are not two mechanisms. They are one subtraction reached from two directions: the annulus column got heavier, or the column opposing it got lighter. The engine does not distinguish, because the row only ever sees the difference.

## Exercise

Reproduce the negative row in the panel and record its raw allowable to the digit.

Raise the far side density in single kg/m3 steps until the row turns positive, and confirm the crossing.

Then, holding the far side at 1030 kg/m3, find the annulus density at which the same element crosses, and check it against the figure above.
