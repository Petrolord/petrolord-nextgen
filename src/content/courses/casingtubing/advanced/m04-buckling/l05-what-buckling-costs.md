# What buckling costs

Four consequences, and this engine reports the state and none of the four.

{{panel:ct-tubing-explorer}}

## The state is a flag

    buckling: { state, sinusoidalN, helicalN, compressionN }

That is all. A word, the compression and the two thresholds it was compared against.

Nothing in the engine changes because of it. The forces are not adjusted, the length changes are not adjusted, and the packer safety factor is computed from the same total either way.

## The four things buckling actually costs

**Length.** A helical string is shorter end to end than a straight one, because some of its length has gone into the spiral. That length change is real and it is not in the length change total.

**Bending stress.** A helix has curvature, and curvature times E times the radius is a bending stress on top of everything else. On a small annulus it can be large.

**Contact force.** A buckled string presses on the casing wall, hard, in a helical line. That drives wear on the casing and on the tubing, and it is why a permanently buckled string is a maintenance problem rather than an event.

**Lock-up.** A helically buckled string in a small annulus can jam, so that force applied at surface does not reach the bottom. That matters for anything that has to be run or pulled through it.

## Why the engine does not compute them

Because each of the four needs something the planning form does not have: an axial force PROFILE along the string rather than a single value at the packer, and a friction coefficient.

Adding them properly means solving a buckled-string problem along the whole length, which is a different engine. The Torque and Drag module does that for a drillstring.

## So what is the flag for

To tell you that the planning numbers have stopped being adequate.

A completion that reports 'none' on every case can be signed off on these numbers. A completion that reports 'helical' on any case needs a proper buckling analysis before anybody relies on the length change or the packer force.

That is a legitimate and useful thing for a screening tool to do: know where its own answer stops being good, and say so.

## Reading it correctly

    'none'       -> the planning numbers stand
    'sinusoidal' -> the length change is slightly overstated, the rest is close
    'helical'    -> do this properly

## Exercise

The production heating case reports 'helical' and a length change of 0.8947604591459051 m.

Say whether the true length change is larger or smaller than that, and which direction the error takes the stroke verdict of true.
