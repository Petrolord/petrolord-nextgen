# What net pressure is

The pressure that opens the rock is not the pressure in the fracture. It is the part of it the rock is not already holding back.

{{panel:st-frac-explorer}}

## The excess, not the total

Net pressure is the fluid pressure inside the fracture minus the stress trying to close it. Write the closure stress as the number the rock imposes and net pressure is whatever you have managed to put on top of it.

That subtraction is the whole idea. A fracture does not care that there are tens of megapascals of fluid pressure at its face. It cares only about the surplus, because the first part of that pressure is spent balancing the earth and only the remainder is available to do anything.

In the published case the closure stress is 38.13195 MPa and the PKN net pressure is 2.889736 MPa. The number that creates the fracture is under a tenth of the number in the wellbore.

## What the surplus buys you

Two things, at once.

It holds the fracture open. Width is not a free parameter that you choose. It is the elastic response of the rock to the net pressure acting on the faces, so a fracture with no net pressure has no width and is not a fracture at all.

It drives the fracture forward. Growth in length and in height is paid for out of the same surplus. This is why net pressure is the single most watched quantity during a treatment. A real time net pressure record is a record of what the fracture is doing.

## Where it lands on the gauge

The engine adds it straight back to closure to give the bottomhole treating pressure:

| Model | Net pressure, MPa | Bottomhole treating pressure, MPa |
| --- | --- | --- |
| PKN | 2.889736 | 41.021687 |
| KGD | 0.602344 | 38.734295 |

Both entries share the same closure stress of 38.13195 MPa. Only the net pressure differs, because only the net pressure depends on the fracture model.

Note what is not in that table. The engine puts slurry hydrostatic and pipe and perforation friction explicitly out of scope, so this is a bottomhole number and not a surface number. If you supply no closure stress at all, the engine returns net pressure and leaves the treating pressure empty rather than guessing.

## Exercise

Read the net pressure and the treating pressure for PKN in the panel, then subtract one from the other and confirm you recover the closure stress.

Switch the model to KGD without changing anything else. The closure stress cannot move, so account for the entire change in treating pressure as a change in net pressure.
