# The blend between them

The transition, and why it is smoothed rather than switched.

## The problem

The laminar law and the turbulent law give different friction factors at the critical Reynolds number. If the engine simply switched from one to the other, the pressure loss would JUMP at that point.

A jump is unphysical, and it is worse than unphysical for a solver: any routine that searches for a flow rate, a trip speed or a nozzle size runs into a discontinuity and either fails to converge or converges to the wrong side of it.

## What the method specifies

A blend over a band of Reynolds numbers:

    below Rec:            laminar
    Rec to Rec + 800:     a weighted blend of the two
    above Rec + 800:      turbulent

The weight moves linearly across the band, so the friction factor is continuous and so is the pressure loss.

## Why 800

Because it is wide enough to smooth the discontinuity and narrow enough not to distort either regime, and because the method specification the goldens name says so.

That is an honest answer. The width of a blending band is a numerical convention rather than a physical measurement, and two implementations that blend differently will disagree in the transition.

## The consequence for reproducibility

Every implementation of drilling hydraulics has to make this choice, and they do not all make it the same way. Some use a different band, some use a maximum of the two friction factors, some switch abruptly.

So two hydraulics packages given identical inputs will agree closely in fully laminar and fully turbulent flow and can differ noticeably in the transition. That is the single commonest source of a disagreement between two commercial hydraulics answers.

## What the engine reports

Each element carries a regime label: laminar, transitional or turbulent. Reading them tells you where in the well the answer is on solid ground and where it is inside a convention.

## The reason it matters here

Because the annulus is often in exactly that transitional band at ordinary drilling rates, and the annulus is what sets the equivalent circulating density.

So the part of the calculation with the most modelling convention in it is the part that produces the number the formation feels.

## Exercise

Explain, in one sentence each, why a discontinuous friction factor would break the minimum-flow-rate solver and the maximum-trip-speed solver in this course.

Both are bisections, and a bisection does not need continuity to converge. Say what it would actually get wrong.
