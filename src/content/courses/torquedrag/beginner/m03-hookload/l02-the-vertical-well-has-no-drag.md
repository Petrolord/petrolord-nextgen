# The vertical well has no drag

The case that proves the model does what it says.

{{panel:td-string-explorer}}

## The result

On the vertical well, all six operations return the same hookload for the same axial condition:

| operation | hookload | surface torque |
|---|---|---|
| pick up | 732311.4682840434 N | 0 |
| slack off | 732311.4682840434 N | 0 |
| rotate off bottom | 732311.4682840434 N | 0 |
| back ream | 732311.4682840434 N | 0 |
| rotate on bottom | 643311.4682840452 N | 2700 N.m |
| slide drill | 643311.4682840452 N | 2700 N.m |

Not close. Identical.

## Why

Both sources of side force vanish. There is no curvature anywhere, so the tension term is zero. The inclination is zero everywhere, so sin(theta) is zero and the weight term is zero too.

With no normal force there is no friction, whatever the friction factor is. Set it to 0.9 and nothing changes.

## The two on-bottom rows

They read 89000 N less, which is exactly the weight on bit. That is the boundary condition: the calculation starts at the bit with T = -89000 N instead of zero, and that offset carries all the way up an otherwise frictionless string.

Their torque is exactly 2700 N.m, which is the bit torque. Again the boundary condition, carried up unchanged because there is no side force for the tangential friction to act on.

## The buckling warning

Look at those two rows in the panel and you will see a warning: the string buckles from 1940 m.

That is correct and it is worth understanding. The bottom 89 kN of the string is in compression, and 1940 m is where the tension crosses zero going down. Below that the pipe is being pushed, and in a vertical hole even a small compression buckles it, because the buckling limits at zero inclination are exactly zero.

In practice that is what drill collars are for: they are stiff and heavy enough that the compression is carried in a section designed for it. The model here is applying a drill-pipe buckling check to a collar, which is conservative rather than wrong, and it is a good illustration of a warning that is technically right and needs interpretation.

## What this case is for

It is a unit test you can run in your head.

Any torque and drag implementation that returns different hookloads for pick up and slack off in a vertical well has a bug. Any that returns a hookload different from the buoyed string weight has a different bug. Both are the first things to check on unfamiliar software.

## Exercise

Set the friction factor to something absurd, 0.9 in both sections, and run the vertical well.

Confirm nothing changes. Then do the same on the slant well and record how much the pick-up hookload moves, so you have a feel for how much friction is actually doing on a deviated well.
