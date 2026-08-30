# Checking a number before using it

Five cheap tests, and the order to run them in.

{{panel:gm-stability-explorer}}

## The situation

Somebody hands you a collapse gradient and a fracture gradient at a depth. Before putting them in a mud programme, what do you check?

## First: is the window positive

Fracture initiation above the lower bound. If it is not, the model is saying the section cannot be drilled, and that needs discussing before anything else.

## Second: is the lower bound the pore pressure or the collapse pressure

They are different problems with different remedies. A report that gives only the maximum of the two has thrown the distinction away, and getting it back costs one extra column.

## Third: does the vertical closed form roughly agree

If the hole is near vertical, compute

    collapse Pw = Pp + (3 SH_eff - Sh_eff - UCS) / (1 + q)
    fracture Pw = Pp + (3 Sh_eff - SH_eff) + T0

by hand. On a vertical hole they should match exactly; on a hole up to about 15 degrees they should be close.

A large disagreement on a near-vertical hole means a convention or an input is wrong.

## Fourth: is anything clamped or at a boundary

Check the clamp count on the stress model, and look for collapse pressures near zero or above the fracture pressure.

## Fifth: is the answer sensitive to something nobody measured

Move the Poisson ratio across its plausible range and see how far the bounds move. Do the same for the friction angle and the UCS.

If the window moves more than the decision can tolerate, the answer is not yet an answer.

## The order matters

Each test is cheaper than the one after it, and each one that fails makes the later ones pointless.

There is no value in a sensitivity study on a window that is negative because of a sign error.

## What a good report contains

The two bounds, both lower-bound candidates separately, the clamp count, the quality score, and a sensitivity band on at least the Poisson ratio and the UCS.

That is six columns rather than two, and it is the difference between a number and a usable number.

## What to do when you cannot check

Say so. A gradient used without any of the five checks is being taken on trust, and recording that in the programme is more useful than pretending otherwise.

## Exercise

Take the panel's output for a vertical hole at 2000 m and run all five checks on it.

Then say which of the five took longest, and whether it was worth the time.
