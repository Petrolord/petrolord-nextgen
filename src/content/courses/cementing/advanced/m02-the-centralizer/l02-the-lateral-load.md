# The lateral load

What pushes the casing sideways, and the three things it depends on.

{{panel:cm-standoff-explorer}}

## The formula

    W = buoyed weight per metre x spacing x sin(inclination)

The load one centralizer carries: the weight of the span of casing it supports, resolved perpendicular to the hole.

## Term by term

**Buoyed weight per metre.** The casing's air weight reduced by the buoyancy factor of the fluid it hangs in.

    w = 43.16 x 9.80665 x (1 - 1440 / 7850) = 345.6133299031847 N per metre

**Spacing.** Each centralizer carries half a span on either side, so it carries one span in total. Linear.

**Sine of the inclination.** The component of gravity pressing the pipe against the low side.

## The three worked, on this well

| spacing | inclination | lateral load (N) |
|---|---|---|
| 12 m | 40 deg | 2665.871594451281 |
| 12 m | 90 deg | 4147.359958838217 |
| 9 m | 90 deg | 3110.5199691286625 |
| 6 m | 90 deg | 2073.6799794191083 |

The horizontal well at 12 m carries 1.556 times the load the slant well does at the same spacing, purely from the sine.

## The vertical case

At zero inclination the sine is zero and the load is zero. The bow spring is not deflected at all and the standoff is exactly 1.

That is why both of this course's wells report a standoff of exactly 1 over their whole vertical section, from surface down to where the trajectory starts building.

A vertical well has no standoff problem. Every standoff problem in drilling is a deviation problem.

## What is NOT in the load

**Tension times dogleg.** A string in tension being pulled through a curve presses on the outside of the curve, and the force can be large. The engine's header says so in as many words: the tension times dogleg lateral-load term is deliberately out of version one.

That omission matters most exactly where the standoff is already worst, which is in the build section.

**Friction and drag.** A casing being run is not in static equilibrium.

**The residual bending of the pipe itself.** Casing is not straight.

## The buoyancy direction, which surprises people

A HEAVIER mud gives a SMALLER buoyed weight and therefore a smaller lateral load and a BETTER standoff.

Module 3 has the numbers. It is the opposite of the instinct that heavy mud makes everything harder.

## Exercise

Compute the lateral load for a 15 m spacing at 60 degrees of inclination on this casing at a mud weight of 1440.

Then compute it again at a mud weight of 1900 and say which way it moved.
