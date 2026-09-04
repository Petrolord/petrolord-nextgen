# Carter leakoff

Fluid leaves through the fracture face at a rate that depends on how long that piece of face has been open.

{{panel:st-frac-explorer}}

## The one over root time law

Carter's model says the leakoff velocity at a point on the face is the leakoff coefficient divided by the square root of the time that point has been exposed to fluid.

The physical reason is that leakoff builds its own resistance. A filter cake grows, an invaded zone of viscous fluid deepens, and the compressible reservoir ahead of it fills up. All three resistances thicken with the square root of time, so the velocity thins the same way.

Integrate that velocity over the exposure time and you get a loss that grows as the square root of time rather than in proportion to it. That is why the volume lost is written as

    VL = KL CL (2 Af) sqrt(ti)

with Af the area of one face of both wings and the factor of two counting the second face.

## The coefficient

CL carries units of metres per square root of a second, which look strange until you remember it multiplies a square root of time to give a length of fluid lost per unit area.

The published case uses 0.0001 m/sqrt(s). That value is not a rock property you can look up. It combines the fluid, the filter cake and the formation, and on a real well it is measured, by pumping a small volume and matching the pressure decline after shut in.

At a half-length of 150 m and a height of 30 m, the leaking area is two faces of two wings, 2 times 2 times 150 times 30, which is 18000 m2 of rock taking fluid.

## What the model leaves out

Spurt loss. The instantaneous slug that disappears into the formation before any filter cake exists is neglected here, and the engine says so in its own documentation rather than hiding it.

That omission is safe in a low permeability rock with a good fluid, and unsafe in a high permeability rock or with a poorly bridged fluid. In those cases the real pad has to be bigger than this model asks for.

The engine also refuses a negative coefficient outright, and treats exactly zero as a special case with no loss at all.

## Exercise

Set the leakoff coefficient to zero in the panel and record the pump time and efficiency. That is the no loss limit, 681.9591857024639 s and an efficiency of 1.

Then restore 0.0001 and say in one sentence what the difference between those two pump times represents physically.
