# A Reynolds number that needs the answer

{{panel:fc-sizing-explorer}}

Here is the awkward shape at the centre of the liquid route. The correction needs a Reynolds number. The Reynolds number, as this engine defines it, needs the flow area. The flow area is what the correction is being applied to work out. The answer is one of its own inputs.

## Why the Reynolds number needs an area

A Reynolds number needs a length scale, and for flow through an orifice the natural length scale is the diameter of that orifice. The engine takes the diameter implied by the required area itself, so the Reynolds relation carries the square root of the area in it.

That is where the liquid Reynolds constant lives. It is 2800.000000000000, recovered by taking the engine's own returned Reynolds number and rearranging it against the area it belongs to. The validation oracle derives the same constant from a density, a velocity, a diameter and a viscosity in absolute SI units, with the diameter taken as the square root of four times the area divided by pi. That is a genuine check, because it arrives at the constant from the definition of a Reynolds number rather than from this engine's arrangement of it.

## How the engine resolves the circle

It guesses, computes, and repeats. The correction starts at one, which gives the inviscid area. That area gives a Reynolds number, which gives a new correction, which gives a new area. The loop runs until the correction stops moving, and the engine reports three things about that process: how many passes it took, whether it converged, and the residual it stopped on.

On AKASO those three come back as six passes, converged, and a residual of 0.000000000000. The residual is the change in the correction on the final pass, and at the precision this course prints residuals it is zero.

## What a single pass would have cost

The obvious shortcut is to stop after one pass. Take the inviscid area, get a Reynolds number from it, apply the correction once and call it done. That is what a hand calculation usually does.

Done that way, using the measured leading constants and the engine's own correction function, the answer is 1.867601 in2 at a Kv of 0.984858 and a Reynolds number of 17546.394776. The converged answer is 1.867758 in2 at a Kv of 0.984776 and a Reynolds number of 17412.317969.

The ratio of the converged area to the one pass area is 1.000083905751. That figure is quoted because the digest computes it. It is also the honest answer to the question of whether the loop was worth building: on this case, the loop moves the area by less than one part in ten thousand, and yet the loop is the correct construction and the single pass is an approximation to it. Knowing the size of an approximation is not the same as being allowed to ignore it.

## Exercise

State the circular dependency in the liquid route in one sentence, naming the three quantities involved. Then write down the converged area and the one pass area for AKASO and the ratio between them, and say which of the three figures the digest computed for you.
