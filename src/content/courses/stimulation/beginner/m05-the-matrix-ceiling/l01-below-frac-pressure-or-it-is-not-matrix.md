# Below frac pressure, or it is not matrix

One pressure separates the two jobs this course knows, and crossing it does not improve a matrix treatment, it ends it.

{{panel:st-acid-explorer}}

## The constraint that defines the job

A matrix treatment injects acid into the pore system the rock already has. The flow paths are the existing ones, widened. Nothing new is created, which is why the whole tier could be written in terms of a skin and a radius.

That only holds while the bottomhole pressure stays below the pressure at which the formation parts. Above it the rock opens a plane, and the fluid goes into the plane, because a fracture is a far easier path than a pore throat.

So the matrix job is defined by a ceiling and not by a chemistry. Same acid, same well, same pumps: below the ceiling it is a matrix treatment, above it it is an acid fracture. The label follows the pressure.

## Where the ceiling sits in the published case

The engine takes the fracturing pressure as the closure stress of the interval. In the published case that is 38131950.890444934 Pa, close to 38.13 MPa, at a mid depth of 2124.897477742 m true vertical.

The reservoir sits at 23730685.440133728 Pa, close to 23.73 MPa. The margin between those two pressures is the entire budget a matrix job has to work with. It is what pushes acid into the rock, and it is fixed by the reservoir and the earth stress rather than by anything on surface.

For contrast, the fracture half of the same published case pumps at a bottomhole treating pressure of 41021686.88488494 Pa on the PKN model. That sits above closure on purpose. It is a fracture job and it is meant to be one.

## Why crossing the ceiling is not a small error

Acid that enters a fracture travels a long way in two directions and ignores the rest of the wellbore. The damaged sheath is a ring around the whole hole, so a plane through it leaves most of that ring untreated.

You also lose control of where the fluid goes. A fracture can grow out of the target interval into a shale or, worse, down into water. A matrix job is contained by the rock because it never had the energy to leave.

And the design variables change. Volume, front radius and pore volumes give way to width, net pressure and leakoff, which belong to the Professional tier.

## What the engine refuses

The rate model will not run at all unless the fracturing pressure exceeds the reservoir pressure. With no margin there is no injection, and the engine says so rather than returning zero.

## Exercise

State in one sentence what physically changes at the moment the bottomhole pressure crosses closure.

Of the two published pressures above, say which one an operator can influence over the life of a field and which one they cannot.

Then explain why an acid volume planned for a matrix job is the wrong volume once the well has fractured.
